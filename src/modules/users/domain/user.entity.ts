//@Entity('Users')
export class User {
  id: number;
  email: string;
  passwordHash: string;
  createdAt: Date;
  isConfirmed: boolean;
  confirmationCode: string;
  codeExpirationDate: Date;

  constructor(email: string, passwordHash: string) {}

  confirmUser() {}

  updateEmailConfirmation() {}

  updatePassword(passwordHash: string) {}
}
