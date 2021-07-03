import React, { useState } from "react";
import { Toolbar } from "./components/common/Toolbar";
import { Row, Col } from "./components/common/Grid";
import { Button } from "./components/common/Button";
import { loginUser } from "./api";
import "./App.scss";

function App() {
  document.title = "Login - Etienne Thompson";
  document.documentElement.className = "theme-light";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onUsernameChange = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    setUsername(event.currentTarget.value);
  };

  const onPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

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
              <Button onClick={() => loginUser(username, password)}>
                Submit
              </Button>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
