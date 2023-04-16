import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../main/use-cases/base-notification.use-case';
import { ImageType } from '../../images/type/image.type';

export class UploadImagePostCommand {
  constructor(public readonly userId: number, public readonly mimetype: string, public readonly photo: Buffer) {}
}

@CommandHandler(UploadImagePostCommand)
export class UploadImagePostUseCase
  extends BaseNotificationUseCase<UploadImagePostCommand, void>
  implements ICommandHandler<UploadImagePostCommand>
{
  constructor() {
    super();
  }
  async executeUseCase(command: UploadImagePostCommand): Promise<void> {
    //set type and sizes for images
    const type = ImageType.POST;
  }
}
