"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const user_utils_1 = require("./user.utils");
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashPassword = yield (0, user_utils_1.hashedPassword)(payload.password);
    const userData = {
        email: payload.email,
        password: hashPassword,
        role: client_1.UserRole.ADMIN,
    };
    const existingUser = yield prisma_1.default.admin.findFirst({
        where: {
            OR: [{ email: payload.email }, { username: payload.username }],
        },
    });
    if (existingUser) {
        throw new Error("User with the same email or username already exists");
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.user.create({
            data: userData,
        });
        const createdAdminData = yield transactionClient.admin.create({
            data: payload,
            select: {
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return createdAdminData;
    }));
    return result;
});
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashPassword = yield (0, user_utils_1.hashedPassword)(payload.password);
    const userData = {
        email: payload.email,
        password: hashPassword,
        role: client_1.UserRole.USER,
    };
    const existingUser = yield prisma_1.default.flatUser.findFirst({
        where: {
            OR: [{ email: payload.email }, { username: payload.username }],
        },
    });
    if (existingUser) {
        throw new Error("User with the same email or username already exists");
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.user.create({
            data: userData,
        });
        const createdFlatUserData = yield transactionClient.flatUser.create({
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
    }));
    return result;
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
        },
    });
    let profileInfo;
    if ((userInfo === null || userInfo === void 0 ? void 0 : userInfo.role) === client_1.UserRole.SUPER_ADMIN) {
        profileInfo = yield prisma_1.default.admin.findUnique({
            where: {
                email: user === null || user === void 0 ? void 0 : user.email,
            },
        });
    }
    else if ((userInfo === null || userInfo === void 0 ? void 0 : userInfo.role) === client_1.UserRole.ADMIN) {
        profileInfo = yield prisma_1.default.admin.findUnique({
            where: {
                email: user === null || user === void 0 ? void 0 : user.email,
            },
        });
    }
    else if ((userInfo === null || userInfo === void 0 ? void 0 : userInfo.role) === client_1.UserRole.USER) {
        profileInfo = yield prisma_1.default.flatUser.findUnique({
            where: {
                email: user === null || user === void 0 ? void 0 : user.email,
            },
        });
    }
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany({
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
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
});
const editProfileIntoDB = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(email);
    const isExistInUser = yield prisma_1.default.flatUser.findUniqueOrThrow({
        where: {
            email,
        },
        select: {
            email: true,
        },
    });
    const isExistInAdmin = yield prisma_1.default.admin.findUnique({
        where: {
            email,
        },
    });
    if (isExistInUser && !isExistInAdmin) {
        const updateUser = yield prisma_1.default.user.update({
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
        return yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
            const updateUser = yield transactionClient.user.update({
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
            yield transactionClient.admin.update({
                where: {
                    email,
                },
                data: payload,
            });
            return updateUser;
        }));
    }
});
const changeUserRole = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
        select: {
            email: true,
        },
    });
    return yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const updateUser = yield transactionClient.user.update({
            where: {
                id: userId,
            },
            data: {
                role: status.role,
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
        const isExistInAdmin = yield prisma_1.default.admin.findFirst({
            where: {
                email: result.email,
            },
            select: {
                username: true,
                email: true,
            },
        });
        if (!isExistInAdmin && status.role === "ADMIN") {
            yield transactionClient.admin.create({
                data: {
                    email: result.email,
                    username: `admin_${userId}`,
                    password: "defaultPassword",
                },
            });
        }
        else if (isExistInAdmin && status.role === "USER") {
            yield transactionClient.admin.delete({
                where: {
                    email: result.email,
                },
            });
        }
        return updateUser;
    }));
});
const changeProfileStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const updateUserStatus = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: status,
    });
    return updateUserStatus;
});
exports.UserServices = {
    createAdmin,
    createUser,
    getMyProfile,
    getAllUsers,
    editProfileIntoDB,
    changeUserRole,
    changeProfileStatus,
};
