import { User } from '@prisma/client';

/**
 * Me View DTO
 */
export class MeViewDto {
  userId: number;
  userName: string;
  email: string;
  hasBusinessAccount: boolean;

  constructor(user: User) {
    this.userId = user.id;
    this.userName = user.userName;
    this.email = user.email;
    this.hasBusinessAccount = user.hasBusinessAccount;
  }
}
