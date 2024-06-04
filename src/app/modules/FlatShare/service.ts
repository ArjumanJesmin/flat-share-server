import prisma from "../../../shared/prisma";
import { FlatShareRequest, RequestStatus } from "@prisma/client";

const createFlatRequestIntoDB = async (
  payload: FlatShareRequest,
  userId: string
) => {
  console.log("Creating flat share request for user:", userId);

  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const { contactInfo, additionalInfo, flatId } = payload;

  const flatData = {
    contactInfo,
    additionalInfo,
    status: RequestStatus.PENDING,
    flatId,
    userId: userInfo.id,
    createdAt: new Date(),
  };

  console.log("Flat data to be inserted:", flatData);

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

export const FlatShareRequestServices = {
  createFlatRequestIntoDB,
  getAllFlatRequestDataFromDB,
};
