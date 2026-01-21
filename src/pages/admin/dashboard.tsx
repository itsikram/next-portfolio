import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../components/AdminLayout';
import styles from '../../styles/Admin.module.css';

export default function AdminDashboard() {
  // const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    portfolio: 0,
    services: 0,
    blogs: 0
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const [portfolioRes, servicesRes, blogsRes] = await Promise.all([
          adminApi.get('/portfolio'),
          adminApi.get('/services'),
          adminApi.get('/blogs')
        ]);

        setStats({
          portfolio: portfolioRes.data.total || 0,
          services: servicesRes.data.total || 0,
          blogs: blogsRes.data.total || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [router]);

  // const handleLogout = () => {
  //   localStorage.removeItem('adminToken');
  //   router.push('/admin/login');
  // };

  return (
    <AdminLayout>
      <div className={styles.dashboardContainer}>
        <header className={styles.dashboardHeader}>
          <h1>Admin Dashboard</h1>
        </header>

        <main className={styles.dashboardMain}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Sidebar Profile Image</h3>
              <div className={styles.statNumber}>👤</div>
              <button 
                onClick={() => router.push('/admin/home')}
                className={styles.manageButton}
              >
                Update Image
              </button>
            </div>

            <div className={styles.statCard}>
              <h3>Home Content</h3>
              <div className={styles.statNumber}>🏠</div>
              <button 
                onClick={() => router.push('/admin/home')}
                className={styles.manageButton}
              >
                Manage
              </button>
            </div>

            <div className={styles.statCard}>
              <h3>About Content</h3>
              <div className={styles.statNumber}>👤</div>
              <button 
                onClick={() => router.push('/admin/about')}
                className={styles.manageButton}
              >
                Manage
              </button>
            </div>

            <div className={styles.statCard}>
              <h3>Resume Content</h3>
              <div className={styles.statNumber}>📄</div>
              <button 
                onClick={() => router.push('/admin/resume')}
                className={styles.manageButton}
              >
                Manage
              </button>
            </div>

            <div className={styles.statCard}>
              <h3>Portfolio Items</h3>
              <div className={styles.statNumber}>{stats.portfolio}</div>
              <button 
                onClick={() => router.push('/admin/portfolio')}
                className={styles.manageButton}
              >
                Manage
              </button>
            </div>

            <div className={styles.statCard}>
              <h3>Services</h3>
              <div className={styles.statNumber}>{stats.services}</div>
              <button 
                onClick={() => router.push('/admin/services')}
                className={styles.manageButton}
              >
                Manage
              </button>
            </div>

            <div className={styles.statCard}>
              <h3>Blogs</h3>
              <div className={styles.statNumber}>{stats.blogs}</div>
              <button 
                onClick={() => router.push('/admin/blogs')}
                className={styles.manageButton}
              >
                Manage
              </button>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h2>Quick Actions</h2>
            <div className={styles.actionButtons}>
              <button 
                onClick={() => router.push('/admin/home')}
                className={styles.actionButton}
              >
                👤 Update Sidebar Profile Image
              </button>
              <button 
                onClick={() => router.push('/admin/home')}
                className={styles.actionButton}
              >
                🏠 Edit Home Content
              </button>
              <button 
                onClick={() => router.push('/admin/about')}
                className={styles.actionButton}
              >
                👤 Edit About Content
              </button>
              <button 
                onClick={() => router.push('/admin/resume')}
                className={styles.actionButton}
              >
                📄 Edit Resume Content
              </button>
              <button 
                onClick={() => router.push('/admin/portfolio/new')}
                className={styles.actionButton}
              >
                + Add Portfolio Item
              </button>
              <button 
                onClick={() => router.push('/admin/services/new')}
                className={styles.actionButton}
              >
                + Add Service
              </button>
              <button 
                onClick={() => router.push('/admin/blogs/new')}
                className={styles.actionButton}
              >
                + Add Blog
              </button>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}
