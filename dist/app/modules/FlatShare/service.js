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
exports.FlatShareRequestServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const createFlatRequestIntoDB = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Creating flat share request for user:", userId);
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });
    const { contactInfo, additionalInfo, flatId } = payload;
    const flatData = {
        contactInfo,
        additionalInfo,
        status: client_1.RequestStatus.PENDING,
        flatId,
        userId: userInfo.id,
        createdAt: new Date(),
    };
    console.log("Flat data to be inserted:", flatData);
    const result = yield prisma_1.default.flatShareRequest.create({
        data: flatData,
        include: {
            user: true,
            flat: true,
        },
    });
    return result;
});
const getAllFlatRequestDataFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flatShareRequest.findMany({
        where: {
            userId,
        },
        include: {
            flat: true,
        },
    });
    return result;
});
exports.FlatShareRequestServices = {
    createFlatRequestIntoDB,
    getAllFlatRequestDataFromDB,
};
