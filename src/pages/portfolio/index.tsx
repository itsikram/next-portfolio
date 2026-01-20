import React, { useCallback } from 'react';
import SearchPlus from '@/Icons/SearchPlus';
import Link2AngularRight from '@/Icons/Link2AngularRight';
import { useRouter } from 'next/router';
import PortfolioSkleton from '@/skletons/portfolio/portfolioSkleton';
import { GetStaticProps } from 'next';
import Image from 'next/image';

type Portfolio = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  meta?: {
    _ps_portfolio_url?: string;
    _ps_portfolio_image?: string;
  };
};
type Props = {
  portfolios: Portfolio[];
};



function truncateText(text: string, maxLength: number): string {
  const plainText = text.replace(/<[^>]*>/g, '');
  if (plainText.length < 1) return '';
  return plainText.length > maxLength
    ? plainText.slice(0, maxLength) + '...'
    : plainText;
}

const Portfolio = ({ portfolios }: Props) => {
    const router = useRouter();



const handlePortfolioClick = useCallback(
  (e: React.MouseEvent<HTMLElement>) => {
    const url = e.currentTarget.dataset.url;
    if (!url) return;
    window.open(url, '_blank');
  },
  [] // Add any dependencies here if needed
);

const handlePortfolioView = useCallback(
  (e: React.MouseEvent<HTMLElement>) => {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    router.push(`/portfolio/portfolio/${id}`)
  },
  [router] // Add any dependencies here if needed
);


    return (
        <section id='portfolio'>
            <h1 className='portfolio-title'>

                <div className='color-wh'>Portfolios</div>
                <div className='title-border'>

                    <div className='title-border-width'></div>
                </div>
            </h1>

            <div className='portfolios-container'>

                {portfolios.length > 0 ? portfolios.map((portfolio, key) => {

                    return (
                        <div key={key} className='portfolio-item' data-id={portfolio.id} onClick={handlePortfolioClick}>
                            <div className='portfolio-image-container'>
                                <div className='portfolio-image-overlay'>
                                    <a className='view-button'  data-id={portfolio.id} onClick={handlePortfolioView}>
                                        <SearchPlus />
                                    </a>
                                    <a onClick={handlePortfolioClick} data-url={portfolio?.meta?._ps_portfolio_url}>

                                        <Link2AngularRight />

                                    </a>
                                </div>
                                <Image src={`${portfolio?.meta?._ps_portfolio_image}`} onError={(e) => {(e.target as HTMLImageElement).style.height = '100px';}}  alt='' width={400} height={250} />
                            </div>
                            <div className='portfolio-details-container'>
                                <h3 className='portfolio-title' title={portfolio.title.rendered}>{truncateText(portfolio.title.rendered, 25)}</h3>
                                <p className='portfolio-desc'>
                                    {truncateText(portfolio.content.rendered, 30)}
                                </p>

                            </div>

                        </div>
                    )

                }) :

                    <PortfolioSkleton count={6} />


                }


            </div>

        </section>
    );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Static portfolio data since the external API is not working
  const mockPortfolios: Portfolio[] = [
    {
      id: 1,
      title: { rendered: "E-commerce WordPress Website" },
      content: { rendered: "Custom e-commerce solution with WooCommerce integration, payment gateways, and inventory management system." },
      meta: {
        _ps_portfolio_url: "https://example.com/ecommerce-project",
        _ps_portfolio_image: "/images/portfolio-ecommerce.jpg"
      }
    },
    {
      id: 2,
      title: { rendered: "MERN Stack Dashboard" },
      content: { rendered: "Full-stack admin dashboard built with React, Node.js, Express, and MongoDB featuring real-time data visualization." },
      meta: {
        _ps_portfolio_url: "https://example.com/dashboard-project",
        _ps_portfolio_image: "/images/portfolio-dashboard.jpg"
      }
    },
    {
      id: 3,
      title: { rendered: "Corporate WordPress Theme" },
      content: { rendered: "Custom WordPress theme development for corporate clients with advanced customization options and SEO optimization." },
      meta: {
        _ps_portfolio_url: "https://example.com/corporate-theme",
        _ps_portfolio_image: "/images/portfolio-corporate.jpg"
      }
    },
    {
      id: 4,
      title: { rendered: "React Native Mobile App" },
      content: { rendered: "Cross-platform mobile application developed with React Native for iOS and Android with offline capabilities." },
      meta: {
        _ps_portfolio_url: "https://example.com/mobile-app",
        _ps_portfolio_image: "/images/portfolio-mobile.jpg"
      }
    },
    {
      id: 5,
      title: { rendered: "Performance Optimization Project" },
      content: { rendered: "Website performance optimization project achieving 90+ PageSpeed scores through code optimization and caching strategies." },
      meta: {
        _ps_portfolio_url: "https://example.com/performance-project",
        _ps_portfolio_image: "/images/profile.jpg"
      }
    },
    {
      id: 6,
      title: { rendered: "Custom Plugin Development" },
      content: { rendered: "WordPress custom plugin development for client-specific business requirements with advanced functionality." },
      meta: {
        _ps_portfolio_url: "https://example.com/plugin-project",
        _ps_portfolio_image: "/images/portfolio-plugin.jpg"
      }
    }
  ];

  return {
    props: {
      portfolios: mockPortfolios,
    }
  };
};

export default Portfolio;


