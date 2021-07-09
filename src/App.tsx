import React from "react";
import queryString from "query-string";
import { Toolbar } from "./components/common/Toolbar";
import { Row, Col } from "./components/common/Grid";
import { Button } from "./components/common/Button";
import { loginUser } from "./api";
import "./App.scss";

const App = () => {
  document.title = "Login - Etienne Thompson";
  document.documentElement.className = "theme-light";

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [appid, setAppid] = React.useState("");

  const onUsernameChange = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    setUsername(event.currentTarget.value);
  };

  const onPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
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
            <Row>
              <h1>Login</h1>
            </Row>
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
              <Button onClick={() => loginUser(username, password, appid)}>
                Submit
              </Button>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default App;
