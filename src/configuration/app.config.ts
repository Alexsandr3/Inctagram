import { INestApplication } from '@nestjs/common';
import { pipeSetup } from './pipe.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import cookieParser from 'cookie-parser';

export const appConfig = (app: INestApplication) => {
  //pipe validation
  pipeSetup(app);
  //exception filter
  exceptionFilterSetup(app);
  //add work with cookies
  app.use(cookieParser());
  //add cors
  app.enableCors({});
  return app;
};
