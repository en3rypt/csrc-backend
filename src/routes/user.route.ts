import { Router } from "express";
import UserController from "../controllers/user.controller";
import { send } from "process";

const sendRouter = Router();
const userController = new UserController();

sendRouter.post("/send", userController.send);
sendRouter.get("/submissions", userController.getAllSubmissions);
sendRouter.get("/submission/:email", userController.getSubmissionsByEmail);
sendRouter.get(
  "/submission/:uuid",
  userController.downloadSubmissionFileByUUID
);
export default sendRouter;
