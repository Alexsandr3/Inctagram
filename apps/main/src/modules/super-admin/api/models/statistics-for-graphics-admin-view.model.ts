import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { StatisticsUsersInputArgs } from '../input-dto/statistics-users.input.args';
import { UserForSuperAdminViewModel } from './user-for-super-admin-view.model';

@ObjectType()
class StatisticsMetrics {
  @Field(() => [Number], { nullable: true })
  countUsers: number[];
  @Field(() => Number)
  total_rows: number;
  @Field(() => [GraphQLISODateTime])
  time_intervals: Date[];
  @Field(() => Number)
  maxCountUsers: number;
  @Field(() => Number)
  maxRoundUsers: number;
  @Field(() => Number)
  sumUsers: number;

  static create(users: UserForSuperAdminViewModel[], startDate: Date, endDate: Date): StatisticsMetrics {
    const instance = new StatisticsMetrics();
    const dates = instance.filterDates(users);
    instance.total_rows = instance.getNumberOfDays(startDate, endDate);
    instance.countUsers = instance.countInDates(dates, instance.total_rows, startDate);
    instance.time_intervals = instance.getIntervalsDateByIndex(instance.total_rows, startDate);
    instance.maxCountUsers = Math.max(...instance.countUsers);
    instance.maxRoundUsers = Math.ceil(instance.maxCountUsers / 10) * 10;
    instance.sumUsers = instance.countUsers.reduce((a, b) => a + b, 0);
    return instance;
  }

  private filterDates(users: UserForSuperAdminViewModel[]): Date[] {
    return users.map(user => user.createdAt).sort((a, b) => a.getTime() - b.getTime());
  }

  private getNumberOfDays(startDate: Date, endDate: Date): number {
    return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  private countInDates(dates: Date[], total_rows: number, startDate: Date): number[] {
    const metrics = new Array(total_rows).fill(0);
    dates.forEach(date => {
      const index = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      metrics[index]++;
    }, 0);
    return metrics;
  }

  private getIntervalsDateByIndex(index: number, startDate: Date): Date[] {
    let date = new Date(startDate);
    const dates = [];
    for (let i = 0; i < index; i++) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }
}

@ObjectType()
class StatisticsQuery {
  @Field(() => GraphQLISODateTime)
  dateStart: Date;
  @Field(() => GraphQLISODateTime)
  dateEnd: Date;
  @Field(() => GraphQLISODateTime, { nullable: true })
  comparisonStartDate: Date;
  @Field(() => GraphQLISODateTime, { nullable: true })
  comparisonEndDate: Date;

  static create(args: StatisticsUsersInputArgs): StatisticsQuery {
    const query = new StatisticsQuery();
    query.dateStart = args.startDate;
    query.dateEnd = args.endDate;
    query.comparisonStartDate = args.comparisonStartDate ? args.comparisonStartDate : null;
    query.comparisonEndDate = args.comparisonEndDate ? args.comparisonEndDate : null;
    return query;
  }
}

@ObjectType()
class StatisticsData {
  @Field(() => StatisticsMetrics)
  metrics: StatisticsMetrics;
  @Field(() => StatisticsMetrics, { nullable: true })
  metricsComparison: StatisticsMetrics;

  static create(data: {
    users: UserForSuperAdminViewModel[];
    args: StatisticsUsersInputArgs;
    comparisonUsers?: UserForSuperAdminViewModel[];
  }): StatisticsData {
    const instanceStatisticsData = new StatisticsData();
    instanceStatisticsData.metrics = StatisticsMetrics.create(data.users, data.args.startDate, data.args.endDate);
    instanceStatisticsData.metricsComparison =
      data.args.comparisonStartDate && data.args.comparisonEndDate
        ? StatisticsMetrics.create(data.comparisonUsers, data.args.comparisonStartDate, data.args.comparisonEndDate)
        : null;
    return instanceStatisticsData;
  }
}

/**
 * @description Statistics for graphics admin view model
 */
@ObjectType()
export class StatisticsForGraphicsAdminViewModel {
  @Field(() => StatisticsQuery)
  query: StatisticsQuery;
  @Field(() => StatisticsData)
  data: StatisticsData;

  static create(data: {
    users: UserForSuperAdminViewModel[];
    args: StatisticsUsersInputArgs;
    comparisonUsers?: UserForSuperAdminViewModel[];
  }): StatisticsForGraphicsAdminViewModel {
    const statistics = new StatisticsForGraphicsAdminViewModel();
    statistics.query = StatisticsQuery.create(data.args);
    statistics.data = StatisticsData.create({
      users: data.users,
      args: data.args,
      comparisonUsers: data.comparisonUsers,
    });
    return statistics;
  }
}
