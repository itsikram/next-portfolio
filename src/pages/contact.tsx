import Head from 'next/head';
import { useCallback, useState } from 'react';
import api from '@/config/axios';
import Telephone from '@/Icons/Telephone';
import Envelope from '@/Icons/Envelope';
import LocationArrowRight from '@/Icons/LocationArrowRight';
import { GetServerSideProps } from 'next';
import serverApi from '@/config/server-api';

interface ContactData {
  personalInfo: {
    emails: string[];
    phones: string[];
    addresses: string[];
  };
  contactForm: {
    recipientEmail: string;
    notificationEmail: string;
  };
}

interface ContactProps {
  contact: ContactData | null;
}

export default function Contact({ contact }: ContactProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }, [form]);

  const handleSubmit = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');
    
    try {
      // Send message through Express server
      await api.post('/contact/send', {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message
      });
      
      setSubmitMessage('Message sent successfully!');
      setMessageType('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitMessage('Failed to send message. Please try again.');
      setMessageType('error');
      
      // Auto-hide error message after 8 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 8000);
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  return (
    <>
      <Head>
        <title>Contact - Md Ikram</title>
      </Head>
      <section id='contact'>
        <h2 className="contact-title color-wh">
          <span>
            Contact Me
          </span>

          <div className='title-border'>

            <div className='title-border-width'></div>
          </div>
        </h2>
        <div className='section-container'>
          <div className='contact-form-container'>

            <h2 className='form-title'>Get In Touch</h2>

            <div className='form-group'>
              <label htmlFor="yourName">Enter Your Name</label>
              <input id='yourName' placeholder='' name='name' required={true} onChange={handleFormChange} value={form.name} />
            </div>
            <div className='form-group'>
              <label htmlFor="yourEmail">Enter Your Email</label>
              <input id='yourEmail' placeholder='' name='email' required={true} onChange={handleFormChange} value={form.email} />
            </div>
            <div className='form-group'>
              <label htmlFor="yourSubject">Enter Your Subject</label>
              <input id='youryourSubjectName' placeholder='' name='subject' required={true} onChange={handleFormChange} value={form.subject} />
            </div>
            <div className='form-group'>
              <label htmlFor="yourMessage">Enter Your Message *</label>
              <textarea id='yourMessage' rows={10} placeholder='' name='message' required={true} onChange={handleFormChange} value={form.message} />
            </div>

            <button className='submit-button' onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'SENDING...' : 'SEND MAIL'}
            </button>
            
            {submitMessage && (
              <div className={`submit-message ${messageType}`}>
                {submitMessage}
              </div>
            )}

          </div>
          <div className='contact-info-container'>

            <div className='info-row'>

              <div className='icon-container'>
                <Telephone />
              </div>
              <div className='data-container'>
                <label>Phone</label>
                {contact?.personalInfo.phones.map((phone, index) => (
                  <a key={index} href={`tel:${phone}`}>{phone}</a>
                ))}
              </div>


            </div>
            <div className='info-row'>

              <div className='icon-container'>
                <Envelope />
              </div>
              <div className='data-container'>
                <label>Email</label>
                {contact?.personalInfo.emails.map((email, index) => (
                  <a key={index} href={`mailto:${email}`}>{email}</a>
                ))}
              </div>


            </div>
            <div className='info-row'>

              <div className='icon-container'>
                <LocationArrowRight />
              </div>
              <div className='data-container'>
                <label>Address</label>
                {contact?.personalInfo.addresses.map((address, index) => (
                  <a key={index} href='#'>{address}</a>
                ))}
              </div>


            </div>


          </div>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ContactProps> = async () => {
  try {
    const response = await serverApi.get('/api/contact');
    
    return {
      props: {
        contact: response.data || null
      }
    };
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return {
      props: {
        contact: null
      }
    };
  }
};
