export type RecaptchaResponse = {
  success: true | false;
  challenge_ts: string; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  hostname: string; // the hostname of the site where the reCAPTCHA was solved
  'error-codes': string[]; // optional ErrorCode
  score: number; // the score for this request (0.0 - 1.0) v3 only generates one of the 4 scores : 0.1, 0.4, 0.7 and 0.9 which is not ideal.
  action: string; // the action name for this request (important to verify)
};
