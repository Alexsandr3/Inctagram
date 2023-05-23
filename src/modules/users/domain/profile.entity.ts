import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { UpdateProfileInputDto } from '../api/inpu-dto/update-profile.input.dto';
import { Type } from 'class-transformer';
import { AvatarEntity } from './avatar.entity';
import { Profile } from '@prisma/client';

export class ProfileEntity extends BaseDateEntity implements Profile {
  userId: number;
  firstName: string;
  lastName: string;
  city: string;
  dateOfBirth: Date;
  aboutMe: string;
  banReason: string;
  @Type(() => AvatarEntity)
  avatars: AvatarEntity[];

  constructor() {
    super();
  }

  private setValues(dto: UpdateProfileInputDto) {
    if (dto.firstName || dto.firstName === null) this.firstName = dto.firstName;
    if (dto.lastName || dto.lastName === null) this.lastName = dto.lastName;
    if (dto.city || dto.city === null) this.city = dto.city;
    if (dto.dateOfBirth || dto.dateOfBirth === null) this.dateOfBirth = dto.dateOfBirth;
    if (dto.aboutMe || dto.aboutMe === null) this.aboutMe = dto.aboutMe;
  }

  public update(dto: UpdateProfileInputDto) {
    this.setValues(dto);
  }

  setBanReason(banReason: string) {
    this.banReason = banReason;
  }
}
