import { Paginated } from '../../../../main/shared/paginated';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ImageForSuperAdminViewModel } from './image-for-super-admin-view.model';

@ObjectType()
export class ImagesWithPaginationViewModel extends Paginated<ImageForSuperAdminViewModel> {
  @Field(() => Int)
  totalCount: number;
  @Field(() => Int)
  pagesCount: number;
  @Field(() => Int)
  page: number;
  @Field(() => Int)
  pageSize: number;
  @Field(() => [ImageForSuperAdminViewModel])
  items: ImageForSuperAdminViewModel;
}
