export const baseUrlGoogle = '/auth/google';

export const googleEndpoints = {
  googleOAuth: () => `${baseUrlGoogle}`,
  handleGoogleOAuthRedirect: (code: string) => `${baseUrlGoogle}/redirect?code=${code}`,
};
