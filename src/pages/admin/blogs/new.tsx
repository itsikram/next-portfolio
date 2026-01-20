import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Admin.module.css';

interface Blog {
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

export default function BlogForm() {
  const [blog, setBlog] = useState<Blog>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: [],
    category: 'technology',
    published: false,
    featured: false,
    readTime: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
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
      await axios.post('http://localhost:5000/api/blogs', blog, {
        headers: { Authorization: `Bearer ${token}` }
      });

      router.push('/admin/blogs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setBlog(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setBlog(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setBlog(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setBlog(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  return (
    <AdminLayout>
      <div className={styles.formContainer}>
        <h2>Add New Blog Post</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={blog.title}
                onChange={handleTitleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={blog.slug}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={blog.category}
                onChange={handleChange}
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
                value={blog.readTime}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="coverImage">Cover Image URL</label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={blog.coverImage}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={blog.published}
                onChange={handleChange}
              />
              <label htmlFor="published">Published</label>
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={blog.featured}
                onChange={handleChange}
              />
              <label htmlFor="featured">Featured</label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={blog.excerpt}
              onChange={handleChange}
              className={styles.textarea}
              rows={3}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={blog.content}
              onChange={handleChange}
              className={styles.textarea}
              rows={10}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Tags</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button type="button" onClick={addTag} className={styles.secondaryButton}>
                Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    background: '#6f42c1',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => removeTag(index)}
                >
                  {tag} ×
                </span>
              ))}
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => router.push('/admin/blogs')}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              {loading ? 'Creating...' : 'Create Blog Post'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
