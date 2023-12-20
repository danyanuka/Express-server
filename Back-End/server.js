import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
// Local Modules

const app = express();
// Config

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// if(process.env.NODE_ENV)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve("public")));
} else {
  const corsOptions = {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

import { bugRoutes } from "./api/bug/bug.routes.js";
import { userRoutes } from "./api/user/user.routes.js";
import { authRoutes } from "./api/auth/auth.routes.js";

app.use("/api/bug", bugRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/**", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log("Server ready at port 3030"));
