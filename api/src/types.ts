export type RequestWithAuth = Express.Request & {
  oidc: {
    user: {
      sub: string;
      picture: string;
      nickname: string;
    };
  };
};

export type ResponseWithJSON = Express.Response & {
  json: (result: any) => void;
};
