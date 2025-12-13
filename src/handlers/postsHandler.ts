import { Request, Response } from "express";
import Post from "../models/Posts.model";
import User from "../models/Users.model";
import Like from "../models/Likes.model";
import Comment from "../models/Comments.model";
import { cloudinaryOptions } from "../config/cloudinary";
import fs from "fs";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["id_user", "username", "avatar"],
        },
        {
          model: Like,
          attributes: ["user_id"],
        },
      ],
    });

    const postsData = posts.map((post) => {
      const likesCount = post.likes.length;
      const likedByUser = post.likes.some(
        (like) => like.user_id === post.user.id_user
      );

      return {
        id_post: post.id_post,
        title: post.title,
        content: post.content,
        image: post.image,
        user: post.user,
        likesCount,
        likedByUser,
      };
    });

    res.json(postsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error obtaining posts",
      error: error.message,
    });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id_post } = req.params;
    const { id_user } = req.userData;

    const post = await Post.findByPk(id_post, {
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
    });

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const isOwner = post.user_id === id_user;
    const likesCount = post.likes.length;
    const likedByUser = post.likes.some((like) => like.user_id === id_user);

    res.json({
      id_post: post.id_post,
      title: post.title,
      content: post.content,
      image: post.image,
      user: post.user,
      likesCount,
      likedByUser,
      comments: post.comments,
      isOwner,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error obtaining post",
      error: error.message,
    });
  }
};

export const createNewPost = async (req: Request, res: Response) => {
  try {
    let imageURL;
    const { title, content } = req.body;
    const { id_user } = req.userData;

    if (!title || !content) {
      return res.status(400).json("All fields must be filled");
    }

    if (req.file) {
      const uploadResult = await cloudinaryOptions.uploader.upload(
        req.file.path,
        {
          folder: "posts",
        }
      );

      imageURL = uploadResult.secure_url;
    }

    const newPost = await Post.create({
      title: title,
      content: content,
      image: imageURL,
      user_id: id_user,
    });

    res.json(newPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating post",
      error: error.message,
    });
  } finally {
    if (req.file) fs.unlinkSync(req.file.path);
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    let imageURL;
    const { title, content } = req.body;
    const { id_post } = req.params;
    const { id_user } = req.userData;

    const post = await Post.findByPk(id_post);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    if (post.user_id !== id_user) {
      return res
        .status(401)
        .json({ message: "You are not authorized to do this action" });
    }

    if (title !== undefined) {
      post.title = title;
    }

    if (content !== undefined) {
      post.content = content;
    }

    if (req.file) {
      const uploadResult = await cloudinaryOptions.uploader.upload(
        req.file.path,
        {
          folder: "posts",
        }
      );

      imageURL = uploadResult.secure_url;

      post.image = imageURL;
    }

    post.save();

    res.json({
      message: "Post Updated Correctly",
      post: post,
    });
  } catch (error) {
    console.error(error);
  } finally {
    if (req.file) fs.unlinkSync(req.file.path);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id_post } = req.params;
    const { id_user } = req.userData;

    const post = await Post.findByPk(id_post);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    if (post.user_id !== id_user) {
      return res
        .status(401)
        .json({ message: "You are not authorized to do this action" });
    }

    await post.destroy();

    res.status(200).json({ message: "Post deleted correctly" });
  } catch (error) {
    console.error(error);
  }
};
