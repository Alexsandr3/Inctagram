import { SessionExtendedDto } from '../application/dto/SessionExtendedDto';
import { UserEntity } from '../../users/domain/user.entity';

export class SessionEntity {
  deviceId: number;
  userId: number;
  exp: number;
  ip: string;
  deviceName: string;
  iat: number;
  user: UserEntity;

  constructor() {}

  updateSessionData(dto: SessionExtendedDto) {
    this.ip = dto.ip;
    this.deviceName = dto.deviceName;
    this.exp = dto.exp;
    this.iat = dto.iat;
  }

  static preparation(session: any): SessionEntity {
    const sessionEntity = new SessionEntity();
    sessionEntity.deviceId = session.deviceId;
    sessionEntity.userId = session.userId;
    sessionEntity.exp = session.exp;
    sessionEntity.ip = session.ip;
    sessionEntity.deviceName = session.deviceName;
    sessionEntity.iat = session.iat;
    return sessionEntity;
  }

  static initCreate(param: {
    ip: string;
    exp: number;
    deviceId: number;
    userId: number;
    iat: number;
    deviceName: string;
  }) {
    const session = new SessionEntity();
    session.ip = param.ip;
    session.exp = param.exp;
    session.deviceId = param.deviceId;
    session.userId = param.userId;
    session.iat = param.iat;
    session.deviceName = param.deviceName;
    return session;
  }
}
