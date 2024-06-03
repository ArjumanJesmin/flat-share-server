import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserServices } from "./user.services";
import { IAuthUser } from "../../../interfaces/common";

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Show User All successfully!",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await UserServices.getMyProfile(user as IAuthUser);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile data fetched!",
      data: result,
    });
  }
);

const editProfile = catchAsync(async (req, res) => {
  const { email } = req.user || { email: null };

  const result = await UserServices.editProfileIntoDB(email, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users profile role changed!",
    data: result,
  });
});

const changeUserRole = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await UserServices.changeUserRole(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users profile role changed!",
    data: result,
  });
});
const changeProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});

export const UserController = {
  createAdmin,
  createUser,
  getMyProfile,
  getAllUsers,
  editProfile,
  changeUserRole,
  changeProfileStatus,
};
