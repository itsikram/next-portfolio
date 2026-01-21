import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link2AngularRight from '@/Icons/Link2AngularRight';
import Github from '@/Icons/Github';
import ArrowLeft from '@/Icons/ArrowLeft';
import { GetServerSideProps } from 'next';
import serverApi from '@/config/server-api';
import styles from '@/styles/SinglePortfolio.module.scss';

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
  updatedAt: string;
};

interface PortfolioProps {
  portfolio: Portfolio | null;
}

const SinglePortfolio = ({ portfolio }: PortfolioProps) => {

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleLiveUrl = () => {
    if (portfolio?.liveUrl) {
      window.open(portfolio.liveUrl, '_blank');
    }
  };

  const handleGithubUrl = () => {
    if (portfolio?.githubUrl) {
      window.open(portfolio.githubUrl, '_blank');
    }
  };

  if (!portfolio) {
    return (
      <div className={styles.singlePortfolio}>
        <div className={styles.errorContainer}>
          <h2>Portfolio Not Found</h2>
          <p>The portfolio item you are looking for does not exist.</p>
          <button onClick={handleBack} className={styles.backButton}>
            <ArrowLeft />
            Back to Portfolios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.singlePortfolio}>
      <div className={styles.portfolioHeader}>
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeft />
          Back
        </button>
        <h1 className={styles.portfolioTitle}>{portfolio.title}</h1>
        <div className={styles.portfolioMeta}>
          <span className={styles.categoryBadge}>{portfolio.category}</span>
          {portfolio.featured && <span className={styles.featuredBadge}>Featured</span>}
          <span className={styles.date}>
            {new Date(portfolio.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className={styles.portfolioContent}>
        <div className={styles.portfolioImageSection}>
          <div className={styles.portfolioImageContainer}>
            <Image
              src={portfolio.image}
              alt={portfolio.title}
              width={800}
              height={400}
              className={styles.portfolioMainImage}
              onError={(e) => {
                (e.target as HTMLImageElement).style.height = '200px';
              }}
            />
          </div>
        </div>

        <div className={styles.portfolioDetails}>
          <div className={styles.portfolioDescription}>
            <h2>About this project</h2>
            <p>{portfolio.description}</p>
          </div>

          <div className={styles.portfolioTechnologies}>
            <h2>Technologies Used</h2>
            <div className={styles.techList}>
              {portfolio.technologies.map((tech, index) => (
                <span key={index} className={styles.techTag}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.portfolioLinks}>
            <h2>Project Links</h2>
            <div className={styles.linkButtons}>
              {portfolio.liveUrl && (
                <button onClick={handleLiveUrl} className={`${styles.linkButton} ${styles.primary}`}>
                  <Link2AngularRight />
                  View Live Project
                </button>
              )}
              {portfolio.githubUrl && (
                <button onClick={handleGithubUrl} className={`${styles.linkButton} ${styles.secondary}`}>
                  <Github />
                  View Source Code
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PortfolioProps> = async ({ params }) => {
  try {
    const id = params?.id as string;
    if (!id) {
      return {
        props: {
          portfolio: null
        }
      };
    }

    const response = await serverApi.get(`/api/portfolio/${id}`);
    
    return {
      props: {
        portfolio: response.data || null
      }
    };
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    return {
      props: {
        portfolio: null
      }
    };
  }
};

export default SinglePortfolio;
