import Head from 'next/head';
import ParticlesBackground from '@/components/ParticlesBackground';
import SocialIcons from '@/components/SocialIcons';

export default function Home() {
    return (
        <>
            <Head>
                <title>Home - Portfolio of Md Ikram</title>
            </Head>
            <section id='home'>
                <h1 className="font-bold home-title color-wh">Hi, I am <span className='color-pc'>Md Ikram</span></h1>
                <p className='color-tc home-desc'>I am a frontend web developer. I can provide clean code and pixel perfect design. I also make website more & more interactive with web animations.</p>
                <div className='social-media-container'>
                    <SocialIcons />
                </div>
            </section>
            <ParticlesBackground />

        </>
    );
}
