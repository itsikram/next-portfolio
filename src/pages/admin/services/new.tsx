import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Admin.module.css';

interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
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
    pricing: 'project',
    price: 0,
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [featureInput, setFeatureInput] = useState('');
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
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('http://localhost:5000/api/services', service, {
        headers: { Authorization: `Bearer ${token}` }
      });

      router.push('/admin/services');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
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

  return (
    <AdminLayout>
      <div className={styles.formContainer}>
        <h2>Add New Service</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={service.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="icon">Icon (SVG path or component name)</label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={service.icon}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="pricing">Pricing Type</label>
              <select
                id="pricing"
                name="pricing"
                value={service.pricing}
                onChange={handleChange}
              >
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
                <option value="project">Project</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={service.price}
                onChange={handleChange}
                min="0"
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
              <label htmlFor="featured">Featured</label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={service.description}
              onChange={handleChange}
              className={styles.textarea}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Features</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <button type="button" onClick={addFeature} className={styles.secondaryButton}>
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {service.features.map((feature, index) => (
                <span
                  key={index}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => removeFeature(index)}
                >
                  {feature} ×
                </span>
              ))}
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => router.push('/admin/services')}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              {loading ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
