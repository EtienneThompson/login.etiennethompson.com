import { AuthCard } from "../../components/common/AuthCard";
import { BrandMark } from "../../components/common/BrandMark";
import { buttonClassName } from "../../components/common/Button";
import { ExternalLinkIcon } from "../../components/common/Icons";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import "./LandingPage.scss";

export const LandingPage = () => {
  useDocumentTitle("Login");

  return (
    <AuthCard
      wide
      icon={<BrandMark size={56} />}
      iconVariant="plain"
      title="One account for every app"
      description="login.etiennethompson.com is the sign-in center for the apps on the etiennethompson.com domain."
      footer={
        <span>
          Trying to sign in? Open the app you want to use and it will send you
          here.
        </span>
      }
    >
      <ul className="landing-page-points">
        <li>
          <strong>Sign in once.</strong> A single account gets you into every
          registered app in the ecosystem.
        </li>
        <li>
          <strong>Access is per app.</strong> You need an account, and you
          need to be given access to the app you're signing in to.
        </li>
        <li>
          <strong>Passwordless if you want.</strong> Add a passkey to sign in
          with your fingerprint, face, or device PIN.
        </li>
      </ul>
      <div className="landing-page-links">
        <a
          href="https://etiennethompson.com"
          className={buttonClassName("primary", true)}
        >
          Visit my site
        </a>
        <a
          href="https://github.com/EtienneThompson/login.etiennethompson.com"
          className={buttonClassName("secondary", true)}
        >
          View the code
          <ExternalLinkIcon />
        </a>
      </div>
    </AuthCard>
  );
};
