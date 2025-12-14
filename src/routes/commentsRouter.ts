import Router from "express";
import { protect } from "../middleware/authMiddleware";
import { createNewComment } from "../handlers/commentsHandler";
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
    .isLength({ min: 1, max: 300 })
    .withMessage("Comment must be between 1 and 300 characters"),

  handleInputErrors,
  createNewComment
);

export default router;
