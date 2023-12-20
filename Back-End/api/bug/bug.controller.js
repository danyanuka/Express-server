import { authService } from "../auth/auth.service.js";
import { bugService } from "./bug.service.js";

// lIST-----LIST-----lIST-----LIST-----lIST-----LIST-----lIST-----LIST-----lIST-----LIST-----lIST-----LIST-----lIST-----LIST-----LIST
export async function getBugs(req, res) {
  try {
    let filterBy = {
      text: req.query.text || "",
      severity: +req.query.severity || 0,
      pageIdx: req.query.pageIdx || undefined,
    };
    // console.log(filterBy);

    const bugs = await bugService.query(filterBy);
    res.send(bugs);
  } catch (err) {
    res.status(400).send("Failed to get bugs");
  }
}

// GetByID-----GetByID-----GetByID-----GetByID-----GetByID-----GetByID-----GetByID-----GetByID-----GetByID-----GetByID-----GetByID-----GetByID
export async function getBug(req, res) {
  const { bugId } = req.params;

  let visitedBugs = [...(req.cookies.visitedBugs || []), bugId];
  console.log("User visited :", visitedBugs);
  try {
    const bug = await bugService.getById(bugId);
    res.cookie("visitedBugs", visitedBugs, { maxAge: 1000 * 7 });
    if (visitedBugs.length > 3) {
      throw new Error("Wait 7 seconds to view more bugs");
    }
    res.send(bug);
  } catch (err) {
    if (err.message === "Wait 7 seconds to view more bugs") {
      res.status(401).send(err.message);
    } else {
      res.status(400).send("Couldn't get bug by ID");
    }
  }
}

// POST-----POST-----POST-----POST-----POST-----POST-----POST-----POST-----POST-----POST-----POST-----POST
export async function addBug(req, res) {
  const { title, description, severity, labels } = req.body;

  const bugToSave = {
    title,
    description,
    severity: +severity,
    labels,
  };
  try {
    const savedBug = await bugService.save(bugToSave, req.loggedinUser);
    res.send(savedBug);
  } catch (err) {
    res.status(400).send("Could't save bug" + err);
  }
}

// UPDATE-----UPDATE-----UPDATE-----UPDATE-----UPDATE-----UPDATE-----UPDATE-----UPDATE-----UPDATE-----UPDATE-----UPDATE-----UPDATE
export async function updateBug(req, res) {
  const { bugId } = req.params;
  const { severity } = req.body;
  const bugToSave = {
    _id: bugId,
    severity: +severity,
  };
  try {
    const savedBug = await bugService.save(bugToSave, req.loggedinUser);
    res.send(savedBug);
  } catch (err) {
    res.status(400).send("Could't save bug" + err);
  }
}

// DELETE-----DELETE-----DELETE-----DELETE-----DELETE-----DELETE-----DELETE-----DELETE-----DELETE-----DELETE-----DELETE-----DELETE
export async function removeBug(req, res) {
  const { bugId } = req.params;

  try {
    await bugService.remove(bugId, req.loggedinUser);
    res.send("Bug Deleted");
  } catch (err) {
    res.status(400).send("Couldt remove bug " + err);
  }
}
