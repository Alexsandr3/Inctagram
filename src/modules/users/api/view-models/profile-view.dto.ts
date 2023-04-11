import { ProfileEntity } from '../../domain/profile.entity';

export class ProfileViewDto {
  id: number;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  city: string | null;
  dateOfBirth: Date | null;
  aboutMe: string | null;
  constructor() {}

  static createView(profile: ProfileEntity): ProfileViewDto {
    const profileView = new ProfileViewDto();
    profileView.id = profile.userId;
    profileView.userName = profile.userName;
    profileView.firstName = profile.firstName;
    profileView.lastName = profile.lastName;
    profileView.city = profile.city;
    profileView.dateOfBirth = profile.dateOfBirth;
    profileView.aboutMe = profile.aboutMe;
    return profileView;
  }
}
