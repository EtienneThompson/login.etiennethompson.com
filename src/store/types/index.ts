export enum LoginStatus {
  Unknown = "Unknown",
  Failed = "Failed",
  Success = "Success",
}

export type LoginStore = {
  isLoggingIn: boolean;
  loginStatus: LoginStatus;
};
