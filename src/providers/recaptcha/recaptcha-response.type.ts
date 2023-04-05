export type RecaptchaResponse = {
  success: true | false;
  challenge_ts: string; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  hostname: string; // the hostname of the site where the reCAPTCHA was solved
  'error-codes': string[]; // optional
  score: number; // the score for this request (0.0 - 1.0)
};
