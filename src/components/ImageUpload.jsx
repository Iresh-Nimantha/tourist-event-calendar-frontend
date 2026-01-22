import React, { useState } from "react";
import { uploadImage, isValidImageUrl } from "../utils/imageUpload";
import { toast } from "react-hot-toast";

const ImageUpload = ({ value, onChange, label = "Image", required = false }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadImage(file);
      setPreview(imageUrl);
      onChange(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreview(url);
    if (isValidImageUrl(url) || url === "") {
      onChange(url);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Preview */}
      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Upload Options */}
      <div className="space-y-3">
        {/* File Upload */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          {uploading && (
            <p className="text-sm text-blue-600 mt-1">Uploading...</p>
          )}
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* URL Input */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Enter Image URL</label>
          <input
            type="url"
            value={preview || ""}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Upload an image file or paste an image URL. Supported formats: JPG, PNG, GIF, WebP (max 10MB)
      </p>
    </div>
  );
};

export default ImageUpload;

