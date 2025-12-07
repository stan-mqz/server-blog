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
  body("username").notEmpty().withMessage("The username cannot be empty"),
  body("email").notEmpty().withMessage("The email cannot be empty"),
  body("password").notEmpty().withMessage("The password cannot be empty"),
  handleInputErrors,
  registerUser
);

router.post(
  "/login",
  body("email").notEmpty().withMessage("The email cannot be empty"),
  body("password").notEmpty().withMessage("The password cannot be empty"),
  handleInputErrors,
  loginUser
);


router.post(
  "/recover-email",
  body("email").notEmpty().withMessage("The email cannot be empty"),
  body("newEmail").notEmpty().withMessage("You must introduce a new email"),
  handleInputErrors,
  recoverEmail
);
router.post(
  "/recover-password",
  body("email").notEmpty().withMessage("The email cannot be empty"),
  body("newPassword")
    .notEmpty()
    .withMessage("You must introduce a new password"),
    handleInputErrors,
  recoverPassword
);

router.post(
  "/verify-email",
  body("verficationToken").notEmpty().withMessage("You have to introduce a valid token"),
  handleInputErrors,
  verifyEmail
);

router.get("/me", protect, getMe);

export default router;
