import { useParams } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Header from "../components/Header";

function QuestionDetails() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionRef = doc(db, "questions", questionId);
        const questionSnap = await getDoc(questionRef);
        if (questionSnap.exists()) {
          setQuestion({ id: questionSnap.id, ...questionSnap.data() });
        } else {
          console.error("Question not found");
        }
      } catch (error) {
        console.error("Error fetching question:", error.message);
      }
    };

    fetchQuestion();
  }, [questionId]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-neutral-900 text-gray-800 dark:text-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto pt-24 px-4">
        {question ? (
          <QuestionCard question={question} />
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Loading question...</p>
        )}
      </div>
    </div>
  );
}

export default QuestionDetails;
