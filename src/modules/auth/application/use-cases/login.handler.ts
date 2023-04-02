import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginInputDto } from '../../api/input-dto/login.input.dto';

/**
 * @description login user and return tokens
 */
export class LoginCommand {
  constructor(
    public readonly loginInputModel: LoginInputDto,
    public readonly ip: string,
    public readonly deviceName: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor() {}

  /**
   * @description login user and return tokens
   * @param command
   */
  async execute(command: LoginCommand) {}
}
