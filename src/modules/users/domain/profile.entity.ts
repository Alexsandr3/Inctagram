import { BaseImageEntity } from '../../images/domain/base-image.entity';
import { BaseDateEntity } from './base-date.entity';
import { UpdateProfileInputDto } from '../api/inpu-dto/update-profile.input.dto';
import { Type } from 'class-transformer';

export class ProfileEntity extends BaseDateEntity {
  userId: number;
  firstName: string;
  lastName: string;
  city: string;
  dateOfBirth: Date;
  aboutMe: string;
  @Type(() => BaseImageEntity)
  avatars: BaseImageEntity[];

  constructor() {
    super();
  }

  static initCreate(userId: number) {
    const instance = new ProfileEntity();
    instance.userId = userId;
    instance.avatars = [];
    return instance;
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
}
