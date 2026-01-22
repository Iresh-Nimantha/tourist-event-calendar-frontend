/**
 * Image Upload Utility
 * Supports multiple methods: Imgur API, direct URL, or base64
 */

// Imgur API (free tier - no API key needed for anonymous uploads)
const IMGUR_CLIENT_ID = import.meta.env.VITE_IMGUR_CLIENT_ID || "";

/**
 * Upload image to Imgur
 * @param {File} file - Image file
 * @returns {Promise<string>} Image URL
 */
export const uploadToImgur = async (file) => {
  if (!IMGUR_CLIENT_ID) {
    throw new Error("VITE_IMGUR_CLIENT_ID is not configured. Please add it to your .env file or use direct URL input.");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.data?.error || "Failed to upload image");
    }

    return data.data.link;
  } catch (error) {
    console.error("Imgur upload error:", error);
    throw error;
  }
};

/**
 * Convert file to base64
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Upload image using the best available method
 * @param {File} file - Image file
 * @returns {Promise<string>} Image URL
 */
export const uploadImage = async (file) => {
  // Validate file
  if (!file) {
    throw new Error("No file provided");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  if (file.size > 10 * 1024 * 1024) {
    // 10MB limit
    throw new Error("Image size must be less than 10MB");
  }

  // Try Imgur first if configured
  if (IMGUR_CLIENT_ID) {
    try {
      return await uploadToImgur(file);
    } catch (error) {
      console.warn("Imgur upload failed, falling back to base64:", error);
    }
  }

  // Fallback to base64 (not recommended for production, but works)
  return await fileToBase64(file);
};

/**
 * Validate image URL
 * @param {string} url - Image URL
 * @returns {boolean}
 */
export const isValidImageUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

