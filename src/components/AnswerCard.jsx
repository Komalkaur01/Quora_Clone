import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";

function AnswerCard({ answer, currentUserId, onVote }) {
  const hasVoted = answer.voters.includes(currentUserId);

  return (
    <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 shadow-sm">
      <p className="text-gray-800 dark:text-gray-100 leading-relaxed">{answer.text}</p>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          Answered by{" "}
          <Link
            to={`/profile/${answer.userId}`}
            className="text-red-600 hover:underline"
          >
            {answer.userEmail}
          </Link>
        </span>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onVote(answer.id, "upvote")}
            disabled={hasVoted}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-green-600 transition disabled:text-gray-300 dark:disabled:text-neutral-600"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{answer.votes}</span>
          </button>
          <button
            onClick={() => onVote(answer.id, "downvote")}
            disabled={hasVoted}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-red-500 transition disabled:text-gray-300 dark:disabled:text-neutral-600"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnswerCard;
