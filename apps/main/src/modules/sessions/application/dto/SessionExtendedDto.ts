/**
 * SessionExtendedDto is the DTO used to return the session data
 * ['deviceId', 'userId', 'iat', 'exp', 'ip', 'deviceName']
 */
export type SessionExtendedDto = {
  deviceId: number;
  userId: number;
  exp: number;
  ip: string;
  deviceName: string;
  iat: number;
};
