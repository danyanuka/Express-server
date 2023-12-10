import { storageService } from "../async-storage.service.js";
import { utilService } from "../util.service.js";

const STORAGE_KEY = "userDB";
_createUsers();

export const userService = {
  query,
  getById,
  save,
  remove,
};

function query() {
  return storageService.query(STORAGE_KEY);
}
function getById(bugId) {
  return storageService.get(STORAGE_KEY, bugId);
}
function remove(bugId) {
  return storageService.remove(STORAGE_KEY, bugId);
}
function save(bug) {
  if (bug._id) {
    return storageService.put(STORAGE_KEY, bug);
  } else {
    return storageService.post(STORAGE_KEY, bug);
  }
}

function _createUsers() {
  let users = utilService.loadFromStorage(STORAGE_KEY);
  if (!users || !users.length) {
    users = [
      {
        _id: "u108",
        fullname: "Dan Yanuka",
        username: "dan123",
        password: "0192Dan",
        score: 100,
      },
      {
        _id: "u109",
        fullname: "Nitzan shemo",
        username: "nitz0192",
        password: "nitznitz2023",
        score: 20,
      },
      {
        _id: "u102",
        fullname: "Dan Cohen",
        username: "dan123456",
        password: "0192Dani",
        score: 50,
      },
      {
        _id: "u103",
        fullname: "Eli Levi",
        username: "eli123",
        password: "1e2l3i",
        score: 200,
      },
    ];
    utilService.saveToStorage(STORAGE_KEY, users);
  }
}
