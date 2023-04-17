import { BaseDateEntity } from '../../users/domain/base-date.entity';
import { ImagePostEntity } from './image-post.entity';

export class PostEntity extends BaseDateEntity {
  id: number;
  description: string;
  location: string;
  images: ImagePostEntity[];
}
