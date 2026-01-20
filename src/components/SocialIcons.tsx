import { FaGithub, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';

export default function SocialIcons() {
  return (
    <div className="flex space-x-4">
      <a href="https://github.com/itsikram" target="_blank" rel="noopener noreferrer">
        <FaGithub size={30} />
      </a>
      <a href="https://www.linkedin.com/in/programmer-ikram/" target="_blank" rel="noopener noreferrer">
        <FaLinkedin size={30} />
      </a>
      <a href="https://facebook.com/programmerikram" target="_blank" rel="noopener noreferrer">
        <FaFacebook size={30} />
      </a>
      
    </div>
  );
}
