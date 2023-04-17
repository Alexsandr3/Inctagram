import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { User } from '@prisma/client';
import { ProfileViewModel } from '../api/view-models/profile-view.dto';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../domain/user.entity';
import { AvatarsViewModel } from '../api/view-models/avatars-view.dto';

export abstract class IUsersQueryRepository {
  abstract findUserById(id: number): Promise<User>;

  abstract findUserProfile(userId: number): Promise<ProfileViewModel>;
  abstract findUserAvatars(userId: number): Promise<AvatarsViewModel>;
}

@Injectable()
export class PrismaUsersQueryRepository implements IUsersQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: number) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findUserProfile(userId: number): Promise<ProfileViewModel> {
    const userWithProfile = await this.prisma.user.findFirst({
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
}
