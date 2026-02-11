import express from "express";
import { renderHome, submitForm } from "../controllers/webController.js";

const router = express.Router();

router.get("/", renderHome);
router.post("/submit", submitForm);

export default router;
