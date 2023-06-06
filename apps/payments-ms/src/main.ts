import { NestFactory } from '@nestjs/core';
import getLogLevels from '@common/modules/logger/getLogLevels';
import { appConfig } from '@common/configuration/app.config';
import { swaggerConfig } from '@common/configuration/swagger/swagger.config';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import { AppModule } from '@payments-ms/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: getLogLevels(false), // true - for production
  });
  //configuration app
  const createdApp = appConfig(app);
  //configuration app
  const PORT = app.get(ApiConfigService).PORT_BUSINESS;
  //configuration swagger
  swaggerConfig(createdApp);
  await createdApp.listen(PORT).then(async () => {
    console.log(`Server is listening on ${await app.getUrl()}`);
  });
}
bootstrap();
