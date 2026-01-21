import styles from '../styles/ExperienceTimeline.module.scss';

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentJob: boolean;
}

interface ExperienceTimelineProps {
  experiences: Experience[];
}

const defaultExperiences: Experience[] = [
  {
    title: 'Senior Software Developer',
    company: 'Lexidom Agency',
    location: 'Remote',
    startDate: 'March 2025',
    endDate: 'Present',
    description: 'Leading software development projects and delivering high-performance solutions for global clients.',
    isCurrentJob: true,
  },
  {
    title: 'WordPress Problem Solver',
    company: 'BdCalling It Ltd.',
    location: 'Banasree, Rampura',
    startDate: 'March 2024',
    endDate: 'July 2024',
    description: 'Provided expert WordPress solutions and custom coding support at Banasree, Rampura office.',
    isCurrentJob: false,
  },
  {
    title: 'Custom WordPress Developer',
    company: 'Freelancer.com',
    location: 'Remote',
    startDate: 'February 2023',
    endDate: 'July 2024',
    description: 'Developed custom WordPress websites and solutions for international clients with focus on performance and scalability.',
    isCurrentJob: false,
  },
  {
    title: 'WordPress Theme Developer',
    company: 'Fiverr.com',
    location: 'Remote',
    startDate: 'November 2020',
    endDate: 'January 2025',
    description: 'Created and customized WordPress themes, delivering high-quality solutions with excellent client satisfaction.',
    isCurrentJob: false,
  },
];

export default function ExperienceTimeline({ experiences = defaultExperiences }: ExperienceTimelineProps) {
  const displayExperiences = experiences.length > 0 ? experiences : defaultExperiences;
  
  return (
    <section className={styles.timeline}>

      {displayExperiences.map((exp, index) => (
        <div className={styles.entry} key={index}>
          <div className={styles.time}>
            {exp.isCurrentJob ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`}
          </div>
          <div className={styles.role}>{exp.title}</div>
          <div className={styles.company}>{exp.company}</div>
          <div className={styles.description}>{exp.description}</div>
        </div>
      ))}
    </section>
  );
}
