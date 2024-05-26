import express from "express";

import { UserRole } from "@prisma/client";
import { FlatShareRequestController } from "./controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPER_ADMIN),
  FlatShareRequestController.createFlatRequest
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPER_ADMIN),
  FlatShareRequestController.getAllFlatRequestData
);
router.get(
  "/getSingleFlatRequest/:id",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPER_ADMIN),
  FlatShareRequestController.getSingleFlatRequestData
);

export const FlatShareRoutes = router;
