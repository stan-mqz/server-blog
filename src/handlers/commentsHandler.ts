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
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating comment",
    });
  }
};

export const editComment = async (req: Request, res: Response) => {
  try {
    const { id_comment } = req.params;
    const { id_user } = req.userData;
    const { content_comment } = req.body;

    const comment = await Comment.findByPk(id_comment);

    if (!comment) {
      return res.status(404).json({ message: "Comment Not Found" });
    }

    if (id_user !== comment.user_id) {
      return res.status(400).json({ message: "Not Authorized" });
    }

     comment.content_comment = content_comment

     await comment.save()

    return res.status(200).json({ message: "Comment updated correctly", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating comment",
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id_comment } = req.params;
    const { id_user } = req.userData;

    const comment = await Comment.findByPk(id_comment);

    if (!comment) {
      return res.status(404).json({ message: "Comment Not Found" });
    }

    if (id_user !== comment.user_id) {
      return res.status(400).json({ message: "Not Authorized" });
    }

    await comment.destroy();

    return res.status(200).json({ message: "Comment deleted correctly" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting comment",
    });
  }
};
