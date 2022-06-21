import React from "react";
import { Button } from "../../components/common/Button";
import { Row, Col, Container } from "../../components/common/Grid";
import "./ResetPassword.scss";

export const ResetPassword = () => {
  document.title = "Etienne Thompson - OAuth Login - Reset Password";
  document.documentElement.className = "theme-light";

  const [newPassword, setNewPassword] = React.useState("");
  const [newConfirm, setNewConfirm] = React.useState("");

  const onPasswordChange = (event: any) => {
    setNewPassword(event.target.value);
  };

  const onConfirmChange = (event: any) => {
    setNewConfirm(event.target.value);
  };

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
              <input
                className="input-text"
                type="password"
                value={newPassword}
                onChange={onPasswordChange}
              />
            </Col>
          </Row>
          <Row>
            <Col align="start">
              <div className="input-label">Confirm New Password:</div>
              <input
                className={`input-text ${
                  newPassword === newConfirm ? "" : "not-same"
                }`}
                type="password"
                value={newConfirm}
                onChange={onConfirmChange}
              />
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
