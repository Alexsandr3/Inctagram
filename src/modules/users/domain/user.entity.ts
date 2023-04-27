import { ProfileEntity } from './profile.entity';
import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { UpdateProfileInputDto } from '../api/inpu-dto/update-profile.input.dto';
import { Type } from 'class-transformer';
import { User } from '@prisma/client';

export class UserEntity extends BaseDateEntity implements User {
  id: number;
  userName: string;
  email: string;
  passwordHash: string;
  isConfirmed: boolean;
  @Type(() => ProfileEntity)
  profile: ProfileEntity;

  constructor() {
    super();
  }

  static initCreateUser(userName: string, email: string, passwordHash: string) {
    const instanceUser = new UserEntity();
    instanceUser.userName = userName;
    instanceUser.email = email;
    instanceUser.passwordHash = passwordHash;
    instanceUser.isConfirmed = false;
    instanceUser.profile = null;
    return instanceUser;
  }

  public isOwner(userId: number): boolean {
    return this.id === userId;
  }

  public confirmUser() {
    this.isConfirmed = true;
  }

  public updatePassword(passwordHash: string) {
    this.passwordHash = passwordHash;
  }

  public updateProfile(dto: UpdateProfileInputDto) {
    this.profile.update(dto);
    if (dto.userName) this.userName = dto.userName;
  }
}
