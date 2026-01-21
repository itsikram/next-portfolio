import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Admin.module.css';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      // If logged in, redirect to dashboard
      router.push('/admin/dashboard');
    } else {
      // If not logged in, redirect to login
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>Redirecting...</h1>
        <p>Please wait while we redirect you to the appropriate page.</p>
      </div>
    </div>
  );
}
