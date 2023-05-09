export class CostMonthlySubscriptionViewModel {
  month: number;
  semiAnnual: number;
  year: number;

  constructor(cost: number) {
    this.month = cost;
    this.semiAnnual = cost * 6;
    this.year = cost * 10;
  }
}
