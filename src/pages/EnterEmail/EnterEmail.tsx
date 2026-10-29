import React from "react";
import { Link } from "react-router-dom";
import { sendResetPasswordEmail } from "../../api";
import { Alert } from "../../components/common/Alert";
import { AuthCard } from "../../components/common/AuthCard";
import { Button, buttonClassName } from "../../components/common/Button";
import {
  ArrowLeftIcon,
  LockIcon,
  MailIcon,
} from "../../components/common/Icons";
import { TextField } from "../../components/common/TextField";
import { getStoredLoginPath } from "../../utils/loginPath";
import { useDocumentTitle } from "../../utils/useDocumentTitle";

export const EnterEmail = () => {
  useDocumentTitle("Reset password");

  const [emailAddress, setEmailAddress] = React.useState("");
  const [emailSubmitted, setEmailSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const loginPath = getStoredLoginPath();
  const backToLogin = loginPath && (
    <Link to={loginPath} className={buttonClassName("link")}>
      <ArrowLeftIcon />
      Back to sign in
    </Link>
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    sendResetPasswordEmail(emailAddress.trim())
      .then(() => {
        setEmailSubmitted(true);
      })
      .catch((error) => {
        setErrorMessage(
          error.message || "We couldn't send the email. Please try again."
        );
      })
      .finally(() => setIsSubmitting(false));
  };

  if (emailSubmitted) {
    return (
      <AuthCard
        icon={<MailIcon />}
        title="Check your email"
        description={
          <>
            We sent a password reset link to <strong>{emailAddress}</strong>.
            The link is valid for 15 minutes.
          </>
        }
        footer={backToLogin}
      >
        <p className="auth-card-description" style={{ textAlign: "center" }}>
          Don't see it? Check your spam folder, or reach out if it doesn't
          arrive.
        </p>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setEmailSubmitted(false)}
        >
          Try a different email
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      icon={<LockIcon />}
      title="Forgot your password?"
      description="Enter the email on your account and we'll send you a link to reset it."
      footer={backToLogin}
    >
      {errorMessage && <Alert>{errorMessage}</Alert>}
      <form className="auth-form" onSubmit={onSubmit}>
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          autoFocus
          required
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="auth-form-actions">
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};
