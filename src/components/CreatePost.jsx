import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { ImagePlus, Send } from "lucide-react";

function CreatePost() {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please choose an image.");

    setLoading(true);
    try {
      const cloudinaryRes = await uploadToCloudinary(file);

      await addDoc(collection(db, "posts"), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        caption: caption.trim(),
        imageUrl: cloudinaryRes.secure_url,
        imagePublicId: cloudinaryRes.public_id,
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        comments: [],
      });

      setCaption("");
      setFile(null);
      alert("Post created!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 shadow-md space-y-4 max-w-xl mx-auto mt-6"
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Create a Post</h2>

      <textarea
        className="w-full min-h-[100px] border border-gray-300 dark:border-gray-600 rounded-md p-3 text-sm bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="What's on your mind?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        required
      />

      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:text-red-600">
        <ImagePlus className="w-5 h-5" />
        <span>{file ? file.name : "Add an image"}</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}

export default CreatePost;
