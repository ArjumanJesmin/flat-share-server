import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../../interfaces/common";
import { FlatShareRequest, RequestStatus } from "@prisma/client";

const createFlatRequestIntoDB = async (
  payload: FlatShareRequest,
  user: IAuthUser
) => {
  console.log(user);
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: user?.userId,
    },
  });

  const { contactInfo, additionalInfo, flatId } = payload;

  const flatData = {
    contactInfo,
    additionalInfo,
    status: RequestStatus.PENDING,
    flatId,
    userId: userInfo?.id,
    createdAt: new Date(),
  };
  console.log(flatData);

  const result = await prisma.flatShareRequest.create({
    data: flatData,
    include: {
      user: true,
      flat: true,
    },
  });
  return result;
};

const getAllFlatRequestDataFromDB = async (userId: string) => {
  const result = await prisma.flatShareRequest.findMany({
    where: {
      userId,
    },
    include: {
      flat: true,
    },
  });
  return result;
};

const getSingleFlatRequestDataFromDB = async (flatId: string) => {
  const result = await prisma.flatShareRequest.findFirstOrThrow({
    where: {
      flatId,
    },
    include: {
      flat: true,
    },
  });
  return result;
};

export const FlatShareRequestServices = {
  createFlatRequestIntoDB,
  getAllFlatRequestDataFromDB,
  getSingleFlatRequestDataFromDB,
};
