import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/modules/prisma/prisma.service';
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
import { PaginationUserInputDto } from '../../super-admin/api/input-dto/pagination-user.input.args';

/**
 * Abstract class for users query repository
 * ['findUserById', 'findUserProfile', 'findUserAvatars', 'getUsersForSuperAdmin']
 */
export abstract class IUsersQueryRepository {
  abstract findUserById(id: number): Promise<User>;
  abstract findUserProfile(userId: number): Promise<ProfileViewModel>;
  abstract findUserAvatars(userId: number): Promise<AvatarsViewModel>;

  //need for super-admin
  abstract getUsersForSuperAdmin(usersArgs: PaginationUsersInputDto): Promise<Paginated<UserForSuperAdminViewModel[]>>;
  abstract getUserForSuperAdmin(usersArgs: PaginationUserInputDto): Promise<UserForSuperAdminViewModel>;
}

@Injectable()
export class PrismaUsersQueryRepository implements IUsersQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getDefaultArgs(usersArgs: PaginationUsersInputDto | PaginationUserInputDto) {
    return {
      orderBy: { [usersArgs.sortBy]: usersArgs.isSortDirection() },
      skip: usersArgs.skip,
      take: usersArgs.getPageSize(),
      include: { profile: { include: { avatars: true } } },
    };
  }

  async findUserById(id: number) {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async findUserProfile(userId: number): Promise<ProfileViewModel> {
    const userWithProfile = await this.prisma.user.findUnique({
      where: { id: userId },
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
    let defaultArgs = this.getDefaultArgs(usersArgs);
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
      const instanceUser = plainToInstance(UserEntity, user);
      return UserForSuperAdminViewModel.create(
        instanceUser.id,
        instanceUser.userName,
        url,
        instanceUser.createdAt,
        instanceUser.status,
      );
    });
    return UsersWithPaginationViewModel.getPaginated({
      items: usersView,
      page: usersArgs.getPageNumber(),
      size: usersArgs.getPageSize(),
      count: usersCount,
    });
  }
  async getUserForSuperAdmin(usersArgs: PaginationUserInputDto): Promise<UserForSuperAdminViewModel> {
    let defaultArgs = this.getDefaultArgs(usersArgs);
    // get user by id with profile
    const user = await this.prisma.user.findUnique({
      where: { id: usersArgs.userId },
      include: { ...defaultArgs.include },
    });
    const userWithProfile = plainToInstance(UserEntity, user);
    const url = user.profile.avatars.length > 0 ? user.profile.avatars[0].url : null;
    const res = UserForSuperAdminViewModel.create(
      userWithProfile.id,
      userWithProfile.userName,
      url,
      userWithProfile.createdAt,
      userWithProfile.status,
    );
    return res;
  }
}
