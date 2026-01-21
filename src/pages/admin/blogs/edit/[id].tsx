import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../../../components/AdminLayout';
import ImageUpload from '../../../../components/ImageUpload';
import styles from '../../../../styles/Admin.module.css';

interface Blog {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  category: string;
  published: boolean;
  featured: boolean;
  readTime: number;
}

export default function EditBlog() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    console.log('Router query:', router.query);
    console.log('Blog ID from query:', id);
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (id) {
      fetchBlog();
    }
  }, [router, id, isMounted]);

  const fetchBlog = async () => {
    try {
      console.log('Fetching blog with ID:', id);
      const response = await adminApi.get(`/blogs/${id}`);
      console.log('API Response:', response.data);
      setBlog(response.data);
    } catch (err: any) {
      console.error('Error fetching blog:', err);
      setError(err.response?.data?.message || 'Failed to fetch blog');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;
    
    setLoading(true);
    setIsSubmitting(true);
    setError('');

    if (!blog.title || !blog.slug || !blog.excerpt || !blog.content) {
      setError('Please fill in all required fields');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      
      formData.append('title', blog.title);
      formData.append('slug', blog.slug);
      formData.append('excerpt', blog.excerpt);
      formData.append('content', blog.content);
      formData.append('category', blog.category);
      formData.append('published', blog.published.toString());
      formData.append('featured', blog.featured.toString());
      formData.append('readTime', blog.readTime.toString());
      
      blog.tags.forEach(tag => {
        formData.append('tags', tag);
      });
      
      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
      }

      await adminApi.put(`/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push('/admin/blogs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update blog');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (!blog || !tagInput.trim()) return;
    
    setBlog(prev => prev ? {
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    } : null);
    setTagInput('');
  };

  const removeTag = (index: number) => {
    if (!blog) return;
    
    setBlog(prev => prev ? {
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    } : null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!blog) return;
    
    const { name, value, type } = e.target;
    setBlog(prev => prev ? {
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    } : null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!blog) return;
    
    const title = e.target.value;
    setBlog(prev => prev ? {
      ...prev,
      title,
      slug: generateSlug(title)
    } : null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      addTag();
    }
  };

  if (!isMounted || fetchLoading) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <h1>Edit Blog Post</h1>
          <p>Loading blog data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && !blog) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <h1>Edit Blog Post</h1>
          <div className={styles.error}>{error}</div>
          <button
            onClick={() => router.push('/admin/blogs')}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            ← Back to Blogs
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!blog) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <h1>Edit Blog Post</h1>
          <p>Blog not found</p>
          <button
            onClick={() => router.push('/admin/blogs')}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            ← Back to Blogs
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={`${styles.container} ${styles.fadeIn}`}>
        <div className={styles.header}>
          <h1>Edit Blog Post</h1>
          <button
            onClick={() => router.push('/admin/blogs')}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            ← Back to Blogs
          </button>
        </div>
        
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Blog Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={blog?.title || ''}
                  onChange={handleTitleChange}
                  required
                  placeholder="e.g., Getting Started with React Hooks"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="slug">URL Slug *</label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={blog?.slug || ''}
                  onChange={handleChange}
                  required
                  placeholder="getting-started-with-react-hooks"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={blog?.category || 'technology'}
                  onChange={handleChange}
                  className={styles.formSelect}
                >
                  <option value="technology">Technology</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="news">News</option>
                  <option value="opinion">Opinion</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="readTime">Read Time (minutes)</label>
                <input
                  type="number"
                  id="readTime"
                  name="readTime"
                  value={blog?.readTime || 5}
                  onChange={handleChange}
                  min="1"
                  placeholder="5"
                />
              </div>

              <div className={styles.formGroup}>
                <ImageUpload
                  value={blog?.coverImage || ''}
                  onChange={(url) => blog && setBlog({ ...blog, coverImage: url })}
                  onFileChange={(file) => setCoverImageFile(file)}
                  label="Cover Image"
                  placeholder="Upload blog cover image"
                  folder="blog-covers"
                />
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={blog?.published || false}
                  onChange={handleChange}
                />
                <label htmlFor="published">Published</label>
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={blog?.featured || false}
                  onChange={handleChange}
                />
                <label htmlFor="featured">Featured Post</label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="excerpt">Excerpt *</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={blog?.excerpt || ''}
                onChange={handleChange}
                className={styles.textarea}
                rows={3}
                required
                placeholder="A brief summary of your blog post..."
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">Content *</label>
              <textarea
                id="content"
                name="content"
                value={blog?.content || ''}
                onChange={handleChange}
                className={styles.textarea}
                rows={12}
                required
                placeholder="Write your blog post content here..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tags</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag (e.g., React, JavaScript)"
                  onKeyPress={handleKeyPress}
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  onClick={addTag} 
                  className={`${styles.button} ${styles.primaryButton}`}
                  disabled={!tagInput.trim()}
                >
                  + Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {blog?.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={() => removeTag(index)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.2)';
                    }}
                  >
                    {tag}
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>×</span>
                  </span>
                ))}
              </div>
              {blog?.tags.length === 0 && (
                <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  No tags added yet. Add tags to help readers find your content.
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
                onClick={() => router.push('/admin/blogs')}
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
                    Updating...
                  </span>
                ) : (
                  '✓ Update Blog Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}