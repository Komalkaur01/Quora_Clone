import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment, onSnapshot, collection, addDoc, query, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { Heart, MessageCircle, Share2 } from "lucide-react";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const postSnap = await getDoc(docRef);
      if (postSnap.exists()) {
        const postData = { id: postSnap.id, ...postSnap.data() };
        setPost(postData);
        setLiked(postData.likedBy?.includes(currentUser?.uid));
      }
    };
    fetchPost();
  }, [id, currentUser?.uid]);

  useEffect(() => {
    const q = query(collection(db, "posts", id, "comments"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [id]);

  const handleLike = async () => {
    if (!currentUser) return toast.error("Login to like posts.");
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      likes: increment(liked ? -1 : 1),
      likedBy: liked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
    });
    setLiked(!liked);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentData = {
      text: newComment,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      createdAt: new Date(),
    };
    await addDoc(collection(db, "posts", id, "comments"), commentData);
    setNewComment("");
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Post link copied!");
  };

  if (!post)
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-800 text-gray-800 dark:text-white">
        <Header />
        <div className="text-center mt-20 text-lg">Loading post...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto pt-20 px-4 space-y-6">
        {/* Post Card */}
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {post.userEmail}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {post.createdAt?.toDate
                  ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })
                  : "Just now"}
              </span>
            </div>
          </div>

          {post.imageUrl && (
            <div className="w-full">
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          <div className="p-4">
            <p className="text-gray-800 dark:text-gray-100">{post.caption}</p>
          </div>

          <div className="px-4 pb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition ${liked ? "text-red-600" : "hover:text-red-500"}`}
            >
              <Heart className="w-5 h-5" />
              {liked ? "Liked" : "Like"} ({post.likes || 0})
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500 transition">
              <MessageCircle className="w-5 h-5" />
              Comment ({comments.length})
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-green-500 transition"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>

        {/* Comment Section */}
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <form onSubmit={handleCommentSubmit} className="mb-4 space-y-2">
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-900 rounded-md text-sm resize-none text-gray-800 dark:text-white"
              placeholder="Write a comment..."
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition text-sm"
            >
              Post Comment
            </button>
          </form>

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-100 dark:bg-neutral-700 p-3 rounded-md">
                  <p className="text-sm font-semibold">{c.userEmail}</p>
                  <p className="text-sm">{c.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {c.createdAt?.toDate
                      ? formatDistanceToNow(c.createdAt.toDate(), { addSuffix: true })
                      : "just now"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
