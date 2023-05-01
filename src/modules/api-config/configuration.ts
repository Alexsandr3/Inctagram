import * as process from 'process';

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,

  PORT: process.env.PORT,
  CURRENT_APP_BASE_URL: process.env.CURRENT_APP_BASE_URL,
  CLIENT_URL: process.env.CLIENT_URL,

  database: {
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,

    DATABASE_URL: process.env.DATABASE_URL,
  },
  mail: {
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_FROM: process.env.MAIL_FROM,
  },
  awsStorage: {
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_BUCKET: process.env.AWS_BUCKET,
    AWS_ENDPOINT: process.env.AWS_ENDPOINT,
    AWS_REGION: process.env.AWS_REGION,
  },
  auth: {
    google: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_AUTHORIZATION_CALLBACK_URL: process.env.GOOGLE_AUTHORIZATION_CALLBACK_URL,
      GOOGLE_REGISTRATION_CALLBACK_URL: process.env.GOOGLE_REGISTRATION_CALLBACK_URL,
    },
    github: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
      GITHUB_AUTHORIZATION_CALLBACK_URL: process.env.GITHUB_AUTHORIZATION_CALLBACK_URL,
      GITHUB_REGISTRATION_CALLBACK_URL: process.env.GITHUB_REGISTRATION_CALLBACK_URL,
    },
    jwt: {
      ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
      EXPIRED_ACCESS: process.env.EXPIRED_ACCESS,
      REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
      EXPIRED_REFRESH: process.env.EXPIRED_REFRESH,
    },
    admin: {
      SA_LOGIN: process.env.SA_LOGIN,
      SA_PASSWORD: process.env.SA_PASSWORD,
    },
  },
  recaptcha: {
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    RECAPTCHA_ENTERPRISE_API_KEY: process.env.RECAPTCHA_ENTERPRISE_API_KEY,
    RECAPTCHA_ENTERPRISE_PUBLIC_SITE_KEY: process.env.RECAPTCHA_ENTERPRISE_PUBLIC_SITE_KEY,
    RECAPTCHA_ENTERPRISE_PROJECT_ID: process.env.RECAPTCHA_ENTERPRISE_PROJECT_ID,
  },

  dev: {
    TOKEN_NGROK: process.env.TOKEN_NGROK,
  },

  TOKEN_TELEGRAM: process.env.TOKEN_TELEGRAM,

  API_KEY_STRIPE: process.env.API_KEY_STRIPE,
  SECRET_HOOK_STRIPE: process.env.SECRET_HOOK_STRIPE,

  IP_RESTRICTION: process.env.IP_RESTRICTION,
});

export type EnvType = ReturnType<typeof configuration>;
