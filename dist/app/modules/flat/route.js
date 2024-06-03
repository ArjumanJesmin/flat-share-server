"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER), controller_1.FlatController.createFlatFromDB);
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER, client_1.UserRole.SUPER_ADMIN), controller_1.FlatController.getAllFlatFromDB);
router.get("/getSingleFlat/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER, client_1.UserRole.SUPER_ADMIN), controller_1.FlatController.getSingleFlat);
router.patch("/updateFLat/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER), controller_1.FlatController.updateFlat);
router.patch("/updateMyFLat/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER), controller_1.FlatController.updateMyFlat);
router.delete("/deleteFlat/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), controller_1.FlatController.deleteFlat);
exports.FlatRoutes = router;
