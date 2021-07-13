import { hashString } from "../utils/hash";
import { LoginRequest, LoginResponse } from "./types";
import { store } from "../store/store";
import { finishedLogin, login, updateLoginStatus } from "../store/actions";
import { LoginStatus } from "../store/types";

export const loginUser = async (
  username: string,
  password: string,
  appid: string
): Promise<LoginResponse> => {
  console.log("loginUser");
  store.dispatch(login());
  const hashedPassword = hashString(password);
  console.log(hashedPassword);

  const loginRequest: LoginRequest = {
    username: username,
    hashedPassword: hashedPassword,
    appid: appid,
  };

  const response = await fetch("http://localhost:3600/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify(loginRequest),
  });

  const loginResponse: LoginResponse = await response.json();

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
