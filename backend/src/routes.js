import { Router } from "express";
const routes = Router();

import UserController from "./app/controllers/UserController";

import SessionsController from "./app/controllers/SessionController";

import authMiddelware from "./app/middlewares/auth";

routes.post("/users", UserController.store);
routes.post("/sessions", SessionsController.store);

routes.put("/users", authMiddelware, UserController.update);
export default routes;
