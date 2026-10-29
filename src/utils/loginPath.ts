import queryString from "query-string";
import { readFromLocalStorage } from "./localStorage";
import { LocalStorageKey } from "../types";

// The login page for the app the user came from before resetting their
// password, or null if it isn't known.
export const getStoredLoginPath = (): string | null => {
  const appid = readFromLocalStorage(LocalStorageKey.CurrentAppId);
  const redirectBase = readFromLocalStorage(
    LocalStorageKey.CurrentRedirectBase
  );
  if (!appid || !redirectBase) {
    return null;
  }
  return `/login?${queryString.stringify({ appid, redirectBase })}`;
};
