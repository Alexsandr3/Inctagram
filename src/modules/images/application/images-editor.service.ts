import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { BaseImageEntity } from '../domain/base-image.entity';
import { S3StorageAdapter } from '../../../providers/aws/s3-storage.adapter';
import { ImageSizeConfig } from '../image-size-config.type';
import { ImageSizeType } from '../type/image-size.type';
import { ImageType } from '../type/image.type';

@Injectable()
export class ImagesEditorService {
  constructor(private readonly storageS3: S3StorageAdapter) {}

  /**
   * @description Generate keys for images for user
   * @private
   */
  private imageKeyGenerators: {
    [type: string]: (userId: number, sizes: string[], ownerId?: number) => Promise<string[]>;
  } = {
    [ImageType.AVATAR]: async (userId: number, sizes: string[]) => this.generatorKeysImagesForAvatar(userId, sizes),
    [ImageType.POST]: async (userId: number, sizes: string[], ownerId?: number) =>
      this.generatorKeysImagesForPost(userId, sizes, ownerId),
  };

  /**
   * @description Resize image to width and height
   * @param inputPath
   * @param width
   * @param height
   */
  async reSizeImage(inputPath: Buffer, width: number, height: number): Promise<Buffer> {
    try {
      return await sharp(inputPath).resize(width, height).toBuffer();
    } catch (e) {
      console.error(`Error resizing image: ${e}`);
    }
  }

  /**
   * @description Generate keys for images for avatar
   * @param userId
   * @param size
   */
  private async generatorKeysImagesForAvatar(userId: number, size: string[]): Promise<string[]> {
    const keys = [];
    for (let i = 0; i < size.length; i++) {
      const key = `users/${userId}/avatar-${ImageSizeConfig[size[i]].defaultWidth}x${
        ImageSizeConfig[size[i]].defaultHeight
      }.jpg`;
      keys.push(key);
    }
    return keys;
  }

  /**
   * @description Generate keys for images for post
   * @param userId
   * @param size
   * @param ownerId
   * @private
   */
  private async generatorKeysImagesForPost(userId: number, size: string[], ownerId?: number): Promise<string[]> {
    const keys = [];
    for (let i = 0; i < size.length; i++) {
      const key = `users/${userId}/post/${ownerId}-${ImageSizeConfig[size[i]].defaultWidth}x${
        ImageSizeConfig[size[i]].defaultHeight
      }.jpg`;
      keys.push(key);
    }
    return keys;
  }

  /**
   * @description Generate keys for images and save images on s3 storage
   * @param userId
   * @param ownerId
   * @param photo
   * @param type
   * @param mimetype
   * @param sizes
   */
  async generatorKeysWithSaveImagesAndCreateImages(
    userId: number,
    ownerId: number,
    photo: Buffer,
    type: ImageType,
    mimetype: string,
    sizes: string[],
  ): Promise<BaseImageEntity[]> {
    //generate keys for images
    const keys: string[] = [];
    if (this.imageKeyGenerators[type]) {
      const keysGenerator = await this.imageKeyGenerators[type](userId, sizes, ownerId);
      keys.push(...keysGenerator);
    }
    //changing size image
    const changeSizeImage = [];
    for (const size of sizes) {
      if (size === ImageSizeType[size]) {
        const resizedImage = await this.reSizeImage(
          photo,
          ImageSizeConfig[size].defaultWidth,
          ImageSizeConfig[size].defaultHeight,
        );
        changeSizeImage.push(resizedImage);
      }
    }
    //delete old image
    await this.storageS3.deleteManyFiles(...keys);

    //save on s3 storage and create instances images
    const instancesImages = [];
    for (let i = 0; i < keys.length; i++) {
      const keyImage = keys[i];
      const imageToSave = changeSizeImage[i];
      const urlImage = await this.storageS3.saveFile(userId, imageToSave, keyImage, mimetype);
      const size = sizes[i];
      const imageEntity = BaseImageEntity.initCreateImageEntity(userId, size, type, urlImage, imageToSave);
      instancesImages.push(imageEntity);
    }

    return instancesImages;
  }

  async deleteImages(...images: BaseImageEntity[]) {
    const keys = images.map(image => image.url);
    await this.storageS3.deleteManyFiles(...keys);
  }
}
