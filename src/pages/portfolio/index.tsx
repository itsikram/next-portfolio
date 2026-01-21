import React, { useCallback } from 'react';
import SearchPlus from '@/Icons/SearchPlus';
import Link2AngularRight from '@/Icons/Link2AngularRight';
import { useRouter } from 'next/router';
import PortfolioSkleton from '@/skletons/portfolio/portfolioSkleton';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import serverApi from '@/config/server-api';

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
      router.push(`/portfolio/${id}`)
    },
    [router]
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
        {portfolios.length > 0 ? portfolios.map((portfolio: Portfolio, key: number) => {

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
                  {portfolio.technologies.slice(0, 3).map((tech: string, index: number) => (
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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const response = await serverApi.get('/api/portfolio');
    return {
      props: {
        portfolios: response.data.portfolios || []
      }
    };
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return {
      props: {
        portfolios: []
      }
    };
  }
};

export default Portfolio;
