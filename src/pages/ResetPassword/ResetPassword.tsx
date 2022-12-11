import React from "react";
import { useNavigate } from "react-router";
import queryString from "query-string";
import { sendUpdatedPassword } from "../../api";
import { Button } from "../../components/common/Button";
import { Row, Col, Container } from "../../components/common/Grid";
import { hashString } from "../../utils/hash";
import { readFromLocalStorage } from "../../utils/localStorage";
import { LocalStorageKey } from "../../types";
import "./ResetPassword.scss";

export const ResetPassword = () => {
  document.title = "Etienne Thompson - OAuth Login - Reset Password";
  document.documentElement.className = "theme-light";

  const navigate = useNavigate();

  const [appId, setAppId] = React.useState("");
  const [redirectUrl, setRedirectUrl] = React.useState("");
  const [resetCode, setResetCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newConfirm, setNewConfirm] = React.useState("");
  const [passwordResetSuccess, setPasswordResetSuccess] =
    React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    let params = queryString.parse(window.location.search.substring(1));
    let code = params.code
      ? Array.isArray(params.code)
        ? params.code[0]
          ? params.code[0]
          : ""
        : params.code
      : "";

    if (!code) {
      setErrorMessage("You must have a reset code to reset your password");
      return;
    }

    setResetCode(code);
  }, []);

  React.useEffect(() => {
    if (!passwordResetSuccess) {
      return;
    }

    const appId = readFromLocalStorage(LocalStorageKey.CurrentAppId);
    const redirectUrl = readFromLocalStorage(
      LocalStorageKey.CurrentRedirectBase
    );
    if (appId && redirectUrl) {
      setAppId(appId);
      setRedirectUrl(redirectUrl);
    }
  }, [passwordResetSuccess]);

  const onPasswordChange = (event: any) => {
    setNewPassword(event.target.value);
  };

  const onConfirmChange = (event: any) => {
    setNewConfirm(event.target.value);
  };

  const onSubmitButtonClicked = () => {
    if (newPassword !== newConfirm) {
      setErrorMessage("Your passwords are not the same!");
      return;
    }

    sendUpdatedPassword(resetCode, hashString(newPassword))
      .then((response) => setPasswordResetSuccess(true))
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <Container className="reset-password-container">
      <div className="card">
        {!passwordResetSuccess ? (
          <Col>
            {errorMessage && (
              <Row>
                <div className="error">{errorMessage}</div>
              </Row>
            )}
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
              <Button onClick={onSubmitButtonClicked}>Submit</Button>
            </Row>
          </Col>
        ) : (
          <Col>
            <Row>
              <div className="reset-notice-message">
                Your password was reset successfully.
              </div>
            </Row>
            {appId && redirectUrl && (
              <Row>
                <div
                  className="return-link"
                  onClick={() =>
                    navigate(
                      `/login?appid=${appId}&redirectBase=${redirectUrl}`
                    )
                  }
                >
                  Return to login
                </div>
              </Row>
            )}
          </Col>
        )}
      </div>
    </Container>
  );
};
