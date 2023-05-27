import { BasePaginationInputDto } from '../../../../main/shared/base-pagination.input.dto';
import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { SortDirectionType } from '../../../../main/enums/sort-direction.enum';
import { UserStatusInputType } from './types/user-status.input.type';
import { SortByForUsersInputType } from './types/sort-by-for-users.input.type';

registerEnumType(SortDirectionType, {
  name: 'SortDirectionType',
  description: 'Sort Direction [asc, desc]',
});

registerEnumType(UserStatusInputType, {
  name: 'UserStatusInputType',
  description: 'User Status [all, active, banned]',
});

registerEnumType(SortByForUsersInputType, {
  name: 'SortByForUsers',
  description: 'Sort By [id, userName, createdAt]',
});

const DEFAULT_PAGE_SIZE = 10;
/**
 * @description Pagination for Users
 * ['pageNumber', 'pageSize', 'sortBy', 'sortDirection', 'status', 'search']
 */
@ArgsType()
export class PaginationUsersInputDto extends BasePaginationInputDto {
  constructor() {
    super();
  }

  @Field(() => Int, { nullable: true })
  pageNumber: number;

  @Field(() => Int, { nullable: true, defaultValue: DEFAULT_PAGE_SIZE })
  pageSize: number = DEFAULT_PAGE_SIZE;

  @Field(() => SortByForUsersInputType, { nullable: true })
  sortBy: SortByForUsersInputType = SortByForUsersInputType.id;

  @Field(() => SortDirectionType, { nullable: true })
  sortDirection: SortDirectionType = SortDirectionType.Desc;

  @Field(() => UserStatusInputType, { nullable: true })
  @IsOptional()
  status: UserStatusInputType = UserStatusInputType.all;

  @Field(() => String, { nullable: true })
  @IsOptional()
  search: string;

  /**
   * @description Get page number
   */
  getPageSize(): number {
    return this.normalizePageValue(this.pageSize, DEFAULT_PAGE_SIZE);
  }
}
