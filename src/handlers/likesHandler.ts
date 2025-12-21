import { Request, Response } from "express";
import Like from "../models/Likes.model";

export const likePost = async (req: Request, res: Response) => {
  try {
    const { id_post } = req.params;
    const { id_user } = req.userData;

    const existingLike = await Like.findOne({
      where: {
        post_id: id_post,
        user_id: id_user,
      },
    });

    if (existingLike) {
      return res.status(400).json({ message: "Post already liked" });
    }

    const like = await Like.create({
      post_id: id_post,
      user_id: id_user,
    });

    res.status(201).json({
      like,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error liking post" });
  }
};


export const unlikePost = async (req: Request, res: Response) => {
  try {
    const { id_post } = req.params;
    const { id_user } = req.userData;

    const like = await Like.findOne({
      where: {
        post_id: id_post,
        user_id: id_user,
      },
    });

    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    await like.destroy();

    res.json({ message: "Like removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing like" });
  }
};
