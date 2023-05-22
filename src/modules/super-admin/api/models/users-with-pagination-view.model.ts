import { UserForSuperAdminViewModel } from './user-for-super-admin-view.model';
import { Paginated } from '../../../../main/shared/paginated';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UsersWithPaginationViewModel extends Paginated<UserForSuperAdminViewModel> {
  @Field(() => Int)
  totalCount: number;
  @Field(() => Int)
  pagesCount: number;
  @Field(() => Int)
  page: number;
  @Field(() => Int)
  pageSize: number;
  @Field(() => [UserForSuperAdminViewModel])
  items: UserForSuperAdminViewModel;
}
