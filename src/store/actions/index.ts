import { AnyAction } from "redux";
import { LoginStatus } from "../types";

export const login = (): AnyAction => {
  return {
    type: "LoggingIn/login",
    payload: true,
  };
};

export const finishedLogin = (): AnyAction => {
  return {
    type: "LoggingIn/login",
    payload: false,
  };
};

export const updateLoginStatus = (newStatus: LoginStatus) => {
  return {
    type: "LoginStatus/update",
    payload: newStatus,
  };
};
