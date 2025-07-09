import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    try {
      const q = query(
        collection(db, "questions"),
        where("text_lowercase", ">=", term),
        where("text_lowercase", "<=", term + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      navigate("/search", { state: { results } });
    } catch (error) {
      console.error("Error searching:", error.message);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-md"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg" />
      <input
        type="text"
        placeholder="Search Quora"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm placeholder-gray-500 dark:placeholder-gray-400 text-sm"
      />
    </form>
  );
}

export default SearchBar;
