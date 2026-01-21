import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign, CheckCircle, Send, Calendar, Users, Award, TrendingUp, Shield, Zap } from 'lucide-react';
import { GetServerSideProps } from 'next';
import serverApi from '@/config/server-api';
import styles from '@/styles/SingleService.module.scss';

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
  technologies?: string[];
  deliverables?: string[];
  maintenance?: string;
  support?: string;
}

interface FormData {
  name: string;
  email: string;
  project: string;
  budget: string;
  timeline: string;
  message: string;
}

interface ServiceProps {
  service: Service | null;
  relatedServices: Service[];
}

export default function SingleService({ service, relatedServices }: ServiceProps) {

  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    project: '',
    budget: '',
    timeline: '',
    message: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [activeTab, setActiveTab] = useState('features');
  // const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMessage('');

    try {
      // Send quote request through API
      await serverApi.post('/api/quote/send', {
        name: formData.name,
        email: formData.email,
        project: formData.project,
        budget: formData.budget,
        timeline: formData.timeline,
        message: formData.message,
        serviceTitle: service?.title
      });
      
      setFormMessage('Thank you for your quote request! I will get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        project: '',
        budget: '',
        timeline: '',
        message: ''
      });
      setTimeout(() => {
        setShowContactForm(false);
        setFormMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error sending quote request:', error);
      setFormMessage('Something went wrong. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const getIconForFeature = (feature: string) => {
    if (feature.toLowerCase().includes('security')) return <Shield size={20} />;
    if (feature.toLowerCase().includes('performance') || feature.toLowerCase().includes('speed')) return <Zap size={20} />;
    if (feature.toLowerCase().includes('support') || feature.toLowerCase().includes('maintenance')) return <Users size={20} />;
    if (feature.toLowerCase().includes('award') || feature.toLowerCase().includes('quality')) return <Award size={20} />;
    if (feature.toLowerCase().includes('growth') || feature.toLowerCase().includes('optimization')) return <TrendingUp size={20} />;
    return <CheckCircle size={20} />;
  };

  if (!service) {
    return (
      <div className={styles.errorContainer}>
        <h2>Service Not Found</h2>
        <p>The service you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/services" className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{service.title} - Md Ikram</title>
        <meta name="description" content={service.description} />
        <meta property="og:title" content={service.title} />
        <meta property="og:description" content={service.description} />
        {service.image && <meta property="og:image" content={service.image} />}
      </Head>

      <div className={styles.singleService}>
        <div className={styles.serviceHeader}>
          <Link href="/services" className={styles.backButton}>
            <ArrowLeft size={20} />
            Back to Services
          </Link>
          
          <div className={styles.serviceHero}>
            {service.image && (
              <div className={styles.serviceImageContainer}>
                <Image 
                  src={service.image} 
                  alt={service.title}
                  width={800} 
                  height={400} 
                  className={styles.serviceImage}
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = '/images/default-service.jpg';
                  }}
                />
              </div>
            )}
            
            <div className={styles.serviceMeta}>
              <div className={styles.categoryBadge}>{service.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
              <h1 className={styles.serviceTitle}>{service.title}</h1>
              <p className={styles.serviceDescription}>{service.description}</p>
              
              <div className={styles.serviceInfo}>
                <div className={styles.infoItem}>
                  <DollarSign size={20} />
                  <span>{service.price}</span>
                </div>
                <div className={styles.infoItem}>
                  <Clock size={20} />
                  <span>{service.timeline}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.serviceContent}>
          <div className={styles.tabsContainer}>
            <div className={styles.tabButtons}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'features' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('features')}
              >
                <CheckCircle size={18} />
                Features
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'technologies' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('technologies')}
              >
                <Zap size={18} />
                Technologies
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'deliverables' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('deliverables')}
              >
                <Award size={18} />
                Deliverables
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'process' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('process')}
              >
                <Calendar size={18} />
                Process
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'features' && (
                <div className={styles.featuresSection}>
                  <h2 className={styles.sectionTitle}>
                    <CheckCircle size={24} />
                    Key Features
                  </h2>
                  <div className={styles.featuresGrid}>
                    {service.features.map((feature, index) => (
                      <div key={index} className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                          {getIconForFeature(feature)}
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'technologies' && (
                <div className={styles.technologiesSection}>
                  <h2 className={styles.sectionTitle}>
                    <Zap size={24} />
                    Technologies Used
                  </h2>
                  {service.technologies && service.technologies.length > 0 ? (
                    <div className={styles.technologiesGrid}>
                      {service.technologies.map((tech, index) => (
                        <div key={index} className={styles.technologyItem}>
                          <div className={styles.techIcon}></div>
                          <span>{tech}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>Technologies information will be updated soon. Contact me for more details about the tech stack used in this service.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'deliverables' && (
                <div className={styles.deliverablesSection}>
                  <h2 className={styles.sectionTitle}>
                    <Award size={24} />
                    What You&apos;ll Get
                  </h2>
                  {service.deliverables && service.deliverables.length > 0 ? (
                    <div className={styles.deliverablesList}>
                      {service.deliverables.map((deliverable, index) => (
                        <div key={index} className={styles.deliverableItem}>
                          <div className={styles.deliverableNumber}>{index + 1}</div>
                          <span>{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>Deliverables information will be updated soon. Contact me for more details about what you&apos;ll receive with this service.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'process' && (
                <div className={styles.processSection}>
                  <h2 className={styles.sectionTitle}>
                    <Calendar size={24} />
                    How It Works
                  </h2>
                  <div className={styles.processSteps}>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>1</div>
                      <div className={styles.stepContent}>
                        <h3>Discovery & Planning</h3>
                        <p>We discuss your requirements and create a detailed project plan with timelines and milestones.</p>
                      </div>
                    </div>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>2</div>
                      <div className={styles.stepContent}>
                        <h3>Design & Development</h3>
                        <p>I create the solution with regular updates and feedback sessions to ensure we&apos;re on the right track.</p>
                      </div>
                    </div>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>3</div>
                      <div className={styles.stepContent}>
                        <h3>Testing & Quality Assurance</h3>
                        <p>Thorough testing including functionality, performance, security, and user experience validation.</p>
                      </div>
                    </div>
                    <div className={styles.processStep}>
                      <div className={styles.stepNumber}>4</div>
                      <div className={styles.stepContent}>
                        <h3>Deployment & Support</h3>
                        <p>Launch the project with deployment assistance and {service.maintenance?.toLowerCase() || 'ongoing support'}.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.supportInfo}>
            <div className={styles.supportCard}>
              <Shield className={styles.supportIcon} size={32} />
              <h3>Support & Maintenance</h3>
              <p>{service.support || 'Comprehensive support included with all projects'}</p>
              <div className={styles.supportDetails}>
                <div className={styles.supportItem}>
                  <Calendar size={16} />
                  <span>{service.maintenance || '3 months included support'}</span>
                </div>
                <div className={styles.supportItem}>
                  <Users size={16} />
                  <span>Dedicated support team</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ctaSection}>
            <h2>Ready to Get Started?</h2>
            <p>Let&apos;s discuss how I can help you with this service and bring your project to life.</p>
            <div className={styles.ctaButtons}>
              <button 
                className={styles.primaryButton}
                onClick={() => setShowContactForm(true)}
              >
                <Send size={18} />
                Get Quote
              </button>
              <Link href="/contact" className={styles.secondaryButton}>
                Contact Me
              </Link>
            </div>
          </div>

          {showContactForm && (
            <div className={styles.contactFormOverlay}>
              <div className={styles.contactFormModal}>
                <div className={styles.modalHeader}>
                  <h3>Get a Quote for {service.title}</h3>
                  <button 
                    className={styles.closeButton}
                    onClick={() => setShowContactForm(false)}
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleSubmitContact} className={styles.contactForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="project">Project Description *</label>
                    <textarea
                      id="project"
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="budget">Budget Range</label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                      >
                        <option value="">Select budget range</option>
                        <option value="500-1000">$500 - $1,000</option>
                        <option value="1000-2500">$1,000 - $2,500</option>
                        <option value="2500-5000">$2,500 - $5,000</option>
                        <option value="5000+">$5,000+</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="timeline">Timeline</label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                      >
                        <option value="">Select timeline</option>
                        <option value="asap">ASAP</option>
                        <option value="1-2-weeks">1-2 weeks</option>
                        <option value="1-month">1 month</option>
                        <option value="2-3-months">2-3 months</option>
                        <option value="3-months+">3+ months</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="message">Additional Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                  
                  {formMessage && (
                    <div className={styles.formMessage}>
                      {formMessage}
                    </div>
                  )}
                  
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => setShowContactForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={formSubmitting}
                    >
                      {formSubmitting ? 'Sending...' : 'Send Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {relatedServices.length > 0 && (
            <div className={styles.relatedServices}>
              <h2 className={styles.sectionTitle}>Related Services</h2>
              <div className={styles.relatedGrid}>
                {relatedServices.map((relatedService) => (
                  <Link key={relatedService._id} href={`/services/${relatedService._id}`} className={styles.relatedCard}>
                    <div className={styles.relatedCardContent}>
                      <h4>{relatedService.title}</h4>
                      <p>{relatedService.description.substring(0, 100)}...</p>
                      <div className={styles.relatedMeta}>
                        <span className={styles.relatedPrice}>{relatedService.price}</span>
                        <span className={styles.relatedTimeline}>{relatedService.timeline}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ServiceProps> = async ({ params }) => {
  const id = params?.id as string;
  
  try {
    if (!id) {
      return {
        props: {
          service: null,
          relatedServices: []
        }
      };
    }

    const [serviceResponse, servicesResponse] = await Promise.all([
      serverApi.get(`/api/services/${id}`),
      serverApi.get('/api/services')
    ]);

    const service = serviceResponse.data || null;
    const allServices = servicesResponse.data?.services || [];
    const relatedServices = allServices.filter((s: Service) => s._id !== id);

    return {
      props: {
        service,
        relatedServices
      }
    };
  } catch (error) {
    console.error('Error fetching service data:', error);
    
    // Fallback to static data for demo purposes
    const fallbackServices: { [key: string]: Service } = {
      '1': {
        _id: '1',
        title: 'WordPress Development',
        category: 'web-development',
        description: 'Custom WordPress themes, plugins, and full-stack solutions.',
        features: ['Custom Theme Development', 'Plugin Development', 'E-commerce Solutions'],
        technologies: ['WordPress', 'PHP', 'MySQL', 'JavaScript', 'React', 'WooCommerce'],
        deliverables: ['Custom WordPress Theme', 'Plugin Package', 'Documentation', '3 Months Support', 'Source Code'],
        price: 'Starting from $999',
        timeline: '2-4 weeks',
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    const service = fallbackServices[id] || null;
    const relatedServices = Object.values(fallbackServices).filter((s: Service) => s._id !== id);

    return {
      props: {
        service,
        relatedServices
      }
    };
  }
};
