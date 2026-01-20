import React, { useCallback, useState, useEffect } from 'react';
import SearchPlus from '@/Icons/SearchPlus';
import Link2AngularRight from '@/Icons/Link2AngularRight';
import { useRouter } from 'next/router';
import PortfolioSkleton from '@/skletons/portfolio/portfolioSkleton';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import axios from 'axios';

type Portfolio = {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  category: string;
  createdAt: string;
};

type Props = {
  portfolios: Portfolio[];
};

function truncateText(text: string, maxLength: number): string {
  if (text.length < 1) return '';
  return text.length > maxLength
    ? text.slice(0, maxLength) + '...'
    : text;
}

const Portfolio = ({ portfolios }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<Portfolio[]>([]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/portfolio');
        setPortfolioData(response.data.portfolios || []);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
        // Fallback to mock data if API fails
        setPortfolioData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handlePortfolioClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const url = e.currentTarget.dataset.url;
      if (!url) return;
      window.open(url, '_blank');
    },
    []
  );

  const handlePortfolioView = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const id = e.currentTarget.dataset.id;
      if (!id) return;
      router.push(`/portfolio/portfolio/${id}`)
    },
    [router]
  );

  if (loading) {
    return (
      <section id='portfolio'>
        <h1 className='portfolio-title'>
          <div className='color-wh'>Portfolios</div>
          <div className='title-border'>
            <div className='title-border-width'></div>
          </div>
        </h1>
        <div className='portfolios-container'>
          <PortfolioSkleton count={6} />
        </div>
      </section>
    );
  }

  return (
    <section id='portfolio'>
      <h1 className='portfolio-title'>
        <div className='color-wh'>Portfolios</div>
        <div className='title-border'>
          <div className='title-border-width'></div>
        </div>
      </h1>

      <div className='portfolios-container'>
        {portfolioData.length > 0 ? portfolioData.map((portfolio, key) => {

          return (
            <div key={portfolio._id} className='portfolio-item' data-id={portfolio._id} onClick={handlePortfolioClick}>
              <div className='portfolio-image-container'>
                <div className='portfolio-image-overlay'>
                  <a className='view-button' data-id={portfolio._id} onClick={handlePortfolioView}>
                    <SearchPlus />
                  </a>
                  <a onClick={handlePortfolioClick} data-url={portfolio.liveUrl}>
                    <Link2AngularRight />
                  </a>
                </div>
                <Image src={portfolio.image} onError={(e) => {(e.target as HTMLImageElement).style.height = '100px';}} alt={portfolio.title} width={400} height={250} />
              </div>
              <div className='portfolio-details-container'>
                <h3 className='portfolio-title' title={portfolio.title}>{truncateText(portfolio.title, 25)}</h3>
                <p className='portfolio-desc'>
                  {truncateText(portfolio.description, 30)}
                </p>
                <div className='portfolio-tech'>
                  {portfolio.technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className='tech-tag'>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          )

        }) :

          <div className='no-portfolios'>
            <h3>No portfolios found</h3>
            <p>Start by adding your first portfolio item in the admin panel.</p>
          </div>

        }
      </div>
    </section>
  );
}

export default Portfolio;
