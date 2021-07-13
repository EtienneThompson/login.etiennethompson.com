import { createStore, compose } from "redux";
import { LoginStatus, LoginStore } from "./types";
import rootReducer from "./reducers";

export const initialState: LoginStore = {
  isLoggingIn: false,
  loginStatus: LoginStatus.Unknown,
};

const composedEnhancers = compose();

export const store = createStore(rootReducer, initialState, composedEnhancers);
