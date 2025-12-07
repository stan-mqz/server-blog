import { Request, Response } from "express";
import User from "../models/Users.model";
import Post from "../models/Posts.model";
import bcrypt from "bcrypt";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id_user } = req.userData;

    const user = await User.findByPk(id_user, {
      include: [Post],
    });

    if (!user) {
      return res.status(404).json({ Message: "User Not Found" });
    }
    return res.json({
      id: user.dataValues.id_user,
      username: user.dataValues.username,
      email: user.dataValues.email,
      avatar: user.dataValues.avatar,
      posts: user.dataValues.posts,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  try {
    const { id_user } = req.userData;
    const { username, email, avatar } = req.body;

    const user = await User.findByPk(id_user);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (username !== undefined) {
      const usernameExists = await User.findOne({
        where: {
          username,
        },
      });

      if (usernameExists) {
        return res.status(400).json({ message: "Username already exists" });
      }

      user.username = username;
    }

    if (email !== undefined) {
      const emailExists = await User.findOne({
        where: {
          email,
        },
      });

      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }

      user.email = email;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    return res.json({
      message: "Data updated successfully",
      id: user.dataValues.id_user,
      username: user.dataValues.username,
      email: user.dataValues.email,
      avatar: user.dataValues.avatar,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { email, password, newPassword } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json("Email Not Found");
    }

    const isMatch = await bcrypt.compare(password, user.dataValues.password);

    if (!isMatch) {
      return res.status(400).json("Invalid Password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    res.json("Password Updated Successfully");

    user.save();
  } catch (error) {
    throw new Error(error);
  }
};
