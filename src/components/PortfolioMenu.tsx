import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from '@/config/axios';
type PortfolioMenuProps = {
  setIsMobileMenu: (value: boolean) => void;
};
const PortfolioMenu = ({setIsMobileMenu}: PortfolioMenuProps) => {
    'use client';
    const pathname = usePathname();
    const [websiteLink, setWebsiteLink] = useState('https://programmerikram.com');
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

    useEffect(() => {
        const fetchGeneralDetails = async () => {
            try {
                const response = await axios.get('/general-details');
                if (response.data?.socialLinks?.website) {
                    setWebsiteLink(response.data.socialLinks.website);
                }
            } catch (error) {
                console.error('Failed to fetch general details:', error);
            }
        };

        // Check admin authentication status
        const checkAdminAuth = () => {
            const adminToken = localStorage.getItem('adminToken');
            setIsAdminLoggedIn(!!adminToken);
        };

        fetchGeneralDetails();
        checkAdminAuth();

        // Listen for storage changes to update admin status
        const handleStorageChange = () => {
            checkAdminAuth();
        };
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    return (
        <div className='portfolio-menu-container'>

            <ul className='portfolio-menu'>
                <li onClick={() => setIsMobileMenu(false)} className={`portfolio-menu-item ${pathname === '/' ? 'active' : ''}`}>
                    <Link href='/'>Home</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/about' ? 'active' : ''}`}>
                    <Link href='/about'>About</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/resume' ? 'active' : ''}`}>
                    <Link href='/resume'>Resume</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/portfolio' ? 'active' : ''}`}>
                    <Link href='/portfolio'>Portfolio</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/services' ? 'active' : ''}`}>
                    <Link href='/services'>Services</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/blogs' ? 'active' : ''}`}>
                    <Link href='/blogs'>Blogs</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)} className={`portfolio-menu-item ${pathname === '/contact' ? 'active' : ''}`}>
                    <Link href='/contact'>Contact </Link>
                </li>
                {isAdminLoggedIn && (
                    <li onClick={() => setIsMobileMenu(false)} className={`portfolio-menu-item ${pathname?.startsWith('/admin') ? 'active' : ''}`}>
                        <Link href='/admin/dashboard'>Admin Dashboard</Link>
                    </li>
                )}
                <li onClick={() => setIsMobileMenu(false)}>
                    <Link href={websiteLink} target='_blank' rel='noopener noreferrer'>Go To Connect </Link>
                </li>
            </ul>
        </div>
    );
}

export default PortfolioMenu;
