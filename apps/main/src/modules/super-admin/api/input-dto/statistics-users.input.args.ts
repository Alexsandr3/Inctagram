import { ArgsType, Field } from '@nestjs/graphql';
import { IsDate, IsOptional } from 'class-validator';

@ArgsType()
export class StatisticsUsersInputArgs {
  @Field(() => Date)
  @IsDate()
  startDate: Date;

  @Field(() => Date)
  @IsDate()
  endDate: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  comparisonStartDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  comparisonEndDate?: Date;

  // @Field(() => String)
  // group: GroupByPeriod.DAY;
}

// const enum GroupByPeriod {
//   DAY = 'day',
//   WEEK = 'week',
//   MONTH = 'month',
//   YEAR = 'year',
// }
