import EducationTimeline from '@/components/EducationTimeline';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import Briefcase from '@/Icons/Briefcase';
import GraduationCap from '@/Icons/GraduationCap';
import ProgressBar from '@/components/ProgressBar';
import { GetServerSideProps } from 'next';
import serverApi from '../config/server-api';

interface ResumeContent {
  skills: Array<{
    name: string;
    percentage: number;
  }>;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrentJob: boolean;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
}

interface ResumeProps {
  resumeContent: ResumeContent;
}

export default function Resume({ resumeContent }: ResumeProps) {

  return (
    <>
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
          {resumeContent.skills.map((skill, index) => (
            <ProgressBar key={index} title={skill.name} percent={skill.percentage} />
          ))}
        </div>

        <h2 className="resume-title color-wh">
          <span>
            Resume
          </span>

          <div className='title-border'>
            <div className='title-border-width'></div>
          </div>
        </h2>

        <div className='resume-experience-container'>
          <h3 className='section-title'>
            <Briefcase />
            Work Experience
          </h3>
          <ExperienceTimeline experiences={resumeContent.experience} />
        </div>
        <div className='resume-education-container'>
          <h3 className='section-title'>
            <GraduationCap />
            Education
          </h3>
          <EducationTimeline education={resumeContent.education} />
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ResumeProps> = async () => {
  try {
    const response = await serverApi.get('/api/resume-content');
    
    return {
      props: {
        resumeContent: response.data || {
          skills: [
            { name: "HTML", percentage: 98 },
            { name: "CSS", percentage: 95 },
            { name: "JavaScript", percentage: 80 },
            { name: "jQuery", percentage: 90 },
            { name: "PHP", percentage: 85 },
            { name: "Node.js", percentage: 70 },
            { name: "React", percentage: 85 },
            { name: "Bootstrap", percentage: 85 },
            { name: "WordPress", percentage: 95 },
            { name: "Laravel", percentage: 40 }
          ],
          experience: [
            {
              title: "Full Stack Developer",
              company: "Tech Company",
              location: "Remote",
              startDate: "2022",
              endDate: "Present",
              description: "Developing and maintaining web applications using modern technologies.",
              isCurrentJob: true
            }
          ],
          education: [
            {
              degree: "Bachelor of Science in Computer Science",
              institution: "University Name",
              location: "City, Country",
              startDate: "2020",
              endDate: "2024",
              description: "Graduated with honors, specialized in software development."
            }
          ]
        }
      }
    };
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return {
      props: {
        resumeContent: {
          skills: [],
          experience: [],
          education: []
        }
      }
    };
  }
};
