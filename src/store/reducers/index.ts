import { LoginStore } from "../types";
import { initialState } from "../store";
import { AnyAction } from "redux";

const isLoggingIn = (state: LoginStore, action: AnyAction) => {
  if (action.type === "LoggingIn/login") {
    return action.payload;
  }

  return state.isLoggingIn;
};

const setLoginStatus = (state: LoginStore, action: AnyAction) => {
  switch (action.type) {
    case "LoginStatus/update":
      return action.payload;
  }

  return state.loginStatus;
};

export default function rootReducer(
  state: LoginStore = initialState,
  action: any
) {
  return {
    isLoggingIn: isLoggingIn(state, action),
    loginStatus: setLoginStatus(state, action),
  };
}
