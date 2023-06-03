import { Injectable, Logger } from '@nestjs/common';
import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { ImageType } from '@common/main/entities/type/image.type';
import { ClientAdapter } from './client-adapter';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);
  constructor(private readonly clientAdapter: ClientAdapter) {}

  async generateAndSaveImages(
    userId: number,
    files: Express.Multer.File[],
    type: ImageType,
  ): Promise<BaseImageEntity[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      const blob = new Blob([file.buffer]);
      formData.append(`files`, blob);
    });
    formData.append('userId', userId.toString());
    formData.append('type', type);
    return this.clientAdapter.sendFormData<BaseImageEntity[]>(formData);
  }

  async deleteImages(...keys: string[]) {
    return this.clientAdapter.deleteImages(keys);
  }
}
