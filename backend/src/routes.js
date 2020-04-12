import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

const routes = new Router();
const upload = multer(multerConfig);

import UserController from "./app/controllers/userController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import ProviderController from "./app/controllers/ProviderController";
import AppointmentsController from "./app/controllers/AppointmentsController";
import authMiddleware from "./app/middlewares/auth";

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);
routes.put("/users", UserController.up);
routes.post("/files", upload.single("file"), FileController.store);
routes.get("/providers", ProviderController.index);
routes.post("/appointments", AppointmentsController.store);
routes.get("/appointments", AppointmentsController.index);

export default routes;
