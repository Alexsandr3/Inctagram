import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ImageForSuperAdminViewModel {
  @Field(() => Int, { nullable: true })
  ownerId: number;
  @Field(() => Int, { nullable: true })
  fileSize: number;
  @Field(() => String, { nullable: true })
  url: string;
  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;
  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;
  constructor() {}

  static createIns(
    ownerId: number,
    fileSize: number,
    url: string,
    createdAt: Date,
    updatedAt: Date,
  ): ImageForSuperAdminViewModel {
    const ins = new ImageForSuperAdminViewModel();
    ins.ownerId = ownerId;
    ins.fileSize = fileSize;
    ins.url = url;
    ins.createdAt = createdAt;
    ins.updatedAt = updatedAt;
    return ins;
  }
}
