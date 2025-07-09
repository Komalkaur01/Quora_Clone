import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const followUser = async (currentUserId, targetUserId) => {
  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);

  await updateDoc(currentRef, {
    following: arrayUnion(targetUserId),
  });

  await updateDoc(targetRef, {
    followers: arrayUnion(currentUserId),
  });
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);

  await updateDoc(currentRef, {
    following: arrayRemove(targetUserId),
  });

  await updateDoc(targetRef, {
    followers: arrayRemove(currentUserId),
  });
};
