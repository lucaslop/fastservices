import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

//variables
const routes = Router();
const upload = multer(multerConfig);

//controllers
import UserController from "./app/controllers/UserController";
import SessionsController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";

//midllewares
import authMiddelware from "./app/middlewares/auth";

//routes
routes.post("/users", UserController.store);
routes.post("/sessions", SessionsController.store);

//routes with auth
routes.use(authMiddelware);
routes.put("/users", UserController.update);
routes.post("/files", upload.single("file"), FileController.store);

export default routes;
