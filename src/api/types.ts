export type LoginRequest = {
  username: string;
  hashedPassword: string;
  appid: string;
};

export type LoginResponse = {
  clientId: string;
  redirectUrl: string;
};
