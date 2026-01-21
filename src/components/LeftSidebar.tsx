'use client';

import React, { useState, useEffect } from 'react';
import PortfolioMenu from './PortfolioMenu';
import MenuHamburger from '@/Icons/MenuHamburger';
import Image from 'next/image';
import axios from '@/config/axios';

const LeftSidebar = () => {

    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const [profileImage, setProfileImage] = useState('/images/profile.jpg')

    useEffect(() => {
        const fetchGeneralDetails = async () => {
            try {
                const response = await axios.get('/general-details');
                if (response.data?.sidebarImage) {
                    setProfileImage(response.data.sidebarImage);
                }
            } catch (error) {
                console.error('Failed to fetch general details:', error);
                // Fallback to home-content if general-details fails
                try {
                    const fallbackResponse = await axios.get('/home-content');
                    if (fallbackResponse.data?.hero?.profileImage) {
                        setProfileImage(fallbackResponse.data.hero.profileImage);
                    }
                } catch (fallbackError) {
                    console.error('Failed to fetch profile image from fallback:', fallbackError);
                }
            }
        };

        fetchGeneralDetails();
    }, []);

    return (
        <div className={`left-sidebar ${isMobileMenu? 'show': ''}`}>
            {/* <h1 className='my-name mb-2'>Md Ikram</h1> */}
            <div className='left-sidebar-container'>
                <div className='image-container my-2'>
                    <Image className='avatar-image' src={profileImage} alt='Programmer Ikram' width={300} height={300} />
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
