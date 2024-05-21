import { Admin, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const getAllFromDB = async () => {
  const result = await prisma.admin.findMany();
  return result;
};

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Admin>
): Promise<Admin | null> => {
  const admin = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "This admin does not exist");
  }
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Admin> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deletedAdmin = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deletedAdmin.email,
      },
    });

    return deletedAdmin;
  });
};

export const AdminService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
