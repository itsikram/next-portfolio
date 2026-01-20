import styles from '../styles/ExperienceTimeline.module.scss';

const experiences = [
  {
    time: 'March 2025 - Now',
    role: 'Senior Software Developer',
    company: 'Lexidom Agency',
    description:
      'Leading software development projects and delivering high-performance solutions for global clients.',
  },
  {
    time: 'March 2024 - July 2024',
    role: 'WordPress Problem Solver',
    company: 'BdCalling It Ltd.',
    description:
      'Provided expert WordPress solutions and custom coding support at Banasree, Rampura office.',
  },
  {
    time: 'February 2023 - July 2024',
    role: 'Custom WordPress Developer',
    company: 'Freelancer.com',
    description:
      'Developed custom WordPress websites and solutions for international clients with focus on performance and scalability.',
  },
  {
    time: 'November 2020 - January 2025',
    role: 'WordPress Theme Developer',
    company: 'Fiverr.com',
    description:
      'Created and customized WordPress themes, delivering high-quality solutions with excellent client satisfaction.',
  },
];

export default function ExperienceTimeline() {
  return (
    <section className={styles.timeline}>

      {experiences.map((exp, index) => (
        <div className={styles.entry} key={index}>
          <div className={styles.time}>{exp.time}</div>
          <div className={styles.role}>{exp.role}</div>
          <div className={styles.company}>{exp.company}</div>
          <div className={styles.description}>{exp.description}</div>
        </div>
      ))}
    </section>
  );
}
