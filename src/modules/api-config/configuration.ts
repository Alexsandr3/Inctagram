import * as process from 'process';

export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,

  PORT: process.env.PORT,

  CURRENT_APP_BASE_URL: process.env.CURRENT_APP_BASE_URL,

  PGSQL_URL: process.env.PGSQL_URL,

  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM: process.env.MAIL_FROM,

  CLIENT_URL: process.env.CLIENT_URL,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  EXPIRED_ACCESS: process.env.EXPIRED_ACCESS,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  EXPIRED_REFRESH: process.env.EXPIRED_REFRESH,

  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  BUCKET: process.env.BUCKET,
  ENDPOINT: process.env.ENDPOINT,

  TOKEN_NGROK: process.env.TOKEN_NGROK,

  TOKEN_TELEGRAM: process.env.TOKEN_TELEGRAM,

  API_KEY_STRIPE: process.env.API_KEY_STRIPE,
  SECRET_HOOK_STRIPE: process.env.SECRET_HOOK_STRIPE,

  SA_LOGIN: process.env.SA_LOGIN,
  SA_PASSWORD: process.env.SA_PASSWORD,

  IP_RESTRICTION: process.env.IP_RESTRICTION,
});

export type EnvType = ReturnType<typeof configuration>;
