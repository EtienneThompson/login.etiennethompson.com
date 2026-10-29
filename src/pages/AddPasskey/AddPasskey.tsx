import React from "react";
import { useLocation } from "react-router";
import { WebAuthnError } from "@simplewebauthn/browser";
import { registerPasskey } from "../../api";
import { LoginResponse } from "../../api/types";
import { Alert } from "../../components/common/Alert";
import { AuthCard } from "../../components/common/AuthCard";
import { Button } from "../../components/common/Button";
import { KeyIcon, LockIcon } from "../../components/common/Icons";
import { writeToLocalStorage } from "../../utils/localStorage";
import { redirectToApplication } from "../../utils/redirect";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { LocalStorageKey } from "../../types";

export const AddPasskey = () => {
  useDocumentTitle("Add a passkey");

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
        setErrorMessage("The passkey wasn't added. You can try again.");
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

  if (!loginResponse || !loginResponse.passkeyRegistration) {
    return (
      <AuthCard
        icon={<LockIcon />}
        title="Sign in first"
        description="Sign in to an app with your password to add a passkey to your account."
      />
    );
  }

  return (
    <AuthCard
      icon={<KeyIcon />}
      title="Skip the password next time?"
      description="Add a passkey to sign in with your fingerprint, face, or device PIN instead of your password."
      footer={
        <Button
          variant="link"
          onClick={onDontAskAgainClicked}
          disabled={isWaitingForPasskey}
        >
          Don't ask again on this device
        </Button>
      }
    >
      {errorMessage && <Alert>{errorMessage}</Alert>}
      {isWaitingForPasskey && (
        <Alert variant="info">
          Follow the prompt from your browser or device to create your
          passkey.
        </Alert>
      )}
      <div className="auth-form-actions">
        <Button
          fullWidth
          icon={<KeyIcon />}
          isLoading={isWaitingForPasskey}
          onClick={onAddPasskeyClicked}
        >
          {isWaitingForPasskey ? "Waiting for your device…" : "Add a passkey"}
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={onNotNowClicked}
          disabled={isWaitingForPasskey}
        >
          Not now
        </Button>
      </div>
    </AuthCard>
  );
};
