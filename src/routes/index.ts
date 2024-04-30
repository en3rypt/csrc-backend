import { Router } from "express";
import sendRouter from "./send.route";

const router = Router();

router.use("/send", sendRouter);

export default router;
