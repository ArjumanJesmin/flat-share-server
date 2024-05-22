import { Flat, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import prisma from "../../../shared/prisma";

const createFlatFromDB = async (payload: Flat) => {
  const {
    location,
    description,
    rentAmount,
    bedrooms,
    amenities,
    flatUserId,
    userId,
  } = payload;

  const id = uuidv4();

  type TFlatId = {
    flatUserId: string | null;
  };
  // Create flat object
  const flatData: Prisma.FlatCreateInput = {
    id,
    location,
    description,
    rentAmount,
    bedrooms,
    amenities,
    flatUserId,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create flat in the database
  const createdFlat = await prisma.flat.create({
    data: flatData,
  });

  return createdFlat;
};
export const FlatService = {
  createFlatFromDB,
};
