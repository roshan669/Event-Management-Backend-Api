import express from "express";

const app = express();

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//routes import
import eventRouter from "./routes/event.routes.js";
import userRouter from "./routes/user.routes.js";
// routes declaration
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/users", userRouter);
export { app };
