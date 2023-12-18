import { useState, useEffect } from "react";

export function BugSort({ sortBy, onSetFilterBy }) {
  const [sortByToEdit, setSortByToEdit] = useState(sortBy);

  useEffect(() => {
    onSetFilterBy({ sortBy: sortByToEdit });
  }, [sortByToEdit]);

  function handleChange({ target }) {
    let { value } = target;

    setSortByToEdit({ type: value, dir: -1 });
  }
  //  do just like the handle change for the DIRection and without the unessecary wrappings
  function onToggleSortDir({ target }) {
    const { checked } = target;
    const dirValue = checked ? 1 : -1;
    setSortByToEdit((prevSortBy) => ({
      ...prevSortBy,
      dir: dirValue,
    }));
  }

  return (
    <form style={{ backgroundColor: "rgb(233, 206, 221)", width: "465px" }}>
      <label htmlFor="sortBy" style={{ marginLeft: "5px" }}>
        Sort :
        <select onChange={handleChange} name="sortBy">
          <option value="alphabet">Alphabetically</option>
          <option value="severity">By severity</option>
          <option value="date">By Date</option>
        </select>
        <br></br>
      </label>
      <label style={{ marginLeft: "10px" }}>
        Switch Direction :
        <input onClick={onToggleSortDir} type="checkbox" />
      </label>
    </form>
  );
}
