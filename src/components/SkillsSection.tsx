import styles from '../styles/SkillsSection.module.scss';

interface TechnicalSkills {
  frontend: string[];
  backend: string[];
  database: string[];
  tools: string[];
}

interface SkillsSectionProps {
  technicalSkills?: TechnicalSkills;
  keyStrengths?: string[];
}

const defaultSkills: TechnicalSkills = {
  frontend: [
    'React.js', 'Redux.js', 'React Native', 'HTML5', 'CSS3', 
    'Bootstrap', 'Tailwind', 'Material-UI', 'jQuery.js', 'Sass CSS'
  ],
  backend: [
    'PHP', 'Node.js', 'Express.js', 'Firebase', 'Prisma', 
    'Mongoose', 'SQL', 'Flask (Python)'
  ],
  database: [
    'MySQL', 'MongoDB', 'SQLite', 'MariaDB', 'PostgreSQL'
  ],
  tools: [
    'AWS', 'Shopify', 'Figma', 'Docker', 'Postman', 'VS Code', 
    'Cursor', 'Photoshop', 'Android Studio', 'Git', 'GitHub', 
    'XAMPP', 'Cloudflared', 'ClickUp', 'Workfolio', 'VirtualBox', 
    'WinSCP', 'Vercel'
  ]
};

const defaultStrengths = [
  'Hard Worker, Honest, Punctual and Responsible',
  'Strong problem-solving and debugging skills',
  'Willing to accept responsibility and perform accordingly even under pressure'
];

export default function SkillsSection({ technicalSkills = defaultSkills, keyStrengths = defaultStrengths }: SkillsSectionProps) {
  const skills = technicalSkills;
  const strengths = keyStrengths;
  return (
    <section className={styles.skillsContainer}>
      <h2 className="about-title color-wh">
        <span>Technical Skills</span>
        <div className='title-border'>
          <div className='title-border-width'></div>
        </div>
      </h2>
      
      <div className={styles.skillsGrid}>
        <div className={styles.skillCategory}>
          <h3 className={styles.categoryTitle}>Front-end</h3>
          <div className={styles.skillList}>
            {skills.frontend.map((skill, index) => (
              <span key={index} className={styles.skillTag}>{skill}</span>
            ))}
          </div>
        </div>
        
        <div className={styles.skillCategory}>
          <h3 className={styles.categoryTitle}>Back-end</h3>
          <div className={styles.skillList}>
            {skills.backend.map((skill, index) => (
              <span key={index} className={styles.skillTag}>{skill}</span>
            ))}
          </div>
        </div>
        
        <div className={styles.skillCategory}>
          <h3 className={styles.categoryTitle}>Database</h3>
          <div className={styles.skillList}>
            {skills.database.map((skill, index) => (
              <span key={index} className={styles.skillTag}>{skill}</span>
            ))}
          </div>
        </div>
        
        <div className={styles.skillCategory}>
          <h3 className={styles.categoryTitle}>Tools & Platforms</h3>
          <div className={styles.skillList}>
            {skills.tools.map((skill, index) => (
              <span key={index} className={styles.skillTag}>{skill}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.strengthsSection}>
        <h3 className={styles.categoryTitle}>Key Strengths</h3>
        <ul className={styles.strengthsList}>
          {strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
