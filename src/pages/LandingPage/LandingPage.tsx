import React from "react";
import { Row, Col } from "../../components/common/Grid";
import "./LandingPage.scss";

export const LandingPage = () => {
  document.title = "Etienne Thompson - OAuth Login - Home";
  document.documentElement.className = "theme-light";

  return (
    <div className="landing-page-container">
      <Row>
        <Col>
          <h1>Welcome to login.etiennethompson.com</h1>
          <p className="landing-page-description">
            This site is the login center for the ecosystem of apps on the
            etiennethompson.com domain. Users can log in to all the registered
            applications in the ecosystem from this singular login system. They
            only need one account to get access to everything. Users must have
            an account as well as been given access to the application they are
            trying to log into.
          </p>
          <div className="horizontal-break" />
          <p className="landing-page-description">
            You can check out more about me here:{" "}
            <a href="http://etiennethompson.com">etiennethompson.com</a>
            <br />
            You can check out the code for this project here:{" "}
            <a href="https://github.com/EtienneThompson/login.etiennethompson.com">
              Github
            </a>
          </p>
        </Col>
      </Row>
    </div>
  );
};
