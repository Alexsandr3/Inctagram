export const baseUrlGoogle = '/auth/google';

export const googleEndpoints = {
  googleAuthorization: () => `${baseUrlGoogle}/authorization`,
  googleAuthorizationHandler: (code: string) => `${baseUrlGoogle}/authorization/redirect?code=${code}`,
  googleRegistration: () => `${baseUrlGoogle}/registration`,
  googleRegistrationHandler: (code: string) => `${baseUrlGoogle}/registration/redirect?code=${code}`,
};
