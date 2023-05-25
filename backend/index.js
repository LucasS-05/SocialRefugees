import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";

import { users, group } from "./mockData.js";
import User from "./models/User.js";
import Group from "./models/Group.js";

import path from "path";
import { fileURLToPath } from "url";

import { register } from "./controllers/auth.js";
import { createGroup } from "./controllers/groups.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import groupRoutes from "./routes/groups.js";
import { verifyToken } from "./middlewares/auth.js";

/* CONFIG */

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Express config */

const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(helmet());
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "32mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "32mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* File storage */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
/* Routes with files */
app.post("/auth/register", upload.single("picture"), register);
app.post("/groups", verifyToken, upload.single("picture"), createGroup);

/* Routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/groups", groupRoutes);

/* Mongoose Setup */

const PORT = process.env.PORT || 4001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    //DO NOT UNCOMMENT
    // User.insertMany(users);
    // Group.insertMany(group);
  })
  .catch((error) => console.log(`${error} did not connect`));
