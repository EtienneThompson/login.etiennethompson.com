import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { hashString } from "../utils/hash";
import { scrapeSqlInjection } from "../utils/sql";
import {
  LoginRequest,
  LoginResponse,
  BaseResponse,
  PasskeyLoginOptions,
  PasskeyRegistrationOptions,
} from "./types";
import { store } from "../store/store";
import { finishedLogin, login, updateLoginStatus } from "../store/actions";
import { LoginStatus } from "../store/types";

export const loginUser = async (
  username: string,
  password: string,
  appid: string,
  redirectBase: string,
  includePasskeyRegistration: boolean
): Promise<LoginResponse> => {
  store.dispatch(login());
  // Scrape input username and password for SQL Injection attacks.
  const [scrapedUsername, scrapedPassword, scrapedAppid, scrapedRedirectBase] =
    scrapeSqlInjection(username, password, appid, redirectBase);
  // Hash the password for protection.
  const hashedPassword = await hashString(scrapedPassword);

  const loginRequest: LoginRequest = {
    username: scrapedUsername,
    hashedPassword: hashedPassword,
    appid: scrapedAppid,
    redirectBase: scrapedRedirectBase,
    includePasskeyRegistration: includePasskeyRegistration,
  };

  // Send the request to the api.
  const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/login`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify(loginRequest),
  });

  const loginResponse: LoginResponse = await response.json();

  // Validate response.
  if (
    !loginResponse ||
    !loginResponse.clientId ||
    !loginResponse.redirectUrl
  ) {
    store.dispatch(updateLoginStatus(LoginStatus.Failed));
  } else {
    store.dispatch(updateLoginStatus(LoginStatus.Success));
  }

  store.dispatch(finishedLogin());

  return loginResponse;
};

// Login a user with a passkey. Returns null if the user cancelled choosing a
// passkey.
export const loginWithPasskey = async (
  appid: string,
  redirectBase: string,
  useBrowserAutofill: boolean
): Promise<LoginResponse | null> => {
  // Wait for the user to pick a passkey before showing the spinner, since
  // autofill can wait indefinitely.
  let loginOptions: PasskeyLoginOptions;
  let credential;
  try {
    const optionsResponse = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/login/passkey/options`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
      }
    );
    loginOptions = await optionsResponse.json();
    credential = await startAuthentication({
      optionsJSON: loginOptions.options,
      useBrowserAutofill: useBrowserAutofill,
    });
  } catch (error) {
    return null;
  }

  store.dispatch(login());
  const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/login/passkey`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      challengeId: loginOptions.challengeId,
      credential: credential,
      appid: appid,
      redirectBase: redirectBase,
    }),
  });

  const loginResponse: LoginResponse = await response.json();

  // Validate response.
  if (
    !loginResponse ||
    !loginResponse.clientId ||
    !loginResponse.redirectUrl
  ) {
    store.dispatch(updateLoginStatus(LoginStatus.Failed));
  } else {
    store.dispatch(updateLoginStatus(LoginStatus.Success));
  }

  store.dispatch(finishedLogin());

  return loginResponse;
};

// Create a passkey on this device and save it to the user's account.
export const registerPasskey = async (
  registration: PasskeyRegistrationOptions
): Promise<BaseResponse> => {
  const credential = await startRegistration({
    optionsJSON: registration.options,
  });

  const response = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/login/passkey/register`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        challengeId: registration.challengeId,
        credential: credential,
      }),
    }
  );

  if (response.status >= 200 && response.status <= 299) {
    const data: BaseResponse = {
      code: response.status,
      message: "Passkey added successfully",
    };
    return Promise.resolve(data);
  } else {
    const message = await response.json();
    const data: BaseResponse = {
      code: response.status,
      message: message.message,
    };
    return Promise.reject(data);
  }
};

export const sendResetPasswordEmail = async (
  email: string
): Promise<BaseResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/login/reset/request`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ email: email }),
    }
  );

  if (response.status >= 200 && response.status <= 299) {
    const data: BaseResponse = {
      code: response.status,
      message: "Email sent successfully",
    };
    return Promise.resolve(data);
  } else {
    const message = await response.json();
    const data: BaseResponse = {
      code: response.status,
      message: message.message,
    };
    return Promise.reject(data);
  }
};

export const sendUpdatedPassword = async (
  code: string,
  newPassword: string
): Promise<BaseResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/login/reset`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        resetCode: code,
        newPassword: newPassword,
      }),
    }
  );

  if (response.status >= 200 && response.status <= 299) {
    const data: BaseResponse = {
      code: response.status,
      message: "Password reset successfully",
    };
    return Promise.resolve(data);
  } else {
    const message = await response.json();
    const data: BaseResponse = {
      code: response.status,
      message: message.message,
    };
    return Promise.reject(data);
  }
};
