import { Request, Response } from "express";
import courseModel from "../models/course.model";
import path from "path";
import axios from "axios";
import fs from "fs";

const downloadFile = async (url: string): Promise<string> => {
  const filePath = path.join(__dirname, "../../data.csv");

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log("File already exists:", filePath);
    return filePath; // Skip downloading if file exists
  }
  const writer = fs.createWriteStream(filePath);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
};

export async function getCourses(req: Request, res: Response) {
  let filter = {};
  if (req.query.search) {
    const regex = new RegExp(req.query.search as string, "i"); // Case-insensitive search
    filter = {
      $or: [{ title: regex }],
    };
  }
  const courses = await courseModel.find(filter);

  if (courses.length) {
    res.status(200).json({
      data: courses,
    });
  } else {
    const dfd = (await import("danfojs-node")).default;

    const filePath = await downloadFile(
      "https://my.api.mockaroo.com/courses?key=0ca20010"
    );

    const dataFrame = await dfd.readCSV(filePath);
    const coursesJson = await dfd.toJSON(dataFrame);
    await courseModel.insertMany(coursesJson);
    res.status(200).json({
      data: await courseModel.find(filter),
    });
  }
}
