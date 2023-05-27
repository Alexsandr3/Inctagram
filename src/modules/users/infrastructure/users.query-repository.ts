import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { ProfileViewModel } from '../api/view-models/profile-view.dto';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../domain/user.entity';
import { AvatarsViewModel } from '../api/view-models/avatars-view.dto';
import { UserForSuperAdminViewModel } from '../../super-admin/api/models/user-for-super-admin-view.model';
import { UserStatusInputType } from '../../super-admin/api/input-dto/types/user-status.input.type';
import { PaginationUsersInputDto } from '../../super-admin/api/input-dto/pagination-users.input.args';
import { Paginated } from '../../../main/shared/paginated';
import { UsersWithPaginationViewModel } from '../../super-admin/api/models/users-with-pagination-view.model';

export abstract class IUsersQueryRepository {
  abstract findUserById(id: number): Promise<User>;

  abstract findUserProfile(userId: number): Promise<ProfileViewModel>;
  abstract findUserAvatars(userId: number): Promise<AvatarsViewModel>;

  //need for super-admin
  abstract getUsersForSuperAdmin(usersArgs: PaginationUsersInputDto): Promise<Paginated<UserForSuperAdminViewModel[]>>;
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
  async getUsersForSuperAdmin(usersArgs: PaginationUsersInputDto): Promise<Paginated<UserForSuperAdminViewModel[]>> {
    let defaultArgs = {
      orderBy: { [usersArgs.sortBy]: usersArgs.isSortDirection() },
      skip: usersArgs.skip,
      take: usersArgs.getPageSize(), //limit - default 10
      include: { profile: { include: { avatars: true } } },
    };
    if (usersArgs.status === UserStatusInputType.all) {
      defaultArgs['where'] = { status: { notIn: [UserStatus.DELETED] } };
    }
    if (usersArgs.status === UserStatusInputType.banned) {
      defaultArgs['where'] = { status: { notIn: [UserStatus.DELETED], in: [UserStatus.BANNED] } };
    }
    if (usersArgs.status === UserStatusInputType.active) {
      defaultArgs['where'] = { status: { notIn: [UserStatus.DELETED], in: [UserStatus.ACTIVE] } };
    }
    if (usersArgs.search) {
      defaultArgs['where'] = {
        ...defaultArgs['where'],
        userName: { contains: usersArgs.search, mode: 'insensitive' },
      };
    }
    const users = await this.prisma.user.findMany(defaultArgs);
    const usersCount = await this.prisma.user.count({ where: defaultArgs['where'] });
    const usersView = users.map(user => {
      const url = user.profile.avatars.length > 0 ? user.profile.avatars[0].url : null;
      return UserForSuperAdminViewModel.create(user.id, user.userName, url, user.createdAt, user.status);
    });
    return UsersWithPaginationViewModel.getPaginated({
      items: usersView,
      page: usersArgs.getPageNumber(),
      size: usersArgs.getPageSize(),
      count: usersCount,
    });
  }
}
