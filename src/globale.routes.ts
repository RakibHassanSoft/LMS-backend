import { Router } from "express";
import authRoutes from "./auth/auth.routes"

const router = Router();


router.use("/auth", authRoutes);
// router.use("/employee", employeeRoutes);

export default router;
