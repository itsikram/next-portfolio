import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../../components/AdminLayout';
import ImageUpload from '../../../components/ImageUpload';
import styles from '../../../styles/Admin.module.css';

interface Portfolio {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  category: string;
}

export default function PortfolioForm() {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    title: '',
    description: '',
    image: '',
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    featured: false,
    category: 'web'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [techInput, setTechInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsSubmitting(true);
    setError('');

    try {
  // const token = localStorage.getItem('adminToken');
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add the image file if selected
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      
      // Add all portfolio fields except image (handled separately)
      Object.keys(portfolio).forEach(key => {
        if (key !== 'image') {
          const value = portfolio[key as keyof Portfolio];
          if (key === 'technologies') {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      await adminApi.post('/portfolio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      router.push('/admin/portfolio');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to create portfolio');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      setPortfolio(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (index: number) => {
    setPortfolio(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPortfolio(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      addTechnology();
    }
  };

  return (
    <AdminLayout>
      <div className={`${styles.container} ${styles.fadeIn}`}>
        <div className={styles.header}>
          <h1>Add New Portfolio Item</h1>
          <button
            onClick={() => router.push('/admin/portfolio')}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            ← Back to Portfolio
          </button>
        </div>
        
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Project Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={portfolio.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., E-Commerce Platform"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={portfolio.category}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile App</option>
                  <option value="desktop">Desktop Software</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <ImageUpload
                  value={portfolio.image}
                  onChange={(url) => setPortfolio({ ...portfolio, image: url })}
                  onFileChange={setSelectedFile}
                  label="Project Image *"
                  placeholder="Upload project image"
                  folder="portfolio"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="liveUrl">Live Demo URL</label>
                <input
                  type="url"
                  id="liveUrl"
                  name="liveUrl"
                  value={portfolio.liveUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="githubUrl">GitHub Repository URL</label>
                <input
                  type="url"
                  id="githubUrl"
                  name="githubUrl"
                  value={portfolio.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={portfolio.featured}
                  onChange={handleChange}
                />
                <label htmlFor="featured">Featured Project</label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Project Description *</label>
              <textarea
                id="description"
                name="description"
                value={portfolio.description}
                onChange={handleChange}
                className={styles.textarea}
                required
                rows={5}
                placeholder="Describe your project, its purpose, and your role in it..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Technologies Used</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add a technology (e.g., React, Node.js)"
                  onKeyPress={handleKeyPress}
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  onClick={addTechnology} 
                  className={`${styles.button} ${styles.primaryButton}`}
                  disabled={!techInput.trim()}
                >
                  + Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {portfolio.technologies.map((tech, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={() => removeTechnology(index)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.2)';
                    }}
                  >
                    {tech}
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>×</span>
                  </span>
                ))}
              </div>
              {portfolio.technologies.length === 0 && (
                <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  No technologies added yet. Add the technologies you used in this project.
                </p>
              )}
            </div>

            {error && (
              <div className={styles.error} style={{ marginBottom: '1rem' }}>
                ⚠️ {error}
              </div>
            )}

            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => router.push('/admin/portfolio')}
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className={styles.spinner} style={{ width: '16px', height: '16px', margin: 0 }} />
                    Creating...
                  </span>
                ) : (
                  '✓ Create Portfolio Item'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
