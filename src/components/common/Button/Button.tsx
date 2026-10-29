import React from "react";
import { ButtonProps, ButtonVariant } from "./Button.types";
import { LoadingSpinner } from "../LoadingSpinner";
import "./Button.scss";

// Class names for anything that should look like a button, such as links.
export const buttonClassName = (
  variant: ButtonVariant = "primary",
  fullWidth = false,
  className = ""
): string =>
  ["button", `button--${variant}`, fullWidth ? "button--full" : "", className]
    .filter(Boolean)
    .join(" ");

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      fullWidth = false,
      isLoading = false,
      icon,
      className,
      disabled,
      type = "button",
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonClassName(variant, fullWidth, className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...rest}
      >
        {isLoading ? <LoadingSpinner /> : icon}
        {children}
      </button>
    );
  }
);
