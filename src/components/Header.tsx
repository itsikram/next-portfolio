'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.scss';
import axios from '@/config/axios';

export default function Header() {
  const [brandName, setBrandName] = useState('Portfolio');
  const [navigation] = useState([
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" }
  ]);

  useEffect(() => {
    const fetchGeneralDetails = async () => {
      try {
        const response = await axios.get('/general-details');
        if (response.data?.siteDetails?.siteName) {
          setBrandName(response.data.siteDetails.siteName);
        }
      } catch (error) {
        console.error('Failed to fetch general details:', error);
      }
    };

    fetchGeneralDetails();
  }, []);

  return (
    <header className={styles.nav}>
      <div><strong>{brandName}</strong></div>
      <nav>
        {navigation.map((item, index) => (
          <Link key={index} href={item.href}>{item.label}</Link>
        ))}
      </nav>
    </header>
  );
}
