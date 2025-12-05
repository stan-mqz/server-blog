import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/Users.model";
import { UserType } from "../types";

//We use this to type our payload properties
interface JwtPayloadCustom extends jwt.JwtPayload {
  id: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(404).json("No token find. Not authorized");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayloadCustom;

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json("User Not Found");
    }

    req.body = {
        id: user.toJSON().id_user
    }

    next();
  } catch (error) {
    throw new Error(error);
  }
};
