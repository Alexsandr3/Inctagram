import { ProfileEntity } from './profile.entity';
import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { UpdateProfileInputDto } from '../api/inpu-dto/update-profile.input.dto';
import { Type } from 'class-transformer';
import { User } from '@prisma/client';
import { ExternalAccountEntity } from './ExternalAccountEntity';
import { RegisterUserFromExternalAccountInputDto } from '../../auth/api/input-dto/register-user-from-external-account-input.dto';

export const userFieldParameters = {
  userNameLength: {
    min: 6,
    max: 30,
  },
};

export class UserEntity extends BaseDateEntity implements User {
  id: number;
  userName: string;
  email: string;
  passwordHash: string;
  isConfirmed: boolean;
  @Type(() => ExternalAccountEntity)
  externalAccounts: ExternalAccountEntity[];
  @Type(() => ProfileEntity)
  profile: ProfileEntity;

  constructor() {
    super();
  }

  static initCreateUser(userName: string, email: string, passwordHash: string): UserEntity {
    const instanceUser = new UserEntity();
    instanceUser.userName = userName;
    instanceUser.email = email.toLowerCase();
    instanceUser.passwordHash = passwordHash;
    instanceUser.isConfirmed = false;
    instanceUser.profile = null;
    instanceUser.externalAccounts = null;
    return instanceUser;
  }

  static createUserFromExternalAccount(
    userName: string,
    passwordHash: string,
    dto: RegisterUserFromExternalAccountInputDto,
  ) {
    const instanceUser = this.initCreateUser(userName, dto.email, passwordHash);
    instanceUser.isConfirmed = true;
    instanceUser.externalAccounts = [ExternalAccountEntity.createConfirmedExternalAccount(dto)];
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

  public addExternalAccountToUser(dto: RegisterUserFromExternalAccountInputDto) {
    if (!this.externalAccounts) this.externalAccounts = [];
    this.externalAccounts.push(ExternalAccountEntity.initCreate(dto));
  }

  confirmExternalAccount(providerId: string) {
    const externalAccount = this.externalAccounts.find(a => a.providerId === providerId);
    externalAccount.confirmAccount();
  }
}
