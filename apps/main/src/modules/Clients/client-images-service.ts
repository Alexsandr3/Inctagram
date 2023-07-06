import { Injectable } from '@nestjs/common';
import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { ImageType } from '@common/main/entities/type/image.type';
import { ClientImagesAdapter } from './client-images-adapter';

@Injectable()
export class ClientImagesService {
  constructor(private readonly clientAdapter: ClientImagesAdapter) {}

  async generateAndSaveImages(
    userId: number,
    files: Express.Multer.File[],
    type: ImageType,
  ): Promise<BaseImageEntity[]> {
    const formData = new FormData();
    files.forEach(file => {
      let blob = new Blob([file.buffer], { type: file.mimetype });
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
