import { ProfileEntity } from './profile.entity';
import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { UpdateProfileInputDto } from '../api/inpu-dto/update-profile.input.dto';
import { Type } from 'class-transformer';
import { User } from '@prisma/client';
import { ExternalAccountEntity } from './external-account.entity';
import { RegisterUserFromExternalAccountInputDto } from '../../auth/api/input-dto/register-user-from-external-account-input.dto';
import { UserStatusType } from '../types/user-status.type';
import { EmailConfirmationEntity } from '../../auth/domain/email-confirmation.entity';

/**
 * User field parameters [min length -6, max length - 30]
 */
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
  hasBusinessAccount: boolean;
  status: UserStatusType;
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
    instanceUser.status = UserStatusType.PENDING;
    instanceUser.profile = null;
    instanceUser.externalAccounts = null;
    instanceUser.hasBusinessAccount = false;
    return instanceUser;
  }

  static createUserFromExternalAccount(
    userName: string,
    passwordHash: string,
    dto: RegisterUserFromExternalAccountInputDto,
  ) {
    const instanceUser = this.initCreateUser(userName, dto.email, passwordHash);
    instanceUser.status = UserStatusType.ACTIVE;
    instanceUser.externalAccounts = [ExternalAccountEntity.createConfirmedExternalAccount(dto)];
    return instanceUser;
  }

  public isOwner(userId: number): boolean {
    return this.id === userId;
  }

  public confirmUser() {
    // this.isConfirmed = true;
    this.status = UserStatusType.ACTIVE;
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

  activateBusinessAccount() {
    this.hasBusinessAccount = true;
  }

  deactivateBusinessAccount() {
    this.hasBusinessAccount = false;
  }

  validateConfirmationCodeAndStatus(
    foundEmailConfirmation: EmailConfirmationEntity,
    confirmationCode: string,
  ): boolean {
    // if user is already confirmed or code is expired or code is invalid
    return (
      this.hasActiveStatus() ||
      foundEmailConfirmation.codeExpirationDate < new Date() ||
      foundEmailConfirmation.confirmationCode !== confirmationCode
    );
  }

  hasActiveStatus(): boolean {
    return this.status === UserStatusType.ACTIVE;
  }

  hasProfileAvatar() {
    return this.profile.avatars.length === 0;
  }

  setStatusDeleted() {
    this.status = UserStatusType.DELETED;
  }

  setStatusBanned(banReason: string) {
    this.status = UserStatusType.BANNED;
    this.profile.setBanReason(banReason);
  }

  setStatusActive() {
    this.status = UserStatusType.ACTIVE;
    this.profile.setBanReason(null);
  }

  getAvatarURLsForDeletion() {
    return this.profile.avatars.map(image => image.url);
  }

  getAvatarIds() {
    return this.profile.avatars.map(image => image.id);
  }
}
