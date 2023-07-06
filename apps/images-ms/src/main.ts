import { NestFactory } from '@nestjs/core';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import { swaggerConfig } from '@common/configuration/swagger/swagger.config';
import getLogLevels from '@common/modules/logger/getLogLevels';
import { appConfig } from '@common/configuration/app.config';
import { AppModule } from '@images-ms/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: getLogLevels(false), // true - for production
  });
  //configuration app
  const createdApp = appConfig(app);

  const PORT = app.get(ApiConfigService).PORT_IMAGES;
  //configuration swagger
  swaggerConfig(createdApp);
  await createdApp.listen(PORT).then(async () => {
    Logger.log(`Server running on http://localhost:${PORT} --- IMAGES microservice`, 'Bootstrap');
    console.log(`Server is listening on ${await app.getUrl()}`);
  });
}
bootstrap();
