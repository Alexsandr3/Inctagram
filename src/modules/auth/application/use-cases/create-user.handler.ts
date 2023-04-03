import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';
import { RegisterInputDto } from '../../api/input-dto/register.input.dto';
import { User } from '../../../users/domain/user.entity';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * @description create new user and send email for confirmation
 */
export class CreateUserCommand {
  constructor(public readonly userInputModel: RegisterInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailManager,
  ) {}

  /**
   * @description create new user and send email for confirmation
   * @param command
   */
  async execute(command: CreateUserCommand) {
    const { email, password } = command.userInputModel;

    await this.validateUser(email);

    const user = await this.createUser(email, password);
    await this.mailService.sendUserConfirmation(email, user.emailConfirmation.confirmationCode);
  }

  private async createUser(email: string, password: string): Promise<User> {
    const passwordHash = await this.authService.getPasswordHash(password);

    const user = new User(email, passwordHash);
    await this.usersRepository.saveUser(user);

    return user;
  }

  /**
   * @description check email and login for uniqueness
   * @param email
   * @private
   */
  private async validateUser(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);
    if (user) throw new BadRequestException(`email are already exists`, 'email');
  }
}
