import { Router } from "express";

const routes = new Router();
import UserController from "./app/controllers/userController";
import SessionController from "./app/controllers/SessionController";
import authMiddleware from "./app/middlewares/auth";
routes.put("/users", authMiddleware, UserController.up);
routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

export default routes;
