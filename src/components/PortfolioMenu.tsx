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
                <li onClick={() => setIsMobileMenu(false)} className={`portfolio-menu-item ${pathname === '/portfolio' ? 'active' : ''}`}>
                    <Link href='/portfolio'>Home</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/portfolio/about' ? 'active' : ''}`}>
                    <Link href='/portfolio/about'>About</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/portfolio/resume' ? 'active' : ''}`}>
                    <Link href='/portfolio/resume'>Resume</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/portfolio/portfolio' ? 'active' : ''}`}>
                    <Link href='/portfolio/portfolio'>Portfolio</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/portfolio/blogs' ? 'active' : ''}`}>
                    <Link href='/portfolio/blogs'>Blogs</Link>
                </li>
                <li onClick={() => setIsMobileMenu(false)}  className={`portfolio-menu-item ${pathname === '/portfolio/contact' ? 'active' : ''}`}>
                    <Link href='/portfolio/contact'>Contact </Link>
                </li>
            </ul>
        </div>
    );
}

export default PortfolioMenu;
