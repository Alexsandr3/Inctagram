/**
 * SessionDto is the data transfer object for the session entity.
 * ['deviceId', 'userId', 'iat', 'exp']
 */
export type SessionDto = {
  deviceId: number;
  userId: number;
  iat: number;
  exp: number;
};
