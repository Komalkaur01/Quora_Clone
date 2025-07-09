import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";

import Header from "../components/Header";
import CreatePost from "../components/CreatePost";
import PostFeed from "../components/PostFeed";
import FollowButton from "../components/FollowButton";

import {
  BookOpen,
  Laptop,
  FlaskConical,
  Briefcase,
  HeartPulse,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const filtered = usersSnapshot.docs
        .filter((doc) => doc.id !== auth.currentUser?.uid)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(filtered);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="flex pt-16 max-w-7xl mx-auto px-4 lg:px-6 xl:px-8 gap-4">

        {/* LEFT SIDEBAR - TOPICS */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-gray-700 px-4 py-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-600" />
            Topics
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Technology", icon: Laptop, route: "/technology" },
              { label: "Science", icon: FlaskConical, route: "/science" },
              { label: "Business", icon: Briefcase, route: "/business" },
              { label: "Health", icon: HeartPulse, route: "/health" },
            ].map(({ label, icon: Icon, route }) => (
              <li key={label}>
                <button
                  onClick={() => navigate(route)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 w-full text-left px-2 py-1 rounded-md transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col items-center px-2 sm:px-4 py-6">
          <div className="w-full max-w-2xl">
            <CreatePost />
            <PostFeed />
          </div>
        </main>

        {/* RIGHT SIDEBAR - DISCOVER PEOPLE */}
        <aside className="hidden xl:block w-72 bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-gray-700 px-4 py-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Discover People
          </h3>

          {auth.currentUser ? (
            <ul className="space-y-4">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div>
                    <Link
                      to={`/profile/${user.id}`}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      {user.name || user.email}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <FollowButton targetUserId={user.id} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please log in to discover people.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Home;
