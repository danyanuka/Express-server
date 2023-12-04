import { utilService } from "./util.service.js";
import Axios from "axios";

const axios = Axios.create({
  withCredentials: true,
});

const BASE_URL = "//localhost:3030/api/bugs/";
export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getFilterFromParams,
};

async function query(filterBy = {}) {
  let { data: bugs } = await axios.get(BASE_URL);
  if (filterBy.text) {
    bugs = bugs.filter((bug) =>
      bug.title.toLowerCase().includes(filterBy.text.toLowerCase())
    );
  }

  if (filterBy.severity) {
    bugs = bugs.filter((bug) => bug.severity === filterBy.severity);
  }
  return bugs;
}

async function getById(bugId) {
  const url = BASE_URL + bugId;
  const { data: bug } = await axios.get(url);
  return bug;
}
async function remove(bugId) {
  const url = BASE_URL + bugId + "/remove";
  try {
    const { data: res } = await axios.get(url);
    return res;
  } catch (err) {
    console.log(err);
  }
}
async function save(bug) {
  const queryParams = `?_id=${bug._id || ""}&title=${bug.title}&severity=${
    bug.severity
  }&createdAt=${bug.createdAt}&description=${bug.description}`;
  const url = BASE_URL + "save" + queryParams;
  const { data: savedBug } = await axios.get(url);
  console.log(savedBug);
  return savedBug;
}

function getDefaultFilter() {
  return { text: "", severity: "" };
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
