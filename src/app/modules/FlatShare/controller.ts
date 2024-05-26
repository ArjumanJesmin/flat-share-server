import { IAuthUser } from "./../../../interfaces/common";
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { FlatShareRequestServices } from "./service";

const createFlatRequest = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    console.log(user);

    const result = await FlatShareRequestServices.createFlatRequestIntoDB(
      req.body,
      user
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Flat Share Request created successfully",
      data: result,
    });
  }
);

const getAllFlatRequestData = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user;
    const result = await FlatShareRequestServices.getAllFlatRequestDataFromDB(
      userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Flat Share Request retrieved successfully",
      data: result,
    });
  }
);
const getSingleFlatRequestData = catchAsync(
  async (req: Request, res: Response) => {
    const { flatId } = req.params;
    const result =
      await FlatShareRequestServices.getSingleFlatRequestDataFromDB(flatId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Flat Share Request retrieved successfully",
      data: result,
    });
  }
);

export const FlatShareRequestController = {
  createFlatRequest,
  getAllFlatRequestData,
  getSingleFlatRequestData,
};
