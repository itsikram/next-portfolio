import styles from '../styles/ContactInfo.module.scss';
import Envelope from '@/Icons/Envelope';
import { Github, Linkedin } from 'lucide-react';

export default function ContactInfo() {
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
              <a href="mailto:mdikram295@gmail.com">mdikram295@gmail.com</a>
            </div>
          </div>
          
          <div className={styles.contactItem}>
            <div className={styles.phoneIcon}>📱</div>
            <div>
              <h4>Mobile</h4>
              <a href="tel:+8801581400711">+8801581400711</a>
            </div>
          </div>
          
          <div className={styles.contactItem}>
            <div className={styles.locationIcon}>📍</div>
            <div>
              <h4>Address</h4>
              <p>Biler Kani, Munshiganj, Bangladesh</p>
            </div>
          </div>
        </div>
        
        <div className={styles.socialLinks}>
          <h3>Connect With Me</h3>
          <div className={styles.socialButtons}>
            <a 
              href="https://github.com/itsikram" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialButton}
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/programmer-ikram/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialButton}
            >
              <Linkedin size={20} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
