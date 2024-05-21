import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserServices } from "./user.services";

const createApplicant = catchAsync(async (req: Request, res: Response) => {
  //const { Applicant , ...userData } = req.body;
  const result = await UserServices.createApplicant(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Applicant created successfully!",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  //const { admin, ...userData } = req.body;
  const result = await UserServices.createAdmin(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});

const createManager = catchAsync(async (req: Request, res: Response) => {
  //const { manager, ...userData } = req.body;
  const result = await UserServices.createManager(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUser();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await UserServices.getMyProfile(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile data fetched!",
    data: result,
  });
});

export const UserController = {
  createApplicant,
  createAdmin,
  createManager,
  getAllUser,
  getMyProfile,
};
