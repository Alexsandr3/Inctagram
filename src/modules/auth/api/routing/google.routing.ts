export const baseUrlGoogle = '/auth/google';

export const googleEndpoints = {
  googleAuthorization: () => `${baseUrlGoogle}/login`,
  googleAuthorizationHandler: (code: string) => `${baseUrlGoogle}/login/redirect?code=${code}`,
  googleRegistration: () => `${baseUrlGoogle}/registration`,
  googleRegistrationHandler: (code: string) => `${baseUrlGoogle}/registration/redirect?code=${code}`,
};
