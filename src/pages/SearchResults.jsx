import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import QuestionCard from "../components/QuestionCard";

function SearchResults() {
  const { state } = useLocation();
  const results = state?.results || [];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto p-4 pt-20">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-neutral-700 pb-2">
          Search Results
        </h2>

        {results.length > 0 ? (
          <div className="space-y-6">
            {results.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              No results found.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Try refining your search or asking a new question.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
