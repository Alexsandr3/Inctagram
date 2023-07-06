import { Module } from '@nestjs/common';
import { ApiJwtService } from './api-jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory: (apiConfigService: ApiConfigService) => {
        return {
          secret: apiConfigService.ACCESS_TOKEN_SECRET,
          signOptions: { expiresIn: apiConfigService.EXPIRED_ACCESS },
        };
      },
    }),
    ApiConfigModule,
  ],
  providers: [ApiJwtService],
  exports: [ApiJwtService],
})
export class ApiJwtModule {}
