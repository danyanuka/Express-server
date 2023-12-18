import { Link } from "react-router-dom";

import { BugPreview } from "./BugPreview";
import { userService } from "../services/users/user.service";

export function BugList({ bugs, onRemoveBug, onEditBug }) {
  const loggedinUser = userService.getLoggedinUser();
  console.log(loggedinUser);

  function isOwnedByUser(bug) {
    return (
      loggedinUser?.isAdmin ||
      (loggedinUser && loggedinUser._id === bug.owner._id)
    );
  }

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          {isOwnedByUser(bug) ? (
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
          ) : (
            <p>Log in for full access</p>
          )}

          <Link
            style={{ backgroundColor: "rgb(233, 206, 221)" }}
            to={`/bug/${bug._id}`}
          >
            Details
          </Link>
        </li>
      ))}
    </ul>
  );
}
