import express from "express";
import cors from "cors";
// Local Modules
import { bugService } from "./services/bug.service.js";
import { utilService } from "./services//util.service.js";

const app = express();
const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

app.get("/", (req, res) => res.send("Hello there"));
app.listen(3030, () => console.log("Server ready at port 3030"));

// Get All
app.get("/api/bugs", async (req, res) => {
  try {
    const bugs = await bugService.query();
    res.send(bugs);
  } catch (err) {
    res.status(400).send("Failed to get bugs");
  }
});

// Save(Post,Put)
app.get("/api/bugs/save", async (req, res) => {
  const bugToSave = utilService.queryToObject(req.query);
  try {
    const savedBug = await bugService.save(bugToSave);
    res.send(savedBug);
  } catch (err) {
    res.status(400).send("Could't save bug");
  }
});

// Get By ID
app.get("/api/bugs/:bugId", async (req, res) => {
  const { bugId } = req.params;
  try {
    const bug = await bugService.getById(bugId);
    res.send(bug);
  } catch (err) {
    res.status(400).send("Couldnt get bug");
  }
});

// Remove
app.get("/api/bugs/:bugId/remove", async (req, res) => {
  const { bugId } = req.params;
  try {
    await bugService.remove(bugId);
    res.send("Bug Deleted");
  } catch (err) {
    res.status(400).send("Couldt remove bug");
  }
});
