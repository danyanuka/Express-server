import { utilService } from "../../services/util.service.js";
import { loggerService } from "../../services/logger.service.js";
import { authService } from "../auth/auth.service.js";

let users = utilService.readJsonFile("./data/users.json");

async function query() {
  try {
    return users;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function getById(userId) {
  try {
    const user = users.find((user) => user._id === userId);
    if (!user) throw `Couldnt find a user with id: ${userId}`;
    return user;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function remove(userId) {
  try {
    const idx = users.findIndex((user) => user._id === userId);
    if (idx === -1) throw `Couldnt find user with id:${userId}`;

    users.splice(idx, 1);
    utilService.saveJsonFile(users, "./data/users.json");
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function save(userToSave) {
  try {
    // if (userToSave._id) {
    //   const idx = users.findIndex((user) => user._id === userToSave._id);
    //   if (idx === -1) throw `Couldnt find user with id:${userToSave._id}`;
    //   users.splice(idx, 1, userToSave);
    // } else {}
    userToSave._id = utilService.makeId();
    userToSave.score = 10000;
    users.push(userToSave);

    utilService.saveJsonFile(users, "./data/users.json");
    return userToSave;
  } catch (err) {
    loggerService.error(err);
    throw err;
  }
}

async function getByUsername(username) {
  return users.find((user) => user.username === username);
}

export const userService = {
  query,
  getById,
  remove,
  save,
  getByUsername,
};
