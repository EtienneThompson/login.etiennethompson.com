import React from "react";

export interface ButtonProps {
  className?: string;
  color?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}
