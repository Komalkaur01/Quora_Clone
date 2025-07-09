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
import { formatDistanceToNow } from "date-fns";

function Business() {
  const [questions, setQuestions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const navigate = useNavigate();

  const fetchBusinessQuestions = async () => {
    try {
      const q = query(
        collection(db, "questions"),
        where("topic", "==", "business"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setQuestions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching business questions:", error.message);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const fetchBusinessPosts = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        where("topic", "==", "business"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching business posts:", error.message);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchBusinessQuestions();
    fetchBusinessPosts();
  }, []);

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please log in.");
    await addDoc(collection(db, "questions"), {
      text: questionText.trim(),
      text_lowercase: questionText.trim().toLowerCase(),
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      topic: "business",
      createdAt: new Date(),
      votes: 0,
    });

    setQuestionText("");
    fetchBusinessQuestions();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="flex pt-16 max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-gray-700 px-4 py-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-600" />
            Topics
          </h3>
          <ul className="space-y-4 text-sm">
            <li>
              <button
                onClick={() => navigate("/technology")}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 w-full text-left px-2 py-1"
              >
                <Laptop className="w-4 h-4" />
                Technology
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/science")}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 w-full text-left px-2 py-1"
              >
                <FlaskConical className="w-4 h-4" />
                Science
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/business")}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 w-full text-left px-2 py-1"
              >
                <Briefcase className="w-4 h-4" />
                Business
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/health")}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 w-full text-left px-2 py-1"
              >
                <HeartPulse className="w-4 h-4" />
                Health
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Business Questions
            </h2>

            {/* Post Form */}
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 mb-6">
              <form onSubmit={handlePostQuestion}>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2">
                  <MessageCircleQuestion className="w-5 h-5 text-red-600" />
                  Ask a Question (Business)
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="What do you want to ask about business?"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-md resize-none text-sm"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  disabled={!questionText.trim()}
                  className="mt-3 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </form>
            </div>

            {/* Questions List */}
            {loadingQuestions ? (
              <p className="text-gray-500 dark:text-gray-400">Loading questions...</p>
            ) : questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No questions in Business yet. Be the first to ask!
              </p>
            )}
          </div>

          {/* Business Posts Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Business Posts
            </h2>
            {loadingPosts ? (
              <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden"
                  >
                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {post.userEmail}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {post.createdAt?.toDate
                          ? formatDistanceToNow(post.createdAt.toDate(), {
                              addSuffix: true,
                            })
                          : "Just now"}
                      </p>
                    </div>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="post"
                        className="w-full max-h-[450px] object-cover"
                      />
                    )}
                    <div className="p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {post.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No posts in Business yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Business;
