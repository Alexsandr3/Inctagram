import { SessionEntity } from '../domain/session.entity';

export class DeviceViewModel {
  ip: string;
  userAgent: string;
  lastVisit: string;
  deviceId: number;

  constructor(session: SessionEntity) {
    this.ip = session.ip;
    this.userAgent = session.deviceName;
    this.lastVisit = new Date(session.iat * 1000).toISOString();
    this.deviceId = session.deviceId;
  }
}

export class DevicesViewModel {
  devices: DeviceViewModel[];
  currentDeviceId: number;

  constructor(sessions: SessionEntity[], currentDeviceId: number) {
    this.devices = sessions.map(session => new DeviceViewModel(session));
    this.currentDeviceId = currentDeviceId;
  }
}
