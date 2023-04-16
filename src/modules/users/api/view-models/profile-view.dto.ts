import { ProfileEntity } from '../../domain/profile.entity';
import { AvatarImageViewDto } from './avatar-image-view.dto';

export class ProfileViewModel {
  id: number;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  city: string | null;
  dateOfBirth: Date | null;
  aboutMe: string | null;
  avatars: AvatarImageViewDto[];
  constructor() {}

  static createView(profile: ProfileEntity, userName: string): ProfileViewModel {
    const profileView = new ProfileViewModel();
    profileView.id = profile.userId;
    profileView.userName = userName;
    profileView.firstName = profile.firstName;
    profileView.lastName = profile.lastName;
    profileView.city = profile.city;
    profileView.dateOfBirth = profile.dateOfBirth;
    profileView.aboutMe = profile.aboutMe;
    profileView.avatars = profile.avatars.map(a => new AvatarImageViewDto(a.url, a.width, a.height, a.fileSize, a.id));
    return profileView;
  }
}
