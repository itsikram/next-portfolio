import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Admin.module.css';

interface SocialLink {
  platform: string;
  url: string;
  displayName: string;
}

interface ContactContent {
  personalInfo: {
    emails: string[];
    phones: string[];
    addresses: string[];
  };
  socialLinks: SocialLink[];
  contactForm: {
    recipientEmail: string;
    notificationEmail: string;
  };
}

export default function ContactManager() {
  const [content, setContent] = useState<ContactContent>({
    personalInfo: {
      emails: [''],
      phones: [''],
      addresses: ['']
    },
    socialLinks: [],
    contactForm: {
      recipientEmail: '',
      notificationEmail: ''
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
      const response = await adminApi.get('/contact');
      setContent(response.data);
    } catch (err: unknown) {
      setError('Failed to fetch contact content');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminApi.put('/contact', content);
      setSuccess('Contact information updated successfully!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update contact information');
    } finally {
      setLoading(false);
    }
  };

  const updateEmails = (index: number, value: string) => {
    const newEmails = [...content.personalInfo.emails];
    newEmails[index] = value;
    setContent(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        emails: newEmails
      }
    }));
  };

  const addEmail = () => {
    setContent(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        emails: [...prev.personalInfo.emails, '']
      }
    }));
  };

  const removeEmail = (index: number) => {
    setContent(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        emails: prev.personalInfo.emails.filter((_, i) => i !== index)
      }
    }));
  };

  const updatePhones = (index: number, value: string) => {
    const newPhones = [...content.personalInfo.phones];
    newPhones[index] = value;
    setContent(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        phones: newPhones
      }
    }));
  };

  const addPhone = () => {
    setContent(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        phones: [...prev.personalInfo.phones, '']
      }
    }));
  };

  const removePhone = (index: number) => {
    setContent(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        phones: prev.personalInfo.phones.filter((_, i) => i !== index)
      }
    }));
  };

  const updateAddresses = (index: number, value: string) => {
    const newAddresses = [...content.personalInfo.addresses];
    newAddresses[index] = value;
    setContent(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        addresses: newAddresses
      }
    }));
  };

  const addAddress = () => {
    setContent(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        addresses: [...prev.personalInfo.addresses, '']
      }
    }));
  };

  const removeAddress = (index: number) => {
    setContent(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        addresses: prev.personalInfo.addresses.filter((_, i) => i !== index)
      }
    }));
  };

  const addSocialLink = () => {
    setContent(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '', displayName: '' }]
    }));
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    setContent(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeSocialLink = (index: number) => {
    setContent(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  return (
    <AdminLayout>
      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <h2>Contact Information</h2>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.formContainer} style={{ margin: '1.5rem', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className={styles.section}>
              <h3>Email Addresses</h3>
              {content.personalInfo.emails.map((email, index) => (
                <div key={index} className={styles.formGroup}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmails(index, e.target.value)}
                      placeholder="Enter email address"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeEmail(index)}
                      className={`${styles.button} ${styles.dangerButton}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addEmail}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Email
              </button>
            </div>

            <div className={styles.section}>
              <h3>Phone Numbers</h3>
              {content.personalInfo.phones.map((phone, index) => (
                <div key={index} className={styles.formGroup}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => updatePhones(index, e.target.value)}
                      placeholder="Enter phone number (e.g., +8801581400711)"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhone(index)}
                      className={`${styles.button} ${styles.dangerButton}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPhone}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Phone
              </button>
            </div>

            <div className={styles.section}>
              <h3>Addresses</h3>
              {content.personalInfo.addresses.map((address, index) => (
                <div key={index} className={styles.formGroup}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => updateAddresses(index, e.target.value)}
                      placeholder="Enter address"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className={`${styles.button} ${styles.dangerButton}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addAddress}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Address
              </button>
            </div>

            <div className={styles.section}>
              <h3>Social Links</h3>
              {content.socialLinks.map((social, index) => (
                <div key={index} className={styles.formGroup}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                      value={social.platform}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="">Select Platform</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      value={social.displayName}
                      onChange={(e) => updateSocialLink(index, 'displayName', e.target.value)}
                      placeholder="Display Name"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className={`${styles.button} ${styles.dangerButton}`}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder="Social media URL"
                    style={{ marginTop: '0.5rem', width: '100%' }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addSocialLink}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Social Link
              </button>
            </div>

            <div className={styles.section}>
              <h3>Contact Form Settings</h3>
              <div className={styles.formGroup}>
                <label>Recipient Email (where contact form messages are sent)</label>
                <input
                  type="email"
                  value={content.contactForm.recipientEmail}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    contactForm: {
                      ...prev.contactForm,
                      recipientEmail: e.target.value
                    }
                  }))}
                  placeholder="mdikram295@gmail.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Notification Email (for admin notifications)</label>
                <input
                  type="email"
                  value={content.contactForm.notificationEmail}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    contactForm: {
                      ...prev.contactForm,
                      notificationEmail: e.target.value
                    }
                  }))}
                  placeholder="mdikram295@gmail.com"
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
