import { IsOptional } from 'class-validator';
import { SortDirectionType } from '../enums/sort-direction.enum';

/**
 * Default page size for pagination [12]
 */
const DEFAULT_PAGE_SIZE = 12;

/**
 * Base Pagination Input Dto is a base class for pagination input models
 * @description ['pageSize', 'pageNumber', 'sortBy', 'sortDirection']
 */
export class BasePaginationInputDto {
  /**
   * pageSize is number of items that should be returned
   */
  @IsOptional()
  pageSize?: number;
  /**
   *  pageNumber is number of portions that should be returned
   */
  @IsOptional()
  pageNumber?: number;
  /**
   * Sort by parameters
   */
  @IsOptional()
  sortBy?: string;
  /**
   * Sort by desc or asc ['asc', 'desc']
   */
  @IsOptional()
  sortDirection?: SortDirectionType = SortDirectionType.Desc;

  get skip(): number {
    return this.getPageSize() * (this.getPageNumber() - 1);
  }

  isSortDirection(): 'asc' | 'desc' {
    return this.sortDirection === SortDirectionType.Asc ? 'asc' : 'desc';
  }

  protected normalizePageValue(value: number, defaultValue: number): number {
    if (isNaN(value) || value < 1) {
      return defaultValue;
    }
    return value;
  }

  getPageSize(): number {
    return this.normalizePageValue(this.pageSize, DEFAULT_PAGE_SIZE);
  }

  getPageNumber(): number {
    return this.normalizePageValue(this.pageNumber, 1);
  }
}
