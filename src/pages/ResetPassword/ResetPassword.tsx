import React from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { sendUpdatedPassword } from "../../api";
import { Alert } from "../../components/common/Alert";
import { AuthCard } from "../../components/common/AuthCard";
import { Button, buttonClassName } from "../../components/common/Button";
import {
  AlertIcon,
  CheckIcon,
  LockIcon,
} from "../../components/common/Icons";
import { TextField } from "../../components/common/TextField";
import { hashString } from "../../utils/hash";
import { getStoredLoginPath } from "../../utils/loginPath";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

// Read the reset code from the link in the email.
const getResetCode = (): string => {
  const params = queryString.parse(window.location.search.substring(1));
  const code = Array.isArray(params.code) ? params.code[0] : params.code;
  return code || "";
};

export const ResetPassword = () => {
  useDocumentTitle("Choose a new password");

  const [resetCode] = React.useState(getResetCode);
  const [newPassword, setNewPassword] = React.useState("");
  const [newConfirm, setNewConfirm] = React.useState("");
  const [passwordResetSuccess, setPasswordResetSuccess] =
    React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const passwordsMatch = newPassword === newConfirm;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordsMatch) {
      setErrorMessage("Your passwords don't match.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);
    hashString(newPassword)
      .then((hashedPassword) => sendUpdatedPassword(resetCode, hashedPassword))
      .then(() => setPasswordResetSuccess(true))
      .catch((error) =>
        setErrorMessage(
          error.message || "We couldn't reset your password. Please try again."
        )
      )
      .finally(() => setIsSubmitting(false));
  };

  if (!resetCode) {
    return (
      <AuthCard
        icon={<AlertIcon />}
        iconVariant="danger"
        title="This link isn't valid"
        description="You need the link from a password reset email to choose a new password. Request a new one to continue."
      >
        <Link to="/enter_email" className={buttonClassName("primary", true)}>
          Request a new link
        </Link>
      </AuthCard>
    );
  }

  if (passwordResetSuccess) {
    const loginPath = getStoredLoginPath();
    return (
      <AuthCard
        icon={<CheckIcon />}
        iconVariant="success"
        title="Password updated"
        description="Your password was reset successfully. You can now sign in with your new password."
      >
        {loginPath && (
          <Link to={loginPath} className={buttonClassName("primary", true)}>
            Return to sign in
          </Link>
        )}
      </AuthCard>
    );
  }

  return (
    <AuthCard
      icon={<LockIcon />}
      title="Choose a new password"
      description="Enter a new password for your account."
    >
      {errorMessage && <Alert>{errorMessage}</Alert>}
      <form className="auth-form" onSubmit={onSubmit}>
        <TextField
          id="new-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          autoFocus
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isSubmitting}
        />
        <TextField
          id="confirm-password"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          required
          value={newConfirm}
          onChange={(e) => setNewConfirm(e.target.value)}
          disabled={isSubmitting}
          error={
            newConfirm && !passwordsMatch
              ? "Passwords don't match."
              : undefined
          }
        />
        <div className="auth-form-actions">
          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={!newPassword || !passwordsMatch}
          >
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};
