export type GoogleInputProfileType = {
  id: string; //'108167060127849664323',
  displayName: string; //'bee brick',
  name: {
    familyName: string; //'brick';
    givenName: string; //'bee'
  };
  emails: [
    {
      value: string; //'forexperienceinincubatore@gmail.com';
      verified: boolean; //true;
    },
  ];
  photos: [
    {
      value: string; //'https://lh3.googleusercontent.com/a/AGNmyxal_Y9v86Rps6z9h4TyKGxQI3l9LXZcOl_WL0IJ=s96-c';
    },
  ];
  provider: string; //'google';
};

export type GoogleUserType = {
  userId: number;
  email: string;
  provider: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
};
