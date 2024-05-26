import { Admin, User, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { hashedPassword } from "./user.utils";
import { IAuthUser } from "../../../interfaces/common";

const createAdmin = async (payload: {
  username: string;
  email: string;
  password: string;
}) => {
  const hashPassword = await hashedPassword(payload.password);
  const userData = {
    email: payload.email,
    password: hashPassword,
    role: UserRole.ADMIN,
  };

  const existingUser = await prisma.admin.findFirst({
    where: {
      OR: [{ email: payload.email }, { username: payload.username }],
    },
  });

  if (existingUser) {
    throw new Error("User with the same email or username already exists");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: payload,
      select: {
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return createdAdminData;
  });

  return result;
};

const createUser = async (payload: {
  username: string;
  email: string;
  password: string;
}) => {
  const hashPassword = await hashedPassword(payload.password);
  const userData = {
    email: payload.email,
    password: hashPassword,
    role: UserRole.USER,
  };

  const existingUser = await prisma.flatUser.findFirst({
    where: {
      OR: [{ email: payload.email }, { username: payload.username }],
    },
  });

  if (existingUser) {
    throw new Error("User with the same email or username already exists");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdFlatUserData = await transactionClient.flatUser.create({
      data: payload,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return createdFlatUserData;
  });

  return result;
};

const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
    },
  });

  let profileInfo;

  if (userInfo?.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: user?.email,
      },
    });
  } else if (userInfo?.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: user?.email,
      },
    });
  } else if (userInfo?.role === UserRole.USER) {
    profileInfo = await prisma.flatUser.findUnique({
      where: {
        email: user?.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};
const getAllUsers = async () => {
  try {
    const users = await prisma.flatUser.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const UserServices = {
  createAdmin,
  createUser,
  getMyProfile,
  getAllUsers,
};
