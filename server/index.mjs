import express from "express";
import { Model } from "./Model.mjs";
import { genCrudRouter } from "./genCrudRouter.mjs";

const app = express();
const port = 3000;
const logger = console.log;
const debug = true;

app.use((req, res, next) => {
  if (debug) {
    logger(`Logging requests: ${req.url}, ${req.method}`);
  }
  next();
});

const students = new Model("students");
const stuRouter = genCrudRouter(students);
app.use("/student", stuRouter);

const courses = new Model("courses");
const courseRouter = genCrudRouter(courses);
app.use("/course", courseRouter);

app.listen(port, () => {
  logger(`server started on host/3000`);
});

export { app };
