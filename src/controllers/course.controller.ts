import { Request, Response } from "express";
import courseModel from "../models/course.model";
import path from "path";
import axios from "axios";
import fs from "fs";

const downloadFile = async (url: string): Promise<string> => {
  const filePath = path.join(__dirname, "../../data.csv");

  // Check if file already exists
  if (fs.existsSync(filePath)) {
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

export async function getCourses(req: Request, res: Response): Promise<any> {
  let filter = {};
  const { isTopRated, search, page = 1, limit = 12 } = req.query;
  const itemsPerPage = parseInt(limit as string, 10);
  const skip = (parseInt(page as string, 10) - 1) * itemsPerPage;

  const totalCourses = await courseModel.countDocuments();
  console.log("🚀 ~ getCourses ~ totalCourses:", totalCourses)

  if (search) {
    const regex = new RegExp(req.query.search as string, "i"); // Case-insensitive search
    filter = {
      $or: [
        { title: regex },
        { categories: { $elemMatch: { $regex: regex } } },
      ],
    };
  }
  const courses = await courseModel.find();
  console.log("🚀 ~ getCourses ~ courses:", courses)

  if (courses.length) {
    if (isTopRated) {
      const topRatedCourses = await courseModel
        .find(filter)
        .sort({ rating: -1 })
        .limit(6);
      return res.status(200).json({
        totalCourses,
        data: topRatedCourses,
      });
    }
    return res.status(200).json({
      totalCourses,
      data: await courseModel.find(filter).limit(itemsPerPage).skip(skip),
    });
  } else {
    const dfd = (await import("danfojs-node")).default;

    const filePath = await downloadFile(
      "https://my.api.mockaroo.com/courses?key=0ca20010"
    );

    const dataFrame = await dfd.readCSV(filePath);
    const coursesJson = await dfd.toJSON(dataFrame);
    await courseModel.insertMany(coursesJson);

    if (isTopRated) {
      const topRatedCourses = await courseModel
        .find(filter)
        .sort({ rating: -1 }) // Sort by rating in descending order
        .limit(6); // Limit to 6 top-rated courses
      return res.status(200).json({
        totalCourses: await courseModel.countDocuments(),
        data: topRatedCourses,
      });
    }

    return res.status(200).json({
      totalCourses: await courseModel.countDocuments(),
      data: await courseModel.find(filter).limit(itemsPerPage).skip(skip),
    });
  }
}

export async function deleteCourse(req: Request, res: Response): Promise<any> {
  const id = req.params.id;
  try {
    await courseModel.deleteOne({
      _id: id,
    });
    return res.status(200).json({ message: "Delete course successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Delete course failed" });
  }
}

export async function createCourse(req: Request, res: Response): Promise<any> {
  const { title, categories, price, rating, cover_img } = req.body;
  try {
    const courseCreated = await courseModel.create({
      title,
      categories,
      price,
      rating,
      cover_image: cover_img,
    });
    return res
      .status(200)
      .json({ id: courseCreated._id, message: "Create course successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Create course failed" });
  }
}
