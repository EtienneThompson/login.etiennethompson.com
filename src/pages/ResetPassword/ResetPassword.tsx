import React from "react";
import { Button } from "../../components/common/Button";
import { Row, Col, Container } from "../../components/common/Grid";
import "./ResetPassword.scss";

export const ResetPassword = () => {
  document.title = "Etienne Thompson - OAuth Login - Login";
  document.documentElement.className = "theme-light";

  return (
    <Container className="reset-password-container">
      <div className="card">
        <Col>
          <Row className="reset-notice-message">
            You've requested to reset your password. Enter the email associated
            with your account.
          </Row>
          <Row>
            <Col align="start">
              <div className="input-label">Enter your email:</div>
              <input className="input-text" type="text" />
            </Col>
          </Row>
          <Row>
            <Button>Submit</Button>
          </Row>
        </Col>
      </div>
    </Container>
  );
};
