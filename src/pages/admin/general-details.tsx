import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../components/AdminLayout';
import DocumentUpload from '../../components/DocumentUpload';
import FaviconUpload from '../../components/FaviconUpload';
import styles from '../../styles/Admin.module.css';

interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  website: string;
}

interface SiteDetails {
  siteName: string;
  siteUrl: string;
  logo: string;
  contactEmail: string;
  phoneNumber: string;
  location: string;
}

interface SeoDetails {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImage: string;
  twitterHandle: string;
  googleAnalytics: string;
}

interface GeneralDetails {
  socialLinks: SocialLinks;
  cvDownloadUrl: string;
  sidebarImage: string;
  siteDetails: SiteDetails;
  seoDetails: SeoDetails;
}

export default function GeneralDetailsPage() {
  const [details, setDetails] = useState<GeneralDetails>({
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      website: ''
    },
    cvDownloadUrl: '',
    sidebarImage: '',
    siteDetails: {
      siteName: '',
      siteUrl: '',
      logo: '',
      contactEmail: '',
      phoneNumber: '',
      location: ''
    },
    seoDetails: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      ogImage: '',
      twitterHandle: '',
      googleAnalytics: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchDetails();
  }, [router]);

  const fetchDetails = async () => {
    try {
      const response = await adminApi.get('/general-details');
      setDetails(response.data);
    } catch (error) {
      console.error('Error fetching general details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setDetails(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleCvUpload = (url: string) => {
    setDetails(prev => ({
      ...prev,
      cvDownloadUrl: url
    }));
  };

  const handleSidebarImageUpload = (url: string) => {
    setDetails(prev => ({
      ...prev,
      sidebarImage: url
    }));
  };

  const handleFaviconUpdate = (faviconUrl: string) => {
    setDetails(prev => ({
      ...prev,
      siteDetails: {
        ...prev.siteDetails,
        logo: faviconUrl
      }
    }));
  };

  const handleSiteDetailChange = (field: keyof SiteDetails, value: string) => {
    setDetails(prev => ({
      ...prev,
      siteDetails: {
        ...prev.siteDetails,
        [field]: value
      }
    }));
  };

  const handleSeoDetailChange = (field: keyof SeoDetails, value: string | string[]) => {
    setDetails(prev => ({
      ...prev,
      seoDetails: {
        ...prev.seoDetails,
        [field]: value
      }
    }));
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    handleSeoDetailChange('metaKeywords', keywords);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await adminApi.put('/general-details', details);
      alert('General details updated successfully!');
    } catch (error) {
      console.error('Error updating general details:', error);
      alert('Failed to update general details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading general details...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <h2>General Details</h2>
          <p>Manage social links, site details, SEO settings, CV download, and sidebar image</p>
        </div>

        <div className={styles.formContainer} style={{ margin: '1.5rem', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className={styles.section}>
              <h3>Site Details</h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="siteName">Site Name</label>
                  <input
                    type="text"
                    id="siteName"
                    value={details.siteDetails.siteName}
                    onChange={(e) => handleSiteDetailChange('siteName', e.target.value)}
                    placeholder="Portfolio of Your Name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="siteUrl">Site URL</label>
                  <input
                    type="url"
                    id="siteUrl"
                    value={details.siteDetails.siteUrl}
                    onChange={(e) => handleSiteDetailChange('siteUrl', e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contactEmail">Contact Email</label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={details.siteDetails.contactEmail}
                    onChange={(e) => handleSiteDetailChange('contactEmail', e.target.value)}
                    placeholder="contact@yourportfolio.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={details.siteDetails.phoneNumber}
                    onChange={(e) => handleSiteDetailChange('phoneNumber', e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={details.siteDetails.location}
                    onChange={(e) => handleSiteDetailChange('location', e.target.value)}
                    placeholder="Your City, Country"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Site Favicon</label>
                  <FaviconUpload
                    currentFavicon={details.siteDetails.logo}
                    onFaviconUpdate={handleFaviconUpdate}
                  />
                  {details.siteDetails.logo && (
                    <div className={styles.currentFile}>
                      <span>Current Favicon: </span>
                      <a 
                        href={details.siteDetails.logo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.fileLink}
                      >
                        View Favicon
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3>SEO Details</h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="metaTitle">Meta Title</label>
                  <input
                    type="text"
                    id="metaTitle"
                    value={details.seoDetails.metaTitle}
                    onChange={(e) => handleSeoDetailChange('metaTitle', e.target.value)}
                    placeholder="Portfolio of Your Name - Full Stack Developer"
                  />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="metaDescription">Meta Description</label>
                  <textarea
                    id="metaDescription"
                    value={details.seoDetails.metaDescription}
                    onChange={(e) => handleSeoDetailChange('metaDescription', e.target.value)}
                    placeholder="Brief description of your portfolio and skills"
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="metaKeywords">Meta Keywords</label>
                  <input
                    type="text"
                    id="metaKeywords"
                    value={details.seoDetails.metaKeywords.join(', ')}
                    onChange={(e) => handleKeywordsChange(e.target.value)}
                    placeholder="Full Stack Developer, React, Node.js, MongoDB (comma separated)"
                  />
                  <small>Enter keywords separated by commas</small>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="twitterHandle">Twitter Handle</label>
                  <input
                    type="text"
                    id="twitterHandle"
                    value={details.seoDetails.twitterHandle}
                    onChange={(e) => handleSeoDetailChange('twitterHandle', e.target.value)}
                    placeholder="@yourusername"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="googleAnalytics">Google Analytics ID</label>
                  <input
                    type="text"
                    id="googleAnalytics"
                    value={details.seoDetails.googleAnalytics}
                    onChange={(e) => handleSeoDetailChange('googleAnalytics', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Upload OG Image</label>
                  <DocumentUpload
                    value={details.seoDetails.ogImage}
                    onChange={(url) => handleSeoDetailChange('ogImage', url)}
                    label="Open Graph Image"
                    placeholder="Click to upload OG image"
                    accept="image/*"
                    maxSize={2}
                    className="og-image-upload"
                  />
                  {details.seoDetails.ogImage && (
                    <div className={styles.currentFile}>
                      <span>Current OG Image: </span>
                      <a 
                        href={details.seoDetails.ogImage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.fileLink}
                      >
                        View Image
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3>Documents & Media</h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Upload CV Document</label>
                  <DocumentUpload
                    value={details.cvDownloadUrl}
                    onChange={handleCvUpload}
                    label="CV Document"
                    placeholder="Click to upload CV document"
                    accept=".pdf"
                    maxSize={10}
                    className="cv-upload"
                  />
                  {details.cvDownloadUrl && (
                    <div className={styles.currentFile}>
                      <span>Current CV: </span>
                      <a 
                        href={details.cvDownloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.fileLink}
                      >
                        View CV
                      </a>
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Upload Sidebar Profile Image</label>
                  <DocumentUpload
                    value={details.sidebarImage}
                    onChange={handleSidebarImageUpload}
                    label="Sidebar Image"
                    placeholder="Click to upload sidebar image"
                    accept="image/*"
                    maxSize={5}
                    className="sidebar-image-upload"
                  />
                  {details.sidebarImage && (
                    <div className={styles.currentFile}>
                      <span>Current Image: </span>
                      <a 
                        href={details.sidebarImage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.fileLink}
                      >
                        View Image
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3>Social Links</h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="github">GitHub</label>
                  <input
                    type="url"
                    id="github"
                    value={details.socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="linkedin">LinkedIn</label>
                  <input
                    type="url"
                    id="linkedin"
                    value={details.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="twitter">Twitter</label>
                  <input
                    type="url"
                    id="twitter"
                    value={details.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="facebook">Facebook</label>
                  <input
                    type="url"
                    id="facebook"
                    value={details.socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/username"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="instagram">Instagram</label>
                  <input
                    type="url"
                    id="instagram"
                    value={details.socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    value={details.socialLinks.website}
                    onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                disabled={saving}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
