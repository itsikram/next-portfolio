import Head from 'next/head';
import ParticlesBackground from '@/components/ParticlesBackground';
import SocialIcons from '@/components/SocialIcons';
import ProgressBar from '@/components/ProgressBar';
import EducationTimeline from '@/components/EducationTimeline';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import Briefcase from '@/Icons/Briefcase';
import GraduationCap from '@/Icons/GraduationCap';
export default function Home() {


    return (
         <>
            {/* <Head>
                <title>Home - Portfolio of Md Ikram</title>
            </Head> */}
            <section id='resume'>
                <h2 className="resume-title color-wh">
                    <span>
                        My Skills

                    </span>

                    <div className='title-border'>

                        <div className='title-border-width'></div>
                    </div>
                </h2>

                <div className='resume-skill-container'>
                    <ProgressBar title={'HTML'} percent={98} />
                    <ProgressBar title={'CSS'} percent={95} />
                    <ProgressBar title={'javaScript'} percent={80} />
                    <ProgressBar title={'jQuery'} percent={90} />
                    <ProgressBar title={'PHP'} percent={85} />
                    <ProgressBar title={'Node.js'} percent={70} />
                    <ProgressBar title={'React'} percent={85} />
                    <ProgressBar title={'Bootsrap'} percent={85} />
                    <ProgressBar title={'WordPress'} percent={95} />
                    <ProgressBar title={'Laravel'} percent={40} />
                </div>

                <h2 className="resume-title color-wh">
                    <span>
                        Resume
                    </span>

                    <div className='title-border'>
                        <div className='title-border-width'></div>
                    </div>
                </h2>
                {/* <div className="timeline">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div> */}



                <div className='resume-experience-container'>
                    <h3 className='section-title'>
                        <Briefcase />
                        Work Experience
                    </h3>
                    <ExperienceTimeline />

                </div>
                <div className='resume-education-container'>
                    <h3 className='section-title'>
                        <GraduationCap />
                        Education
                    </h3>
                    <EducationTimeline />

                </div>




            </section>

        </>
    )

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
