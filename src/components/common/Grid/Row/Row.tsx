import { FunctionComponent } from "react";
import { RowProps } from "./Row.types";
import "./Row.scss";

export const Row: FunctionComponent<RowProps> = (props: RowProps) => {
  return (
    <div
      className={`row-container ${props.className}`}
      style={{ justifyContent: props.justify }}
    >
      {props.children}
    </div>
  );
};
