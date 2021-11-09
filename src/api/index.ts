import { hashString } from "../utils/hash";
import { scrapeSqlInjection } from "../utils/sql";
import { LoginRequest, LoginResponse } from "./types";
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
