import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserForSuperAdminViewModel {
  @Field(() => Int)
  userId: number;
  @Field()
  userName: string;
  @Field({ nullable: true })
  profileLink: string;
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field()
  status: string;

  constructor() {}

  static create(
    userId: number,
    userName: string,
    profileLink: string,
    dataAdded: Date,
    status: string,
  ): UserForSuperAdminViewModel {
    const user = new UserForSuperAdminViewModel();
    user.userId = userId;
    user.userName = userName;
    user.profileLink = profileLink;
    user.createdAt = dataAdded;
    user.status = status;
    return user;
  }
}
