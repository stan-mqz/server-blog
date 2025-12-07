import jwt from "jsonwebtoken";
import { UserType } from "../types";

//The parameter id will be used as a key and its value as the value
export const generateToken = (id: UserType["id_user"]) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const generateEmailToken = (
  id: UserType["id_user"],
  email: UserType["email"]
) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};