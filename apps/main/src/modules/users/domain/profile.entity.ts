import { UpdateProfileInputDto } from '../api/inpu-dto/update-profile.input.dto';
import { Type } from 'class-transformer';
import { AvatarEntity } from './avatar.entity';
import { Profile } from '@prisma/client';
import { BanReasonInputType } from '../../super-admin/api/input-dto/types/ban-reason.input.type';
import { BaseDateEntity } from '@common/main/entities/base-date.entity';

export class ProfileEntity extends BaseDateEntity implements Profile {
  userId: number;
  firstName: string;
  lastName: string;
  city: string;
  dateOfBirth: Date;
  aboutMe: string;
  banReason: BanReasonInputType;
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

  setBanReason(banReason: BanReasonInputType) {
    this.banReason = banReason ? BanReasonInputType[banReason] : null;
  }
}
