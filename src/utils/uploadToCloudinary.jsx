// utils/uploadToCloudinary.js
import axios from "axios";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default"); // or your custom preset

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/dmehnfzkf/image/upload`,
    formData
  );

  return res.data; // return full response
};
