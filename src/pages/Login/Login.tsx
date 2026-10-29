import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
  WebAuthnAbortService,
} from "@simplewebauthn/browser";
import { Alert } from "../../components/common/Alert";
import { AuthCard } from "../../components/common/AuthCard";
import { Button } from "../../components/common/Button";
import { KeyIcon } from "../../components/common/Icons";
import { TextField } from "../../components/common/TextField";
import { loginUser, loginWithPasskey } from "../../api";
import { LoginResponse } from "../../api/types";
import { finishedLogin, updateLoginStatus } from "../../store/actions";
import { LoginStore } from "../../store/types";
import { LoginStatus } from "../../store/types";
import queryString from "query-string";
import {
  deleteFromLocalStorage,
  readFromLocalStorage,
  writeToLocalStorage,
} from "../../utils/localStorage";
import { redirectToApplication } from "../../utils/redirect";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { LocalStorageKey } from "../../types";

type LoginMethod = "password" | "passkey";

export const Login = () => {
  useDocumentTitle("Sign in");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // User input state.
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [appid, setAppid] = React.useState("");
  const [redirectBase, setRedirectBase] = React.useState("");
  // Which button shows the spinner. Passkey autofill counts as a passkey.
  const [loginMethod, setLoginMethod] = React.useState<LoginMethod>("passkey");

  const supportsPasskeys = browserSupportsWebAuthn();

  // Login system state.
  const isLoggingIn = useSelector((state: LoginStore) => state.isLoggingIn);
  const loginStatus = useSelector((state: LoginStore) => state.loginStatus);

  // Stop showing the spinner if the request itself failed.
  const onLoginError = (error: unknown) => {
    console.error("Could not login:", error);
    dispatch(updateLoginStatus(LoginStatus.Failed));
    dispatch(finishedLogin());
  };

  // Login a user and redirect them back to their application.
  const handleLogin = async (
    username: string,
    password: string,
    appid: string,
    redirectBase: string
  ): Promise<void> => {
    // Offer to add a passkey after logging in, unless the user opted out on
    // this device.
    const offerPasskey =
      supportsPasskeys &&
      !readFromLocalStorage(LocalStorageKey.PasskeyPromptDismissed);
    let loginResponse: LoginResponse;
    try {
      loginResponse = await loginUser(
        username,
        password,
        appid,
        redirectBase,
        offerPasskey
      );
    } catch (error) {
      onLoginError(error);
      return;
    }

    if (
      !loginResponse ||
      !loginResponse.clientId ||
      !loginResponse.redirectUrl
    ) {
      return;
    }

    if (loginResponse.passkeyRegistration) {
      navigate("/add_passkey", { state: loginResponse });
      return;
    }

    redirectToApplication(loginResponse);
  };

  // Login a user with a passkey and redirect them back to their application.
  const handlePasskeyLogin = async (
    appid: string,
    redirectBase: string,
    useBrowserAutofill: boolean
  ): Promise<void> => {
    let loginResponse: LoginResponse | null;
    try {
      loginResponse = await loginWithPasskey(
        appid,
        redirectBase,
        useBrowserAutofill
      );
    } catch (error) {
      onLoginError(error);
      return;
    }

    if (
      !loginResponse ||
      !loginResponse.clientId ||
      !loginResponse.redirectUrl
    ) {
      return;
    }

    redirectToApplication(loginResponse);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginMethod("password");
    await handleLogin(username, password, appid, redirectBase);
  };

  const onPasskeyButtonClicked = async () => {
    setLoginMethod("passkey");
    await handlePasskeyLogin(appid, redirectBase, false);
  };

  const onResetPasswordLinkClicked = () => {
    writeToLocalStorage(LocalStorageKey.CurrentAppId, appid);
    writeToLocalStorage(LocalStorageKey.CurrentRedirectBase, redirectBase);
    navigate("/enter_email");
  };

  // Parse the query on login to get the application id.
  React.useEffect(() => {
    let params = queryString.parse(window.location.search.substring(1));
    let appid = params.appid
      ? Array.isArray(params.appid)
        ? params.appid[0]
          ? params.appid[0]
          : ""
        : params.appid
      : "";
    let redirectBase = params.redirectBase
      ? Array.isArray(params.redirectBase)
        ? params.redirectBase[0]
          ? params.redirectBase[0]
          : ""
        : params.redirectBase
      : "";
    setAppid(appid);
    setRedirectBase(redirectBase);

    // Remove any stored app id for resetting a password.
    deleteFromLocalStorage(LocalStorageKey.CurrentAppId);
    deleteFromLocalStorage(LocalStorageKey.CurrentRedirectBase);

    // Offer saved passkeys when the user focuses the username field.
    browserSupportsWebAuthnAutofill().then((supportsAutofill) => {
      if (supportsAutofill) {
        handlePasskeyLogin(appid, redirectBase, true);
      }
    });

    // Stop waiting for a passkey when leaving the page.
    return () => WebAuthnAbortService.cancelCeremony();
  }, []);

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in with your Etienne Thompson account."
    >
      {loginStatus === LoginStatus.Failed && !isLoggingIn && (
        <Alert>
          We couldn't sign you in. Check your username and password, and make
          sure you have access to this app.
        </Alert>
      )}
      <form className="auth-form" onSubmit={onSubmit}>
        <TextField
          id="username"
          label="Username"
          autoComplete="username webauthn"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoggingIn}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoggingIn}
          labelAction={
            <Button
              variant="link"
              onClick={onResetPasswordLinkClicked}
              disabled={isLoggingIn}
            >
              Forgot password?
            </Button>
          }
        />
        <div className="auth-form-actions">
          <Button
            type="submit"
            fullWidth
            isLoading={isLoggingIn && loginMethod === "password"}
            disabled={isLoggingIn}
          >
            {isLoggingIn && loginMethod === "password"
              ? "Signing in…"
              : "Sign in"}
          </Button>
        </div>
      </form>
      {supportsPasskeys && (
        <>
          <div className="auth-divider">or</div>
          <Button
            variant="secondary"
            fullWidth
            icon={<KeyIcon />}
            isLoading={isLoggingIn && loginMethod === "passkey"}
            disabled={isLoggingIn}
            onClick={onPasskeyButtonClicked}
          >
            {isLoggingIn && loginMethod === "passkey"
              ? "Signing in…"
              : "Sign in with a passkey"}
          </Button>
        </>
      )}
    </AuthCard>
  );
};
