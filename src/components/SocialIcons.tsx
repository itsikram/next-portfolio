import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaGlobe } from 'react-icons/fa';
import api from '../config/axios';

interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  website: string;
}

export default function SocialIcons() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    github: "https://github.com/itsikram",
    linkedin: "https://www.linkedin.com/in/programmer-ikram/",
    twitter: "https://twitter.com/yourusername",
    facebook: "https://facebook.com/programmerikram",
    instagram: "https://instagram.com/yourusername",
    website: "https://yourwebsite.com"
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await api.get('/general-details');
        if (response.data && response.data.socialLinks) {
          setSocialLinks(response.data.socialLinks);
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
      }
    };

    fetchSocialLinks();
  }, []);

  const getIcon = (platform: keyof SocialLinks) => {
    switch (platform) {
      case 'github': return <FaGithub size={30} />;
      case 'linkedin': return <FaLinkedin size={30} />;
      case 'twitter': return <FaTwitter size={30} />;
      case 'facebook': return <FaFacebook size={30} />;
      case 'instagram': return <FaInstagram size={30} />;
      case 'website': return <FaGlobe size={30} />;
      default: return <FaGlobe size={30} />;
    }
  };

  const renderSocialIcon = (platform: keyof SocialLinks) => {
    const url = socialLinks[platform];
    if (!url || url === `https://yourusername.com` || url === `https://yourwebsite.com`) {
      return null;
    }

    return (
      <a 
        key={platform}
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={platform}
      >
        {getIcon(platform)}
      </a>
    );
  };

  return (
    <div className="flex space-x-4">
      {renderSocialIcon('github')}
      {renderSocialIcon('linkedin')}
      {renderSocialIcon('twitter')}
      {renderSocialIcon('facebook')}
      {renderSocialIcon('instagram')}
      {renderSocialIcon('website')}
    </div>
  );
}
