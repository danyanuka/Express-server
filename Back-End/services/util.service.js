import fs from "fs";
import { resolve } from "path";

function makeId(length = 5) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
// Takes the queryParams, making an object out of it and also changes Strings to Numbers if needed.
function queryToObject(query) {
  return Object.entries(query).reduce((acc, [key, value]) => {
    acc[key] = !isNaN(+value) ? +value : value;
    return acc;
  }, {});
}

function readJsonFile(path) {
  const str = fs.readFileSync(path, "utf8");
  const json = JSON.parse(str);
  return json;
}

function saveJsonFile(bugs, path) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 2);
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export const utilService = {
  makeId,
  queryToObject,
  readJsonFile,
  saveJsonFile,
};
