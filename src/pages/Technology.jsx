import { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import Header from "../components/Header";
import QuestionCard from "../components/QuestionCard";
import {
  BookOpen,
  Laptop,
  FlaskConical,
  Briefcase,
  HeartPulse,
  Send,
  MessageCircleQuestion,
} from "lucide-react";

function Technology() {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const navigate = useNavigate();

  const fetchTechnologyQuestions = async () => {
    try {
      const q = query(
        collection(db, "questions"),
        where("topic", "==", "technology"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setQuestions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching technology questions:", error.message);
    }
  };

  useEffect(() => {
    fetchTechnologyQuestions();
  }, []);

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please log in.");
    await addDoc(collection(db, "questions"), {
      text: questionText.trim(),
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      topic: "technology",
      createdAt: new Date(),
      votes: 0,
    });

    setQuestionText("");
    fetchTechnologyQuestions();
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-neutral-900 text-gray-800 dark:text-gray-100">
      <Header />
      <div className="flex pt-16 max-w-7xl mx-auto">
        <aside className="hidden md:block w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 px-4 py-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-600" />
            Topics
          </h3>
          <ul className="space-y-4 text-sm">
            <li>
              <button
                onClick={() => navigate("/technology")}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 cursor-pointer w-full text-left px-2 py-1"
              >
                <Laptop className="w-4 h-4" />
                Technology
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/science")}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 cursor-pointer w-full text-left px-2 py-1"
              >
                <FlaskConical className="w-4 h-4" />
                Science
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/business")}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 cursor-pointer w-full text-left px-2 py-1"
              >
                <Briefcase className="w-4 h-4" />
                Business
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/health")}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 cursor-pointer w-full text-left px-2 py-1"
              >
                <HeartPulse className="w-4 h-4" />
                Health
              </button>
            </li>
          </ul>
        </aside>

        <main className="flex-1 px-4 py-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Technology Questions
          </h2>

          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm p-4 mb-6">
            <form onSubmit={handlePostQuestion}>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2">
                <MessageCircleQuestion className="w-5 h-5 text-red-600" />
                Ask a Question (Technology)
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="What do you want to ask about technology?"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-neutral-900 dark:text-white rounded-md resize-none text-sm"
                rows={4}
                required
              />
              <button
                type="submit"
                className="mt-3 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
              >
                <Send className="w-4 h-4" />
                Post
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Technology;
