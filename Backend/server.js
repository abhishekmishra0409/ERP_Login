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
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5175',
      'http://localhost:5174',
      'https://erp-login-wheat.vercel.app',
      'http://erp-login-wheat.vercel.app',
      'https://erp-login-abhishekmishra0409s-projects.vercel.app',
      'https://erp-login-git-main-abhishekmishra0409s-projects.vercel.app',
      'https://erp-login.onrender.com'

    ];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use((req, res, next) => {
console.log(`Request URL: ${req.url}`);
console.log(`Request Method: ${req.method}`);
console.log(`Request Origin: ${req.headers.origin}`);
next();
});


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

