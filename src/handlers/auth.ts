import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { UserType } from "../types/index";
import User from "../models/Users.model";
import colors from "colors";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const, //as const converts it into a literal type
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const generateToken = (id: UserType["id_user"]) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.json("All fields must be filled");
    }

    const usernameExists = await User.findOne({
      where: { username: username },
    });

    const emailExists = await User.findOne({
      where: { email: email },
    });

    if (usernameExists) {
      return res.status(400).json("User already exists");
    }

    if (emailExists) {
      return res.status(400).json("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const token = generateToken(newUser.id_user);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({ data: newUser });
  } catch (error) {
    throw new Error(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("All fields must be filled");
  }

  const user = await User.findOne({
    where: { email: email },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }


  //Convert data obtained to JSON
  const userData = user.toJSON()

  const isMatch = await bcrypt.compare(password, userData.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  

  const token = generateToken(userData.id_user);
  res.cookie("token", token, cookieOptions);

  return res.json({ 
    id: userData.id_user,
    username: userData.username,
    email: userData.email,
    avatar: userData.avatar
   });
};
