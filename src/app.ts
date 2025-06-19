import express from "express";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";

import authRoutes from "./auth/authRoutes";
import roomRoutes from "./room/roomRoutes";
import devicesRoutes from "./devices/devicesRoutes";
import { authenticate } from "./middleware/authMiddleware";

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Remove X-Powered-By header
  app.disable("x-powered-by");

  // Routes
  app.use("/auth", authRoutes);
  //@ts-ignore
  app.use("/rooms", authenticate, roomRoutes);
  //@ts-ignore
  app.use("/devices", authenticate, devicesRoutes);

  // Health check ('cause why not?)
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
  });

  return app;
};
