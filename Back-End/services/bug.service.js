import { utilService } from "./util.service.js";

const bugs = utilService.readJsonFile("./data/bugs.json");

async function query() {
  try {
    return bugs;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);
    if (!bug) throw `Couldnt find a bug with id: ${bugId}`;
    return bug;
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
    console.log(err);
    throw err;
  }
}

export const bugService = {
  query,
  getById,
  remove,
  save,
};
