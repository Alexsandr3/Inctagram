import { ProfileEntity } from '../../domain/profile.entity';
import { AvatarViewDto } from './user-images-view.dto';

export class ProfileViewDto {
  id: number;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  city: string | null;
  dateOfBirth: Date | null;
  aboutMe: string | null;
  avatars: AvatarViewDto[];
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
    profileView.avatars = profile.avatars.map(a => new AvatarViewDto(a.url, a.width, a.height, a.fileSize));
    return profileView;
  }
}
