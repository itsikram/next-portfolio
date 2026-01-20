import Brush from '@/Icons/Brush';
import Globe from '@/Icons/Globe';
import VsCode from '@/Icons/VsCode';
import Briefcase from '@/Icons/Briefcase';
import GraduationCap from '@/Icons/GraduationCap';
import ContactInfo from '@/components/ContactInfo';

export default function Services() {
  const services = [
    {
      icon: <Brush />,
      title: 'WordPress Development',
      category: 'Web Development',
      description: 'Custom WordPress themes, plugins, and full-stack solutions with performance optimization and SEO best practices.',
      features: [
        'Custom Theme Development',
        'Plugin Development',
        'E-commerce Solutions',
        'Performance Optimization',
        'SEO Implementation'
      ],
      price: 'Starting from $999',
      timeline: '2-4 weeks'
    },
    {
      icon: <VsCode />,
      title: 'MERN Stack Development',
      category: 'Full Stack Development',
      description: 'Full-stack web applications using MongoDB, Express.js, React.js, and Node.js with scalable architecture.',
      features: [
        'React.js Frontend',
        'Node.js Backend',
        'MongoDB Database',
        'RESTful APIs',
        'Real-time Applications'
      ],
      price: 'Starting from $1,499',
      timeline: '4-8 weeks'
    },
    {
      icon: <Globe />,
      title: 'Performance Optimization',
      category: 'Optimization',
      description: 'Website speed optimization, code optimization, and performance tuning for better user experience and search rankings.',
      features: [
        'Page Speed Optimization',
        'Code Minification',
        'Image Optimization',
        'Caching Strategies',
        'CDN Implementation'
      ],
      price: 'Starting from $499',
      timeline: '1-2 weeks'
    },
    {
      icon: <Briefcase />,
      title: 'Custom Web Applications',
      category: 'Enterprise Solutions',
      description: 'Tailored web applications for businesses with advanced features and scalable architecture.',
      features: [
        'Business Logic Implementation',
        'User Authentication',
        'Database Design',
        'API Integration',
        'Cloud Deployment'
      ],
      price: 'Starting from $2,999',
      timeline: '6-12 weeks'
    },
    {
      icon: <GraduationCap />,
      title: 'Technical Consulting',
      category: 'Consultation',
      description: 'Expert technical consultation for project planning, architecture design, and technology stack selection.',
      features: [
        'Project Planning',
        'Architecture Design',
        'Technology Stack Selection',
        'Code Review',
        'Best Practices Guidance'
      ],
      price: 'Starting from $299',
      timeline: '1 week'
    },
    {
      icon: <VsCode />,
      title: 'API Development',
      category: 'Backend Development',
      description: 'RESTful and GraphQL API development with proper documentation and security measures.',
      features: [
        'RESTful APIs',
        'GraphQL APIs',
        'API Documentation',
        'Authentication & Security',
        'Rate Limiting'
      ],
      price: 'Starting from $799',
      timeline: '2-3 weeks'
    }
  ];

  const processSteps = [
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
          {services.map((service, index) => (
            <div key={index} className='service-card'>
              <div className='service-header'>
                <div className='service-icon-container'>
                  {service.icon}
                </div>
                <div className='service-meta'>
                  <span className='service-category'>{service.category}</span>
                  <h3 className='service-title'>{service.title}</h3>
                </div>
              </div>
              
              <p className='service-description color-tc'>{service.description}</p>
              
              <div className='service-features'>
                <h4 className='features-title'>Key Features:</h4>
                <ul className='features-list'>
                  {service.features.map((feature, idx) => (
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
                <button className='service-btn'>Get Quote</button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="services-title color-wh">
          <span>Process</span>
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
