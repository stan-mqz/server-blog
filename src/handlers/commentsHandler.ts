import { Request, Response } from "express";
import Comment from "../models/Comments.model";

export const createNewComment = async (req: Request, res: Response) => {
  try { 
    const { id_post } = req.params;
    const { id_user } = req.userData;
    const { content_comment } = req.body;

    const newComment = await Comment.create({
      content_comment,
      user_id: id_user,
      post_id: id_post,
    });

    res.status(201).json({
      message: "Comment created correctly",
      comment: newComment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating post",
    });
  }
};
