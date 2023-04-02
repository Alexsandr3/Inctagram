import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../../providers/mailer/application/mail.service';
import { RegisterInputDto } from '../../api/input-dto/register.input.dto';

/**
 * @description create new user and send email for confirmation
 */
export class CreateUserCommand {
  constructor(public readonly userInputModel: RegisterInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly mailService: MailService) {}

  /**
   * @description create new user and send email for confirmation
   * @param command
   */
  async execute(command: CreateUserCommand) {
    const { email, password } = command.userInputModel;
    //email verification and login for uniqueness
    // this.mailService.sendUserConfirmation(user.email, user.confirmationCode);
  }

  /**
   * @description check email and login for uniqueness
   * @param userInputModel
   * @private
   */
  private async validateUser(userInputModel: any): Promise<boolean> {
    return true;
  }
}
