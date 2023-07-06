export type RecaptchaEnterpriseResponse = {
  tokenProperties: {
    valid: boolean;
    hostname: string; //'www.google.com';
    action: string; //'homepage';
    createTime: string; //'2021-08-31T14:00:00.000Z';
  };
  riskAnalysis: {
    score: number; //0.9;
    reasons: string[]; //['AUTOMATION'];
    extendedVerdictReasons: [];
  };
  event: {
    token: string; //'TOKEN';
    siteKey: string; //'KEY';
    expectedAction: string; //'USER_ACTION';
  };
  name: string; //'projects/PROJECT_NUMBER/assessments/b6ac310000000000';
};
