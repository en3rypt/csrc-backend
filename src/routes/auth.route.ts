import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const authRouter = Router();

const authController = new AuthController();

authRouter.post("/verification-link", authController.sendVerify);
authRouter.get("/verify-email", authController.verifyEmail);

export default authRouter;
