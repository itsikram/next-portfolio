import React, { useState } from 'react';
import adminApi from '@/config/adminApi';

interface FaviconUploadProps {
  currentFavicon?: string;
  onFaviconUpdate: (faviconUrl: string) => void;
}

const FaviconUpload: React.FC<FaviconUploadProps> = ({ currentFavicon, onFaviconUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (should be .ico or image)
    const validTypes = ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png', 'image/jpeg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid favicon file (.ico, .png, .jpg, .gif)');
      return;
    }

    // Validate file size (max 100KB for favicon)
    if (file.size > 100 * 1024) {
      setError('Favicon file size should be less than 100KB');
      return;
    }

    const formData = new FormData();
    formData.append('favicon', file);

    try {
      setUploading(true);
      setError(null);
      
      // For file upload, we need to use regular axios with proper headers
      const uploadResponse = await adminApi.post('/upload/favicon', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const faviconUrl = uploadResponse.data.url;
      onFaviconUpdate(faviconUrl);
      
      // Update general details with new favicon
      await adminApi.put('/general-details', {
        siteDetails: {
          logo: faviconUrl
        }
      });
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload favicon');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="favicon-upload">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Favicon
        </label>
        
        {currentFavicon && (
          <div className="mb-4 flex items-center space-x-4">
            <img 
              src={currentFavicon} 
              alt="Current favicon" 
              className="w-8 h-8 object-contain border rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="text-sm text-gray-600">Current favicon</span>
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            {uploading ? 'Uploading...' : 'Choose Favicon'}
            <input
              type="file"
              accept=".ico,.png,.jpg,.jpeg,.gif"
              onChange={handleFaviconUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          
          <span className="text-sm text-gray-500">
            Recommended: 32x32px, .ico format, max 100KB
          </span>
        </div>
        
        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaviconUpload;
