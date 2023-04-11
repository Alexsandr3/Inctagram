import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { ProfileEntity } from '../domain/profile.entity';
import { ImageEntity } from '../domain/image.entity';

export abstract class IProfilesRepository {
  abstract createProfile(profile: ProfileEntity): Promise<void>;
  abstract findById(userId: number): Promise<ProfileEntity | null>;
  abstract updateProfile(profile: ProfileEntity): Promise<void>;
  abstract deleteProfile(profile: ProfileEntity): Promise<void>;
  abstract saveImageProfile(instanceImage: ImageEntity): Promise<void>;
}

@Injectable()
export class PrismaProfilesRepository implements IProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(profile: ProfileEntity): Promise<void> {
    const { userId, userName, firstName, lastName, city, dateOfBirth, aboutMe } = profile;
    await this.prisma.profile.create({
      data: {
        userId,
        userName,
        firstName,
        lastName,
        city,
        dateOfBirth,
        aboutMe,
      },
    });
  }
  async findById(userId: number): Promise<ProfileEntity | null> {
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId,
      },
      select: {
        userId: true,
        userName: true,
        firstName: true,
        lastName: true,
        city: true,
        dateOfBirth: true,
        aboutMe: true,
      },
    });
    if (profile) return ProfileEntity.preparationProfile(profile);
    return null;
  }
  async updateProfile(profile: ProfileEntity): Promise<void> {
    const { userId, userName, firstName, lastName, city, dateOfBirth, aboutMe } = profile;
    await this.prisma.profile.update({
      where: {
        userId,
      },
      data: {
        userName,
        firstName,
        lastName,
        city,
        dateOfBirth,
        aboutMe,
      },
    });
  }
  async deleteProfile(profile: ProfileEntity): Promise<void> {}
  async saveImageProfile(instanceImage: ImageEntity): Promise<void> {
    await this.prisma.image.create({
      data: {
        profileId: instanceImage.profileId,
        affiliation: instanceImage.affiliation,
        typeSize: instanceImage.typeSize,
        url: instanceImage.url,
        width: instanceImage.width,
        height: instanceImage.height,
        fileSize: instanceImage.fileSize,
        createdAt: instanceImage.createdAt,
        updatedAt: instanceImage.updatedAt,
      },
    });
  }
}