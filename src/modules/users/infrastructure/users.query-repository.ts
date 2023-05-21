import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { User } from '@prisma/client';
import { ProfileViewModel } from '../api/view-models/profile-view.dto';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../domain/user.entity';
import { AvatarsViewModel } from '../api/view-models/avatars-view.dto';
import { UserModel } from '../../super-admin/models/user.model';
import { FetchUsersArgs } from '../../super-admin/api/input-dto/fetch-users.args';

export abstract class IUsersQueryRepository {
  abstract findUserById(id: number): Promise<User>;

  abstract findUserProfile(userId: number): Promise<ProfileViewModel>;
  abstract findUserAvatars(userId: number): Promise<AvatarsViewModel>;

  //need for super-admin
  abstract getUsersForSuperAdmin(usersArgs: FetchUsersArgs): Promise<UserModel[]>;

  abstract searchUsersByNameForSuperAdmin(userName: string): Promise<UserModel[]>;
}

@Injectable()
export class PrismaUsersQueryRepository implements IUsersQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: number) {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async findUserProfile(userId: number): Promise<ProfileViewModel> {
    const userWithProfile = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: { profile: { include: { avatars: true } } },
    });
    const user = plainToInstance(UserEntity, userWithProfile);
    user.profile.avatars.sort((a, b) => b.width - a.width);
    return new ProfileViewModel(user.profile, user.userName);
  }

  async findUserAvatars(userId: number): Promise<AvatarsViewModel> {
    const profileViewModel = await this.findUserProfile(userId);
    return new AvatarsViewModel(profileViewModel.avatars);
  }

  //need for super-admin
  async getUsersForSuperAdmin(usersArgs: FetchUsersArgs): Promise<UserModel[]> {
    console.log(usersArgs);
    const users = await this.prisma.user.findMany({
      orderBy: { id: 'desc' },
      skip: usersArgs.skip,
      take: usersArgs.take,
      include: {
        profile: {
          include: {
            avatars: true,
          },
        },
      },
    });
    const usersCount = await this.prisma.user.count();
    return users.map(user => {
      const url = user.profile.avatars.length > 0 ? user.profile.avatars[0].url : null;
      return UserModel.create(user.id, user.userName, url, user.createdAt, user.status);
    });
  }

  async searchUsersByNameForSuperAdmin(userName: string): Promise<UserModel[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { id: 'desc' },
      where: {
        userName: {
          contains: userName,
          mode: 'insensitive',
        },
      },
      include: {
        profile: {
          include: {
            avatars: true,
          },
        },
      },
    });
    return users.map(user => {
      const url = user.profile.avatars.length > 0 ? user.profile.avatars[0].url : null;
      return UserModel.create(user.id, user.userName, url, user.createdAt, user.status);
    });
  }
}
