import { hashString } from "../utils/hash";
import { scrapeSqlInjection } from "../utils/sql";
import { LoginRequest, LoginResponse, BaseResponse } from "./types";
import { store } from "../store/store";
import { finishedLogin, login, updateLoginStatus } from "../store/actions";
import { LoginStatus } from "../store/types";

export const loginUser = async (
  username: string,
  password: string,
  appid: string,
  redirectBase: string
): Promise<LoginResponse> => {
  store.dispatch(login());
  // Scrape input username and password for SQL Injection attacks.
  const [scrapedUsername, scrapedPassword, scrapedAppid, scrapedRedirectBase] =
    scrapeSqlInjection(username, password, appid, redirectBase);
  // Hash the password for protection.
  const hashedPassword = hashString(scrapedPassword);

  const loginRequest: LoginRequest = {
    username: scrapedUsername,
    hashedPassword: hashedPassword,
    appid: scrapedAppid,
    redirectBase: scrapedRedirectBase,
  };

  // Send the request to the api.
  const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/login`, {
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

export const sendResetPasswordEmail = async (
  email: string
): Promise<BaseResponse> => {
  const response = await fetch(
    `${process.env.REACT_APP_API_ENDPOINT}/login/reset/request`,
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
    `${process.env.REACT_APP_API_ENDPOINT}/login/reset`,
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
