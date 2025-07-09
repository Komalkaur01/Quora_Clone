import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    increment,
    arrayUnion,
    arrayRemove,
    query,
    orderBy,
    addDoc,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function PostFeed() {
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [commentsMap, setCommentsMap] = useState({});

    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchPosts = async () => {
            const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const postList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postList);

            // Extract liked posts by current user
            if (currentUser) {
                const liked = postList
                    .filter((post) => post.likedBy?.includes(currentUser.uid))
                    .map((post) => post.id);
                setLikedPosts(liked);
            }
        };

        fetchPosts();
    }, [currentUser]);

    const handleLike = async (postId) => {
        if (!currentUser) return;

        const postRef = doc(db, "posts", postId);
        const isLiked = likedPosts.includes(postId);

        try {
            if (isLiked) {
                await updateDoc(postRef, {
                    likes: increment(-1),
                    likedBy: arrayRemove(currentUser.uid),
                });
                setLikedPosts((prev) => prev.filter((id) => id !== postId));
            } else {
                await updateDoc(postRef, {
                    likes: increment(1),
                    likedBy: arrayUnion(currentUser.uid),
                });
                setLikedPosts((prev) => [...prev, postId]);
            }
        } catch (err) {
            console.error("Error updating like:", err.message);
        }
    };

    const handleToggleComments = (postId) => {
        if (activeCommentPostId === postId) {
            setActiveCommentPostId(null);
        } else {
            setActiveCommentPostId(postId);
            listenToComments(postId); // start fetching comments
        }
    };

    const listenToComments = (postId) => {
        const q = query(
            collection(db, "posts", postId, "comments"),
            orderBy("createdAt", "asc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const comments = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCommentsMap((prev) => ({ ...prev, [postId]: comments }));
        });
        return unsubscribe;
    };

    const handleAddComment = async (e, postId) => {
        e.preventDefault();
        if (!auth.currentUser || !commentText.trim()) return;

        await addDoc(collection(db, "posts", postId, "comments"), {
            text: commentText.trim(),
            userId: auth.currentUser.uid,
            userEmail: auth.currentUser.email,
            createdAt: serverTimestamp(),
        });

        setCommentText("");
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 px-4 space-y-6">
            {posts.map((post) => {
                const isLiked = likedPosts.includes(post.id);
                const isCommentOpen = activeCommentPostId === post.id;
                const comments = commentsMap[post.id] || [];

                return (
                    <Link
  key={post.id}
  to={`/post/${post.id}`}
  className="block bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden hover:ring-2 ring-red-500 transition"
>
                        <div className="p-4 flex items-center justify-between">
                            <div>
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
                        </div>

                        {post.imageUrl && (
                            <div className="w-full">
                                <img
                                    src={post.imageUrl}
                                    alt="post"
                                    className="w-full max-h-[450px] object-cover object-center transition duration-300 hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                        )}

                        <div className="p-4">
                            <p className="text-sm text-gray-700 dark:text-gray-200">
                                {post.caption}
                            </p>
                        </div>

                        <div className="px-4 pb-4 flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                            <button
                                className={`flex items-center gap-1 transition ${isLiked ? "text-red-500" : "hover:text-red-500"
                                    }`}
                                onClick={() => handleLike(post.id)}
                            >
                                <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
                                {isLiked ? "Liked" : "Like"}
                            </button>

                            <button
                                onClick={() => handleToggleComments(post.id)}
                                className="hover:text-blue-500 flex items-center gap-1"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Comment
                            </button>

                            <button
                                onClick={() => {
                                    const postUrl = `${window.location.origin}/post/${post.id}`;
                                    navigator.clipboard.writeText(postUrl);
                                    toast.success("Link copied to clipboard!");
                                }}
                                className="hover:text-green-500 flex items-center gap-1"
                            >
                                <Share2 className="w-5 h-5" />
                                Share
                            </button>
                        </div>

                        {/* Comments UI */}
                        {isCommentOpen && (
                            <div className="px-4 pb-6 space-y-4">
                                {/* Comment Form */}
                                <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                        disabled={!commentText.trim()}
                                    >
                                        Post
                                    </button>
                                </form>

                                {/* Comments List */}
                                <div className="space-y-2 text-sm">
                                    {comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="border-l-2 border-red-500 pl-3 text-gray-800 dark:text-gray-100"
                                            >
                                                <p className="font-medium">{comment.userEmail}</p>
                                                <p>{comment.text}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {comment.createdAt?.toDate
                                                        ? formatDistanceToNow(comment.createdAt.toDate(), {
                                                            addSuffix: true,
                                                        })
                                                        : "Just now"}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}

export default PostFeed;
