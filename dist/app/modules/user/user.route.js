"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/create-admin", 
// auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
user_controller_1.UserController.createAdmin);
router.post("/create-user", user_controller_1.UserController.createUser);
router.get("/me", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), user_controller_1.UserController.getMyProfile);
router.get("/users", user_controller_1.UserController.getAllUsers);
router.patch("/editProfile", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.USER), user_controller_1.UserController.editProfile);
router.patch("/:id/status", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), user_controller_1.UserController.changeProfileStatus);
exports.userRoutes = router;
