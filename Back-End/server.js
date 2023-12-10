import express from "express";
import cors from "cors";
// Local Modules

const app = express();
// Config
const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

// app.get("/", (req, res) => res.send("Hello there"));
app.listen(3030, () => console.log("Server ready at port 3030"));

import { bugRoutes } from "./api/bug/bug.routes.js";

app.use("/api/bug", bugRoutes);

// Get All
// app.get("/api/bug", async (req, res) => {
//   try {
//     let filterBy = {
//       text: req.query.text || "",
//       severity: +req.query.severity || 0,
//       pageIdx: req.query.pageIdx || undefined,
//     };
//     const bugs = await bugService.query(filterBy);
//     res.send(bugs);
//   } catch (err) {
//     res.status(400).send("Failed to get bugs");
//   }
// });

// app.post("/api/bug", async (req, res) => {
//   const { title, description, severity, labels } = req.body;
//   const createdAt = new Date().getTime();
//   const bugToSave = {
//     title,
//     description,
//     severity: +severity,
//     labels,
//     createdAt,
//   };
//   try {
//     const savedBug = await bugService.save(bugToSave);
//     res.send(savedBug);
//   } catch (err) {
//     res.status(400).send("Could't save bug");
//   }
// });

// Update
// app.put("/api/bug/:bugId", async (req, res) => {
//   const { bugId } = req.params;
//   const { title, description, severity, labels, createdAt } = req.body;
//   const bugToSave = {
//     _id: bugId,
//     title,
//     description,
//     severity: +severity,
//     labels,
//     createdAt,
//   };
//   try {
//     const savedBug = await bugService.save(bugToSave);
//     res.send(savedBug);
//   } catch (err) {
//     res.status(400).send("Could't save bug");
//   }
// });

// Get By ID
// app.get("/api/bug/:bugId", async (req, res) => {
//   const { bugId } = req.params;
//   try {
//     const bug = await bugService.getById(bugId);
//     res.send(bug);
//   } catch (err) {
//     res.status(400).send("Couldnt get bug");
//   }
// });

// Delete
// app.delete("/api/bug/:bugId", async (req, res) => {
//   const { bugId } = req.params;
//   try {
//     await bugService.remove(bugId);
//     res.send("Bug Deleted");
//   } catch (err) {
//     res.status(400).send("Couldt remove bug");
//   }
// });
