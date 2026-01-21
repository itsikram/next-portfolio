import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../../components/AdminLayout';
import ImageUpload from '../../../components/ImageUpload';
import DocumentUpload from '../../../components/DocumentUpload';
import styles from '../../../styles/Admin.module.css';

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface Review {
  text: string;
  author: string;
  source: string;
}

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
  services: Service[];
  reviews: Review[];
  technicalSkills: {
    frontend: string[];
    backend: string[];
    database: string[];
    tools: string[];
  };
  keyStrengths: string[];
  cvDownloadUrl: string;
}

export default function AboutContentManager() {
  const [content, setContent] = useState<AboutContent>({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      age: '',
      nationality: '',
      experience: '',
      languages: '',
      address: '',
      mobile: '',
      email: '',
      freelance: '',
      profileImage: '',
      description: ''
    },
    services: [],
    reviews: [],
    technicalSkills: {
      frontend: [],
      backend: [],
      database: [],
      tools: []
    },
    keyStrengths: [],
    cvDownloadUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchContent();
  }, [router]);

  const fetchContent = async () => {
    try {
      const response = await adminApi.get('/about-content');
      setContent(response.data);
    } catch (err: unknown) {
      setError('Failed to fetch content');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminApi.put('/about-content', content);
      setSuccess('Content updated successfully!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addService = () => {
    setContent(prev => ({
      ...prev,
      services: [...prev.services, { title: '', description: '', icon: '' }]
    }));
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    setContent(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const removeService = (index: number) => {
    setContent(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addReview = () => {
    setContent(prev => ({
      ...prev,
      reviews: [...prev.reviews, { text: '', author: '', source: '' }]
    }));
  };

  const updateReview = (index: number, field: keyof Review, value: string) => {
    setContent(prev => ({
      ...prev,
      reviews: prev.reviews.map((review, i) => 
        i === index ? { ...review, [field]: value } : review
      )
    }));
  };

  const removeReview = (index: number) => {
    setContent(prev => ({
      ...prev,
      reviews: prev.reviews.filter((_, i) => i !== index)
    }));
  };

  const updateTechnicalSkill = (category: keyof typeof content.technicalSkills, index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      technicalSkills: {
        ...prev.technicalSkills,
        [category]: prev.technicalSkills[category].map((skill, i) => 
          i === index ? value : skill
        )
      }
    }));
  };

  const addTechnicalSkill = (category: keyof typeof content.technicalSkills) => {
    setContent(prev => ({
      ...prev,
      technicalSkills: {
        ...prev.technicalSkills,
        [category]: [...prev.technicalSkills[category], '']
      }
    }));
  };

  const removeTechnicalSkill = (category: keyof typeof content.technicalSkills, index: number) => {
    setContent(prev => ({
      ...prev,
      technicalSkills: {
        ...prev.technicalSkills,
        [category]: prev.technicalSkills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const updateKeyStrength = (index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      keyStrengths: prev.keyStrengths.map((strength, i) => 
        i === index ? value : strength
      )
    }));
  };

  const addKeyStrength = () => {
    setContent(prev => ({
      ...prev,
      keyStrengths: [...prev.keyStrengths, '']
    }));
  };

  const removeKeyStrength = (index: number) => {
    setContent(prev => ({
      ...prev,
      keyStrengths: prev.keyStrengths.filter((_, i) => i !== index)
    }));
  };

  return (
    <AdminLayout>
      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <h2>About Page Content</h2>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.formContainer} style={{ margin: '1.5rem', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className={styles.section}>
              <h3>Personal Information</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={content.personalInfo.fullName}
                    onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                    placeholder="Md Ikram"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Date of Birth</label>
                  <input
                    type="text"
                    value={content.personalInfo.dateOfBirth}
                    onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                    placeholder="16/07/2003"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Age</label>
                  <input
                    type="text"
                    value={content.personalInfo.age}
                    onChange={(e) => handlePersonalInfoChange('age', e.target.value)}
                    placeholder="22 Years"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Nationality</label>
                  <input
                    type="text"
                    value={content.personalInfo.nationality}
                    onChange={(e) => handlePersonalInfoChange('nationality', e.target.value)}
                    placeholder="Bangladeshi"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Experience</label>
                  <input
                    type="text"
                    value={content.personalInfo.experience}
                    onChange={(e) => handlePersonalInfoChange('experience', e.target.value)}
                    placeholder="5+ Years"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Languages</label>
                  <input
                    type="text"
                    value={content.personalInfo.languages}
                    onChange={(e) => handlePersonalInfoChange('languages', e.target.value)}
                    placeholder="English, Bengali"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Address</label>
                  <input
                    type="text"
                    value={content.personalInfo.address}
                    onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                    placeholder="Biler Kani, Munshiganj, Bangladesh"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Mobile</label>
                  <input
                    type="text"
                    value={content.personalInfo.mobile}
                    onChange={(e) => handlePersonalInfoChange('mobile', e.target.value)}
                    placeholder="+8801581400711"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={content.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    placeholder="mdikram295@gmail.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Freelance Status</label>
                  <input
                    type="text"
                    value={content.personalInfo.freelance}
                    onChange={(e) => handlePersonalInfoChange('freelance', e.target.value)}
                    placeholder="Available"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={content.personalInfo.description}
                  onChange={(e) => handlePersonalInfoChange('description', e.target.value)}
                  className={styles.textarea}
                  rows={4}
                  placeholder="Full Stack WordPress & MERN Developer with 5+ years of experience..."
                />
              </div>

              <div className={styles.formGroup}>
                <ImageUpload
                  value={content.personalInfo.profileImage}
                  onChange={(url) => handlePersonalInfoChange('profileImage', url)}
                  label="Profile Image"
                  placeholder="Upload profile image"
                  folder="profile"
                />
              </div>

              <div className={styles.formGroup}>
                <DocumentUpload
                  value={content.cvDownloadUrl}
                  onChange={(url) => setContent(prev => ({ ...prev, cvDownloadUrl: url }))}
                  label="CV Document"
                  placeholder="Upload CV PDF"
                  accept=".pdf"
                  maxSize={10}
                />
              </div>
            </div>

            <div className={styles.section}>
              <h3>Services</h3>
              {content.services.map((service, index) => (
                <div key={index} className={styles.formGroup}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateService(index, 'title', e.target.value)}
                      placeholder="Service Title"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      value={service.icon}
                      onChange={(e) => updateService(index, 'icon', e.target.value)}
                      placeholder="Icon Name"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className={`${styles.button} ${styles.dangerButton}`}
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                    placeholder="Service description..."
                    className={styles.textarea}
                    rows={2}
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Service
              </button>
            </div>

            <div className={styles.section}>
              <h3>Reviews</h3>
              {content.reviews.map((review, index) => (
                <div key={index} className={styles.formGroup}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={review.author}
                      onChange={(e) => updateReview(index, 'author', e.target.value)}
                      placeholder="Author Name"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      value={review.source}
                      onChange={(e) => updateReview(index, 'source', e.target.value)}
                      placeholder="Source (e.g., Freelancer.com)"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeReview(index)}
                      className={`${styles.button} ${styles.dangerButton}`}
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={review.text}
                    onChange={(e) => updateReview(index, 'text', e.target.value)}
                    placeholder="Review text..."
                    className={styles.textarea}
                    rows={3}
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addReview}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Review
              </button>
            </div>

            <div className={styles.section}>
              <h3>Technical Skills</h3>
              {Object.entries(content.technicalSkills).map(([category, skills]) => (
                <div key={category} className={styles.formGroup}>
                  <h4 style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>{category}</h4>
                  {skills.map((skill, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateTechnicalSkill(category as keyof typeof content.technicalSkills, index, e.target.value)}
                        placeholder={`Enter ${category} skill`}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => removeTechnicalSkill(category as keyof typeof content.technicalSkills, index)}
                        className={`${styles.button} ${styles.dangerButton}`}
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addTechnicalSkill(category as keyof typeof content.technicalSkills)}
                    className={`${styles.button} ${styles.secondaryButton}`}
                    style={{ marginTop: '0.5rem' }}
                  >
                    + Add {category} Skill
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.section}>
              <h3>Key Strengths</h3>
              {content.keyStrengths.map((strength, index) => (
                <div key={index} className={styles.formGroup}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={strength}
                      onChange={(e) => updateKeyStrength(index, e.target.value)}
                      placeholder="Enter key strength"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeKeyStrength(index)}
                      className={`${styles.button} ${styles.dangerButton}`}
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addKeyStrength}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Key Strength
              </button>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                disabled={loading}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
