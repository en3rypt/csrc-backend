import multer from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("application/pdf")) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
