import { ProfileEntity } from '../../domain/profile.entity';
import { AvatarViewDto } from './avatar-view.dto';

/**
 * Profile view dto
 */
export class ProfileViewModel {
  id: number;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  city: string | null;
  dateOfBirth: Date | null;
  aboutMe: string | null;
  avatars: AvatarViewDto[];
  constructor(profile: ProfileEntity, userName: string) {
    this.id = profile.userId;
    this.userName = userName;
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.city = profile.city;
    this.dateOfBirth = profile.dateOfBirth;
    this.aboutMe = profile.aboutMe;
    this.avatars = profile.avatars.map(a => new AvatarViewDto(a));
  }
}
