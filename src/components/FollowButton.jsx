import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { followUser, unfollowUser } from "../utils/follow";

function FollowButton({ targetUserId }) {
  const currentUserId = auth.currentUser?.uid;
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      if (!currentUserId) return;
      const currentDoc = await getDoc(doc(db, "users", currentUserId));
      const currentData = currentDoc.data();
      setIsFollowing(currentData?.following?.includes(targetUserId));
    };

    checkFollowing();
  }, [currentUserId, targetUserId]);

  const handleClick = async () => {
    if (!currentUserId) {
      alert("Please log in");
      return;
    }

    if (isFollowing) {
      await unfollowUser(currentUserId, targetUserId);
    } else {
      await followUser(currentUserId, targetUserId);
    }

    setIsFollowing((prev) => !prev);
  };

  if (currentUserId === targetUserId) return null;

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-1 text-sm rounded-full border transition font-medium
        ${
          isFollowing
            ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
            : "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
        }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowButton;
