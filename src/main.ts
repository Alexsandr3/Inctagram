import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './configuration/app.config';
import { ApiConfigService } from './modules/api-config/api.config.service';
import { swaggerConfig } from './configuration/swagger/swagger.config';
import getLogLevels from './providers/logger/getLogLevels';
import { connectToNgrok } from './configuration/connectToNgrok';

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
  swaggerConfig(createdApp);
  await createdApp.listen(PORT).then(async () => {
    console.log(`Server is listening on ${await app.getUrl()}`);
  });
  //connect to ngrok for development
  await connectToNgrok(createdApp);
}
bootstrap();
