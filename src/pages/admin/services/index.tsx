import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Admin.module.css';

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
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
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setServices(services.filter(service => service._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/services/edit/${id}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <h1>Services Management</h1>
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Services Management</h1>
          <button 
            onClick={() => router.push('/admin/services/new')}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Add New Service
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {services.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No services found. Create your first service!</p>
            <button 
              onClick={() => router.push('/admin/services/new')}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              Create Service
            </button>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
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
                    <td>{service.pricing}</td>
                    <td>${service.price}</td>
                    <td>
                      <span className={`${styles.badge} ${service.featured ? styles.featured : ''}`}>
                        {service.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleEdit(service._id)}
                          className={`${styles.button} ${styles.secondaryButton} ${styles.small}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className={`${styles.button} ${styles.dangerButton} ${styles.small}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
