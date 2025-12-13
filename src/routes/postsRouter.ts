import { Router } from "express";
import {
  createNewPost,
  deletePost,
  editPost,
  getAllPosts,
  getPostById,
} from "../handlers/postsHandler";
import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";
import { parseFormData } from "../middleware/parseFormData";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/errorMiddleware";
import { likePost, unlikePost } from "../config/likesHandler";
const router = Router();

router.get("/all", protect, getAllPosts);
router.get(
  "/:id_post",
  protect,
  param("id_post")
    .notEmpty()
    .withMessage("Post ID is required")
    .isInt({ min: 1 })
    .withMessage("Post ID must be a valid positive integer"),
  handleInputErrors,
  getPostById
);

router.post(
  "/create-post",
  protect,
  upload.single("image"),
  parseFormData,

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters")
    .escape(),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Content must be between 10 and 500 characters"),
  handleInputErrors,
  createNewPost
);

router.patch(
  "/edit-post/:id_post",
  protect,
  upload.single("image"),
  parseFormData,

  param("id_post")
    .notEmpty()
    .withMessage("Post ID is required")
    .isInt({ min: 1 })
    .withMessage("Post ID must be a valid positive integer"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty if provided")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters")
    .escape(),

  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty if provided")
    .isLength({ min: 10, max: 500 })
    .withMessage("Content must be between 10 and 500 characters"),

  handleInputErrors,
  editPost
);

router.delete(
  "/delete/:id_post",
  protect,
  param("id_post")
    .notEmpty()
    .withMessage("Post ID is required")
    .isInt({ min: 1 })
    .withMessage("Post ID must be a valid positive integer"),
  deletePost
);

router.post("/:id_post/like", protect, likePost);
router.delete("/:id_post/like", protect, unlikePost);

export default router;
