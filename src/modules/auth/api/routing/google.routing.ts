export const baseUrlGoogle = '/auth/google';

export const googleEndpoints = {
  googleAuthorization: () => `${baseUrlGoogle}/authorization`,
  googleAuthorizationHandler: () => `${baseUrlGoogle}/authorization/redirect`,
  googleRegistration: () => `${baseUrlGoogle}/registration`,
  googleRegistrationHandler: () => `${baseUrlGoogle}/registration/redirect`,
};
