import { INestApplication, Logger } from '@nestjs/common';
import { ApiConfigService } from '../modules/api-config/api.config.service';
import * as ngrok from 'ngrok';

export const connectToNgrok = async (app: INestApplication) => {
  const logger = new Logger(connectToNgrok.name);
  const port = app.get(ApiConfigService).PORT;
  const token = app.get(ApiConfigService).TOKEN_NGROK;
  let baseUrl = app.get(ApiConfigService).CURRENT_APP_BASE_URL;
  const nodeEnv = app.get(ApiConfigService).NODE_ENV;
  //connect to ngrok for development
  if (nodeEnv === 'test') {
    baseUrl = await ngrok.connect({ authtoken: token, addr: port });
    logger.log(`Server is listening port NGROK on__ ${baseUrl}`);
  }
  return;
};
