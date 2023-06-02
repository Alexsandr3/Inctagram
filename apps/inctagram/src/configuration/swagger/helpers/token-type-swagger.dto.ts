import { PickType } from '@nestjs/swagger';

class TokensType {
  public accessToken: string;
  public refreshToken: string;
  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class TokenTypeSwaggerDto extends PickType(TokensType, ['accessToken'] as const) {}
