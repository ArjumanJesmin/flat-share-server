import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-admin",
  // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.createAdmin
);

router.post(
  "/create-user",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.createUser
);

router.get(
  "/me",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getMyProfile
);
router.get("/users", UserController.getAllUsers);

export const userRoutes = router;
