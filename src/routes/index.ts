import { Router } from "express";
import sendRouter from "./send.route";
import authRouter from "./auth.route";

const router = Router();

router.use("/send", sendRouter);
router.use("/auth", authRouter);
export default router;
