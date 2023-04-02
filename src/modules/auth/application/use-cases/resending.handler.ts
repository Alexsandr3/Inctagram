import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from '../../../../providers/mailer/application/mail.service';

/**
 * @description Resending command
 */
export class ResendingCommand {
  constructor() {}
}

@CommandHandler(ResendingCommand)
export class ResendingHandler implements ICommandHandler<ResendingCommand> {
  constructor(private readonly mailService: MailService) {}

  /**
   * Resending code confirmation
   * @param command
   */
  async execute(command: ResendingCommand): Promise<boolean> {
    return;
  }
}
