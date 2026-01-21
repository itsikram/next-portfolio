import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Admin.module.css';

interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
  category: string;
  pricing: string;
  price: number;
  featured: boolean;
}

export default function ServiceForm() {
  const [service, setService] = useState<Service>({
    title: '',
    description: '',
    icon: '',
    features: [],
    category: 'web-development',
    pricing: 'project',
    price: 0,
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [featureInput, setFeatureInput] = useState('');
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
      await adminApi.post('/services', service);

      router.push('/admin/services');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setService(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setService(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setService(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <AdminLayout>
      <div className={`${styles.container} ${styles.fadeIn}`}>
        <div className={styles.header}>
          <h1>Add New Service</h1>
          <button
            onClick={() => router.push('/admin/services')}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            ← Back to Services
          </button>
        </div>
        
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Service Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={service.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Web Development"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="icon">Icon Name *</label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={service.icon}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Code, Briefcase, Brush"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Service Category *</label>
                <select
                  id="category"
                  name="category"
                  value={service.category}
                  onChange={handleChange}
                  className={styles.formSelect}
                  required
                >
                  <option value="web-development">Web Development</option>
                  <option value="mobile-development">Mobile Development</option>
                  <option value="ui-ux-design">UI/UX Design</option>
                  <option value="backend-development">Backend Development</option>
                  <option value="full-stack">Full Stack Development</option>
                  <option value="consulting">Consulting</option>
                  <option value="optimization">Performance Optimization</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="pricing">Pricing Type</label>
                <select
                  id="pricing"
                  name="pricing"
                  value={service.pricing}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="project">Project Based</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={service.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={service.featured}
                  onChange={handleChange}
                />
                <label htmlFor="featured">Featured Service</label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Service Description *</label>
              <textarea
                id="description"
                name="description"
                value={service.description}
                onChange={handleChange}
                className={styles.textarea}
                required
                rows={4}
                placeholder="Describe your service in detail..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Service Features</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add a feature (e.g., Responsive Design)"
                  onKeyPress={handleKeyPress}
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  onClick={addFeature} 
                  className={`${styles.button} ${styles.primaryButton}`}
                  disabled={!featureInput.trim()}
                >
                  + Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {service.features.map((feature, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={() => removeFeature(index)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
                    }}
                  >
                    {feature}
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>×</span>
                  </span>
                ))}
              </div>
              {service.features.length === 0 && (
                <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  No features added yet. Add features to highlight what's included in this service.
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
                onClick={() => router.push('/admin/services')}
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
                  '✓ Create Service'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
