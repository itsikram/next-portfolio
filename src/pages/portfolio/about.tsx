import Brush from '@/Icons/Brush';
import Globe from '@/Icons/Globe';
import VsCode from '@/Icons/VsCode';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
            <img src={'https://programmerikram.com/wp-content/uploads/2025/05/ikramul-islam-scaled.jpg'} alt='' />
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
                  <td>:  English, Bangali, Hindi </td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>: Dhaka, Bangladesh</td>
                </tr>


                <tr>
                  <td>Freelance</td>
                  <td>:  Available </td>
                </tr>
              </tbody>
            </table>
            <p className='about-info-desc color-tc'>
              I am a frontend web developer. I can provide clean code and pixel perfect design. I also make website more & more interactive with web animations.
            </p>
            <a className='about-info-button color-wh' download={true} href='https://programmerikram.com/wp-content/uploads/2025/03/Md-Ikram-cv-WordPress-Developer.pdf'>Download Cv</a>
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

            <h3 className='service-title'>Web Design</h3>
            <div className='separator'></div>
            <p className='service-desc'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod.
            </p>
          </div>
          <div className='about-service'>
            <div className='service-icon-container'>
              <VsCode />
            </div>

            <h3 className='service-title'>Web Development</h3>
            <div className='separator'></div>
            <p className='service-desc'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod.
            </p>
          </div>
          <div className='about-service'>
            <div className='service-icon-container'>
              <Globe />
            </div>

            <h3 className='service-title'>UI/UX</h3>
            <div className='separator'></div>
            <p className='service-desc'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod.
            </p>
          </div>
        </div>

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
      </section>

    </>
  );


}
