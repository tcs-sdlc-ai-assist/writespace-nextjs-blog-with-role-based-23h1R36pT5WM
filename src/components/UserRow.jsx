"use client";

import PropTypes from "prop-types";
import Avatar from "@/components/Avatar";

export function UserRow({ user, currentUserId, onDelete }) {
  const isAdmin = user.role === "admin";
  const isHardCodedAdmin = user.userId === "admin" || user.username === "admin";
  const isSelf = user.id === currentUserId || user.userId === currentUserId;
  const deleteDisabled = isHardCodedAdmin || isSelf;

  const formattedDate = (() => {
    try {
      return new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  })();

  const roleBadge = isAdmin ? (
    <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
      Admin
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
      User
    </span>
  );

  return (
    <>
      {/* Desktop: table row */}
      <tr className="hidden md:table-row border-b border-surface-200 hover:bg-surface-50 transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar role={user.role === "admin" ? "admin" : "user"} />
            <div>
              <p className="font-medium text-surface-900">{user.displayName || user.username}</p>
              <p className="text-sm text-surface-500">@{user.username}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          {roleBadge}
        </td>
        <td className="px-4 py-3 text-sm text-surface-600">
          {formattedDate}
        </td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={() => onDelete(user.id)}
            disabled={deleteDisabled}
            className={
              deleteDisabled
                ? "rounded-lg px-3 py-1.5 text-sm font-medium text-surface-400 bg-surface-100 cursor-not-allowed"
                : "rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            }
            title={
              isHardCodedAdmin
                ? "Cannot delete the admin account"
                : isSelf
                  ? "Cannot delete your own account"
                  : "Delete user"
            }
          >
            Delete
          </button>
        </td>
      </tr>

      {/* Mobile: card */}
      <div className="md:hidden rounded-xl border border-surface-200 bg-white p-4 shadow-sm animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar role={user.role === "admin" ? "admin" : "user"} />
            <div>
              <p className="font-medium text-surface-900">{user.displayName || user.username}</p>
              <p className="text-sm text-surface-500">@{user.username}</p>
            </div>
          </div>
          {roleBadge}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-surface-500">Joined {formattedDate}</p>
          <button
            onClick={() => onDelete(user.id)}
            disabled={deleteDisabled}
            className={
              deleteDisabled
                ? "rounded-lg px-3 py-1.5 text-sm font-medium text-surface-400 bg-surface-100 cursor-not-allowed"
                : "rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            }
            title={
              isHardCodedAdmin
                ? "Cannot delete the admin account"
                : isSelf
                  ? "Cannot delete your own account"
                  : "Delete user"
            }
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    displayName: PropTypes.string,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(["admin", "user"]).isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  currentUserId: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

UserRow.defaultProps = {
  currentUserId: null,
};

export default UserRow;