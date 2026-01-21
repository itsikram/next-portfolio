import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Admin.module.css';

interface Portfolio {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  category: string;
}

export default function PortfolioManage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchPortfolios();
  }, [router]);

  const fetchPortfolios = async () => {
    try {
      const response = await adminApi.get('/portfolio');
      setPortfolios(response.data.portfolios || []);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch portfolios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      await adminApi.delete(`/portfolio/${id}`);
      
      setPortfolios(portfolios.filter(p => p._id !== id));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to delete portfolio');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <h2>Portfolio Items</h2>
          <Link href="/admin/portfolio/new" className={styles.addButton}>
            + Add New
          </Link>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {portfolios.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No portfolio items found</h3>
            <p>Start by adding your first portfolio item.</p>
          </div>
        ) : (
          <table className={styles.listTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Technologies</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolios.map((portfolio) => (
                <tr key={portfolio._id}>
                  <td>{portfolio.title}</td>
                  <td>{portfolio.category}</td>
                  <td>{portfolio.technologies.join(', ')}</td>
                  <td>{portfolio.featured ? 'Yes' : 'No'}</td>
                  <td className={styles.actionButtonsCell}>
                    <Link 
                      href={`/admin/portfolio/${portfolio._id}/edit`}
                      className={styles.editButton}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(portfolio._id)}
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
