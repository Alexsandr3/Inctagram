import { BasePaginationInputDto } from '../../../../main/shared/base-pagination.input.dto';

/**
 * @description Default page size [12]
 */
const DEFAULT_PAGE_SIZE = 12;

/**
 * @description Pagination for Posts
 */
export class PaginationPostsInputDto extends BasePaginationInputDto {
  isSortByDefault(): string {
    const defaultValue = ['id', 'description', 'location', 'createdAt'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'createdAt');
  }
  getPageSize(): number {
    return this.normalizePageValue(this.pageSize, DEFAULT_PAGE_SIZE);
  }
}
