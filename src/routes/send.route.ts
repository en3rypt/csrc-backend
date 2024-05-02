import { Router } from "express";
import SendController from "../controllers/send.controller";

const sendRouter = Router();
const sendController = new SendController();

sendRouter.get("/", sendController.send);
sendRouter.get("/get", sendController.get);
export default sendRouter;
