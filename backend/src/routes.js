import { Router } from "express";
const routes = Router();

import UserController from "./app/controllers/UserController";

import SessionsController from "./app/controllers/SessionController";

import authMiddelware from "./app/middlewares/auth";

routes.post("/users", UserController.store);
routes.put("/users", authMiddelware, UserController.update);

routes.post("/sessions", SessionsController.store);

export default routes;
