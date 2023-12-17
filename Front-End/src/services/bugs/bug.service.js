import { utilService } from "../util.service.js";
import Axios from "axios";

const axios = Axios.create({
  withCredentials: true,
});

const BASE_URL = "//localhost:3030/api/bug/";
export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getFilterFromParams,
};
// Get List
async function query(filterBy) {
  let sortBy = filterBy.sortBy;
  try {
    let { data: bugs } = await axios.get(BASE_URL, { params: filterBy });
    console.log(filterBy);

    if (sortBy.type === "severity") {
      bugs.sort((b1, b2) => (b1.severity - b2.severity) * sortBy.dir);
    }

    if (sortBy.type === "alphabet") {
      bugs.sort((b1, b2) =>
        b1.title.toLowerCase().localeCompare(b2.title.toLowerCase())
      );
    }

    if (sortBy.type === "date") {
      bugs.sort((b1, b2) => (b1.createdAt - b2.createdAt) * sortBy.dir);
    }

    return bugs;
  } catch (err) {
    console.log(err);
  }
}

// GetByID
async function getById(bugId) {
  const url = BASE_URL + bugId;
  try {
    const { data: bug } = await axios.get(url);
    return bug;
  } catch (err) {
    throw err;
  }
}

// DELETE
async function remove(bugId) {
  const url = BASE_URL + bugId;
  try {
    const { data: res } = await axios.delete(url);
    return res;
  } catch (err) {
    console.log(err);
  }
}

// PUT/POST
async function save(bug) {
  const dynMethod = bug._id ? "put" : "post";
  const dynPath = bug._id ? BASE_URL + bug._id : BASE_URL;
  try {
    const { data: savedBug } = await axios[dynMethod](dynPath, bug);
    return savedBug;
  } catch (err) {
    console.log(err);
  }
}

function getDefaultFilter() {
  return {
    text: "",
    severity: "",
    pageIdx: undefined,
    sortBy: { type: "", dir: 1 },
  };
}

function getFilterFromParams(searchParams) {
  const defaultFilter = getDefaultFilter();
  const filterBy = {};

  for (const field in defaultFilter) {
    filterBy[field] =
      field === "severity"
        ? +searchParams.get(field) || ""
        : searchParams.get(field) || "";
  }
  return filterBy;
}
