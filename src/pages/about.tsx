import Brush from '@/Icons/Brush';
import Globe from '@/Icons/Globe';
import VsCode from '@/Icons/VsCode';
import Code from '@/Icons/Code';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SkillsSection from '@/components/SkillsSection';
import ContactInfo from '@/components/ContactInfo';
import Image from 'next/image';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import serverApi from '../config/server-api';

interface AboutContent {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    age: string;
    nationality: string;
    experience: string;
    languages: string;
    address: string;
    mobile: string;
    email: string;
    freelance: string;
    profileImage: string;
    description: string;
  };
  reviews: Array<{
    text: string;
    author: string;
    source: string;
  }>;
  technicalSkills?: {
    frontend: string[];
    backend: string[];
    database: string[];
    tools: string[];
  };
  keyStrengths?: string[];
  cvDownloadUrl: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  category: string;
  pricing: string;
  price: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AboutProps {
  aboutContent: AboutContent;
  services: Service[];
  generalDetails: { cvDownloadUrl: string };
}

export default function About({ aboutContent, services, generalDetails }: AboutProps) {

  const getIconComponent = (iconName: string) => {
    switch(iconName.toLowerCase()) {
      case 'brush': return <Brush />;
      case 'vscode': return <VsCode />;
      case 'globe': return <Globe />;
      default: return <VsCode />;
    }
  };

  return (
    <>
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
            <Image src={aboutContent.personalInfo.profileImage} alt='Md Ikram' className='profile-image' fill />
          </div>
          <div className='about-info-details'>
            <h2 className='about-info-title color-wh'>
              I am <span className='color-pc'>{aboutContent.personalInfo.fullName}</span>
            </h2>

            <table className='about-info-table'>
              <tbody>
                <tr>
                  <td>Full Name</td>
                  <td>:  {aboutContent.personalInfo.fullName}</td>
                </tr>
                <tr>
                  <td>Date of Birth</td>
                  <td>:  {aboutContent.personalInfo.dateOfBirth}</td>
                </tr>
                <tr>
                  <td>Age</td>
                  <td>:  {aboutContent.personalInfo.age}</td>
                </tr>
                <tr>
                  <td>Nationality</td>
                  <td>:  {aboutContent.personalInfo.nationality}</td>
                </tr>
                <tr>
                  <td>Experience</td>
                  <td>:  {aboutContent.personalInfo.experience}</td>
                </tr>
                <tr>
                  <td>Languages</td>
                  <td>:  {aboutContent.personalInfo.languages}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>: {aboutContent.personalInfo.address}</td>
                </tr>
                <tr>
                  <td>Mobile</td>
                  <td>: {aboutContent.personalInfo.mobile}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>: {aboutContent.personalInfo.email}</td>
                </tr>
                <tr>
                  <td>Freelance</td>
                  <td>:  {aboutContent.personalInfo.freelance}</td>
                </tr>
              </tbody>
            </table>
            <p className='about-info-desc color-tc'>
              {aboutContent.personalInfo.description}
            </p>
            <a className='about-info-button color-wh' download={true} href={generalDetails.cvDownloadUrl}>Download Cv</a>
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
          {services.map((service: Service, index: number) => (
            <Link key={service._id} href={`/services/${service._id}`} className='service-link'>
              <div className='about-service'>
                <div className='service-icon-container'>
                  {getIconComponent(service.icon)}
                </div>

                <div className='service-category'>
                  {service.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>

                <h3 className='service-title'>{service.title}</h3>
                <div className='separator'></div>
                <p className='service-desc'>
                  {service.description}
                </p>
                
                {service.features && service.features.length > 0 && (
                  <div className='service-features'>
                    <h4 className='features-title'>Key Features:</h4>
                    <ul className='features-list'>
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className='feature-item'>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <SkillsSection 
          technicalSkills={aboutContent.technicalSkills}
          keyStrengths={aboutContent.keyStrengths}
        />

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
            {aboutContent.reviews.map((review, key) => (
              <div key={key}>
                <div className='about-review'>
                  <p className='review-text'>{review.text}</p>
                  <h4 className='review-author'>{review.author}</h4>
                  <span className='review-src'>{review.source}</span>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <ContactInfo />
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<AboutProps> = async () => {
  try {
    const [aboutResponse, servicesResponse, generalResponse] = await Promise.all([
      serverApi.get('/api/about-content'),
      serverApi.get('/api/services'),
      serverApi.get('/api/general-details')
    ]);

    return {
      props: {
        aboutContent: aboutResponse.data || {
          personalInfo: {
            fullName: "Md Ikram",
            dateOfBirth: "16/07/2003",
            age: "22 Years",
            nationality: "Bangladeshi",
            experience: "5+ Years",
            languages: "English, Bengali",
            address: "Biler Kani, Munshiganj, Bangladesh",
            mobile: "+8801581400711",
            email: "mdikram295@gmail.com",
            freelance: "Available",
            profileImage: "/images/profile.jpg",
            description: "Full Stack WordPress & MERN Developer with 5+ years of experience."
          },
          reviews: [
            {
              text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem tenetur ratione quod.',
              author: 'Baish',
              source: 'Freelancer.com'
            }
          ],
          cvDownloadUrl: "/Senior Software Developer.pdf"
        },
        services: servicesResponse.data?.services || [],
        generalDetails: generalResponse.data || { cvDownloadUrl: "/Senior Software Developer.pdf" }
      }
    };
  } catch (error) {
    console.error('Error fetching about page data:', error);
    return {
      props: {
        aboutContent: {
          personalInfo: {
            fullName: "Md Ikram",
            dateOfBirth: "16/07/2003",
            age: "22 Years",
            nationality: "Bangladeshi",
            experience: "5+ Years",
            languages: "English, Bengali",
            address: "Biler Kani, Munshiganj, Bangladesh",
            mobile: "+8801581400711",
            email: "mdikram295@gmail.com",
            freelance: "Available",
            profileImage: "/images/profile.jpg",
            description: "Full Stack WordPress & MERN Developer with 5+ years of experience."
          },
          reviews: [
            {
              text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
              author: 'Baish',
              source: 'Freelancer.com'
            }
          ],
          cvDownloadUrl: "/Senior Software Developer.pdf"
        },
        services: [],
        generalDetails: { cvDownloadUrl: "/Senior Software Developer.pdf" }
      }
    };
  }
};
