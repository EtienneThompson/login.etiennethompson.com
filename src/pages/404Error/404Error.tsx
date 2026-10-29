import { Link } from "react-router-dom";
import { AuthCard } from "../../components/common/AuthCard";
import { buttonClassName } from "../../components/common/Button";
import { ArrowLeftIcon } from "../../components/common/Icons";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import "./404Error.scss";

export const Error404 = () => {
  useDocumentTitle("Page not found");

  return (
    <AuthCard
      icon={<span className="error-404-code">404</span>}
      title="Page not found"
      description="That's not a page on this site. Double-check the URL, or head back home."
    >
      <Link to="/" className={buttonClassName("primary", true)}>
        <ArrowLeftIcon />
        Go home
      </Link>
    </AuthCard>
  );
};
