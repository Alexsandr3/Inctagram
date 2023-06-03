import { NestFactory } from '@nestjs/core';
import { BusinessModule } from './business.module';
import getLogLevels from '@common/modules/logger/getLogLevels';
import { appConfig } from '@common/configuration/app.config';
import { swaggerConfig } from '@common/configuration/swagger/swagger.config';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

async function bootstrap() {
  const app = await NestFactory.create(BusinessModule, {
    rawBody: true,
    logger: getLogLevels(false), // true - for production
  });
  //configuration app
  const createdApp = appConfig(app);
  //configuration app
  const PORT = app.get(ApiConfigService).PORT;
  //configuration swagger
  swaggerConfig(createdApp);
  await createdApp.listen(PORT).then(async () => {
    console.log(`Server is listening on ${await app.getUrl()}`);
  });
}
bootstrap();
