import prisma from "../../../shared/prisma";

import { Flat, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IAuthUser } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { FlatPayload } from "./flat.interface";

// declare module "express" {
//   export interface Request {
//     user: IAuthUser;
//     body: FlatData | null;
//   }
// }

const createFlatFromDB = async (payload: FlatPayload, userId: string) => {
  try {
    // Extract flatPhotos from req.body
    const {
      location,
      description,
      rentAmount,
      bedrooms,
      flatPhotos,
      amenities,
    } = payload;

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

const getAllFlatFromDB = async (
  // user: IAuthUser,
  filters: any,
  options: IPaginationOptions & {
    location?: string;
    priceMin?: number;
    priceMax?: number;
    bedrooms?: number;
  }
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { location, priceMin, priceMax, bedrooms } = filters;

  const andConditions: Prisma.FlatWhereInput[] = [];

  // Filter by location
  if (location) {
    andConditions.push({
      location: {
        contains: location,
        mode: "insensitive",
      },
    });
  }

  // Filter by price range
  if (priceMin !== undefined || priceMax !== undefined) {
    andConditions.push({
      rentAmount: {
        gte: priceMin,
        lte: priceMax,
      },
    });
  }

  // Filter by number of bedrooms
  if (bedrooms) {
    andConditions.push({
      bedrooms: Number(bedrooms),
    });
  }

  const whereConditions: Prisma.FlatWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.flat.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      user: true,
      flatPhotos: true,
    },
  });

  const total = await prisma.flat.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
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
  const existingFlat = await prisma.flat.findUnique({
    where: { id },
  });

  if (!existingFlat) {
    throw new Error(`Flat with ID ${id} not found.`);
  }
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
  userId: string,
  payload: any
) => {
  await prisma.flat.findFirstOrThrow({
    where: {
      id,
      userId,
    },
  });

  const result = await prisma.flat.update({
    where: {
      id,
      userId,
    },
    data: payload,
  });
  return result;
};

const deleteFlatFromDB = async (id: string): Promise<Flat> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteFlat = await transactionClient.flat.delete({
      where: {
        id,
      },
    });

    await transactionClient.flatPhoto.deleteMany({
      where: {
        flatId: id,
      },
    });

    return deleteFlat;
  });
};

export const FlatService = {
  createFlatFromDB,
  getAllFlatFromDB,
  updateFlatDataIntoDB,
  updateMyFlatDataIntoDB,
  deleteFlatFromDB,
  getSingleFlatFromDB,
};
