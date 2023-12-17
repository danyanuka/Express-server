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
async function remove(bugId) {
  try {
    const idx = bugs.findIndex((bug) => bug._id === bugId);
    if (idx === -1) throw `Couldnt find bug with id:${bugId}`;
    bugs.splice(idx, 1);
    utilService.saveJsonFile(bugs, "./data/bugs.json");
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}
async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (idx === -1) throw `Couldnt find bug with id:${bugToSave._id}`;
      bugs.splice(idx, 1, bugToSave);
    } else {
      bugToSave._id = utilService.makeId();
      bugs.push(bugToSave);
    }
    utilService.saveJsonFile(bugs, "./data/bugs.json");
    return bugToSave;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

export const bugService = {
  query,
  getById,
  remove,
  save,
};
