import { UserEntity } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { EmailConfirmationEntity } from '../../auth/domain/email-confirmation.entity';
import { AvatarEntity } from '../domain/avatar.entity';
import { ConfirmationOfExternalAccountEntity } from '../../auth/domain/confirmation-of-external-account.entity';

export abstract class IUsersRepository {
  abstract findById(userId: number): Promise<UserEntity | null>;
  abstract findUserByUserName(userName: string): Promise<UserEntity | null>;
  abstract findUserByEmail(email: string): Promise<UserEntity | null>;
  abstract findUserByNameOrEmail(userName: string, email: string): Promise<UserEntity | null>;
  abstract findUserWithEmailConfirmationByConfirmationCode(
    confirmationCode: string,
  ): Promise<{ foundUser: UserEntity; foundEmailConfirmation: EmailConfirmationEntity } | null>;
  abstract saveUserWithEmailConfirmation(user: UserEntity, emailConfirmation: EmailConfirmationEntity);
  abstract updateUser(user: UserEntity, emailConfirmation?: EmailConfirmationEntity);
  abstract deleteUser(userId: number);

  abstract deleteImagesAvatar(userId: number): Promise<void>;

  abstract addAvatars(userId: number, avatars: AvatarEntity[]);

  abstract updateAvatars(userId: number, avatars: AvatarEntity[]);

  abstract findUserByProviderId(googleId: string): Promise<UserEntity | null>;

  abstract countUsers(): Promise<number>;

  abstract saveUser(user: UserEntity): Promise<number>;

  abstract addExternalAccountToUser(
    user: UserEntity,
    confirmationOfExternalAccount: ConfirmationOfExternalAccountEntity,
  );

  abstract findUserWithConfirmationOfExternalAccountByConfirmationCode(
    confirmationCode: string,
  ): Promise<{ foundUser: UserEntity; foundConfirmationOfExternalAccount: ConfirmationOfExternalAccountEntity } | null>;

  abstract updateUserExternalAccount(user: UserEntity);

  abstract deleteUserExternalAccount(foundUser: UserEntity, providerId: string);
}

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: number): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: { id: userId },
      include: { profile: { include: { avatars: true } } },
    });
    return plainToInstance(UserEntity, foundUser);
  }

  async findUserByUserName(userName: string): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: { userName: { contains: userName, mode: 'insensitive' } },
      include: { profile: { include: { avatars: true } } },
    });
    return plainToInstance(UserEntity, foundUser);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
      include: { profile: { include: { avatars: true } }, externalAccounts: true },
    });
    return plainToInstance(UserEntity, foundUser);
  }
  async findUserByNameOrEmail(userName: string, email: string): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { userName: { contains: userName, mode: 'insensitive' } },
          { email: { contains: email, mode: 'insensitive' } },
        ],
      },
      include: { profile: { include: { avatars: true } } },
    });
    return plainToInstance(UserEntity, foundUser);
  }

  async findUserWithEmailConfirmationByConfirmationCode(
    confirmationCode: string,
  ): Promise<{ foundUser: UserEntity; foundEmailConfirmation: EmailConfirmationEntity } | null> {
    const foundUserWithEmailConfirmation = await this.prisma.user.findFirst({
      where: {
        emailConfirmation: { confirmationCode: confirmationCode },
      },
      include: { emailConfirmation: true, profile: { include: { avatars: true } } },
    });
    const { emailConfirmation, ...foundUser } = foundUserWithEmailConfirmation;
    const userInstance = plainToInstance(UserEntity, foundUser);
    const emailConfirmationInstance = plainToInstance(EmailConfirmationEntity, emailConfirmation);
    return { foundUser: userInstance, foundEmailConfirmation: emailConfirmationInstance };
  }

  async saveUserWithEmailConfirmation(user: UserEntity, emailConfirmation: EmailConfirmationEntity) {
    const createdUser = await this.prisma.user.create({
      data: {
        ...user,
        emailConfirmation: {
          create: emailConfirmation,
        },
        externalAccounts: {},
        profile: {
          create: {},
        }, //{ create: { ...user.profile, images: { create: user.profile.images } } },
      },
    });
    //create businessAccount
    await this.prisma.businessAccount.create({
      data: {
        userId: createdUser.id,
        subscriptions: {
          create: [],
        },
      },
    });
  }

  async updateUser(user: UserEntity, emailConfirmation: EmailConfirmationEntity = null): Promise<void> {
    let updProfile = {};
    if (user.profile) {
      updProfile = {
        upsert: {
          create: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            city: user.profile.city,
            dateOfBirth: user.profile.dateOfBirth,
            aboutMe: user.profile.aboutMe,
            //images: { disconnect: true },
          },
          update: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            city: user.profile.city,
            dateOfBirth: user.profile.dateOfBirth,
            aboutMe: user.profile.aboutMe,
            //images: { disconnect: true },
          },
        },
      };
    }

    let updEmailConfirmation = {};
    if (emailConfirmation)
      updEmailConfirmation = {
        update: {
          confirmationCode: emailConfirmation.confirmationCode,
          codeExpirationDate: emailConfirmation.codeExpirationDate,
        },
      };

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        userName: user.userName,
        email: user.email,
        passwordHash: user.passwordHash,
        isConfirmed: user.isConfirmed,
        emailConfirmation: updEmailConfirmation,
        profile: updProfile,
        externalAccounts: { create: user.externalAccounts },
      },
    });
  }

  async deleteUser(userId: number): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async deleteImagesAvatar(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: { update: { avatars: { deleteMany: { profileId: userId } } } },
      },
    });
  }

  async addAvatars(userId: number, avatars: AvatarEntity[]) {
    const addAvatarsConfig = avatars.map(i => {
      return {
        imageType: i.imageType,
        sizeType: i.sizeType,
        url: i.url,
        width: i.width,
        height: i.height,
        fileSize: i.fileSize,
        fieldId: i.fieldId,
      };
    });

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: { update: { avatars: { createMany: { data: addAvatarsConfig } } } },
      },
    });
  }
  async updateAvatars(userId: number, avatars: AvatarEntity[]) {
    const updateAvatarsConfig = avatars.map(i => {
      return {
        where: {
          url: i.url,
        },
        data: {
          imageType: i.imageType,
          sizeType: i.sizeType,
          width: i.width,
          height: i.height,
          fileSize: i.fileSize,
          fieldId: i.fieldId,
          resourceId: i.resourceId,
        },
      };
    });

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: { update: { avatars: { updateMany: updateAvatarsConfig } } },
      },
    });
  }

  async findUserByProviderId(providerId: string): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: { externalAccounts: { some: { providerId } } },
      include: { profile: { include: { avatars: true } }, externalAccounts: true },
    });

    return plainToInstance(UserEntity, foundUser);
  }

  async countUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async saveUser(user: UserEntity): Promise<number> {
    const createdUser = await this.prisma.user.create({
      data: {
        ...user,
        externalAccounts: {
          create: user.externalAccounts,
        },
        profile: {
          create: {},
        },
      },
      select: { id: true },
    });
    return createdUser.id;
  }

  async addExternalAccountToUser(user: UserEntity, confirmationOfExternalAccount: ConfirmationOfExternalAccountEntity) {
    const createExternalAccounts = user.externalAccounts.find(a => !a.id);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        externalAccounts: {
          create: {
            ...createExternalAccounts,
            confirmationOfExternalAccount: {
              create: {
                confirmationCode: confirmationOfExternalAccount.confirmationCode,
                codeExpirationDate: confirmationOfExternalAccount.codeExpirationDate,
              },
            },
          },
        },
      },
    });
  }

  async findUserWithConfirmationOfExternalAccountByConfirmationCode(confirmationCode: string): Promise<{
    foundUser: UserEntity;
    foundConfirmationOfExternalAccount: ConfirmationOfExternalAccountEntity;
  } | null> {
    const foundUserWithConfirmation = await this.prisma.user.findFirst({
      where: { externalAccounts: { some: { confirmationOfExternalAccount: { confirmationCode } } } },
      include: { externalAccounts: { include: { confirmationOfExternalAccount: true } } },
    });
    const { confirmationOfExternalAccount } = foundUserWithConfirmation.externalAccounts.find(
      a => a.confirmationOfExternalAccount && a.confirmationOfExternalAccount.confirmationCode === confirmationCode,
    );

    const userInstance = plainToInstance(UserEntity, foundUserWithConfirmation);
    const confirmationOfExternalAccountInstance = plainToInstance(
      ConfirmationOfExternalAccountEntity,
      confirmationOfExternalAccount,
    );
    return { foundUser: userInstance, foundConfirmationOfExternalAccount: confirmationOfExternalAccountInstance };
  }

  async updateUserExternalAccount(user: UserEntity) {
    const updExternalAccounts = user.externalAccounts.map(a => {
      return {
        where: {
          id: a.id,
        },
        data: {
          isConfirmed: a.isConfirmed,
          provider: a.provider,
          displayName: a.displayName,
          email: a.email,
        },
      };
    });

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        externalAccounts: {
          updateMany: updExternalAccounts,
        },
      },
    });
  }

  async deleteUserExternalAccount(user: UserEntity, providerId: string) {
    await this.prisma.user.update({ where: { id: user.id }, data: { externalAccounts: { delete: { providerId } } } });
  }
}
