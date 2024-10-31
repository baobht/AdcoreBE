"use strict";
import { Router } from "express";
import coursesRouter from "./courses"

const router = Router();

router.use("/v1/api", coursesRouter);

export default router;
