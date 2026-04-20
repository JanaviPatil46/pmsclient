


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'material-react-toastify';
import { Upload, Pencil, Loader2 } from 'lucide-react';

const ProfilePictureUpload = ({ accountId, currentImage, onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);
console.log("Current Image:", currentImage);
console.log("Preview Image:", preview);
  // Update preview when currentImage changes
  useEffect(() => {
    if (currentImage) {
      setPreview(`https://www.snptaxes.com/${currentImage}`);
    }
  }, [currentImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.warning('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', image);

    try {
      setIsUploading(true);
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${accountId}/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success('Profile picture updated successfully');
      if (onUploadSuccess) onUploadSuccess(); // <-- Call refetch
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
      setImage(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar with edit overlay */}
      <div className="relative">
        <div className="h-28 w-28 rounded-full border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-muted-foreground select-none">?</span>
          )}
        </div>
        <input
          accept="image/*"
          className="hidden"
          id="profile-picture-upload"
          type="file"
          onChange={handleImageChange}
        />
        <label
          htmlFor="profile-picture-upload"
          className="absolute bottom-0 right-0 cursor-pointer rounded-lg bg-primary p-1.5 hover:bg-primary/90 transition-colors shadow-md"
        >
          <Pencil size={14} className="text-primary-foreground" />
        </label>
      </div>

      {image && (
        <div className="w-full space-y-2">
          <p className="text-xs text-muted-foreground text-center">
            {image.name} &mdash; {Math.round(image.size / 1024)} KB
          </p>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <><Loader2 size={15} className="animate-spin" /> Uploading...</>
            ) : (
              <><Upload size={15} /> Upload Profile Picture</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
