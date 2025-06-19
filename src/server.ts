import http from "http";
import { createApp } from "./app";
import { initializeDatabase } from "./database/databaseSource";
import { createAedesServer } from "./mqtt/mqttServer";

const startServer = async () => {
  await initializeDatabase();

  const app = createApp();
  const httpServer = http.createServer(app);
  const PORT = process.env.PORT || 5000;

  // Setup Aedes MQTT server
  createAedesServer();

  httpServer.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

