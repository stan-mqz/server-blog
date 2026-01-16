import { Request, Response } from "express";
import User from "../models/Users.model";
import Post from "../models/Posts.model";
import bcrypt from "bcrypt";
import { cloudinaryOptions } from "../config/cloudinary";
import fs from "fs";
import Like from "../models/Likes.model";
import Comment from "../models/Comments.model";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id_user } = req.params;
    const authenticatedUserId = req.userData?.id_user; 

    const user = await User.findByPk(id_user, {
      include: [
        {
          model: Post,
          include: [
            {
              model: User,
              attributes: ["id_user", "username", "avatar"],
            },
            {
              model: Like,
              attributes: ["user_id"],
            },
            {
              model: Comment,
              include: [
                {
                  model: User,
                  attributes: ["id_user", "username", "avatar"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    
    const postsWithOwnership =
      user.dataValues.posts?.map((post) => {
        const isOwner = post.user_id === authenticatedUserId;

        const comments = post.comments?.map((comment) => ({
          ...comment.dataValues,
          isOwner: comment.user_id === authenticatedUserId,
        }));

        const likesCount = post.likes?.length || 0;
        const likedByUser =
          post.likes?.some((like) => like.user_id === authenticatedUserId) ||
          false;

        return {
          ...post.dataValues,
          likesCount,
          likedByUser,
          comments,
          isOwner,
        };
      }) || [];

    return res.json({
      id: user.dataValues.id_user,
      username: user.dataValues.username,
      email: user.dataValues.email,
      avatar: user.dataValues.avatar,
      posts: postsWithOwnership,
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
      return res.status(404).json({ message: "Email Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.dataValues.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    res.status(200).json("Password Updated Successfully");

    user.save();
  } catch (error) {
    throw new Error(error);
  }
};
