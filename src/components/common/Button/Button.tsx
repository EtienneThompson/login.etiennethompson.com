import { FunctionComponent } from "react";
import { ButtonProps } from "./Button.types";
import { Keyboard } from "../../../types";
import "./Button.scss";

export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return (
    <div
      tabIndex={0}
      className="button-container"
      onClick={props.onClick}
      onKeyPress={(e) =>
        e.key === Keyboard.Enter ? props.onClick && props.onClick() : null
      }
    >
      {props.children}
    </div>
  );
};
