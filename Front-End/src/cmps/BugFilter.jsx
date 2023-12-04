import { useEffect, useState } from "react";

export function BugFilter({ filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

  useEffect(() => {
    onSetFilterBy(filterByToEdit);
  }, [filterByToEdit]);

  function handleChange({ target }) {
    let { name: field, value, type } = target;
    if (type === "number") value = +value || "";

    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
  }
  console.log(filterByToEdit);
  return (
    <form>
      <h4>Filter By:</h4>
      <label htmlFor="text">Text :</label>
      <input
        onChange={handleChange}
        value={filterByToEdit.text}
        placeholder="Search by text"
        type="text"
        name="text"
        style={{ marginLeft: " 3px" }}
      />

      <label htmlFor="severity" style={{ marginLeft: " 20px" }}>
        Severity :
      </label>
      <input
        onChange={handleChange}
        value={filterByToEdit.severity}
        placeholder="severity"
        type="number"
        name="severity"
        style={{ marginLeft: " 3px" }}
      />
    </form>
  );
}
