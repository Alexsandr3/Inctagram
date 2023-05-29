import { Field, GraphQLISODateTime, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { UserEntity } from '../../../users/domain/user.entity';
import { UserStatusType } from '../../../users/types/user-status.type';

registerEnumType(UserStatusType, {
  name: 'UserStatusType',
  description:
    'User Status ' +
    'PENDING - user registered but not activated; ' +
    'ACTIVE - user registered and activated; ' +
    'BANNED - user banned by admin; ' +
    'DELETED - user deleted by admin',
});
@ObjectType()
export class UserForSuperAdminViewModel extends UserEntity {
  @Field(() => Int)
  userId: number;
  @Field()
  userName: string;
  @Field({ nullable: true })
  profileLink: string;
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => UserStatusType)
  status: UserStatusType;

  constructor() {
    super();
  }

  static create(
    userId: number,
    userName: string,
    profileLink: string,
    dataAdded: Date,
    status: UserStatusType,
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
