require("dotenv").config();
import express from "express";
import cors from "cors";

const app = express();

const port = 3000;
app.use(express.json());
app.use(cors())
app.use(
  express.urlencoded({
    extended: true,
  })
);
const dfd = require("danfojs-node");

app
  .get("/", async (req, res) => {
    // console.log("🚀 ~ .get ~ req:", req)
    // const dataFrame = await dfd.readCSV("./courses.csv");
    // const json = await dfd.toJSON(dataFrame);
    // console.log("🚀 ~ normalizeAndSaveData ~ json:", json);
    res.send({
      message: "Hello, World!",
      // data: json,
    });
  })
  .get("/random", (req, res) => {
    res.send({
      number: Math.floor(Math.random() * 100),
    });
  });

app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
