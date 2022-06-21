import React from "react";
import { Button } from "../../components/common/Button";
import { Row, Col, Container } from "../../components/common/Grid";
import "./ResetPassword.scss";

export const ResetPassword = () => {
  document.title = "Etienne Thompson - OAuth Login - Reset Password";
  document.documentElement.className = "theme-light";

  return (
    <Container className="reset-password-container">
      <div className="card">
        <Col>
          <Row className="reset-notice-message">
            Enter a new password for your account.
          </Row>
          <Row>
            <Col align="start">
              <div className="input-label">New Password:</div>
              <input className="input-text" type="text" />
            </Col>
          </Row>
          <Row>
            <Col align="start">
              <div className="input-label">Confirm New Password:</div>
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