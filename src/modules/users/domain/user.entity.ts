import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { EmailConfirmationEntity } from './user.email-confirmation.entity';
import { ProfileEntity } from './profile.entity';
import { BaseDateEntity } from './base-date.entity';
import { CreateProfileInputDto } from '../api/inpu-dto/create-profile.input.dto';
import { Type } from 'class-transformer';

export class UserEntity extends BaseDateEntity {
  id: number;
  userName: string;
  email: string;
  passwordHash: string;
  @Type(() => EmailConfirmationEntity)
  emailConfirmation: EmailConfirmationEntity;
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
    instanceUser.emailConfirmation = new EmailConfirmationEntity();
    instanceUser.profile = null;
    return instanceUser;
  }

  public isOwner(userId: number): boolean {
    return this.id === userId;
  }

  public confirmUser() {
    this.emailConfirmation.isConfirmed = true;
  }

  public updateEmailConfirmation() {
    this.emailConfirmation.confirmationCode = randomUUID();
    this.emailConfirmation.codeExpirationDate = add(new Date(), { hours: 1 });
  }

  public updatePassword(passwordHash: string) {
    this.passwordHash = passwordHash;
  }
  //
  // public createProfile(dto: CreateProfileInputDto) {
  //   this.profile = ProfileEntity.initCreate(this.id, dto);
  //   this.userName = dto.userName;
  // }

  public updateProfile(dto: CreateProfileInputDto) {
    if (!this.profile) this.profile = ProfileEntity.initCreate(this.id);
    this.profile.update(dto);
    this.userName = dto.userName;
  }
}
