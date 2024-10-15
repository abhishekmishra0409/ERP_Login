import express from "express";
import cors from "cors";
import connectDB from "./Database/db.js";
import studentRoutes from "./Routes/studentRoutes.js";
import roleRoutes from "./Routes/roleRoutes.js";
import adminRoutes from "./Routes/adminRoute.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cloudinaryConfig from "./Database/cloudinaryConfig.js";
import fileUpload from "express-fileupload";


const app = express();
app.use(cookieParser());

//configs
connectDB();
cloudinaryConfig();

//middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175','http://localhost:5174'],
  methods: ['GET', 'POST','PUT','DELETE'],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(morgan("dev"));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

//routes
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", roleRoutes);

app.listen(8080, () => {
  console.log("listening on port 8080");
});

