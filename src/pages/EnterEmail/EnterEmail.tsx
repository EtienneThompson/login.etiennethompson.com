import React from "react";
import { sendResetPasswordEmail } from "../../api";
import { Button } from "../../components/common/Button";
import { Row, Col, Container } from "../../components/common/Grid";
import "./EnterEmail.scss";

export const EnterEmail = () => {
  document.title = "Etienne Thompson - OAuth Login - Enter Email";
  document.documentElement.className = "theme-light";

  const [emailAddress, setEmailAddress] = React.useState("");
  const [emailSubmitted, setEmailSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const onSubmitButtonClicked = () => {
    sendResetPasswordEmail(emailAddress)
      .then((response) => {
        setEmailSubmitted(true);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <Container className="enter-email-container">
      <div className="card">
        {!emailSubmitted ? (
          <Col>
            {errorMessage && (
              <Row>
                <div className="error">{errorMessage}</div>
              </Row>
            )}
            <Row className="reset-notice-title">
              You've requested to reset your password. Enter the email
              associated with your account.
            </Row>
            <Row>
              <Col align="start">
                <div className="input-label">Enter your email:</div>
                <input
                  className="input-text"
                  type="text"
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Button onClick={onSubmitButtonClicked}>Submit</Button>
            </Row>
          </Col>
        ) : (
          <Col>
            <Row className="reset-notice-title">
              An email has been sent to {emailAddress}
            </Row>
            <Row className="reset-notice-subtitle">
              The email will be valid for 15 minutes with the link to reset
              your password.
            </Row>
            <Row className="reset-notice-subtitle">
              If you don't receive the email, please try again or reach out.
            </Row>
          </Col>
        )}
      </div>
    </Container>
  );
};
