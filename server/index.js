import express from "express";
import fs from "fs";
import cors from "cors";
import { getAuth, registerUser } from "./controllers/users.js";
import { getUserTasks, updateTasks } from "./controllers/tasks.js";

const server = express();
server.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3001/"],
    optionsSuccessStatus: 200,
  })
);
server.use(express.json());

const PORT = 5000;
server.post("/login", getAuth);
server.post("/register", registerUser);
server.post("/update-tasks", updateTasks);
server.get("/get-tasks", getUserTasks);

server.listen(PORT, () => {
  console.log(`server is running on ${PORT} port`);
});

