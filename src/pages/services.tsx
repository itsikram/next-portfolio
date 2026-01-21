import Brush from '@/Icons/Brush';
import Globe from '@/Icons/Globe';
import VsCode from '@/Icons/VsCode';
import Briefcase from '@/Icons/Briefcase';
import GraduationCap from '@/Icons/GraduationCap';
import ContactInfo from '@/components/ContactInfo';
import Image from 'next/image';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import serverApi from '@/config/server-api';

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  price: string;
  timeline: string;
  image?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  order: number;
}

interface ProcessContent {
  _id: string;
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
  createdAt: string;
  updatedAt: string;
}

interface ServicesProps {
  services: Service[];
  processContent: ProcessContent | null;
}

export default function Services({ services, processContent }: ServicesProps) {

  const getIconForService = (title: string) => {
    if (title.toLowerCase().includes('wordpress')) return <Brush />;
    if (title.toLowerCase().includes('mern') || title.toLowerCase().includes('api')) return <VsCode />;
    if (title.toLowerCase().includes('performance')) return <Globe />;
    if (title.toLowerCase().includes('custom') || title.toLowerCase().includes('enterprise')) return <Briefcase />;
    if (title.toLowerCase().includes('consulting')) return <GraduationCap />;
    return <VsCode />;
  };

  // Use process content from API or fallback to hardcoded steps
  const processSteps = processContent?.steps || [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'Understanding your requirements and creating a detailed project plan.'
    },
    {
      step: '02',
      title: 'Design & Development',
      description: 'Creating designs and developing the solution with regular updates.'
    },
    {
      step: '03',
      title: 'Testing & Quality Assurance',
      description: 'Thorough testing to ensure everything works perfectly.'
    },
    {
      step: '04',
      title: 'Deployment & Support',
      description: 'Launching the project and providing ongoing support.'
    }
  ];

  return (
    <>
      <section id='services'>
        <h2 className="services-title color-wh">
          <span>Services</span>
          <div className='title-border'>
            <div className='title-border-width'></div>
          </div>
        </h2>

        <div className='services-intro'>
          <p className='services-intro-text color-tc'>
            I offer comprehensive web development services tailored to meet your business needs. 
            With expertise in modern technologies and best practices, I deliver high-quality solutions 
            that drive results and exceed expectations.
          </p>
        </div>

        <div className='services-grid'>
          {services.length > 0 ? (
            services.map((service) => (
              <Link key={service._id} href={`/services/${service._id}`} className='service-card-link'>
                <div className='service-card'>
                  <div className='service-header'>
                    <div className='service-icon-container'>
                      {getIconForService(service.title)}
                    </div>
                    <div className='service-meta'>
                      <span className='service-category'>{service.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <h3 className='service-title'>{service.title}</h3>
                    </div>
                  </div>
                  
                  {service.image && (
                    <div className='service-image-container'>
                      <Image 
                        src={service.image} 
                        alt={service.title}
                        width={400}
                        height={250}
                        className='service-image'
                      />
                    </div>
                  )}
                  
                  <p className='service-description color-tc'>{service.description}</p>
                  
                  <div className='service-features'>
                    <h4 className='features-title'>Key Features:</h4>
                    <ul className='features-list'>
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className='feature-item color-tc'>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className='service-footer'>
                    <div className='service-info'>
                      <div className='info-item'>
                        <span className='info-label'>Price:</span>
                        <span className='info-value color-pc'>{service.price}</span>
                      </div>
                      <div className='info-item'>
                        <span className='info-label'>Timeline:</span>
                        <span className='info-value color-pc'>{service.timeline}</span>
                      </div>
                    </div>
                    <button className='service-btn'>View Details</button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className='error-state'>No services available</div>
          )}
        </div>

        <h2 className="services-title color-wh">
          <span>{processContent?.title || 'Process'}</span>
          <div className='title-border'>
            <div className='title-border-width'></div>
          </div>
        </h2>

        <div className='process-container'>
          {processSteps.map((step, index) => (
            <div key={index} className='process-step'>
              <div className='step-number'>{step.step}</div>
              <div className='step-content'>
                <h3 className='step-title color-wh'>{step.title}</h3>
                <p className='step-description color-tc'>{step.description}</p>
              </div>
              {index < processSteps.length - 1 && <div className='step-connector'></div>}
            </div>
          ))}
        </div>

        <div className='services-cta'>
          <h2 className='cta-title color-wh'>Ready to Start Your Project?</h2>
          <p className='cta-description color-tc'>
            Let&apos;s discuss how I can help bring your ideas to life with professional web development services.
          </p>
          <div className='cta-buttons'>
            <button className='cta-btn-primary'>Get Started</button>
            <button className='cta-btn-secondary'>View Portfolio</button>
          </div>
        </div>

        <ContactInfo />
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ServicesProps> = async () => {
  try {
    const [servicesResponse, processResponse] = await Promise.all([
      serverApi.get('/api/services'),
      serverApi.get('/api/process-content')
    ]);

    return {
      props: {
        services: servicesResponse.data?.services || [],
        processContent: processResponse.data || null
      }
    };
  } catch (error) {
    console.error('Error fetching services page data:', error);
    return {
      props: {
        services: [],
        processContent: null
      }
    };
  }
};
