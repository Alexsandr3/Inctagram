export enum OAuthFlowType {
  Authorization = 'Authorization',
  Registration = 'Registration',
}
export class OAuthException extends Error {
  constructor(public message: string, public key: OAuthFlowType, public httpCode: number) {
    super(message);
  }
}
