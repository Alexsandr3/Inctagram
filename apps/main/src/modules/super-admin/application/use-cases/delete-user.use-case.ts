import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { NotificationException } from '@common/main/validators/result-notification';
import { GraphQLErrorType } from '../../../../main/enums/graphQL-error.type';
import { NotificationCode } from '@common/configuration/notificationCode';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';

export class DeleteUserCommand {
  constructor(public readonly userId: number) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase
  extends BaseNotificationUseCase<DeleteUserCommand, boolean>
  implements ICommandHandler<DeleteUserCommand>
{
  constructor(private readonly usersRepository: IUsersRepository) {
    super();
  }

  async executeUseCase(command: DeleteUserCommand): Promise<boolean> {
    const { userId } = command;

    //find profile
    const user = await this.usersRepository.findById(userId);
    if (!user)
      throw new NotificationException(
        `User with id: ${userId} not found`,
        GraphQLErrorType.graphql,
        NotificationCode.NOT_FOUND,
      );
    user.setStatusDeleted();
    await this.usersRepository.updateUser(user);
    return true;
  }
}
