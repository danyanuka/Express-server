import { Link } from "react-router-dom";
import { BugPreview } from "./BugPreview";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

export function BugList({ bugs, onRemoveBug, onEditBug }) {
  // const [coockies] = useCookies(["visitedBugs"]);
  // const visitedBugs = coockies.visitedBugs || [];

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>
            <button
              onClick={() => {
                onRemoveBug(bug._id);
              }}
            >
              x
            </button>
            <button
              onClick={() => {
                onEditBug(bug);
              }}
            >
              Edit
            </button>
          </div>
          {/* {visitedBugs.length < 4 ? ( */}
          <Link to={`/bug/${bug._id}`}>Details</Link>
          {/* ) : (
            <p>Wait 7 sec</p>
          )} */}
        </li>
      ))}
    </ul>
  );
}
