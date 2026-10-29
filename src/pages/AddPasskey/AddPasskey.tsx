import React from "react";
import { useLocation } from "react-router";
import { WebAuthnError } from "@simplewebauthn/browser";
import { registerPasskey } from "../../api";
import { LoginResponse } from "../../api/types";
import { Button } from "../../components/common/Button";
import { Row, Col, Container } from "../../components/common/Grid";
import { writeToLocalStorage } from "../../utils/localStorage";
import { redirectToApplication } from "../../utils/redirect";
import { LocalStorageKey } from "../../types";
import "./AddPasskey.scss";

export const AddPasskey = () => {
  document.title = "Etienne Thompson - OAuth Login - Add a Passkey";
  document.documentElement.className = "theme-light";

  // The login page passes the login response here after a password login.
  const location = useLocation();
  const loginResponse = location.state as LoginResponse | null;

  const [errorMessage, setErrorMessage] = React.useState("");
  const [isWaitingForPasskey, setIsWaitingForPasskey] = React.useState(false);

  const onAddPasskeyClicked = async () => {
    if (!loginResponse || !loginResponse.passkeyRegistration) {
      return;
    }

    setErrorMessage("");
    setIsWaitingForPasskey(true);
    try {
      await registerPasskey(loginResponse.passkeyRegistration);
    } catch (error: any) {
      console.error("Could not add a passkey:", error);
      setIsWaitingForPasskey(false);
      if (
        error instanceof WebAuthnError &&
        error.code === "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED"
      ) {
        // This device already has a passkey for the account.
        writeToLocalStorage(LocalStorageKey.PasskeyPromptDismissed, true);
        redirectToApplication(loginResponse);
        return;
      }
      if (error instanceof Error && error.name === "NotAllowedError") {
        setErrorMessage("The passkey wasn't added.");
        return;
      }
      setErrorMessage(error.message || "Could not add the passkey.");
      return;
    }

    // Don't ask again on this device once it has a passkey.
    writeToLocalStorage(LocalStorageKey.PasskeyPromptDismissed, true);
    redirectToApplication(loginResponse);
  };

  const onNotNowClicked = () => {
    if (loginResponse) {
      redirectToApplication(loginResponse);
    }
  };

  const onDontAskAgainClicked = () => {
    writeToLocalStorage(LocalStorageKey.PasskeyPromptDismissed, true);
    onNotNowClicked();
  };

  return (
    <Container className="add-passkey-container">
      <div className="card">
        {loginResponse && loginResponse.passkeyRegistration ? (
          <Col>
            {errorMessage && (
              <Row>
                <div className="error">{errorMessage}</div>
              </Row>
            )}
            {isWaitingForPasskey && (
              <Row className="add-passkey-subtitle">
                Follow the prompt from your browser or device to create your
                passkey.
              </Row>
            )}
            <Row className="add-passkey-title">
              Skip the password next time?
            </Row>
            <Row className="add-passkey-subtitle">
              Add a passkey to sign in with your fingerprint, face, or device
              PIN instead of your password.
            </Row>
            <Row>
              <Button
                className="large-button add-passkey-button"
                onClick={onAddPasskeyClicked}
              >
                Add a passkey
              </Button>
            </Row>
            <Row>
              <Button
                className="large-button add-passkey-button"
                onClick={onNotNowClicked}
              >
                Not now
              </Button>
            </Row>
            <Row>
              <div
                className="add-passkey-link"
                onClick={onDontAskAgainClicked}
              >
                Don't ask again on this device
              </div>
            </Row>
          </Col>
        ) : (
          <Col>
            <Row className="add-passkey-title">
              Login to add a passkey to your account.
            </Row>
          </Col>
        )}
      </div>
    </Container>
  );
};
