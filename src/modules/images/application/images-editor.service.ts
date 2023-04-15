import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { ImageEntity } from '../domain/image.entity';
import { S3StorageAdapter } from '../../../providers/aws/s3-storage.adapter';
import { UserEntity } from '../../users/domain/user.entity';
import { ImageSizeConfig } from '../image-size-config.type';
import { ImageEntitiesAndUrls } from '../type/image-entities-and.urls.type';
import { ImageSizeType } from '../type/image-size.type';
import { ImageType } from '../type/image.type';

@Injectable()
export class ImagesEditorService {
  constructor(private readonly storageS3: S3StorageAdapter) {}

  /**
   * @description Generate keys for images for user
   * @private
   */
  private imageKeyGenerators: { [type: string]: (userId: number, sizes: string[]) => Promise<string[]> } = {
    [ImageType.AVATAR]: async (userId: number, sizes: string[]) => this.generatorKeysImagesForAvatar(userId, sizes),
    [ImageType.POST]: async (userId: number, sizes: string[]) => this.generatorKeysImagesForPost(userId, sizes),
  };

  /**
   * @description Resize image to width and height
   * @param inputPath
   * @param width
   * @param height
   */
  private async reSizeImage(inputPath: Buffer, width: number, height: number): Promise<Buffer> {
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
   * @private
   */
  private async generatorKeysImagesForPost(userId: number, size: string[]): Promise<string[]> {
    const keys = [];
    for (let i = 0; i < size.length; i++) {
      const key = `users/${userId}/post-${ImageSizeConfig[size[i]].defaultWidth}x${
        ImageSizeConfig[size[i]].defaultHeight
      }.jpg`;
      keys.push(key);
    }
    return keys;
  }

  /**
   * @description Generate keys for images and save images on s3 storage
   * @param user
   * @param photo
   * @param type
   * @param mimetype
   * @param sizes
   */
  async generatorKeysWithSaveImagesAndCreateImages(
    user: UserEntity,
    photo: Buffer,
    type: ImageType,
    mimetype: string,
    sizes: string[],
  ): Promise<ImageEntitiesAndUrls> {
    //generate keys for images
    const keys: string[] = [];
    if (this.imageKeyGenerators[type]) {
      const keysGenerator = await this.imageKeyGenerators[type](user.id, sizes);
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
    if (user.profile.images) {
      for (const keyImage of keys) {
        await this.storageS3.deleteFile(keyImage);
      }
    }
    //save on s3 storage
    const urlImages = [];
    for (let i = 0; i < keys.length; i++) {
      const keyImage = keys[i];
      const imageToSave = changeSizeImage[i];
      const urlImage = await this.storageS3.saveFile(user.id, imageToSave, keyImage, mimetype);
      urlImages.push(urlImage);
    }
    //create instances images
    const instancesImages = [];
    for (let i = 0; i < urlImages.length; i++) {
      const urlImage = urlImages[i];
      const imageToSave = changeSizeImage[i];
      const size = sizes[i];
      const imageEntity = ImageEntity.initCreateImageEntity(user.id, size, type, urlImage, imageToSave);
      instancesImages.push(imageEntity);
    }

    return {
      instancesImages: instancesImages,
      urlImages: urlImages,
    };
  }
}
