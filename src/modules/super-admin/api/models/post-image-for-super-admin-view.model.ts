import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { ImagePostEntity } from '../../../posts/domain/image-post.entity';
import { PostStatus } from '../../../posts/types/post-status.type';

@ObjectType()
export class PostImageForSuperAdminViewModel extends ImagePostEntity {
  @Field(() => Int, { nullable: true })
  postId: number;
  @Field(() => Int, { nullable: true })
  fileSize: number;
  @Field(() => String, { nullable: true })
  status: PostStatus;
  @Field(() => String, { nullable: true })
  url: string;
  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;
  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;

  constructor() {
    super();
  }

  static create(image: ImagePostEntity): PostImageForSuperAdminViewModel {
    const model = new PostImageForSuperAdminViewModel();
    model.postId = image.postId;
    model.fileSize = image.fileSize;
    model.status = image.status;
    model.url = image.url;
    model.createdAt = image.createdAt;
    model.updatedAt = image.updatedAt;
    return model;
  }

  static createEmpty() {
    const model = new PostImageForSuperAdminViewModel();
    model.postId = null;
    model.fileSize = null;
    return model;
  }
}
