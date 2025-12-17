import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/Users.model";
import { JwtPayloadEmailCustom } from "../types/index";
import { cookieOptions } from "../config/cookies";
import { transporter } from "../config/transporter";
import { generateToken, generateEmailToken } from "../config/tokens";

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
      isVerified: false,
    });

    const emailToken = generateEmailToken(newUser.id_user, newUser.email);

    const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email?token=${emailToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: newUser.email,

      subject: "Verify Your Email",

      html: `Please click the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
    });

    return res.status(200).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
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

    const isMatch = await bcrypt.compare(password, user.dataValues.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please Verify Your E-mail before logging in" });
    }

    const token = generateToken(user.dataValues.id_user);
    res.cookie("token", token, cookieOptions);

    return res.json({
      id: user.dataValues.id_user,
      username: user.dataValues.username,
      email: user.dataValues.email,
      avatar: user.dataValues.avatar,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const getMe = async (req: Request, res: Response) => {
  res.json(req.userData);
};

export const recoverEmail = async (req: Request, res: Response) => {
  try {
    //Todo: Add email-sending service for email validation before updating
    const { email, newEmail } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json("Email Not Found");
    }

    user.email = newEmail;

    user.save();

    res.status(200).json("E-mail Updated Correctly");
  } catch (error) {
    throw new Error(error);
  }
};

export const recoverPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json("Email Not Found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.save();

    res.status(200).json("Password updated correctly");
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { verficationToken } = req.body;

  try {
    const decoded = jwt.verify(
      verficationToken,
      process.env.JWT_SECRET
    ) as JwtPayloadEmailCustom;

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ isVerified: true });

    const token = generateToken(user.dataValues.id_user);

    res.cookie("token", token, cookieOptions);

    return res.json({
      message: "Email verified successfully",
      user: {
        id: user.dataValues.id_user,
        username: user.dataValues.username,
        email: user.dataValues.email,
        avatar: user.dataValues.avatar,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
      ...cookieOptions,
      maxAge: 0, 
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};
