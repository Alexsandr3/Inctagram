import { SessionDto } from '../../../sessions/application/dto/SessionDto';

export class GenerateNewTokensDto {
  oldSessionData: SessionDto;
  ip: string;
  deviceName: string;
}
