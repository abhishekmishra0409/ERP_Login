import express from "express";
import cors from "cors";
import connectDB from "./Database/db.js";
import studentRoutes from "./Routes/studentRoutes.js";
import teacherRoutes from "./Routes/teacherRoutes.js";
import adminRoutes from "./Routes/adminRoute.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

connectDB();

//middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(morgan("dev"));

//routes
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);

app.listen(8080, () => {
  console.log("listening on port 8080");
});

