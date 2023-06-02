import { NestFactory } from '@nestjs/core';
import { BusinessModule } from './business.module';

async function bootstrap() {
  const app = await NestFactory.create(BusinessModule);
  await app.listen(3000);
}
bootstrap();
