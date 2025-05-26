import Head from 'next/head';
import { useCallback, useState } from 'react';
import axios from 'axios';
import Telephone from '@/Icons/Telephone';
import Envelope from '@/Icons/Envelope';
import LocationArrowRight from '@/Icons/LocationArrowRight';



export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const sendEmailNotification = async (
    email: string,
    subject: string,
    message: string,
    senderName: string
  ): Promise<void> => {

    try {
      const response = await axios.post('https://programmerikram.com/wp-json/portfolio/v1/send-mail', {
        name: senderName,
        email,
        message,
        subject: `${subject} - From Portfolio `,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
    }  catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    console.error('Error sending mail:', err.response?.data || err.message);
  } else {
    console.error('An unknown error occurred:', err);
  }
}
  }

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }, [form]);

  const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sendEmailNotification('mdikram295@gmail.com', form.subject, `Message Received!\n\n${JSON.stringify(form, null, 2)}`, form.name)
    // alert(`Message Sent!\n\n${JSON.stringify(form, null, 2)}`);
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
              <input id='yourName' placeholder='' name='name' required={true} onChange={handleFormChange} />
            </div>
            <div className='form-group'>
              <label htmlFor="yourEmail">Enter Your Email</label>
              <input id='yourEmail' placeholder='' name='email' required={true} onChange={handleFormChange} />
            </div>
            <div className='form-group'>
              <label htmlFor="yourSubject">Enter Your Subject</label>
              <input id='youryourSubjectName' placeholder='' name='subject' required={true} onChange={handleFormChange} />
            </div>
            <div className='form-group'>
              <label htmlFor="yourMessage">Enter Your Message *</label>
              <textarea id='yourMessage' rows={10} placeholder='' name='message' required={true} onChange={handleFormChange}> </textarea>
            </div>

            <button className='submit-button' onClick={handleSubmit}>SEND MAIL</button>

          </div>
          <div className='contact-info-container'>

            <div className='info-row'>

              <div className='icon-container'>
                <Telephone />
              </div>
              <div className='data-container'>
                <label>Phone</label>
                <a href='tel:+8801601216268'>+8801601216268</a>
                <a href='tel:+8801601216268'>+8801581400711</a>
              </div>


            </div>
            <div className='info-row'>

              <div className='icon-container'>
                <Envelope />
              </div>
              <div className='data-container'>
                <label>Email</label>
                <a href='mailto:mdikram295@gmail.com'>mdikram295@gmail.com</a>
                <a href='mailto:ikramapple123@gmail.com'>ikramapple123@gmail.com</a>
              </div>


            </div>
            <div className='info-row'>

              <div className='icon-container'>
                <LocationArrowRight />
              </div>
              <div className='data-container'>
                <label>Address</label>
                <a href='#'>Boikhar, Sadar Munshiganj</a>
                <a href='#'>Dhaka, Bangladesh</a>
              </div>


            </div>


          </div>
        </div>
      </section>
    </>
  );
}
