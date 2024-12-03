import express, { Router } from "express";
import user from "./route/user";
const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/api/v1/", user);

app.listen(PORT, () => {
  console.log("server is connect to the Port : 3000");
});
