import { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown } from "lucide-react";

function QuestionCard({ question }) {
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    const fetchAnswers = async () => {
      const querySnapshot = await getDocs(
        collection(db, "questions", question.id, "answers")
      );
      setAnswers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchAnswers();
  }, [question.id]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please log in to post an answer.");
      return;
    }

    try {
      await addDoc(collection(db, "questions", question.id, "answers"), {
        text: answerText.trim(),
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: new Date(),
        votes: 0,
        voters: [],
      });
      setAnswerText("");
      const querySnapshot = await getDocs(
        collection(db, "questions", question.id, "answers")
      );
      setAnswers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error posting answer:", error.message);
    }
  };

  const handleVote = async (answerId, type) => {
    if (!auth.currentUser) {
      alert("Please log in to vote.");
      return;
    }

    const answerRef = doc(db, "questions", question.id, "answers", answerId);
    const answer = answers.find((ans) => ans.id === answerId);
    const hasVoted = answer.voters.includes(auth.currentUser.uid);

    if (hasVoted) return;

    try {
      await updateDoc(answerRef, {
        votes: type === "upvote" ? answer.votes + 1 : answer.votes - 1,
        voters: arrayUnion(auth.currentUser.uid),
      });

      const updated = await getDocs(
        collection(db, "questions", question.id, "answers")
      );
      setAnswers(updated.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error voting:", error.message);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-sm p-6 space-y-6">
      {/* Question Header */}
      <div>
        <Link to={`/question/${question.id}`}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition">
            {question.text}
          </h2>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Asked by{" "}
          <Link
            to={`/profile/${question.userId}`}
            className="text-red-600 dark:text-red-400 hover:underline"
          >
            {question.userEmail}
          </Link>
        </p>
      </div>

      {/* Answer List */}
      <div className="space-y-4">
        {answers.map((answer) => (
          <div
            key={answer.id}
            className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm"
          >
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {answer.text}
            </p>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                Answered by{" "}
                <Link
                  to={`/profile/${answer.userId}`}
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  {answer.userEmail}
                </Link>
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleVote(answer.id, "upvote")}
                  disabled={answer.voters.includes(auth.currentUser?.uid)}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition disabled:text-gray-300"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{answer.votes}</span>
                </button>
                <button
                  onClick={() => handleVote(answer.id, "downvote")}
                  disabled={answer.voters.includes(auth.currentUser?.uid)}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition disabled:text-gray-300"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Input */}
      <form onSubmit={handlePostAnswer} className="space-y-2">
        <textarea
          placeholder="Write your answer..."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          className="w-full h-24 p-3 border border-gray-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-neutral-800 text-sm text-gray-900 dark:text-white resize-none"
          required
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition dark:bg-red-600 dark:hover:bg-red-700"
        >
          Post Answer
        </button>
      </form>
    </div>
  );
}

export default QuestionCard;
