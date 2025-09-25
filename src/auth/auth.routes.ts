import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get("/profile", authenticate, AuthController.getProfile);
router.get(
  "/users",
  authenticate,
  authorize(["admin", "moderator"]),
  AuthController.getAllUsers
);

export default router;
