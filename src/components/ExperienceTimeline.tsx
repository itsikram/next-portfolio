import styles from '../styles/ExperienceTimeline.module.scss';

const experiences = [
  {
    time: '09/2020 - Present',
    role: 'WordPress Developer',
    company: 'Fiverr.com',
    description:
      'I had 70+ five star review on my old fiver account. I worked there as wordpress developer. Because of my mistake I lost my old account now trying to rank one more account',
  },
  {
    time: '05/2021 - 02/2022',
    role: 'MERN Developer',
    company: 'Freelancer.com',
    description:
      'I have 7 five star reviews and I worked there as a MERN Stack Application Developer',
  },
  {
    time: '06/2024 - 10/2024',
    role: 'WordPress Problem Solver',
    company: 'BdCalling It Ltd',
    description:
      'BdCalling was my first office job. there have not programmer. I was the only programmer who know coding. My responsiblities was fix there elementor developer\'s issues and do Custom coding ',
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
