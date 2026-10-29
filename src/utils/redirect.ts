import { LoginResponse } from "../api/types";

// Send the user back to their application with their login details.
export const redirectToApplication = (loginResponse: LoginResponse): void => {
  const queryChar = loginResponse.redirectUrl.indexOf("?") > -1 ? "&" : "?";
  // Create the new redirect url.
  const redirectTo =
    loginResponse.redirectUrl +
    queryChar +
    "clientId=" +
    loginResponse.clientId +
    "&isUser=" +
    loginResponse.isUser +
    "&isAdmin=" +
    loginResponse.isAdmin;
  // Open the link and focus to it.
  const win = window.open(redirectTo, "_self");
  if (win) {
    win.focus();
  }
};
