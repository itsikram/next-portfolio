import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Admin.module.css';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  category: string;
  published: boolean;
  featured: boolean;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

export default function BlogsManagement() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchBlogs();
  }, [router]);

  const fetchBlogs = async () => {
    try {
      const response = await adminApi.get('/blogs');
      setBlogs(response.data.blogs || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await adminApi.delete(`/blogs/${id}`);
      
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete blog');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/blogs/edit/${id}`);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <h2>Blog Posts</h2>
          <Link href="/admin/blogs/new" className={styles.addButton}>
            + Add New
          </Link>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {blogs.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No blog posts found</h3>
            <p>Start by adding your first blog post.</p>
          </div>
        ) : (
          <table className={styles.listTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <div>
                      <strong>{blog.title}</strong>
                      <br />
                      <small style={{ color: '#94a3b8' }}>{blog.slug}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.small}`}>
                      {blog.category}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.small} ${blog.published ? styles.featured : ''}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.small} ${blog.featured ? styles.featured : ''}`}>
                      {blog.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className={styles.actionButtonsCell}>
                    <Link 
                      href={`/admin/blogs/edit/${blog._id}`}
                      className={styles.editButton}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
