import Head from 'next/head';
import SocialIcons from '@/components/SocialIcons';
import { Mail, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import serverApi from '../config/server-api';
interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    profileImage: string;
  };
  stats: Array<{
    value: string;
    label: string;
  }>;
  ctaButtons: Array<{
    text: string;
    url: string;
    type: 'primary' | 'secondary';
    isDownload: boolean;
  }>;
  seo: {
    title: string;
    description: string;
  };
}

interface GeneralDetails {
  cvDownloadUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    website: string;
  };
}

interface HomeProps {
  homeContent: HomeContent;
  generalDetails: GeneralDetails;
}

export default function Home({ homeContent, generalDetails }: HomeProps) {
  return (
    <>
      <Head>
        <title>{homeContent.seo.title}</title>
        <meta name="description" content={homeContent.seo.description} />
      </Head>

      <section id='home'>
        <div className='hero-content'>
          <div className='hero-text'>
            <h1 className="home-title color-wh">
              {homeContent.hero.title.split(' ').map((word, index) => 
                word.includes("Md Ikram") ? 
                  <span key={index} className='color-pc'>{word}</span> : 
                  word + (index < homeContent.hero.title.split(' ').length - 1 ? ' ' : '')
              )}
            </h1>
            <h2 className="home-subtitle color-tc">
              {homeContent.hero.subtitle}
            </h2>
            <p className='home-desc color-tc'>
              {homeContent.hero.description}
            </p>

            <div className='hero-buttons'>
              {homeContent.ctaButtons.map((button, index) => (
                button.isDownload ? (
                  <a key={index} href={generalDetails.cvDownloadUrl} download className={`btn-${button.type}`}>
                    <Download size={20} />
                    {button.text}
                  </a>
                ) : (
                  <Link key={index} href={button.url} className={`btn-${button.type}`}>
                    <Mail size={20} />
                    {button.text}
                  </Link>
                )
              ))}
            </div>
          </div>

          <div className='hero-image'>
            <div className='profile-card'>
              <Image src={homeContent.hero.profileImage} alt='Md Ikram' width={350} height={350} />
              <div className='card-overlay'>
                <h3>Md Ikram</h3>
                <p>Full Stack Developer</p>
              </div>
            </div>
          </div>
        </div>

        <div className='hero-stats'>
          {homeContent.stats.map((stat, index) => (
            <div key={index} className='stat-item'>
              <h3 className='color-pc'>{stat.value}</h3>
              <p className='color-tc'>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className='social-media-container'>
          <SocialIcons />
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const [homeResponse, generalResponse] = await Promise.all([
      serverApi.get('/api/home-content'),
      serverApi.get('/api/general-details')
    ]);

    return {
      props: {
        homeContent: homeResponse.data || {
          hero: {
            title: "Hi, I'm Md Ikram",
            subtitle: "Full Stack Developer",
            description: "Crafting exceptional digital experiences with clean code and pixel-perfect design.",
            profileImage: "/images/profile.jpg"
          },
          stats: [
            { value: "5+", label: "Years Experience" },
            { value: "50+", label: "Projects Completed" },
            { value: "30+", label: "Happy Clients" }
          ],
          ctaButtons: [
            {
              text: "Get In Touch",
              url: "/contact",
              type: 'primary' as const,
              isDownload: false
            },
            {
              text: "Download CV",
              url: "/Senior Software Developer.pdf",
              type: 'secondary' as const,
              isDownload: true
            }
          ],
          seo: {
            title: "Home - Portfolio of Md Ikram",
            description: "Full Stack WordPress & MERN Developer with 5+ years of experience"
          }
        },
        generalDetails: generalResponse.data || {
          cvDownloadUrl: "/Senior Software Developer.pdf",
          socialLinks: {
            github: "https://github.com/itsikram",
            linkedin: "https://www.linkedin.com/in/programmer-ikram/",
            twitter: "https://twitter.com/yourusername",
            facebook: "https://facebook.com/programmerikram",
            instagram: "https://instagram.com/yourusername",
            website: "https://yourwebsite.com"
          }
        }
      }
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      props: {
        homeContent: {
          hero: {
            title: "Hi, I'm Md Ikram",
            subtitle: "Full Stack Developer",
            description: "Crafting exceptional digital experiences with clean code and pixel-perfect design.",
            profileImage: "/images/profile.jpg"
          },
          stats: [
            { value: "5+", label: "Years Experience" },
            { value: "50+", label: "Projects Completed" },
            { value: "30+", label: "Happy Clients" }
          ],
          ctaButtons: [
            {
              text: "Get In Touch",
              url: "/contact",
              type: 'primary' as const,
              isDownload: false
            },
            {
              text: "Download CV",
              url: "/Senior Software Developer.pdf",
              type: 'secondary' as const,
              isDownload: true
            }
          ],
          seo: {
            title: "Home - Portfolio of Md Ikram",
            description: "Full Stack WordPress & MERN Developer with 5+ years of experience"
          }
        },
        generalDetails: {
          cvDownloadUrl: "/Senior Software Developer.pdf",
          socialLinks: {
            github: "https://github.com/itsikram",
            linkedin: "https://www.linkedin.com/in/programmer-ikram/",
            twitter: "https://twitter.com/yourusername",
            facebook: "https://facebook.com/programmerikram",
            instagram: "https://instagram.com/yourusername",
            website: "https://yourwebsite.com"
          }
        }
      }
    };
  }
};
