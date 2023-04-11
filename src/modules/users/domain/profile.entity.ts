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
    instance.setValues(userName, firstName, lastName, city, dateOfBirth, aboutMe);
    return instance;
  }

  static preparationProfile(profile: any): ProfileEntity {
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

  private setValues(
    userName: string,
    firstName: string,
    lastName: string,
    city: string,
    dateOfBirth: Date,
    aboutMe: string,
  ) {
    if (userName) this.userName = userName;
    if (firstName) this.firstName = firstName;
    if (lastName) this.lastName = lastName;
    if (city) this.city = city;
    if (dateOfBirth) this.dateOfBirth = dateOfBirth;
    if (aboutMe) this.aboutMe = aboutMe;
  }

  update(userName: string, firstName: string, lastName: string, city: string, dateOfBirth: Date, aboutMe: string) {
    this.setValues(userName, firstName, lastName, city, dateOfBirth, aboutMe);
    return this;
  }
}
