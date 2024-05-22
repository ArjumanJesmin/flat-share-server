import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { FlatRoutes } from "../modules/flat/route";

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/flat",
    route: FlatRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
