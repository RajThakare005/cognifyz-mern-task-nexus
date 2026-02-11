import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandlers.js";
import { apiLimiter } from "./middleware/rateLimiters.js";
import authRoutes from "./routes/authRoutes.js";
import externalRoutes from "./routes/externalRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import webRoutes from "./routes/webRoutes.js";
import { startJobWorker } from "./services/jobQueue.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", webRoutes);
app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/external", externalRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    startJobWorker();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("DB connection failed", error.message);
    process.exit(1);
  });
