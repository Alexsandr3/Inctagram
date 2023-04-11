import { Profile } from '@prisma/client';
import { ImageEntity } from './image.entity';
import { BaseDateEntity } from './base-date.entity';

export class ProfileEntity extends BaseDateEntity {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  city: string;
  dateOfBirth: Date;
  aboutMe: string;
  images: ImageEntity[];

  constructor() {
    super();
  }

  static initCreate(
    userId: number,
    userName: string,
    firstName: string,
    lastName: string,
    city: string,
    dateOfBirth: Date,
    aboutMe: string,
  ) {
    const instance = new ProfileEntity();
    instance.userId = userId;
    if (userName) instance.userName = userName;
    if (firstName) instance.firstName = firstName;
    if (lastName) instance.lastName = lastName;
    if (city) instance.city = city;
    if (dateOfBirth) instance.dateOfBirth = dateOfBirth;
    if (aboutMe) instance.aboutMe = aboutMe;
    return instance;
  }

  static preparationProfile(profile: Profile): ProfileEntity {
    const instance = new ProfileEntity();
    instance.userId = profile.userId;
    instance.userName = profile.userName;
    instance.firstName = profile.firstName;
    instance.lastName = profile.lastName;
    instance.city = profile.city;
    instance.dateOfBirth = profile.dateOfBirth;
    instance.aboutMe = profile.aboutMe;
    return instance;
  }

  checkOwner(userId: number) {
    return this.userId === userId;
  }
}
