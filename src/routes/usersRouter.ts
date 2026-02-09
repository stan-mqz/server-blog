import { Router } from "express";
import {
  getUserById,
  updateUserAvatar,
  updateUserPassword,
  updateUsername,
  updateUserEmail,
} from "../handlers/usersHandler";
import { protect } from "../middleware/authMiddleware";
import { body } from "express-validator";
import upload from "../middleware/uploadMiddleware";
import { handleInputErrors } from "../middleware/errorMiddleware";

const router = Router();

router.get("/profile/:id_user", protect, getUserById);

router.patch(
  "/update-username",
  protect,
  body("username")
    .exists()
    .withMessage("Username is required")
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  handleInputErrors,
  updateUsername,
);

router.patch(
  "/update-email",
  protect,
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  handleInputErrors,
  updateUserEmail,
);

router.patch(
  "/update-avatar",
  protect,
  upload.single("avatar"),
  updateUserAvatar,
);

router.patch(
  "/update-password",
  protect,

  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("newPassword").exists().withMessage("New password is required"),
  handleInputErrors,
  updateUserPassword,
);

export default router;
