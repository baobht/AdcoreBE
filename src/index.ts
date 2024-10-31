require("dotenv").config();
import express from "express";
import cors from "cors";
import customRouter from "./routes"
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Init db
require("./utils/init.mongodb");
//Init routes
app.use("", customRouter);
app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
