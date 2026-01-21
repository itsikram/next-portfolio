import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './PageLoader.module.css';

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };

    const handleRouteChangeError = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.events]);

  if (!isLoading) return null;

  return (
    <div className={styles['page-loader-overlay']}>
      <div className={styles['page-loader']}>
        <div className={styles['loader-spinner']}></div>
        <div className={styles['loader-text']}>Loading...</div>
      </div>
    </div>
  );
};

export default PageLoader;
