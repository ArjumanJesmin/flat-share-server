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
exports.FlatService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createFlatFromDB = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract flatPhotos from req.body
        const { location, description, rentAmount, bedrooms, flatPhotos, amenities, } = payload;
        const photos = Array.isArray(flatPhotos) ? flatPhotos : [];
        // Validate that all required fields are present
        if (!location || !description || !rentAmount || !bedrooms || !amenities) {
            throw new Error("One or more required fields are missing or invalid");
        }
        const createdFlat = yield prisma_1.default.flat.create({
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
    }
    catch (error) {
        console.error("Error creating flat:", error);
        throw error;
    }
});
const getAllFlatFromDB = (user, filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { location, priceMin, priceMax, bedrooms } = filters;
    const andConditions = [];
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.flat.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: "desc" },
        include: {
            user: true,
            flatPhotos: true,
        },
    });
    const total = yield prisma_1.default.flat.count({
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
});
const getSingleFlatFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flat.findFirstOrThrow({
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
});
const updateFlatDataIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.flat.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const updateMyFlatDataIntoDB = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.flat.findFirstOrThrow({
        where: {
            id,
            userId,
        },
    });
    const result = yield prisma_1.default.flat.update({
        where: {
            id,
            userId,
        },
        data: payload,
    });
    return result;
});
const deleteFlatFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.flatPhoto.deleteMany({
        where: {
            flatId: id,
        },
    });
    // Then delete the Flat record
    yield prisma_1.default.flat.delete({
        where: {
            id,
        },
    });
    console.log("Flat deleted successfully");
    return { success: true, message: "Flat deleted successfully" };
});
exports.FlatService = {
    createFlatFromDB,
    getAllFlatFromDB,
    updateFlatDataIntoDB,
    updateMyFlatDataIntoDB,
    deleteFlatFromDB,
    getSingleFlatFromDB,
};
