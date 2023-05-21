import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => Int)
  userId: number;
  @Field()
  userName: string;
  @Field({ nullable: true })
  profileLink: string;
  @Field(() => GraphQLISODateTime)
  dataAdded: Date;
  @Field()
  status: string;

  constructor() {}

  static create(userId: number, userName: string, profileLink: string, dataAdded: Date, status: string): UserModel {
    const user = new UserModel();
    user.userId = userId;
    user.userName = userName;
    user.profileLink = profileLink;
    user.dataAdded = dataAdded;
    user.status = status;
    return user;
  }
}
