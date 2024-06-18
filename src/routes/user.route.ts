import { Router } from "express";
import UserController from "../controllers/user.controller";

const sendRouter = Router();
const userController = new UserController();

sendRouter.post("/send", userController.send);
sendRouter.get("/submissions", userController.getAllSubmissions);
sendRouter.get("/submission/:email", userController.getSubmissionsByEmail);
sendRouter.get(
  "/submission/download/:uuid",
  userController.downloadSubmissionFileByUUID
);
sendRouter.get(
  "/submission/file/:fileName",
  userController.downloadSubmissionByFilename
);
export default sendRouter;
