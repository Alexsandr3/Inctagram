import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { ImageSizeType } from '@common/main/entities/type/image-size.type';
import { ImageType } from '@common/main/entities/type/image.type';
import { StatusImagesType } from '@common/main/types/status-images.type';

@Entity()
export class ImageMain implements BaseImageEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ type: 'enum', enum: ImageType })
  imageType: ImageType;
  @Column({ type: 'enum', enum: ImageSizeType })
  sizeType: ImageSizeType;
  @Column({ type: 'enum', enum: StatusImagesType, default: StatusImagesType.CREATED })
  status: StatusImagesType;
  @Column()
  url: string;
  @Column()
  width: number;
  @Column()
  height: number;
  @Column()
  fileSize: number;
  @Column()
  fieldId: string;
  @Column()
  resourceId: string;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor() {}

  static create(images: BaseImageEntity[]): ImageMain[] {
    return images.map(image => {
      const newImage = new ImageMain();
      newImage.id = image.id;
      newImage.imageType = image.imageType;
      newImage.sizeType = image.sizeType;
      newImage.status = StatusImagesType.CREATED;
      newImage.url = image.url;
      newImage.width = image.width;
      newImage.height = image.height;
      newImage.fileSize = image.fileSize;
      newImage.fieldId = image.fieldId;
      newImage.resourceId = image.resourceId;
      newImage.createdAt = image.createdAt;
      newImage.updatedAt = image.updatedAt;
      return newImage;
    });
  }

  changeStatusDeleted(): ImageMain {
    this.status = StatusImagesType.DELETED;
    return this;
  }
}
