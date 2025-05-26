import styles from '../styles/ExperienceTimeline.module.scss';

const experiences = [
  {
    time: '2018 - Present',
    role: 'Frontend Web Developer',
    company: 'Abc Company',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, magni mollitia, aspernatur consequatur accusamus vero eum facere exercitationem velit suscipit ipsam placeat libero. Deleniti exercitationem nostrum quasi. Molestiae, vel porro.',
  },
  {
    time: '2016 - 2018',
    role: 'Frontend Web Developer',
    company: 'CBA Company',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, magni mollitia, aspernatur consequatur accusamus vero eum facere exercitationem velit suscipit ipsam placeat libero. Deleniti exercitationem nostrum quasi. Molestiae, vel porro.',
  },
  {
    time: '2014 - 1016',
    role: 'UI/UX Designer',
    company: 'Example Company',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, magni mollitia, aspernatur consequatur accusamus vero eum facere exercitationem velit suscipit ipsam placeat libero. Deleniti exercitationem nostrum quasi. Molestiae, vel porro.',
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
