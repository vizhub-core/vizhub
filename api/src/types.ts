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

export type Endpoint = (args: {
  app: any;
  gateways: any;
  shareDBConnection: any;
}) => void;
