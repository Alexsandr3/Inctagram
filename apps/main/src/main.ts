import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from '@common/configuration/swagger/swagger.config';
import { connectToNgrok } from '@common/configuration/connectToNgrok';
import { appConfig } from '@common/configuration/app.config';
import getLogLevels from '@common/modules/logger/getLogLevels';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: getLogLevels(false), // true - for production
  });
  //configuration app
  const createdApp = appConfig(app);
  //configuration app
  const PORT = app.get(ApiConfigService).PORT;
  //configuration swagger
  swaggerConfig(createdApp, 'swagger-main');
  await createdApp.listen(PORT).then(async () => {
    Logger.log(`Server running on http://localhost:${PORT} --- MAIN microservice`, 'Bootstrap');
    console.log(`Server is listening on ${await app.getUrl()}`);
  });
  //connect to ngrok for development if NODE_ENV === test
  await connectToNgrok(createdApp);
}
bootstrap();
