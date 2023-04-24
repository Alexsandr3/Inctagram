export type GithubProfileType = {
  id: string;
  nodeId: string; //'U_kgDOBsG87w';
  displayName: string; //'Alex Bee';
  username: string; //'Alexsandr3';
  profileUrl: string; //'https://github.com/Alexsandr3';
  photos: [
    {
      value: string; //'https://avatars.githubusercontent.com/u/113360111?v=4'
    },
  ];
  provider: string; //'github';
};

export type GithubUserType = {
  userId: number;
  email: string;
  provider: string;
  userName: string;
  picture: string;
  accessToken: string;
};
