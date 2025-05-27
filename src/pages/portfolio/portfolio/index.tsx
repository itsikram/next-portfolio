import React, { useCallback, useEffect, useState } from 'react';
import SearchPlus from '@/Icons/SearchPlus';
import Link2AngularRight from '@/Icons/Link2AngularRight';
import { useRouter } from 'next/router';
import PortfolioSkleton from '@/skletons/portfolio/portfolioSkleton';
import { GetStaticProps } from 'next';

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

const Portfolio = () => {

    const router = useRouter();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([])
    useEffect(() => {
        fetch('https://programmerikram.com/wp-json/wp/v2/portfolio').then(res => res.json()).then((data: Portfolio[]) => {
            // console.log('data', data[0])
            setPortfolios(data)
        })

    }, [])



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
                                <img src={`${portfolio?.meta?._ps_portfolio_image}`} onError={(e) => {(e.target as HTMLImageElement).style.height = '100px';}}  alt=''/>
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
  const res = await fetch('https://programmerikram.com/wp-json/wp/v2/portfolio');
  const data = await res.json();

  if (!data || !Array.isArray(data)) {
    return { props: { portfolios: [] } };
  }

  return {
    props: {
      portfolios: data,
    }
  };
};

export default Portfolio;


