import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';

export class BanUserCommand {
  constructor(public readonly userId: number, public readonly banReason: string) {}
}

@CommandHandler(BanUserCommand)
export class BanUserUseCase
  extends BaseNotificationUseCase<BanUserCommand, boolean>
  implements ICommandHandler<BanUserCommand>
{
  constructor(private readonly usersRepository: IUsersRepository) {
    super();
  }

  async executeUseCase(command: BanUserCommand): Promise<boolean> {
    const { userId, banReason } = command;
    //find profile
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    user.setStatusBanned(banReason);
    await this.usersRepository.updateUser(user);
    return true;
  }
}
