import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import Header from "../components/Header";
import QuestionCard from "../components/QuestionCard";
import FollowButton from "../components/FollowButton";
import UserList from "../components/UserList";
import { formatDistanceToNow } from "date-fns";

function Profile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    const fetchAllQuestions = async () => {
      try {
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const questionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching all questions:", error.message);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    const fetchAllAnswers = async () => {
      try {
        const answers = [];
        const questionsSnapshot = await getDocs(collection(db, "questions"));
        for (const questionDoc of questionsSnapshot.docs) {
          const questionId = questionDoc.id;
          const answersSnapshot = await getDocs(
            collection(db, "questions", questionId, "answers")
          );
          answers.push(
            ...answersSnapshot.docs.map((doc) => ({
              id: doc.id,
              questionId,
              questionText: questionDoc.data().text || "No question text available",
              ...doc.data(),
            }))
          );
        }
        setAllAnswers(answers);
      } catch (error) {
        console.error("Error fetching all answers:", error.message);
      } finally {
        setIsLoadingAnswers(false);
      }
    };

    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const posts = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((post) => post.userId === userId);
        setUserPosts(posts);
      } catch (err) {
        console.error("Error fetching posts:", err.message);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchUserData();
    fetchAllQuestions();
    fetchAllAnswers();
    fetchPosts();
  }, [userId]);

  const userQuestions = allQuestions.filter((q) => q.userId === userId);
  const userAnswers = allAnswers.filter((a) => a.userId === userId);

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-neutral-900 flex items-center justify-center text-gray-700 dark:text-gray-200">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-neutral-900 text-gray-800 dark:text-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto p-4 pt-20 space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold">{userData.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{userData.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Joined on{" "}
            {new Date(userData.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}
          </p>

          {auth.currentUser?.uid !== userId && (
            <div className="mt-4">
              <FollowButton targetUserId={userId} />
            </div>
          )}

          <div className="mt-4 flex gap-6 text-sm text-gray-700 dark:text-gray-300">
            <button
              onClick={() => {
                setShowFollowers((prev) => !prev);
                setShowFollowing(false);
              }}
              className="hover:underline focus:outline-none"
            >
              <strong>{userData.followers?.length || 0}</strong> followers
            </button>
            <button
              onClick={() => {
                setShowFollowing((prev) => !prev);
                setShowFollowers(false);
              }}
              className="hover:underline focus:outline-none"
            >
              <strong>{userData.following?.length || 0}</strong> following
            </button>
          </div>

          {showFollowers && <UserList userIds={userData.followers || []} title="Followers" />}
          {showFollowing && <UserList userIds={userData.following || []} title="Following" />}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-300 dark:border-gray-700 pb-2">
          {["posts", "questions", "answers"].map((tab) => (
            <button
              key={tab}
              className={`capitalize px-3 py-1 rounded ${activeTab === tab
                  ? "bg-red-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-red-600"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "posts" &&
            (isLoadingPosts ? (
              <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
            ) : userPosts.length > 0 ? (
              <div className="grid gap-6">
                {userPosts.map((post) => (
  <div
    key={post.id}
    className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden hover:ring-1 hover:ring-red-500 transition"
  >
    {/* Header: User Info */}
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm uppercase">
          {userData?.name?.[0] || userData?.email?.[0] || "U"}
        </div>
        <div className="text-sm">
          <p className="font-medium text-gray-800 dark:text-gray-100">
            {userData.name || userData.email}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {post.createdAt?.toDate
              ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })
              : "Just now"}
          </p>
        </div>
      </div>
    </div>

    {/* Image */}
    {post.imageUrl && (
      <div className="w-full">
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full aspect-video object-cover object-center transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>
    )}

    {/* Caption */}
    <div className="p-4">
      <p className="text-sm text-gray-700 dark:text-gray-200">{post.caption}</p>
    </div>

    {/* Optionally: Actions (if needed on profile posts too) */}
    {/* 
    <div className="px-4 pb-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
      <button className="flex items-center gap-1 hover:text-red-500 transition">
        <Heart className="w-5 h-5" />
        Like
      </button>
      <button className="flex items-center gap-1 hover:text-blue-500 transition">
        <MessageCircle className="w-5 h-5" />
        Comment
      </button>
      <button
        onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
          toast.success("Link copied to clipboard!");
        }}
        className="flex items-center gap-1 hover:text-green-500 transition"
      >
        <Share2 className="w-5 h-5" />
        Share
      </button>
    </div> 
    */}
  </div>
))}


              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
            ))}

          {activeTab === "questions" &&
            (isLoadingQuestions ? (
              <p className="text-gray-500 dark:text-gray-400">Loading questions...</p>
            ) : userQuestions.length > 0 ? (
              userQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No questions posted yet.</p>
            ))}

          {activeTab === "answers" &&
            (isLoadingAnswers ? (
              <p className="text-gray-500 dark:text-gray-400">Loading answers...</p>
            ) : userAnswers.length > 0 ? (
              userAnswers.map((answer) => (
                <div
                  key={answer.id}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm mb-4"
                >
                  <Link
                    to={`/question/${answer.questionId}`}
                    className="text-red-600 font-medium hover:underline"
                  >
                    {answer.questionText}
                  </Link>
                  <p className="mt-2">{answer.text}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Answered on{" "}
                    {new Date(answer.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No answers posted yet.</p>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
