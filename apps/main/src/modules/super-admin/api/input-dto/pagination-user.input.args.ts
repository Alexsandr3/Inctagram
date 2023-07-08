import { BasePaginationInputDto } from '../../../../main/shared/base-pagination.input.dto';
import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { SortDirectionType } from '@common/main/enums/sort-direction.enum';
import { SortByForUserInputType } from './types/sort-by-for-user.input.type';

registerEnumType(SortDirectionType, {
  name: 'SortDirectionType',
  description: 'Sort Direction [asc, desc]',
});

registerEnumType(SortByForUserInputType, {
  name: 'SortByForUser',
  description: 'Sort By [id, createdAt]',
});

/**
 * Default page size for pagination [12]
 */
const DEFAULT_PAGE_SIZE = 12;

/**
 * @description Pagination for User
 */
@ArgsType()
export class PaginationUserInputDto extends BasePaginationInputDto {
  constructor() {
    super();
  }

  @Field(() => Int)
  @IsNumber()
  userId: number;

  @Field(() => Int, { nullable: true })
  pageNumber: number;

  @Field(() => Int, { nullable: true, defaultValue: DEFAULT_PAGE_SIZE })
  pageSize: number = DEFAULT_PAGE_SIZE;

  @Field(() => SortByForUserInputType, { nullable: true })
  sortBy: SortByForUserInputType = SortByForUserInputType.createdAt;

  @Field(() => SortDirectionType, { nullable: true })
  sortDirection: SortDirectionType = SortDirectionType.Desc;

  /**
   * @description Get page number
   */
  getPageSize(): number {
    return this.normalizePageValue(this.pageSize, DEFAULT_PAGE_SIZE);
  }
}
