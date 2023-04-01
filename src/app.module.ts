import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiConfigModule } from './modules/api-config/api.config.module';

@Module({
  imports: [ApiConfigModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
