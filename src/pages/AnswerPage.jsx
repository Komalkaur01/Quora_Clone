import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import Header from "../components/Header";
import AnswerCard from "../components/AnswerCard";

function AnswerPage() {
  const { questionId } = useParams();
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const fetchAnswers = async () => {
    const snapshot = await getDocs(
      query(
        collection(db, "questions", questionId, "answers"),
        orderBy("createdAt", "desc")
      )
    );
    setAnswers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      const snapshot = await getDocs(collection(db, "questions"));
      const found = snapshot.docs.find((doc) => doc.id === questionId);
      if (found) setQuestion({ id: found.id, ...found.data() });
    };
    fetchQuestion();
    fetchAnswers();
  }, [questionId]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Login required.");

    await addDoc(collection(db, "questions", questionId, "answers"), {
      text: answerText.trim(),
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      createdAt: new Date(),
      votes: 0,
      voters: [],
    });
    setAnswerText("");
    fetchAnswers();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto p-4 pt-20 space-y-6">
        {question && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{question.text}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Asked by{" "}
              <span className="text-red-600">{question.userEmail}</span>
            </p>
          </>
        )}

        <form onSubmit={handlePostAnswer} className="space-y-2">
          <textarea
            placeholder="Write your answer..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md resize-none"
            required
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition"
          >
            Post Answer
          </button>
        </form>

        <div className="space-y-4">
          {answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              questionId={questionId}
              refreshAnswers={fetchAnswers}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnswerPage;
