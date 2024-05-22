import { FlatService } from "./service";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import { Request, Response } from "express";

const createFlatFromDB = catchAsync(async (req: Request, res: Response) => {
  // const token = req.headers.authorization as string;
  const result = await FlatService.createFlatFromDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrieval successfully",
    data: result,
  });
});

export const FlatController = {
  createFlatFromDB,
};
