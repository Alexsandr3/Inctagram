import { Paginated } from '../../../../main/shared/paginated';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SubscriptionForSuperAdminViewModel } from './subscription-for-super-admin-view.model';

@ObjectType()
export class PaymentsWithPaginationViewModel extends Paginated<SubscriptionForSuperAdminViewModel> {
  @Field(() => Int)
  totalCount: number;
  @Field(() => Int)
  pagesCount: number;
  @Field(() => Int)
  page: number;
  @Field(() => Int)
  pageSize: number;
  @Field(() => [SubscriptionForSuperAdminViewModel])
  items: SubscriptionForSuperAdminViewModel;
}
