export abstract class StatisticsForGraphics<Q, D> {
  abstract query: Q;
  abstract data: D;

  public static create<Q, D>(data: { query: Q; data: D }): StatisticsForGraphics<Q, D> {
    return {
      query: data.query,
      data: data.data,
    };
  }
}
