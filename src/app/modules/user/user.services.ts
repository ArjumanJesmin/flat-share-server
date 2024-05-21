import { Admin, Manager, Prisma, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { hashedPassword } from "./user.utils";
import { IUser } from "./user.interface";
import { IGenericResponse } from "../../../interfaces/common";
import { Request } from "express";
import { IUploadFile } from "../../../interfaces/file";
import { FileUploadHelper } from "../../../helpers/fileUploadHelper";

import { MeiliSearch } from "meilisearch";

const meiliClient = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: "aSampleMasterKey",
});

const createApplicant = async (req: Request) => {
  const file = req.file as IUploadFile;

  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
      file
    );
    req.body.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashPassword = await hashedPassword(req.body.password);

  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.email,
        password: hashPassword,
        role: UserRole.APPLICANT,
        name: req.body.name,
      },
    });

    const newApplicant = await transactionClient.applicant.create({
      data: {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        role: UserRole.APPLICANT,
      },
    });

    const { id, email, name } = newApplicant;
    const index = meiliClient.index("applicant");
    await index.addDocuments([{ id, email, name }]);

    return newApplicant;
  });

  return result;
};

const createAdmin = async (req: Request): Promise<Admin> => {
  const file = req.file as IUploadFile;

  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
      file
    );
    req.body.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.email,
        password: hashPassword,
        role: UserRole.ADMIN,
        name: req.body.name,
      },
    });

    const newAdmin = await transactionClient.admin.create({
      data: {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
      },
    });

    return newAdmin;
  });

  return result;
};

const createManager = async (req: Request): Promise<Manager> => {
  const file = req.file as IUploadFile;

  if (file) {
    const uploadedProfileImage = await FileUploadHelper.uploadToCloudinary(
      file
    );
    req.body.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async (transactionClient) => {
    const newUser = await transactionClient.user.create({
      data: {
        email: req.body.email,
        password: hashPassword,
        role: UserRole.MANAGER,
        name: req.body.name,
      },
    });

    const newManager = await transactionClient.manager.create({
      data: {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
      },
    });

    return newManager;
  });

  return result;
};

const getAllUser = async (): Promise<IGenericResponse<IUser[]>> => {
  const result = await prisma.user.findMany();
  return {
    data: result,
    meta: {
      total: result.length,
      page: 1,
      limit: result.length,
    },
  };
};

const getMyProfile = async (authUser: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: authUser.userId,
    },
    select: {
      email: true,
      role: true,
      needPasswordChange: true,
    },
  });

  let profileData;
  if (userData?.role === UserRole.ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: {
        email: userData.email,
      },
    });
  } else if (userData?.role === UserRole.MANAGER) {
    profileData = await prisma.manager.findUnique({
      where: {
        email: userData.email,
      },
    });
  } else if (userData?.role === UserRole.APPLICANT) {
    profileData = await prisma.applicant.findUnique({
      where: {
        email: userData.email,
      },
    });
  }
  return { ...profileData, ...userData };
};

export const UserServices = {
  createApplicant,
  createAdmin,
  createManager,
  getAllUser,
  getMyProfile,
};
