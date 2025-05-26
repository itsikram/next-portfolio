import styles from '../styles/EducationTimeline.module.scss';

const educations = [
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
