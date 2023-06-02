import { NestFactory } from '@nestjs/core';
import { ImagesModule } from './images.module';

async function bootstrap() {
  const app = await NestFactory.create(ImagesModule);
  await app.listen(3002);
}
bootstrap();
