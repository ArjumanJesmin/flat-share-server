import { FlatService } from "./service";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { IAuthUser } from "../../../interfaces/common";

const createFlatFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FlatService.createFlatFromDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat created successfully",
    data: result,
  });
});

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

const getSingleFlat = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FlatService.getSingleFlatFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat retrieval successfully",
    data: result,
  });
});

const updateFlat = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FlatService.updateFlatDataIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FLat data updated!",
    data: result,
  });
});

const updateMyFlat = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const { id } = req.params;

    const result = await FlatService.updateMyFlatDataIntoDB(id, user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "FLat data updated!",
      data: result,
    });
  }
);

const deleteFlat = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await FlatService.deleteFlatFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FLat Deleted successfully!",
    data: result,
  });
});

export const FlatController = {
  createFlatFromDB,
  getAllFlatFromDB,
  updateMyFlat,
  updateFlat,
  deleteFlat,
  getSingleFlat,
};
