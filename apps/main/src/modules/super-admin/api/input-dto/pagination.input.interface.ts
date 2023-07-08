export interface IPaginationInputDto {
  userId: number;
  sortBy: string;
  skip: number;
  isSortDirection: string;
  getPageSize: number;
  getPageNumber: number;
}
