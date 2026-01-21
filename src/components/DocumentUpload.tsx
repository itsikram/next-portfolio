import React, { useState, useRef } from 'react';
import adminApi from '@/config/adminApi';

interface DocumentUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onFileChange?: (file: File | null) => void;
  label?: string;
  placeholder?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  value,
  onChange,
  onFileChange,
  label = "Upload Document",
  placeholder = "Click to upload document",
  accept = ".pdf",
  maxSize = 10,
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (accept === '.pdf' && file.type !== 'application/pdf') {
      alert('Please select a PDF document');
      return;
    } else if (accept.startsWith('image/') && !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size should be less than ${maxSize}MB`);
      return;
    }

    setFileName(file.name);
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      const endpoint = accept === '.pdf' ? '/upload/document' : '/upload/image';
      const fieldName = accept === '.pdf' ? 'document' : 'image';
      formData.append(fieldName, file);

      const response = await adminApi.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      onChange(response.data.url);
      
      if (onFileChange) {
        onFileChange(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveDocument = () => {
    setFileName("");
    onChange("");
    if (onFileChange) {
      onFileChange(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getDocumentIcon = () => {
    if (value) {
      if (value.includes('.pdf')) return '📄';
      if (value.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return '🖼️';
      return '📎';
    }
    return '📁';
  };

  return (
    <div className={`document-upload ${className}`}>
      {label && <label className="form-label">{label}</label>}
      
      <div className="document-upload-container">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {value ? (
          <div className="document-preview">
            <div className="document-info">
              <span className="document-icon">{getDocumentIcon()}</span>
              <div className="document-details">
                <span className="document-name">{fileName || "Document uploaded"}</span>
                <a 
                  href={value} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="document-link"
                >
                  View Document
                </a>
              </div>
            </div>
            <div className="document-actions">
              <button
                type="button"
                onClick={handleUploadClick}
                className="change-document-btn"
                title="Change document"
              >
                📝
              </button>
              <button
                type="button"
                onClick={handleRemoveDocument}
                className="remove-document-btn"
                title="Remove document"
              >
                ×
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="upload-placeholder"
            onClick={handleUploadClick}
          >
            <div className="upload-content">
              <div className="upload-icon">{accept.startsWith('image/') ? '🖼️' : '📄'}</div>
              <span>{placeholder}</span>
              <small>Max size: {maxSize}MB</small>
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default DocumentUpload;
