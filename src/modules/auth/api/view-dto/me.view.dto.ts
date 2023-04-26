import { User } from '@prisma/client';

/**
 * Me View DTO
 */
export class MeViewDto {
  userId: number;
  userName: string;
  email: string;

  constructor(user: User) {
    this.userId = user.id;
    this.userName = user.userName;
    this.email = user.email;
  }
}
