import { ApiProperty } from '@nestjs/swagger';

export abstract class Paginated<T> {
  @ApiProperty()
  totalCount: number;
  @ApiProperty()
  pagesCount: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  abstract items: T;

  public static getPaginated<T>(data: { items: T; page: number; size: number; count: number }): Paginated<T> {
    return {
      totalCount: data.count,
      pagesCount: Math.ceil(data.count / data.size),
      page: data.page,
      pageSize: data.size,
      items: data.items,
    };
  }
}
