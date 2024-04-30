import { Router } from "express";
import SendController from "../controllers/send.controller";

const sendRouter = Router();
const sendController = new SendController();

sendRouter.get("/", sendController.send);

export default sendRouter;
