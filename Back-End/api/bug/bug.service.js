import { utilService } from "../../services/util.service.js";
import { loggerService } from "../../services/logger.service.js";

let bugs = utilService.readJsonFile("./data/bugs.json");
const PAGE_SIZE = 4;

async function query(filterBy = {}) {
  let bugsToFilter = [...bugs];
  try {
    if (filterBy.text) {
      bugsToFilter = bugsToFilter.filter((bug) =>
        bug.title.toLowerCase().includes(filterBy.text.toLowerCase())
      );
    }

    if (filterBy.severity) {
      bugsToFilter = bugsToFilter.filter(
        (bug) => bug.severity === filterBy.severity
      );
    }

    if (filterBy.pageIdx) {
      const startIdx = filterBy.pageIdx * PAGE_SIZE;
      bugsToFilter = bugsToFilter.slice(startIdx, startIdx + PAGE_SIZE);
    }
    return bugsToFilter;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);
    if (!bug) throw `Couldnt find a bug with id: ${bugId}`;
    return bug;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}
async function remove(bugId, loggedinUser) {
  try {
    const idx = bugs.findIndex((bug) => bug._id === bugId);
    if (idx === -1) throw `Couldnt find bug with id:${bugId}`;

    console.log(loggedinUser);
    const bug = bugs[idx];
    if (!loggedinUser.isAdmin && bug.owner._id !== loggedinUser._id)
      throw "Not your bug";

    bugs.splice(idx, 1);
    utilService.saveJsonFile(bugs, "./data/bugs.json");
  } catch (err) {
    loggerService.error("CarService[Remove] : ", err);
    throw err;
  }
}
async function save(bugToSave, loggedinUser) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (idx === -1) throw `Couldnt find bug with id:${bugToSave._id}`;

      const bug = bugs[idx];
      if (bug.owner._id !== loggedinUser._id) throw "Not your bug";

      const updatedBug = { ...bug, ...bugToSave };
      bugs.splice(idx, 1, updatedBug);
      utilService.saveJsonFile(bugs, "./data/bugs.json");
      return updatedBug;
    } else {
      bugToSave._id = utilService.makeId();
      bugToSave.createdAt = Date.now();
      bugToSave.owner = loggedinUser;
      bugs.push(bugToSave);
      utilService.saveJsonFile(bugs, "./data/bugs.json");
      return bugToSave;
    }
  } catch (err) {
    loggerService.error("CarService[save] : ", err);
    throw err;
  }
}

export const bugService = {
  query,
  getById,
  remove,
  save,
};
