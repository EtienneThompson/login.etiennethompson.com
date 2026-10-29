import React from "react";
import "./AuthCard.scss";

export interface AuthCardProps {
  title: string;
  description?: React.ReactNode;
  // Shown in a badge above the title.
  icon?: React.ReactNode;
  iconVariant?: "primary" | "success" | "danger" | "plain";
  // Shown under a divider at the bottom of the card.
  footer?: React.ReactNode;
  wide?: boolean;
  children?: React.ReactNode;
}

export const AuthCard = ({
  title,
  description,
  icon,
  iconVariant = "primary",
  footer,
  wide = false,
  children,
}: AuthCardProps) => {
  return (
    <section className={`auth-card ${wide ? "auth-card--wide" : ""}`}>
      <header className="auth-card-header">
        {icon && (
          <div className={`auth-card-icon auth-card-icon--${iconVariant}`}>
            {icon}
          </div>
        )}
        <h1 className="auth-card-title">{title}</h1>
        {description && (
          <p className="auth-card-description">{description}</p>
        )}
      </header>
      {children && <div className="auth-card-body">{children}</div>}
      {footer && <footer className="auth-card-footer">{footer}</footer>}
    </section>
  );
};
