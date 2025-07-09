export default function PostCard({ post, showCommentsToggle = false }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white dark:bg-neutral-900 border rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-2">{post.userEmail}</p>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          className="w-full h-auto rounded-lg mb-2"
          alt="Post"
        />
      )}
      <p>{post.caption}</p>

      {showCommentsToggle && (
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="text-sm text-red-500 mt-2"
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
      )}

      {showComments && (
        <div className="mt-2">
          {/* Render fetched comments here */}
          <p className="text-xs text-gray-400">[Comments placeholder]</p>
        </div>
      )}
    </div>
  );
}

