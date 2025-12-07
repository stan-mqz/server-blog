import { Router } from "express";
import {
  getUserById,
  updateUserData,
  updateUserPassword,
} from "../handlers/usersHandler";
import { protect } from "../middleware/authMiddleware";
import { body } from "express-validator";
const router = Router();

router.get("/profile", protect, getUserById);
router.patch(
  "/update-info",
  protect,
  body("username")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),

  updateUserData
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
  updateUserPassword
);

export default router;
