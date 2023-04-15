import { ImageEntity } from '../domain/image.entity';

export type ImageEntitiesAndUrls = {
  instancesImages: ImageEntity[];
  urlImages: string[];
};
