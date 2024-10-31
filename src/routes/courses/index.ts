"use strict";
import { getCourses } from "../../controllers/course.controller";
import { Router } from "express";

const router = Router();

router.get("/courses", getCourses);

export default router;
