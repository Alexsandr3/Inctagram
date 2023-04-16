import { UserEntity } from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { EmailConfirmationEntity } from '../domain/user.email-confirmation.entity';
import { BaseImageEntity } from '../../images/domain/baseImageEntity';

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
  abstract saveImageProfile(instanceImage: BaseImageEntity): Promise<void>;

  abstract deleteImagesAvatar(userId: number): Promise<void>;
}

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: number): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: { profile: { include: { avatars: true } } },
    });
    return plainToInstance(UserEntity, foundUser);
  }

  async findUserByUserName(userName: string): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        userName: { contains: userName, mode: 'insensitive' },
      },

      include: { profile: { include: { avatars: true } } },
    });
    return plainToInstance(UserEntity, foundUser);
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive', // установка нечувствительности к регистру для сравнения
        },
      },
      include: { profile: { include: { avatars: true } } },
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
    await this.prisma.user.create({
      data: {
        ...user,
        emailConfirmation: {
          create: emailConfirmation,
        },
        profile: {
          create: {},
        }, //{ create: { ...user.profile, images: { create: user.profile.images } } },
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

  async saveImageProfile(instanceImage: BaseImageEntity): Promise<void> {
    await this.prisma.image.upsert({
      create: {
        ownerId: instanceImage.ownerId,
        userId: instanceImage.userId,
        imageType: instanceImage.imageType,
        sizeType: instanceImage.sizeType,
        url: instanceImage.url,
        width: instanceImage.width,
        height: instanceImage.height,
        fileSize: instanceImage.fileSize,
        createdAt: instanceImage.createdAt,
        updatedAt: instanceImage.updatedAt,
        fieldId: instanceImage.fieldId,
      },
      update: {
        ownerId: instanceImage.ownerId,
        userId: instanceImage.userId,
        imageType: instanceImage.imageType,
        sizeType: instanceImage.sizeType,
        url: instanceImage.url,
        width: instanceImage.width,
        height: instanceImage.height,
        fileSize: instanceImage.fileSize,
        fieldId: instanceImage.fieldId,
      },
      where: { url: instanceImage.url },
    });
  }

  async deleteImagesAvatar(userId: number): Promise<void> {
    await this.prisma.image.deleteMany({
      where: {
        ownerId: userId,
      },
    });
  }
}
