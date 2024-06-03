"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const auth_routes_1 = require("../modules/auth/auth.routes");
const route_1 = require("../modules/flat/route");
const route_2 = require("../modules/FlatShare/route");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/user",
        route: user_route_1.userRoutes,
    },
    {
        path: "/flat",
        route: route_1.FlatRoutes,
    },
    {
        path: "/flatShare",
        route: route_2.FlatShareRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
