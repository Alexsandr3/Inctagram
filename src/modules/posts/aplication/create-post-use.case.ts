import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../main/use-cases/base-notification.use-case';
import { ChildMetadataDto } from '../api/input-dto/create-post.input.dto';

export class CreatePostCommand {
  constructor(
    public readonly userId: number,
    public readonly description: string,
    public readonly childrenMetadata: ChildMetadataDto[],
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
  extends BaseNotificationUseCase<CreatePostCommand, void>
  implements ICommandHandler<CreatePostCommand>
{
  constructor() {
    super();
  }
  async executeUseCase(command: CreatePostCommand): Promise<void> {
    const { userId, description, childrenMetadata } = command;
  }
}
