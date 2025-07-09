import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import FollowButton from "../components/FollowButton";

function DiscoverPeople() {
  const [users, setUsers] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const filtered = usersSnapshot.docs
        .filter((doc) => doc.id !== currentUser?.uid)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(filtered);
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-neutral-800 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="max-w-3xl mx-auto pt-20 p-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Discover People</h2>
        {users.length > 0 ? (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.id}
                className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between shadow-sm"
              >
                <div>
                  <Link
                    to={`/profile/${user.id}`}
                    className="text-lg font-semibold text-red-600 hover:underline"
                  >
                    {user.name || user.email}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <FollowButton targetUserId={user.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No users found to follow.</p>
        )}
      </div>
    </div>
  );
}

export default DiscoverPeople;
