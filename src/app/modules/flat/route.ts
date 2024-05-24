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

router.get("/", FlatController.getAllFlatFromDB);

export const FlatRoutes = router;
