import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
type PortfolioMenuProps = {
  setIsMobileMenu: (value: boolean) => void;
};
const PortfolioMenu = ({setIsMobileMenu}: PortfolioMenuProps) => {
    'use client';
    const pathname = usePathname();
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
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/blogs' ? 'active' : ''}`}>
                    <Link href='/blogs'>Blogs</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/contact' ? 'active' : ''}`}>
                    <Link href='/contact'>Contact </Link>
                </li>
            </ul>
        </div>
    );
}

export default PortfolioMenu;
