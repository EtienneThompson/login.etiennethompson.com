import React from "react";
import queryString from "query-string";
import { Toolbar } from "./components/common/Toolbar";
import { Row, Col } from "./components/common/Grid";
import { Button } from "./components/common/Button";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { loginUser } from "./api";
import "./App.scss";
import { useSelector } from "react-redux";
import { LoginStatus, LoginStore } from "./store/types";
import { LoginResponse } from "./api/types";

const App = () => {
  // Set title and theme.
  document.title = "Login - Etienne Thompson";
  document.documentElement.className = "theme-light";

  // User input state.
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [appid, setAppid] = React.useState("");

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
    appid: string
  ): Promise<void> => {
    const loginResponse: LoginResponse = await loginUser(
      username,
      password,
      appid
    );

    if (
      !loginResponse ||
      !loginResponse.clientId ||
      !loginResponse.redirectUrl
    ) {
      return;
    }
    const queryChar = loginResponse.redirectUrl.indexOf("?") > -1 ? "&" : "?";
    const redirectTo =
      loginResponse.redirectUrl +
      queryChar +
      "clientId=" +
      loginResponse.clientId;
    window.open(redirectTo, "_self");
  };

  // Parse the query on login to get the application id.
  React.useEffect(() => {
    let params = queryString.parse(window.location.search.substring(1));
    let appid = params.appid
      ? Array.isArray(params.appid)
        ? params.appid[0]
        : params.appid
      : "";
    setAppid(appid);
  }, []);

  return (
    <div className="App">
      <Toolbar />
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
                  <input
                    type="text"
                    value={username}
                    placeholder="username"
                    onChange={onUsernameChange}
                  ></input>
                </Row>
                <Row>
                  <input
                    type="password"
                    value={password}
                    placeholder="password"
                    onChange={onPasswordChange}
                  ></input>
                </Row>
                <Row>
                  <Button
                    onClick={async () =>
                      await handleLogin(username, password, appid)
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

export default App;
