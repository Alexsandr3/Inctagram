import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ImageMain } from '@images-ms/modules/images/domain/image.entity';

export abstract class IImagesRepository {
  abstract save(images: ImageMain[]): Promise<void>;

  abstract findImagesByKeys(keys: string[]): Promise<ImageMain[]>;
}

@Injectable()
export class ImagesRepository implements IImagesRepository {
  constructor(
    @InjectRepository(ImageMain)
    private paymentsRepository: Repository<ImageMain>,
  ) {}

  async save(images: ImageMain[]): Promise<void> {
    for (const image of images) {
      await this.paymentsRepository.save(image);
    }
  }
  async findImagesByKeys(keys: string[]): Promise<ImageMain[]> {
    return await this.paymentsRepository.find({
      where: { url: In(keys) },
    });
  }
}
