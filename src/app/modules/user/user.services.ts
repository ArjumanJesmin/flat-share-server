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
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        needPasswordChange: true,
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

const editProfileIntoDB = async (
  email: string,
  payload: { username?: string; email?: string }
) => {
  console.log(email);
  const isExistInUser = await prisma.flatUser.findUniqueOrThrow({
    where: {
      email,
    },
    select: {
      email: true,
    },
  });

  const isExistInAdmin = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  if (isExistInUser && !isExistInAdmin) {
    const updateUser = await prisma.user.update({
      where: {
        email,
      },
      data: payload,
      select: {
        id: true,
        email: true,
        role: true,
        needPasswordChange: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updateUser;
  }
  if (!!isExistInAdmin && !!isExistInUser) {
    return await prisma.$transaction(async (transactionClient) => {
      const updateUser = await transactionClient.user.update({
        where: {
          email,
        },
        data: payload,
        select: {
          id: true,
          email: true,
          role: true,
          needPasswordChange: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await transactionClient.admin.update({
        where: {
          email,
        },
        data: payload,
      });

      return updateUser;
    });
  }
};

const changeUserRole = async (userId: any, status: { role: UserRole }) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  return await prisma.$transaction(async (transactionClient) => {
    const updateUser = await transactionClient.user.update({
      where: {
        id: userId,
      },
      data: {
        role: status.role as UserRole,
      },
      select: {
        id: true,
        email: true,
        role: true,
        needPasswordChange: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const isExistInAdmin = await prisma.admin.findFirst({
      where: {
        email: result.email,
      },
      select: {
        username: true,
        email: true,
      },
    });

    if (!isExistInAdmin && status.role === "ADMIN") {
      await transactionClient.admin.create({
        data: {
          email: result.email,
          username: `admin_${userId}`,
          password: "defaultPassword",
        },
      });
    } else if (isExistInAdmin && status.role === "USER") {
      await transactionClient.admin.delete({
        where: {
          email: result.email,
        },
      });
    }

    return updateUser;
  });
};

const changeProfileStatus = async (id: any, status: UserRole) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

export const UserServices = {
  createAdmin,
  createUser,
  getMyProfile,
  getAllUsers,
  editProfileIntoDB,
  changeUserRole,
  changeProfileStatus,
};
