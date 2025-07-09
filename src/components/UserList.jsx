import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

function UserList({ userIds, title }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const userData = [];
      for (const uid of userIds) {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          userData.push({ id: uid, ...userDoc.data() });
        }
      }
      setUsers(userData);
    };

    if (userIds.length > 0) fetchUsers();
  }, [userIds]);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm p-4 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {title}
      </h3>

      {users.length > 0 ? (
        <ul className="space-y-3">
          {users.map((user) => (
            <li key={user.id}>
              <Link
                to={`/profile/${user.id}`}
                className="text-red-600 dark:text-red-400 hover:underline focus:outline-none focus:ring-1 focus:ring-red-500 rounded-sm"
              >
                {user.name || user.email}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No users found.
        </p>
      )}
    </div>
  );
}

export default UserList;
