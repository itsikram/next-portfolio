import React, { useEffect, useState } from 'react';
import api from '../config/axios';

interface FaviconDisplayProps {
  className?: string;
}

const FaviconDisplay: React.FC<FaviconDisplayProps> = ({ className = '' }) => {
  const [faviconUrl, setFaviconUrl] = useState<string>('/favicon.ico');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const response = await api.get('/general-details');
        const logo = response.data?.siteDetails?.logo;
        if (logo) {
          setFaviconUrl(logo);
        }
      } catch (error) {
        console.error('Error fetching favicon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavicon();
  }, []);

  if (loading) {
    return <div className={`w-6 h-6 bg-gray-200 rounded animate-pulse ${className}`} />;
  }

  return (
    <img 
      src={faviconUrl} 
      alt="Site favicon" 
      className={`w-6 h-6 object-contain ${className}`}
      onError={(e) => {
        // Fallback to default favicon if custom one fails to load
        const target = e.target as HTMLImageElement;
        target.src = '/favicon.ico';
      }}
    />
  );
};

export default FaviconDisplay;
