import React from "react";

export interface ButtonProps {
  color?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}
