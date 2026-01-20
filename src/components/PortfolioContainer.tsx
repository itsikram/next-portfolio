'use client';

import { ReactNode, useState, useEffect } from 'react';
import LeftSidebar from './LeftSidebar';
import dynamic from 'next/dynamic';
import { Nunito } from 'next/font/google';
import { usePathname } from 'next/navigation';

// Dynamically import ParticlesBackground with SSR disabled
const ParticlesBackground = dynamic(() => import('./ParticlesBackground'), {
  ssr: false
});
type ContainerProps = {
    children: ReactNode;
};

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700','800','900'], // choose weights you need
  display: 'swap', // optional but recommended
})

export default function PortfolioContainer({ children }: ContainerProps) {
      const pathname = usePathname();
    //   alert(pathname)
    const isHomePage = (pathname?.split('/')[1]) == 'portfolio'  || pathname == '/';
    const isAdminRoute = pathname?.startsWith('/admin');
    const shouldShowParticles = true;
    const [isParticlesLoaded, setIsParticlesLoaded] = useState(false);
    
    useEffect(() => {
        // Mark particles as loaded after component mounts
        setIsParticlesLoaded(true);
    }, []);
    
    return (
        <>
            {shouldShowParticles && isParticlesLoaded && <ParticlesBackground />}
            <div className={`portfolio-page-container ${nunito.className} page-${isHomePage ? 'home' : (pathname?.split('/')[1])}`}>
                {!isAdminRoute && <LeftSidebar />}
                <div className='column-9 content-container'>
                    {children}
                </div>
            </div>
        </>
    );
}



