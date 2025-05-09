import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete the local file asynchronously
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    return response;
  } catch (error) {
    // Attempt to delete the local file if upload fails
    fs.unlink(localFilePath, (err) => {
      if (err)
        console.error("Error deleting local file after failed upload:", err);
    });

    console.error("Cloudinary upload failed:", error);
    return null;
  }
};

export { uploadOnCloudinary };
