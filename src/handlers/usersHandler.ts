import { Request, Response } from "express";
import User from "../models/Users.model";
import Post from "../models/Posts.model";
import { UserType } from "../types";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      include: [Post],
    });

    if (!user) {
      return res.status(404).json({ Message: "User Not Found" });
    }

    const userData: UserType = user.toJSON();
    return res.json({
      id: userData.id_user,
      username: userData.username,
      email : userData.email,
      avatar: userData.avatar,
      posts: userData.posts,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { username, email, avatar } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ Message: "User Not Found" });
    }

    if (username !== undefined) {
      const usernameExists = await User.findOne({
        where: { username },
      });

      if (usernameExists) {
        return res.status(400).json("Username already exists");
      }

      user.username = username;
    }

    if (email !== undefined) {
      const emailExists = await User.findOne({
        where: { email },
      });

      if (emailExists) {
        return res.status(400).json("Email already exists");
      }

      user.email = email;
    }

    if (user.avatar !== undefined) user.avatar === avatar;

    res.json();
  } catch (error) {
    throw new Error(error);
  }
};
