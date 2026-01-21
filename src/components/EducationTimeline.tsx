import styles from '../styles/EducationTimeline.module.scss';

interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationTimelineProps {
  education: Education[];
}

const defaultEducation: Education[] = [
  {
    degree: 'Higher Secondary Certificate (H.S.C)',
    institution: 'Govt. Haraganga College, Munshiganj',
    location: 'Munshiganj',
    startDate: '2023',
    endDate: '2023',
    description: 'Field of Study: Business Studies | Result: GPA-3.50 (Out of 5.00)',
  },
  {
    degree: 'Secondary School Certificate (S.S.C)',
    institution: 'Rancha Ruhitpur High School, Munshiganj',
    location: 'Munshiganj',
    startDate: '2020',
    endDate: '2020',
    description: 'Field of Study: Business Studies | Result: GPA-3.72 (Out of 5.00)',
  },
];

export default function EducationTimeline({ education = defaultEducation }: EducationTimelineProps) {
  const displayEducation = education.length > 0 ? education : defaultEducation;
  
  return (
    <section className={styles.timeline}>
      
      {displayEducation.map((edu, index) => (
        <div className={styles.entry} key={index}>
          <div className={styles.time}>{edu.startDate}</div>
          <div className={styles.role}>{edu.degree}</div>
          <div className={styles.company}>{edu.institution}</div>
          <div className={styles.description}>{edu.description}</div>
        </div>
      ))}
    </section>
  );
}
