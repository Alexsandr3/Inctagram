import { PostImageViewModel } from './post-image-view.dto';

export class PostViewModel {
  id: number;
  description: string;
  location: string;
  images: PostImageViewModel[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    description: string,
    location: string,
    images: PostImageViewModel[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.description = description;
    this.location = location;
    this.images = images;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
