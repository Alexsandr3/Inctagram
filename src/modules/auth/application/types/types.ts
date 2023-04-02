export type AccessTokenDataType = { userId: string };
export type TokensType = {
  accessToken: string;
  refreshToken: string;
};
export type SessionDto = {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
};
