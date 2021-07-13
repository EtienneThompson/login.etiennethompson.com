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
  document.title = "Login - Etienne Thompson";
  document.documentElement.className = "theme-light";

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [appid, setAppid] = React.useState("");

  const isLoggingIn = useSelector((state: LoginStore) => state.isLoggingIn);
  const loginStatus = useSelector((state: LoginStore) => state.loginStatus);

  const onUsernameChange = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    setUsername(event.currentTarget.value);
  };

  const onPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

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
              <div>
                <Row>
                  <h1>Login</h1>
                </Row>
                {loginStatus === LoginStatus.Failed && (
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
                    type="text"
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
