import React from "react";

export type ButtonVariant = "primary" | "secondary" | "link";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  // Shows a spinner and disables the button.
  isLoading?: boolean;
  icon?: React.ReactNode;
}
