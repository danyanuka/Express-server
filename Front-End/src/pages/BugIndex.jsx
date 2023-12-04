import { bugService } from "../services/bug.service.js";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { BugList } from "../cmps/BugList";
import { BugFilter } from "../cmps/BugFilter";

import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function BugIndex() {
  const [bugs, setBugs] = useState([]);
  const [SearchParams, setSearchParams] = useSearchParams();
  const [filterBy, setFilterBy] = useState(
    bugService.getFilterFromParams(SearchParams)
  );

  useEffect(() => {
    setSearchParams(filterBy);
    loadBugs();
  }, [filterBy]);

  async function loadBugs() {
    const bugs = await bugService.query(filterBy);

    setBugs(bugs);
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId);
      console.log("Deleted Succesfully!");
      setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId));
      showSuccessMsg("Bug removed");
    } catch (err) {
      console.log("Error from onRemoveBug ->", err);
      showErrorMsg("Cannot remove bug");
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt("Bug title?"),
      severity: +prompt("Bug severity?"),
      description: prompt("Describe the Bug"),
    };
    try {
      const savedBug = await bugService.save(bug);
      console.log("Added Bug", savedBug);
      setBugs((prevBugs) => [...prevBugs, savedBug]);
      showSuccessMsg("Bug added");
    } catch (err) {
      console.log("Error from onAddBug ->", err);
      showErrorMsg("Cannot add bug");
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt("New severity?");
    const bugToSave = { ...bug, severity };
    try {
      const savedBug = await bugService.save(bugToSave);
      console.log("Updated Bug:", savedBug);
      setBugs((prevBugs) =>
        prevBugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        )
      );
      showSuccessMsg("Bug updated");
    } catch (err) {
      console.log("Error from onEditBug ->", err);
      showErrorMsg("Cannot update bug");
    }
  }

  function onSetFilterBy(fieldsToUpdate) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...fieldsToUpdate }));
  }

  return (
    <main className="main-layout">
      <h3>Bugs App</h3>
      <main>
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  );
}