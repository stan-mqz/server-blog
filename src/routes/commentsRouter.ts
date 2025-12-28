import Router from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createNewComment,
  editComment,
  deleteComment
} from "../handlers/commentsHandler";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/errorMiddleware";

const router = Router();

router.post(
  "/create-comment/:id_post",
  protect,

  param("id_post")
    .notEmpty()
    .withMessage("Post ID is required")
    .isInt({ min: 1 })
    .withMessage("Post ID must be a valid positive integer"),

  body("content_comment")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Comment must be between 1 and 100 characters"),

  handleInputErrors,
  createNewComment
);

router.patch(
  "/edit-comment/:id_comment",
  protect,

  param("id_comment")
    .notEmpty()
    .withMessage("Comment ID is required")
    .isInt({ min: 1 })
    .withMessage("Comment ID must be a valid positive integer"),

  body("content_comment")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Comment must be between 1 and 100 characters"),

  handleInputErrors,
  editComment
);

router.delete(
  "/delete-comment/:id_comment",
  protect,

  param("id_comment")
    .notEmpty()
    .withMessage("Comment ID is required")
    .isInt({ min: 1 })
    .withMessage("Comment ID must be a valid positive integer"),

  handleInputErrors,
  deleteComment
);



export default router;
