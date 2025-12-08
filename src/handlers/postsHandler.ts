import e, { Request, Response } from "express";
import Post from "../models/Posts.model";
import User from "../models/Users.model";
import Like from "../models/Likes.model";
import Comment from "../models/Comments.model";
import { cloudinaryOptions } from "../config/cloudinary";
import fs from "fs";

export const getAllPosts = async (req: Request, res: Response) => {
  const posts = await Post.findAll();

  const postsData = posts.map((post) => post.toJSON());

  res.json(postsData);
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id_post } = req.params;

    const post = await Post.findByPk(id_post, {
      include: [User, Like, Comment],
    });

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    res.json({
      id_post: post.dataValues.id_post,
      title: post.dataValues.title,
      content: post.dataValues.content,
      image: post.dataValues.image,
      user: {
        id_user: post.dataValues.user.id_user,
        username: post.dataValues.user.username,
        avatar: post.dataValues.user.avatar,
      },
      likes: post.dataValues.likes,
      comments: post.dataValues.comments,
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

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id_post } = req.params;
    const { id_user } = req.userData;

    const post = await Post.findByPk(id_post);

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

