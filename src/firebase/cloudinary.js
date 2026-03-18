const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
 
/**
 * Cloudinary-তে image upload করে URL return করে
 * @param {File} file - input থেকে নেওয়া image file
 * @param {Function} onProgress - upload progress callback (0-100)
 * @returns {Promise<string>} - uploaded image URL
 */
export const uploadImageToCloudinary = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "fashionbd/products"); // Cloudinary-তে এই folder-এ যাবে
 
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
 
    // Progress tracking
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });
 
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url); // https:// URL return করবে
      } else {
        reject(new Error("Upload failed"));
      }
    });
 
    xhr.addEventListener("error", () => reject(new Error("Network error")));
 
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};