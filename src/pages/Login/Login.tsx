import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "../../components/common/Button";
import { Row, Col } from "../../components/common/Grid";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { loginUser } from "../../api";
import { LoginResponse } from "../../api/types";
import { LoginStore } from "../../store/types";
import { LoginStatus } from "../../store/types";
import queryString from "query-string";
import "./Login.scss";
import {
  deleteFromLocalStorage,
  writeToLocalStorage,
} from "../../utils/localStorage";
import { LocalStorageKey } from "../../types";

export const Login = () => {
  // Set title and theme.
  document.title = "Etienne Thompson - OAuth Login - Login";
  document.documentElement.className = "theme-light";

  const navigate = useNavigate();

  // User input state.
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [appid, setAppid] = React.useState("");
  const [redirectBase, setRedirectBase] = React.useState("");

  const btnRef = React.useRef<any>();

  // Login system state.
  const isLoggingIn = useSelector((state: LoginStore) => state.isLoggingIn);
  const loginStatus = useSelector((state: LoginStore) => state.loginStatus);

  // Update the username state.
  const onUsernameChange = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    setUsername(event.currentTarget.value);
  };

  // Update the password state.
  const onPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  // Login a user and redirect them back to their application.
  const handleLogin = async (
    username: string,
    password: string,
    appid: string,
    redirectBase: string
  ): Promise<void> => {
    const loginResponse: LoginResponse = await loginUser(
      username,
      password,
      appid,
      redirectBase
    );

    if (
      !loginResponse ||
      !loginResponse.clientId ||
      !loginResponse.redirectUrl
    ) {
      return;
    }
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
  }, []);

  React.useEffect(() => {
    if (btnRef && btnRef.current) {
      btnRef.current.focus();
    }
  }, [btnRef]);

  return (
    <div className="App">
      <Row>
        <Col>
          <div className="card">
            {!isLoggingIn ? (
              /* Login form if the system is not logging in.*/
              <div>
                <Row>
                  <h1>Login</h1>
                </Row>
                {loginStatus === LoginStatus.Failed && (
                  /* Error component if login was unsucessful. */
                  <div className="error">Could not login.</div>
                )}
                <Row>
                  <Col align="start">
                    <div className="input-label">Username</div>
                    <input
                      className="input-text"
                      type="text"
                      value={username}
                      onChange={onUsernameChange}
                    ></input>
                  </Col>
                </Row>
                <Row>
                  <Col align="start">
                    <div className="input-label">Password</div>
                    <input
                      className="input-text"
                      type="password"
                      value={password}
                      onChange={onPasswordChange}
                    ></input>
                  </Col>
                </Row>
                <Row justify="end">
                  <div
                    onClick={onResetPasswordLinkClicked}
                    className="forgot-password-link"
                  >
                    Forgot your password?
                  </div>
                </Row>
                <Row>
                  <Button
                    className="large-button"
                    ref={btnRef}
                    onClick={async () =>
                      await handleLogin(
                        username,
                        password,
                        appid,
                        redirectBase
                      )
                    }
                  >
                    Submit
                  </Button>
                </Row>
              </div>
            ) : (
              /* Spinner if the system is logging in. */
              <div>
                <LoadingSpinner />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};
