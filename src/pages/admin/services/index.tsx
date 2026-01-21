import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Admin.module.css';

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  category: string;
  pricing: string;
  price: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchServices();
  }, [router]);

  const fetchServices = async () => {
    try {
      const response = await adminApi.get('/services');
      setServices(response.data.services || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await adminApi.delete(`/services/${id}`);
      
      setServices(services.filter(service => service._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/services/edit/${id}`);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <h2>Services</h2>
          <Link href="/admin/services/new" className={styles.addButton}>
            + Add New
          </Link>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {services.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No services found</h3>
            <p>Start by adding your first service.</p>
          </div>
        ) : (
          <table className={styles.listTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Pricing</th>
                <th>Price</th>
                <th>Featured</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>{service.title}</td>
                  <td>
                    <span className={`${styles.badge} ${styles.categoryBadge}`}>
                      {service.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td>{service.pricing}</td>
                  <td>${service.price}</td>
                  <td>
                    <span className={`${styles.badge} ${service.featured ? styles.featured : ''}`}>
                      {service.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                  <td className={styles.actionButtonsCell}>
                    <Link 
                      href={`/admin/services/edit/${service._id}`}
                      className={styles.editButton}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(service._id)}
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
