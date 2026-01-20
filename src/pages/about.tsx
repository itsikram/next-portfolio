import Brush from '@/Icons/Brush';
import Globe from '@/Icons/Globe';
import VsCode from '@/Icons/VsCode';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SkillsSection from '@/components/SkillsSection';
import ContactInfo from '@/components/ContactInfo';
import Image from 'next/image';

// type _reviewType = {
//   text: string,
//   author: string,
//   src: string
// }

export default function About() {

  const reviews = [
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod. 1',
      author: 'Baish',
      src: 'Freelancer.com'
    },
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod. 2',
      author: 'Baish',
      src: 'Freelancer.com'
    },
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod. 3',
      author: 'Baish',
      src: 'Freelancer.com'
    },
  ]
  return (
    <>
      {/* <Head>
                <title>Home - Portfolio of Md Ikram</title>
            </Head> */}
      <section id='about'>
        <h2 className="about-title color-wh">
          <span>
            About Me

          </span>

          <div className='title-border'>

            <div className='title-border-width'></div>
          </div>
        </h2>

        <div className='about-info-container'>
          <div className='about-info-image'>
            <Image src={'/images/profile.jpg'} alt='Md Ikram' width={300} height={300} />
          </div>
          <div className='about-info-details'>
            <h2 className='about-info-title color-wh'>
              I am <span className='color-pc'>Md Ikram</span>
            </h2>


            <table className='about-info-table'>
              <tbody>
                <tr>
                  <td>Full Name</td>
                  <td>:  Md Ikram</td>
                </tr>
                <tr>
                  <td>Date of Birth</td>
                  <td>:  16/07/2003</td>
                </tr>
                <tr>
                  <td>Age</td>
                  <td>:  22 Years</td>
                </tr>
                <tr>
                  <td>Nationality</td>
                  <td>:  Bangladeshi</td>
                </tr>
                <tr>
                  <td>Experience</td>
                  <td>:  5+ Years</td>
                </tr>
                <tr>
                  <td>Languages</td>
                  <td>:  English, Bengali</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>: Biler Kani, Munshiganj, Bangladesh</td>
                </tr>
                <tr>
                  <td>Mobile</td>
                  <td>: +8801581400711</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>: mdikram295@gmail.com</td>
                </tr>
                <tr>
                  <td>Freelance</td>
                  <td>:  Available </td>
                </tr>
              </tbody>
            </table>
            <p className='about-info-desc color-tc'>
              Full Stack WordPress & MERN Developer with 5+ years of experience delivering high-performance websites and scalable applications for global clients. Specialized in custom WordPress architecture, React-based interfaces, and performance optimization with a strong focus on user experience and business growth.
            </p>
            <a className='about-info-button color-wh' download={true} href='/Senior Software Developer.pdf'>Download Cv</a>
          </div>
        </div>


        <h2 className="about-title color-wh">
          <span>
            Services

          </span>

          <div className='title-border'>

            <div className='title-border-width'></div>
          </div>
        </h2>
        <div className='about-services-container color-tc'>
          <div className='about-service'>
            <div className='service-icon-container'>
              <Brush />
            </div>

            <h3 className='service-title'>WordPress Development</h3>
            <div className='separator'></div>
            <p className='service-desc'>
              Custom WordPress themes, plugins, and full-stack solutions with performance optimization and SEO best practices.
            </p>
          </div>
          <div className='about-service'>
            <div className='service-icon-container'>
              <VsCode />
            </div>

            <h3 className='service-title'>MERN Stack Development</h3>
            <div className='separator'></div>
            <p className='service-desc'>
              Full-stack web applications using MongoDB, Express.js, React.js, and Node.js with scalable architecture.
            </p>
          </div>
          <div className='about-service'>
            <div className='service-icon-container'>
              <Globe />
            </div>

            <h3 className='service-title'>Performance Optimization</h3>
            <div className='separator'></div>
            <p className='service-desc'>
              Website speed optimization, code optimization, and performance tuning for better user experience and search rankings.
            </p>
          </div>
        </div>

        <SkillsSection />

        <h2 className="about-title color-wh">
          <span>
            Reviews

          </span>

          <div className='title-border'>

            <div className='title-border-width'></div>
          </div>
        </h2>

        <div className='about-reviews-container'>
          <Carousel showThumbs={false} autoPlay infiniteLoop>
            {reviews.map((review, key) => {

              return (
                <div key={key}>
                  <div className='about-review'>
                    <p className='review-text'>{review.text}</p>
                    <h4 className='review-author'>{review.author}</h4>
                    <span className='review-src'>{review.src}</span>
                  </div>
                </div>
              )

            })}

          
          </Carousel>
        </div>

        <ContactInfo />
      </section>

    </>
  );


}
