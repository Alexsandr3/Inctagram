import { BasePaginationInputDto } from '../../../../main/shared/base-pagination.input.dto';

/**
 * @description Pagination for Posts
 */
export class PaginationPostsInputDto extends BasePaginationInputDto {
  isSortByDefault(): string {
    const defaultValue = ['id', 'description', 'location', 'createdAt'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'createdAt');
  }
}
