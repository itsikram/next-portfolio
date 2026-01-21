import { useState, useEffect } from 'react';
import styles from '../styles/ContactInfo.module.scss';
import Envelope from '@/Icons/Envelope';
import { Github, Linkedin } from 'lucide-react';
import api from '@/config/axios';

interface ContactData {
  personalInfo: {
    emails: string[];
    phones: string[];
    addresses: string[];
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    displayName: string;
  }>;
}

export default function ContactInfo() {
  const [contact, setContact] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await api.get('/contact');
        setContact(response.data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (loading) {
    return <div>Loading contact information...</div>;
  }

  if (!contact) {
    return <div>Contact information not available.</div>;
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return <Github size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      default:
        return <div className={styles.defaultIcon}>{platform[0]?.toUpperCase()}</div>;
    }
  };

  return (
    <section className={styles.contactContainer}>
      <h2 className="about-title color-wh">
        <span>Get In Touch</span>
        <div className='title-border'>
          <div className='title-border-width'></div>
        </div>
      </h2>
      
      <div className={styles.contactContent}>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <Envelope />
            <div>
              <h4>Email</h4>
              <div className={styles.contactDetails}>
                {contact.personalInfo.emails.map((email, index) => (
                  <a key={index} href={`mailto:${email}`}>{email}</a>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.contactItem}>
            <div className={styles.phoneIcon}>📱</div>
            <div>
              <h4>Mobile</h4>
              <div className={styles.contactDetails}>
                {contact.personalInfo.phones.map((phone, index) => (
                  <a key={index} href={`tel:${phone}`}>{phone}</a>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.contactItem}>
            <div className={styles.locationIcon}>📍</div>
            <div>
              <h4>Address</h4>
              {contact.personalInfo.addresses.map((address, index) => (
                <p key={index}>{address}</p>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.socialLinks}>
          <h3>Connect With Me</h3>
          <div className={styles.socialButtons}>
            {contact.socialLinks.map((social, index) => (
              <a 
                key={index}
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialButton}
              >
                {getSocialIcon(social.platform)}
                <span>{social.displayName}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
