import React, { useState, useRef } from 'react';
import adminApi from '@/config/adminApi';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onFileChange?: (file: File | null) => void;
  label?: string;
  placeholder?: string;
  folder?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onFileChange,
  label = "Upload Image",
  placeholder = "Click to upload image",
  folder = "portfolio",
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setPreview(previewUrl);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await adminApi.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      });

      const result = response.data;
      onChange(result.url);
      
      if (onFileChange) {
        onFileChange(file);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image. Please try again.';
      alert(errorMessage);
      // Reset preview on error
      setPreview(value || "");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview("");
    onChange("");
    if (onFileChange) {
      onFileChange(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`image-upload ${className}`}>
      {label && <label className="form-label">{label}</label>}
      
      <div className="image-upload-container">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {preview ? (
          <div className="image-preview">
            <img 
              src={preview} 
              alt="Preview" 
              className="preview-image"
              style={{maxWidth: '100%'}}
            />
            <div className="image-overlay">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="remove-image-btn"
                title="Remove image"
              >
                ×
              </button>
              <button
                type="button"
                onClick={handleUploadClick}
                className="change-image-btn"
                title="Change image"
              >
                📷
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="upload-placeholder"
            onClick={handleUploadClick}
          >
            <div className="upload-content">
              <div className="upload-icon">📷</div>
              <span>{placeholder}</span>
            </div>
          </div>
        )}
      {uploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span>Uploading... {uploadProgress}%</span>
          </div>
        )}
      </div>
      
      <input
        type="hidden"
        value={preview}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default ImageUpload;
