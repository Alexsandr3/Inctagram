import { PostImageViewModel } from './post-image-view.dto';
import { PostEntity } from '../../domain/post.entity';

export class PostViewModel {
  id: number;
  description: string;
  location: string;
  images: PostImageViewModel[];
  createdAt: Date;
  updatedAt: Date;

  constructor(post: PostEntity) {
    this.id = post.id;
    this.description = post.description;
    this.location = post.location;
    this.images = post.images.map(i => new PostImageViewModel(i.url, i.width, i.height, i.fileSize, i.resourceId));
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }
}
