import { INestApplication } from '@nestjs/common';
import { pipeSetup } from './pipe.setup';
import { exceptionFilterSetup } from './exception-filter.setup';

export const appConfig = (app: INestApplication) => {
  //pipe validation
  pipeSetup(app);
  //exception filter
  exceptionFilterSetup(app);
  return app;
};
