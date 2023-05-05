export const baseUrlGitHub = '/auth/github';

export const githubEndpoints = {
  githubAuthorization: () => `${baseUrlGitHub}/authorization`,
  githubAuthorizationHandler: () => `${baseUrlGitHub}/authorization/redirect`,
  githubRegistration: () => `${baseUrlGitHub}/registration`,
  githubRegistrationHandler: () => `${baseUrlGitHub}/registration/redirect`,
};
