import express from "express";
import { getJoke } from "../controllers/externalController.js";
import { apiLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.get("/joke", apiLimiter, getJoke);

export default router;
