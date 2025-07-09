import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { Bell, Home, PenBox, User, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { ModeToggle } from "./mode-toggle";

function Header() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Listen to user auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-neutral-800 text-black dark:text-white border-b border-gray-200 dark:border-gray-700 shadow-sm z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-xl sm:text-2xl font-semibold text-red-600 cursor-pointer"
        >
          Quora
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-300">
          <Home
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-red-600 transition text-xl"
            title="Home"
          />
          <PenBox
            onClick={() => navigate("/questions")}
            className="cursor-pointer hover:text-red-600 transition text-xl"
            title="All Questions"
          />
          <UserPlus
            onClick={() => navigate("/discover")}
            className="cursor-pointer hover:text-red-600 transition text-xl"
            title="Discover People"
          />
        </div>

        {/* Search Bar */}
        <div className="hidden sm:block w-full max-w-md mx-4">
          <SearchBar />
        </div>

        

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          {user ? (
            <>
              <div
                onClick={() => setShowMenu((prev) => !prev)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <User className="text-2xl text-gray-600 dark:text-gray-300 hover:text-red-600 transition" />
                <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-200 max-w-[150px] truncate">
                  {user.email}
                </span>
              </div>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow z-50 p-4 space-y-2 transition-colors duration-300">
                  <button
                    onClick={() => {
                      navigate(`/profile/${user.uid}`);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left text-sm text-gray-700 dark:text-gray-200 hover:text-red-600"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 mt-2 rounded px-2 py-1 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 transition"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-sm bg-red-600 text-white px-4 py-1.5 rounded-full shadow hover:bg-red-700 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <ModeToggle />
      </div>
    </header>
  );
}

export default Header;
