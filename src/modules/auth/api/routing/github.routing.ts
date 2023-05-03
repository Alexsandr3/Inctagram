export const baseUrlGitHub = '/auth/github';

export const githubEndpoints = {
  githubAuthorization: () => `${baseUrlGitHub}/authorization`,
  githubAuthorizationHandler: (code: string) => `${baseUrlGitHub}/authorization/redirect?code=${code}`,
  githubRegistration: () => `${baseUrlGitHub}/registration`,
  githubRegistrationHandler: (code: string) => `${baseUrlGitHub}/registration/redirect?code=${code}`,
};
