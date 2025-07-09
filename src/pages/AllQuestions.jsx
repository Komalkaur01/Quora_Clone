import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from "../components/Header";
import QuestionCard from "../components/QuestionCard";

function AllQuestions() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchAllQuestions = async () => {
      const q = query(
        collection(db, "questions"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setQuestions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchAllQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto p-4 pt-20 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          All Questions
        </h2>
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}

export default AllQuestions;
