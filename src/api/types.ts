export type LoginRequest = {
  username: string;
  hashedPassword: string;
  appid: string;
  redirectBase: string;
};

export type LoginResponse = {
  clientId: string;
  redirectUrl: string;
  isUser: boolean;
  isAdmin: boolean;
};

export type BaseResponse = {
  code: number;
  message: string;
};
