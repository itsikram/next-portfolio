import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../../components/AdminLayout';
import ImageUpload from '../../../components/ImageUpload';
import styles from '../../../styles/Admin.module.css';

interface Stat {
  value: string;
  label: string;
}

interface CtaButton {
  text: string;
  url: string;
  type: 'primary' | 'secondary';
  isDownload: boolean;
}

interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    profileImage: string;
  };
  stats: Stat[];
  ctaButtons: CtaButton[];
  seo: {
    title: string;
    description: string;
  };
}

export default function HomeContentManager() {
  const [content, setContent] = useState<HomeContent>({
    hero: {
      title: '',
      subtitle: '',
      description: '',
      profileImage: ''
    },
    stats: [],
    ctaButtons: [],
    seo: {
      title: '',
      description: ''
    }
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
      const response = await adminApi.get('/home-content');
      setContent(response.data);
    } catch (_err: unknown) {
      setError('Failed to fetch content');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminApi.put('home-content', content);
      setSuccess('Content updated successfully!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    if (section === 'hero') {
      setContent(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          [field]: value
        }
      }));
    } else if (section === 'seo') {
      setContent(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          [field]: value
        }
      }));
    }
  };

  const addStat = () => {
    setContent(prev => ({
      ...prev,
      stats: [...prev.stats, { value: '', label: '' }]
    }));
  };

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    setContent(prev => ({
      ...prev,
      stats: prev.stats.map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    }));
  };

  const removeStat = (index: number) => {
    setContent(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const addCtaButton = () => {
    setContent(prev => ({
      ...prev,
      ctaButtons: [...prev.ctaButtons, { text: '', url: '', type: 'primary', isDownload: false }]
    }));
  };

  const updateCtaButton = (index: number, field: keyof CtaButton, value: string | boolean) => {
    setContent(prev => ({
      ...prev,
      ctaButtons: prev.ctaButtons.map((button, i) => 
        i === index ? { ...button, [field]: value } : button
      )
    }));
  };

  const removeCtaButton = (index: number) => {
    setContent(prev => ({
      ...prev,
      ctaButtons: prev.ctaButtons.filter((_, i) => i !== index)
    }));
  };

  return (
    <AdminLayout>
      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <h2>Home Page Content</h2>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.formContainer} style={{ margin: '1.5rem', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className={styles.section}>
              <h3>Hero Section</h3>
              <div className={styles.formGroup}>
                <label htmlFor="hero.title">Title</label>
                <input
                  type="text"
                  id="hero.title"
                  name="hero.title"
                  value={content.hero.title}
                  onChange={handleChange}
                  placeholder="Hi, I'm Md Ikram"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hero.subtitle">Subtitle</label>
                <input
                  type="text"
                  id="hero.subtitle"
                  name="hero.subtitle"
                  value={content.hero.subtitle}
                  onChange={handleChange}
                  placeholder="Full Stack Developer"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hero.description">Description</label>
                <textarea
                  id="hero.description"
                  name="hero.description"
                  value={content.hero.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={4}
                  placeholder="Crafting exceptional digital experiences..."
                />
              </div>

              <div className={styles.formGroup}>
                <ImageUpload
                  value={content.hero.profileImage}
                  onChange={(url) => setContent(prev => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      profileImage: url
                    }
                  }))}
                  label="Profile Image"
                  placeholder="Upload profile image"
                  folder="profile"
                />
              </div>

            </div>

            <div className={styles.section}>
              <h3>Statistics</h3>
              {content.stats.map((stat, index) => (
                <div key={index} className={styles.formGroup}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      placeholder="5+"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="Years Experience"
                      style={{ flex: 2 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className={`${styles.button} ${styles.dangerButton}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addStat}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Stat
              </button>
            </div>

            <div className={styles.section}>
              <h3>Call-to-Action Buttons</h3>
              {content.ctaButtons.map((button, index) => (
                <div key={index} className={styles.formGroup}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={button.text}
                      onChange={(e) => updateCtaButton(index, 'text', e.target.value)}
                      placeholder="Get In Touch"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      value={button.url}
                      onChange={(e) => updateCtaButton(index, 'url', e.target.value)}
                      placeholder="/contact"
                      style={{ flex: 1 }}
                    />
                    <select
                      value={button.type}
                      onChange={(e) => updateCtaButton(index, 'type', e.target.value)}
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={button.isDownload}
                        onChange={(e) => updateCtaButton(index, 'isDownload', e.target.checked)}
                      />
                      Download
                    </label>
                    <button
                      type="button"
                      onClick={() => removeCtaButton(index)}
                      className={`${styles.button} ${styles.dangerButton}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addCtaButton}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Button
              </button>
            </div>

            <div className={styles.section}>
              <h3>SEO Settings</h3>
              <div className={styles.formGroup}>
                <label htmlFor="seo.title">Page Title</label>
                <input
                  type="text"
                  id="seo.title"
                  name="seo.title"
                  value={content.seo.title}
                  onChange={handleChange}
                  placeholder="Home - Portfolio of Md Ikram"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="seo.description">Meta Description</label>
                <textarea
                  id="seo.description"
                  name="seo.description"
                  value={content.seo.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Full Stack WordPress & MERN Developer with 5+ years of experience"
                />
              </div>
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
