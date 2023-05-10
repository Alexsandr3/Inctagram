import { BasePaginationInputDto } from '../../../../main/shared/base-pagination.input.dto';

/**
 * @description Pagination for Posts
 */
export class PaginationSubscriptionInputDto extends BasePaginationInputDto {
  isSortByDefault(): string {
    const defaultValue = ['userId', 'dateOfPayment', 'endDateOfSubscription'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'dateOfPayment');
  }
}
