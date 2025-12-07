import { Router } from "express";
const router = Router();
import {
  getMe,
  loginUser,
  recoverEmail,
  recoverPassword,
  registerUser,
  verifyEmail,
} from "../handlers/authHandler";
import { protect } from "../middleware/authMiddleware";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/errorMiddleware";




router.post(
  "/register",
  body("username")
    .notEmpty().withMessage("The username cannot be empty")
    .isString().withMessage("The username must be a string")
    .trim()
    .isLength({ min: 3 }).withMessage("The username must have at least 3 characters"),

  body("email")
    .notEmpty().withMessage("The email cannot be empty")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("The password cannot be empty")
    .isLength({ min: 6 }).withMessage("The password must have at least 6 characters"),

  handleInputErrors,
  registerUser
);



router.post(
  "/login",
  body("email")
    .notEmpty().withMessage("The email cannot be empty")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("The password cannot be empty"),

  handleInputErrors,
  loginUser
);



router.post(
  "/recover-email",
  body("email")
    .notEmpty().withMessage("The email cannot be empty")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("newEmail")
    .notEmpty().withMessage("You must introduce a new email")
    .isEmail().withMessage("Invalid new email format")
    .normalizeEmail(),

  handleInputErrors,
  recoverEmail
);



router.post(
  "/recover-password",
  body("email")
    .notEmpty().withMessage("The email cannot be empty")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("newPassword")
    .notEmpty().withMessage("You must introduce a new password")
    .isLength({ min: 6 }).withMessage("The new password must have at least 6 characters"),

  handleInputErrors,
  recoverPassword
);



router.post(
  "/verify-email",
  body("verficationToken")
    .notEmpty().withMessage("You have to introduce a valid token")
    .isString().withMessage("The token must be a valid string"),

  handleInputErrors,
  verifyEmail
);


router.get("/me", protect, getMe);

export default router;
