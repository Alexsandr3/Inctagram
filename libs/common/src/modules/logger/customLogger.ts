import { ConsoleLogger, ConsoleLoggerOptions } from '@nestjs/common/services/console-logger.service';
import { ConfigService } from '@nestjs/config';
import LogsService from './application/logs.service';
import { Injectable } from '@nestjs/common';
import getLogLevels from './getLogLevels';

@Injectable()
class CustomLogger extends ConsoleLogger {
  private readonly logsService: LogsService;
  // traceId: string;

  constructor(
    // @Inject(ASYNC_STORAGE) private readonly asyncLocalStorage: AsyncLocalStorage<Map<string, string>>,
    context: string,
    options: ConsoleLoggerOptions,
    configService: ConfigService,
    logsService: LogsService,
  ) {
    const environment = configService.get('NODE_ENV');

    super(context, {
      ...options,
      logLevels: getLogLevels(environment === 'development'),
    });
    // this.traceId = this.asyncLocalStorage.getStore()?.get('ASYNC_STORAGE') || randomUUID();
    // console.log(this.traceId);

    this.logsService = logsService;
  }

  log(message: string, context?: string) {
    super.log.apply(this, [message, context]);

    this.logsService.createLog({
      message,
      context,
      level: 'log',
    });
  }
  error(message: string, stack?: string, context?: string) {
    super.error.apply(this, [message, stack, context]);

    this.logsService.createLog({
      message,
      context,
      level: 'error',
    });
  }
  warn(message: string, context?: string) {
    super.warn.apply(this, [message, context]);

    this.logsService.createLog({
      message,
      context,
      level: 'error',
    });
  }
  debug(message: string, context?: string) {
    super.debug.apply(this, [message, context]);

    this.logsService.createLog({
      message,
      context,
      level: 'error',
    });
  }
  verbose(message: string, context?: string) {
    super.debug.apply(this, [message, context]);

    this.logsService.createLog({
      message,
      context,
      level: 'error',
    });
  }
}

export default CustomLogger;
