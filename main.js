import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Connection from "./src/database/connection.js";
import Authrouter from "./src/routes/auth.route.js";
import adminRouter from "./src/routes/admin.route.js";
import clientRouter from "./src/routes/client.route.js";
import technicionRouter from "./src/routes/technicion.route.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const swaggerFile = JSON.parse(
  fs.readFileSync("./swagger-output.json", "utf-8")
);

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1", Authrouter);
app.use("/api/v2", adminRouter);
app.use("/api/v2", clientRouter);
app.use("/api/v2", technicionRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (req, res) => {
  res.send("API is working.....");
});

const port = process.env.PORT || 7000;

Connection().then(() => {
  app.listen(port, () => {
    console.log(`Server is running.... on ${port}`);
  });
}).catch((error) => {
  console.error("Failed to connect to the database:", error);
});
