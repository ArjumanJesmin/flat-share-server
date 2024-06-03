import { FlatService } from "./service";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { IAuthUser } from "../../../interfaces/common";
import { flatFilterableFields } from "./constant";
import pick from "../../../shared/pick";

const createFlatFromDB = catchAsync(async (req, res) => {
  const { userId } = req.user || { userId: null };
  const result = await FlatService.createFlatFromDB(req.body, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat created successfully",
    data: result,
  });
});

const getAllFlatFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IAuthUser;
  const filters = pick(req.query, flatFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await FlatService.getAllFlatFromDB(user, filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flats retrieval successfully",
    meta: result.meta,
    data: result.data,
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

const updateFlat = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FlatService.updateFlatDataIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FLat data updated!",
    data: result,
  });
});

const updateMyFlat = catchAsync(async (req, res: Response) => {
  const { userId } = req.user || { userId: null };
  const { id } = req.params;

  const result = await FlatService.updateMyFlatDataIntoDB(id, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "FLat data updated!",
    data: result,
  });
});

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
