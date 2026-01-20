'use client';

import React, {  useState } from 'react';
import PortfolioMenu from './PortfolioMenu';
import MenuHamburger from '@/Icons/MenuHamburger';
import Image from 'next/image';
const LeftSidebar = () => {

    const [isMobileMenu, setIsMobileMenu] = useState(false)

    return (
        <div className={`left-sidebar ${isMobileMenu? 'show': ''}`}>
            {/* <h1 className='my-name mb-2'>Md Ikram</h1> */}
            <div className='left-sidebar-container'>
                <div className='image-container my-2'>
                    <Image className='avatar-image' src='/images/profile.jpg' alt='Programmer Ikram' width={300} height={300} />
                </div>
                <div className='mobile-mene-toggle' onClick={() => setIsMobileMenu(!isMobileMenu)}>
                    <MenuHamburger />
                </div>
            </div>
            <PortfolioMenu setIsMobileMenu={setIsMobileMenu} />



        </div>
    );
}

export default LeftSidebar;
