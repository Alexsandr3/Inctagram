import { BasePaginationInputDto } from '../../../../main/shared/base-pagination.input.dto';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { SortDirectionType } from '../../../../main/enums/sort-direction.enum';
import { UserStatusInputType } from './types/user-status.input.type';

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
  @IsOptional()
  pageNumber: number;
  @Field(() => Int, { nullable: true })
  @IsOptional()
  pageSize: number;
  @Field(() => String, { nullable: true })
  @IsOptional()
  sortBy: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  sortDirection: SortDirectionType = SortDirectionType.Desc;

  @Field(() => String, { nullable: true })
  @IsOptional()
  status: UserStatusInputType = UserStatusInputType.All;

  @Field(() => String, { nullable: true })
  @IsOptional()
  search: string;

  isSortByDefault(): string {
    const defaultValue = ['id', 'userName', 'createdAt'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'id');
  }

  getStatus(): string {
    const defaultValue = ['all', 'active', 'banned'];
    return (this.status = defaultValue.includes(this.status) ? this.status : UserStatusInputType.All);
  }

  getPageSize(): number {
    return this.normalizePageValue(this.pageSize, DEFAULT_PAGE_SIZE);
  }
}
