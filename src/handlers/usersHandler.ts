import { Request, Response } from "express";
import User from "../models/Users.model";
import Post from "../models/Posts.model";
import bcrypt from "bcrypt";
import { cloudinaryOptions } from "../config/cloudinary";
import fs from "fs";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id_user } = req.userData;

    const user = await User.findByPk(id_user, {
      include: [Post],
    });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
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
    const { username, email } = req.body;

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

    await user.save();

    return res.json({
      message: "Data updated successfully",
      id: user.dataValues.id_user,
      username: user.dataValues.username,
      email: user.dataValues.email,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { id_user } = req.userData;

    const user = await User.findByPk(id_user);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (req.file) {
      const uploadResult = await cloudinaryOptions.uploader.upload(
        req.file.path,
        {
          folder: "blog/avatars",
        }
      );

      user.avatar = uploadResult.secure_url;
    }

    user.save();

    res.json({
      message: "Avatar Updated Correctly",
      avatar: user.avatar,
    });

  } catch (error) {
    console.error("Error Updating avatar:", error);
    return res.status(500).json({
      message: "Error updating avatar",
      error: error.message,
    });

  } finally {
    await fs.unlinkSync(req.file.path);
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { email, password, newPassword } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({message: "Email Not Found"});
    }

    const isMatch = await bcrypt.compare(password, user.dataValues.password);

    if (!isMatch) {
      return res.status(400).json({message: 'Invalid Password'});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    res.status(200).json("Password Updated Successfully");

    user.save();
  } catch (error) {
    throw new Error(error);
  }
};
