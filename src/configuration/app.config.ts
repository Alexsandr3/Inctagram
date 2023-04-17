import { INestApplication } from '@nestjs/common';
import { pipeSetup } from './pipe.setup';
import { exceptionFilterSetup } from './exception-filter.setup';
import cookieParser from 'cookie-parser';
import CustomLogger from '../providers/logger/customLogger';

export const appConfig = (app: INestApplication) => {
  baseAppConfig(app);
  //use custom logger
  app.useLogger(app.get(CustomLogger));
  //add cors
  // const url = app.get(ApiConfigService).FRONTEND_URL
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5003',
      'http://localhost:63342',
      'https://inctagram-vercel.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  return app;
};

export const baseAppConfig = (app: INestApplication) => {
  //pipe validation
  pipeSetup(app);
  //exception filter
  exceptionFilterSetup(app);
  //add work with cookies
  app.use(cookieParser());
};
