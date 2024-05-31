import express from "express";
import { FlatController } from "./controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  FlatController.createFlatFromDB
);

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPER_ADMIN),
  FlatController.getAllFlatFromDB
);
router.get(
  "/getSingleFlat/:id",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.SUPER_ADMIN),
  FlatController.getSingleFlat
);

router.patch(
  "/updateFLat/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  FlatController.updateFlat
);

router.patch(
  "/updateMyFLat/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER),
  FlatController.updateMyFlat
);

router.delete(
  "/deleteFlat/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  FlatController.deleteFlat
);

export const FlatRoutes = router;
