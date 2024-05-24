import { FlatService } from "./service";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import { Request, Response } from "express";
import { IAuthUser } from "../../../interfaces/common";

const createFlatFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await FlatService.createFlatFromDB(req.body, user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin retrieval successfully",
      data: result,
    });
  }
);

const getAllFlatFromDB = catchAsync(async (req: Request, res: Response) => {
  // const token = req.headers.authorization as string;
  const result = await FlatService.getAllFlatFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrieval successfully",
    data: result,
  });
});

export const FlatController = {
  createFlatFromDB,
  getAllFlatFromDB,
};
