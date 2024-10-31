import express from "express";

const app = express();

const port = 3000;
const dfd = require("danfojs-node");

app
  .get("/", async (req, res) => {
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
