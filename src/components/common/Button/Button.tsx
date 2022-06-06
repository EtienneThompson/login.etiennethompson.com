import React from "react";
import { ButtonProps } from "./Button.types";
import { Keyboard } from "../../../types";
import "./Button.scss";

export const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  (props: ButtonProps, ref: any) => {
    return (
      <div
        tabIndex={0}
        className={`button-container ${props.className}`}
        ref={ref}
        onClick={props.onClick}
        onKeyDown={(e) =>
          e.key === Keyboard.Enter ? props.onClick && props.onClick() : null
        }
      >
        {props.children}
      </div>
    );
  }
);
