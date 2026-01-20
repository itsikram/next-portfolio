import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Admin.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    // Simple user info from token
    setUser({ email: 'admin' });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/portfolio', label: 'Portfolio', icon: '💼' },
    { path: '/admin/services', label: 'Services', icon: '🛠️' },
    { path: '/admin/blogs', label: 'Blogs', icon: '📝' },
  ];

  if (router.pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className={styles.adminLayout}>
      <nav className={styles.adminSidebar}>
        <div className={styles.adminLogo}>
          <h2>Admin Panel</h2>
        </div>
        
        <ul className={styles.adminMenu}>
          {menuItems.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.adminFooter}>
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{user?.email}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <main className={styles.adminMain}>
        {children}
      </main>
    </div>
  );
}
