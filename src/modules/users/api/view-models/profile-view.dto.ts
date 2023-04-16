import { ProfileEntity } from '../../domain/profile.entity';
import { BaseImageEntity } from '../../../images/domain/baseImageEntity';

export class ProfileViewDto {
  id: number;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  city: string | null;
  dateOfBirth: Date | null;
  aboutMe: string | null;
  images: BaseImageEntity[];
  constructor() {}

  static createView(profile: ProfileEntity, userName: string): ProfileViewDto {
    const profileView = new ProfileViewDto();
    profileView.id = profile.userId;
    profileView.userName = userName;
    profileView.firstName = profile.firstName;
    profileView.lastName = profile.lastName;
    profileView.city = profile.city;
    profileView.dateOfBirth = profile.dateOfBirth;
    profileView.aboutMe = profile.aboutMe;
    profileView.images = profile.avatars;
    return profileView;
  }
}
