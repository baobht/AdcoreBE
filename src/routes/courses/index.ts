"use strict";
import { createCourse, deleteCourse, getCourses } from "../../controllers/course.controller";
import { Router } from "express";

const router = Router();

router.get("/courses", getCourses);
router.post("/delete-course/:id", deleteCourse);
router.post("/create-course", createCourse);

export default router;
