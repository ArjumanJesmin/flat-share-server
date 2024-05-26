import prisma from "../../../shared/prisma";

import { IAuthUser } from "../../../interfaces/common";
import { Flat } from "@prisma/client";

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

interface FlatPhoto {
  imageUrl: string;
}

interface FlatData {
  location: string;
  description: string;
  rentAmount: number;
  bedrooms: number;
  flatPhotos: FlatPhoto[];
  amenities: string;
}

declare module "express" {
  export interface Request {
    user: IAuthUser;
    body: FlatData | null;
  }
}

const createFlatFromDB = async (req: Request) => {
  try {
    const { userId } = req.user;

    // Extract flatPhotos from req.body
    const {
      location,
      description,
      rentAmount,
      bedrooms,
      flatPhotos,
      amenities,
    } = req.body;

    const photos = Array.isArray(flatPhotos) ? flatPhotos : [];

    // Validate that all required fields are present
    if (!location || !description || !rentAmount || !bedrooms || !amenities) {
      throw new Error("One or more required fields are missing or invalid");
    }

    const createdFlat = await prisma.flat.create({
      data: {
        location,
        description,
        rentAmount,
        bedrooms,
        amenities,
        userId,
        flatPhotos: {
          create: photos.map((photo) => ({
            imageUrl: photo.imageUrl,
          })),
        },
      },
    });

    return createdFlat;
  } catch (error) {
    console.error("Error creating flat:", error);
    throw error;
  }
};

const getAllFlatFromDB = async () => {
  const result = prisma.flat.findMany();
  return result;
};

const getSingleFlatFromDB = async (id: string) => {
  const result = await prisma.flat.findFirstOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      location: true,
      description: true,
      flatPhotos: true,
      rentAmount: true,
      bedrooms: true,
      amenities: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const updateFlatDataIntoDB = async (id: string, payload: Flat) => {
  const result = await prisma.flat.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const updateMyFlatDataIntoDB = async (
  id: string,
  user: IAuthUser,
  payload: TFlat
) => {
  await prisma.flat.findFirstOrThrow({
    where: {
      id,
      userId: user?.id,
    },
  });

  const result = await prisma.flat.update({
    where: {
      id,
      userId: user?.id,
    },
    data: payload,
  });
  return result;
};

const deleteFlatFromDB = async (id: string) => {
  const deleteFlat = await prisma.flat.delete({
    where: {
      id,
    },
  });

  return deleteFlat;
};
export const FlatService = {
  createFlatFromDB,
  getAllFlatFromDB,
  updateFlatDataIntoDB,
  updateMyFlatDataIntoDB,
  deleteFlatFromDB,
  getSingleFlatFromDB,
};
