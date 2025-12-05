import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/Users.model";
import { UserDataType, UserType } from "../types";


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
      res.status(401).json("No token find. Not authorized");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayloadCustom;

    const user : UserType = (await User.findByPk(decoded.id)).toJSON();


    if (!user) {
      return res.status(404).json("User Not Found");
    }

    const userData : UserDataType = {
      id_user: user.id_user,
      username: user.username,
      email: user.email,
      avatar: user.avatar
    }
    
    req.userData = userData 
 
    next();

    
  } catch (error) {
    throw new Error(error);
  }
};
