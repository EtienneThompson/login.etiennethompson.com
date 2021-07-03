import { hashString } from "../utils/hash";
import { LoginRequest } from "./types";

export const loginUser = async (
  username: string,
  password: string
): Promise<void> => {
  console.log("loginUser");
  const hashedPassword = hashString(password);
  console.log(hashedPassword);

  const loginRequest: LoginRequest = {
    username: username,
    hashedPassword: hashedPassword,
  };

  const response = await fetch("http://localhost:3600/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify(loginRequest),
  });

  console.log(await response.json());

  console.log("login api called.");
};
