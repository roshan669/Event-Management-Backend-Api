import db from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "../.env",
});

app.listen(5000 || 8000, () => {
  console.log(` Server is running at port 5000`);
});
