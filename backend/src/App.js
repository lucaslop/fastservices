import express from "express";
import routes from "./routes";
import path from "path";
import mongoose from "mongoose";
import "./database";
class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.mongo();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );
  }
  routes() {
    this.server.use(routes);
  }
  mongo() {
    this.mongoConnection = mongoose.connect(
      "mongodb://localhost:27017/fastservice",
      {
        useNewUrlParser: true,
        useFindAndModify: true
      }
    );
  }
}
export default new App().server;
