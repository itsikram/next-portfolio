import { ReactNode } from 'react';
import LeftSidebar from './LeftSidebar';
import ParticlesBackground from './ParticlesBackground';
import { Nunito } from 'next/font/google';
import { usePathname } from 'next/navigation';
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
    
    return (
        <>
            <ParticlesBackground />
            <div className={`portfolio-page-container ${nunito.className} page-${(pathname?.split('/')[1]) == 'portfolio'  || pathname == '/'? 'home' : (pathname?.split('/')[1])}`}>
                <LeftSidebar />
                <div className='column-9 content-container'>
                    {children}
                </div>
            </div>
        </>
    );
}



