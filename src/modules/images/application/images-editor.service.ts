import { Injectable } from '@nestjs/common';
import sharp, { Metadata } from 'sharp';
import { BaseImageEntity } from '../domain/base-image.entity';
import { S3StorageAdapter } from '../../../providers/aws/s3-storage.adapter';
import { ImageSizeConfig } from '../image-size-config.type';
import { ImageSizeType } from '../type/image-size.type';
import { ImageType } from '../type/image.type';
import { randomUUID } from 'crypto';

@Injectable()
export class ImagesEditorService {
  constructor(private readonly storageS3: S3StorageAdapter) {}

  /**
   * @description Resize image to width and height
   * @param inputPath
   * @param width
   * @param height
   */
  private async reSizeImage(inputPath: Buffer, width: number, height: number): Promise<Buffer> {
    try {
      return await sharp(inputPath).resize(width, height, { fit: 'cover', position: 'center' }).toBuffer();
    } catch (e) {
      console.error(`Error resizing image: ${e}`);
    }
  }

  /**
   * @description Calculate aspect ratio
   * @param image
   * @private
   */
  private async calculateAspectRatio(image: Buffer): Promise<string> {
    const metadata: Metadata = await sharp(image.buffer).metadata();
    const aspectRatio: number = metadata.width / metadata.height;
    if (aspectRatio === 1) {
      return '1:1';
    } else if (aspectRatio > 1) {
      return '16:9';
    } else {
      return '4:5';
    }
  }

  /**
   * @description Generate keys for images
   * @param image
   * @param type
   * @private
   */
  private async sizeGenerator(image: Buffer, type: ImageType): Promise<string[]> {
    if (type === ImageType.AVATAR) {
      return [ImageSizeType.MEDIUM, ImageSizeType.THUMBNAIL];
    }
    const aspectRatio = await this.calculateAspectRatio(image);
    const keys = Object.keys(ImageSizeConfig);
    const result = [];
    for (let i = 0; i < keys.length; i++) {
      const size = ImageSizeConfig[keys[i]];
      if (size.key === aspectRatio) {
        result.push(keys[i]);
      }
    }
    return result;
  }

  /**
   * @description Generate keys for images for user
   * @private
   */
  private imageKeyGenerators: {
    [type: string]: (userId: number, sizes: string[], resourceId) => Promise<string[]>;
  } = {
    [ImageType.AVATAR]: async (userId: number, sizes: string[], resourceId) =>
      this.generatorKeysImagesForAvatar(userId, sizes, resourceId),
    [ImageType.POST]: async (userId: number, sizes: string[], resourceId) =>
      this.generatorKeysImagesForPost(userId, sizes, resourceId),
  };

  /**
   * @description Generate keys for images for avatar
   * @param userId
   * @param size
   * @param resourceId
   */
  private async generatorKeysImagesForAvatar(userId: number, size: string[], resourceId: string): Promise<string[]> {
    const keys = [];
    for (let i = 0; i < size.length; i++) {
      const key = `users/${userId}/avatar/images-${ImageSizeConfig[size[i]].defaultWidth}x${
        ImageSizeConfig[size[i]].defaultHeight
      }`;
      keys.push(key);
    }
    return keys;
  }

  /**
   * @description Generate keys for images for post
   * @param userId
   * @param size
   * @param resourceId
   * @private
   */
  private async generatorKeysImagesForPost(userId: number, size: string[], resourceId: string): Promise<string[]> {
    const keys = [];
    for (let i = 0; i < size.length; i++) {
      const key = `users/${userId}/post/${resourceId}-images-${ImageSizeConfig[size[i]].defaultWidth}x${
        ImageSizeConfig[size[i]].defaultHeight
      }`;
      keys.push(key);
    }
    return keys;
  }

  /**
   * @description Generate keys for images and save images on s3 storage
   * @param userId
   * @param files
   * @param type
   */
  async generateAndSaveImages(
    userId: number,
    files: Express.Multer.File[],
    type: ImageType,
  ): Promise<BaseImageEntity[]> {
    // save on s3 storage and create instances images
    const instancesImages = [];

    for (const file of files) {
      const resourceId = randomUUID();
      const { buffer: photo, mimetype } = file;

      // generate sizes for images
      const sizes = await this.sizeGenerator(photo, type);

      // generate keys for images
      const keys: string[] = [];
      if (this.imageKeyGenerators[type]) {
        const keysGenerator = await this.imageKeyGenerators[type](userId, sizes, resourceId);
        keys.push(...keysGenerator);
      }

      // changing size image
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

      // delete old image
      await this.storageS3.deleteManyFiles(keys);

      // save on s3 storage and create instances images
      for (let i = 0; i < keys.length; i++) {
        const keyImage = keys[i];
        const imageToSave = changeSizeImage[i];
        const urlImage = await this.storageS3.saveFile(userId, imageToSave, keyImage, mimetype);
        const size = sizes[i];
        const imageEntity = BaseImageEntity.initCreateImageEntity(size, type, urlImage, imageToSave, resourceId);
        instancesImages.push(imageEntity);
      }
    }

    return instancesImages;
  }

  async deleteImages(...images: BaseImageEntity[]) {
    const keys = images.map(image => image.url);
    await this.storageS3.deleteManyFiles(keys);
  }

  /**
   * @description Delete image by url
   * @param urlsForDelete
   */
  async deleteImageByUrl(urlsForDelete: string[]) {
    await this.storageS3.deleteManyFiles(urlsForDelete);
  }
}

/*

/!**
 * @description Generate keys for images and save images on s3 storage
 * @param userId
 * @param file
 * @param type
 *!/
async generatorKeysWithSaveImagesAndCreateImages(
  userId: number,
  file: Express.Multer.File,
  type: ImageType,
): Promise<BaseImageEntity[]> {
  const { buffer: photo, mimetype } = file;
  //generate sizes for images
  const sizes = await this.sizeGenerator(photo, type);
  //generate keys for images
  const keys: string[] = [];
const resourceId = randomUUID();
if (this.imageKeyGenerators[type]) {
  const keysGenerator = await this.imageKeyGenerators[type](userId, sizes, resourceId);
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
await this.storageS3.deleteManyFiles(keys);

//save on s3 storage and create instances images
const instancesImages = [];
for (let i = 0; i < keys.length; i++) {
  const keyImage = keys[i];
  const imageToSave = changeSizeImage[i];
  const urlImage = await this.storageS3.saveFile(userId, imageToSave, keyImage, mimetype);
  const size = sizes[i];
  const imageEntity = BaseImageEntity.initCreateImageEntity(size, type, urlImage, imageToSave, resourceId);
  instancesImages.push(imageEntity);
}

return instancesImages;
}*/
