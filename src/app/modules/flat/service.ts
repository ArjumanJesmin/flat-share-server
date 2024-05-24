import { Flat, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import prisma from "../../../shared/prisma";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IAuthUser } from "../../../interfaces/common";

export type IUploadFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

type TFlat = {
  location: string;
  description: string;
  rentAmount: number;
  bedrooms: number;
  flatPhotos: string;
  amenities: string;
};

const createFlatFromDB = async (
  payload: TFlat,
  user: IAuthUser
): Promise<Flat> => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const { location, description, rentAmount, bedrooms, flatPhotos, amenities } =
    payload;

  const flatData = {
    id: uuidv4(),
    location,
    description,
    rentAmount,
    bedrooms,
    flatPhotos,
    amenities,
    userId: userInfo?.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createdFlat = await prisma.flat.create({
    data: flatData,
  });

  return createdFlat;
};

const getAllFlatFromDB = async () => {
  const result = prisma.flat.findMany({
    // include: {
    //   flatUser: true,
    //   user: true,
    // },
  });
  return result;
};
export const FlatService = {
  createFlatFromDB,
  getAllFlatFromDB,
};
