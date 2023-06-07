export interface RabbitExchangeConfigInterface {
  name: string;
  type: 'direct' | 'topic' | 'fanout' | 'match' | 'headers-matched' | 'headers';
  options?: AssertExchangeOptions;
}

interface AssertExchangeOptions {
  durable?: boolean;
  internal?: boolean;
  autoDelete?: boolean;
  alternateExchange?: string;
  arguments?: unknown | unknown[];
}
