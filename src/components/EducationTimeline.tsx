import styles from '../styles/EducationTimeline.module.scss';

const educations = [
  {
    time: '2023',
    role: 'Higher Secondary Certificate (H.S.C)',
    company: 'Govt. Haraganga College, Munshiganj',
    description:
      'Field of Study: Business Studies | Result: GPA-3.50 (Out of 5.00)',
  },
  {
    time: '2020',
    role: 'Secondary School Certificate (S.S.C)',
    company: 'Rancha Ruhitpur High School, Munshiganj',
    description:
      'Field of Study: Business Studies | Result: GPA-3.72 (Out of 5.00)',
  },
];

export default function EducationTimeline() {
  return (
    <section className={styles.timeline}>
      
      {educations.map((edu, index) => (
        <div className={styles.entry} key={index}>
          <div className={styles.time}>{edu.time}</div>
          <div className={styles.role}>{edu.role}</div>
          <div className={styles.company}>{edu.company}</div>
          <div className={styles.description}>{edu.description}</div>
        </div>
      ))}
    </section>
  );
}
