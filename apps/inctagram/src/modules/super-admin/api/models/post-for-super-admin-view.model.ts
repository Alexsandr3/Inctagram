import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { PostImageForSuperAdminViewModel } from './post-image-for-super-admin-view.model';
import { PostEntity } from '../../../posts/domain/post.entity';

@ObjectType()
export class PostForSuperAdminViewModel extends PostEntity {
  @Field(() => Int, { nullable: true })
  id: number;
  @Field(() => Int, { nullable: true })
  ownerId: number;
  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;
  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;
  @Field(() => [PostImageForSuperAdminViewModel])
  images: PostImageForSuperAdminViewModel[];
  constructor() {
    super();
  }

  static createIns(post: PostEntity): PostForSuperAdminViewModel {
    const model = new PostForSuperAdminViewModel();
    model.id = post.id;
    model.ownerId = post.ownerId;
    model.createdAt = post.createdAt;
    model.updatedAt = post.updatedAt;
    model.images = post.images.filter(image => {
      //if sizeType contains "HUGE_HD" need to return this image
      if (image.sizeType.includes('HUGE_HD')) {
        return PostImageForSuperAdminViewModel.create(image);
      }
    });
    return model;
  }

  static createEmpty() {
    const model = new PostForSuperAdminViewModel();
    model.id = null;
    model.ownerId = null;
    model.images = [PostImageForSuperAdminViewModel.createEmpty()];
    return model;
  }
}
