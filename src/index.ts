import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";
import multer from "multer";
import upload from "./middlewares/upload.middleware";
dotenv.config();

const app: Express = express();
app.use(upload.single("file"));

const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded form data
app.use(express.json()); // For parsing JSON payloads
app.use(router);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
