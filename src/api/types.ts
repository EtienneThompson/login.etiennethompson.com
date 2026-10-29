import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";

export type LoginRequest = {
  username: string;
  hashedPassword: string;
  appid: string;
  redirectBase: string;
  includePasskeyRegistration: boolean;
};

export type LoginResponse = {
  clientId: string;
  redirectUrl: string;
  isUser: boolean;
  isAdmin: boolean;
  // Only included when the login request asks for it.
  passkeyRegistration?: PasskeyRegistrationOptions;
};

export type PasskeyRegistrationOptions = {
  challengeId: string;
  options: PublicKeyCredentialCreationOptionsJSON;
};

export type PasskeyLoginOptions = {
  challengeId: string;
  options: PublicKeyCredentialRequestOptionsJSON;
};

export type BaseResponse = {
  code: number;
  message: string;
};
