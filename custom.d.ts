import { Request } from "express";
import { IUploadFile } from "./uploadFileInterface";

declare global {
  namespace Express {
    interface Request {
      file?: IUploadFile;
    }
  }
}
