import Head from 'next/head';
import ParticlesBackground from '@/components/ParticlesBackground';
import SocialIcons from '@/components/SocialIcons';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import '../styles/home-styles.scss';

export default function Home() {
    return (
        <>
            <Head>
                <title>Home - Portfolio of Md Ikram</title>
                <meta name="description" content="Full Stack WordPress & MERN Developer with 5+ years of experience" />
            </Head>
            
            <section id='home'>
                <div className='hero-content'>
                    <div className='hero-text'>
                        <h1 className="home-title color-wh">
                            Hi, I'm <span className='color-pc'>Md Ikram</span>
                        </h1>
                        <h2 className="home-subtitle color-tc">
                            Full Stack Developer
                        </h2>
                        <p className='home-desc color-tc'>
                            Crafting exceptional digital experiences with clean code and pixel-perfect design. 
                            Specialized in WordPress, MERN stack, and creating interactive web applications 
                            that drive business growth.
                        </p>
                        
                        <div className='hero-buttons'>
                            <a href='/contact' className='btn-primary'>
                                <Mail size={20} />
                                Get In Touch
                            </a>
                            <a href='/Senior Software Developer.pdf' download className='btn-secondary'>
                                <Download size={20} />
                                Download CV
                            </a>
                        </div>
                    </div>
                    
                    <div className='hero-image'>
                        <div className='profile-card'>
                            <img src='/images/profile.jpg' alt='Md Ikram' />
                            <div className='card-overlay'>
                                <h3>Md Ikram</h3>
                                <p>Full Stack Developer</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='hero-stats'>
                    <div className='stat-item'>
                        <h3 className='color-pc'>5+</h3>
                        <p className='color-tc'>Years Experience</p>
                    </div>
                    <div className='stat-item'>
                        <h3 className='color-pc'>50+</h3>
                        <p className='color-tc'>Projects Completed</p>
                    </div>
                    <div className='stat-item'>
                        <h3 className='color-pc'>30+</h3>
                        <p className='color-tc'>Happy Clients</p>
                    </div>
                </div>
                
                <div className='social-media-container'>
                    <SocialIcons />
                </div>
            </section>
            
            <ParticlesBackground />
        </>
    );
}
