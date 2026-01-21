import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Admin.module.css';

interface Skill {
  name: string;
  percentage: number;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentJob: boolean;
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ResumeContent {
  skills: Skill[];
  experience: Experience[];
  education: Education[];
}

export default function ResumeContentManager() {
  const [content, setContent] = useState<ResumeContent>({
    skills: [],
    experience: [],
    education: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchContent();
  }, [router]);

  const fetchContent = async () => {
    try {
      const response = await adminApi.get('/resume-content');
      setContent(response.data);
    } catch {
      setError('Failed to fetch content');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminApi.put('/resume-content', content);
      setSuccess('Content updated successfully!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    setContent(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', percentage: 50 }]
    }));
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    setContent(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (index: number) => {
    setContent(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setContent(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        isCurrentJob: false
      }]
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setContent(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setContent(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setContent(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  return (
    <AdminLayout>
      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <h2>Resume Page Content</h2>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.formContainer} style={{ margin: '1.5rem', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className={styles.section}>
              <h3>Skills</h3>
              {content.skills.map((skill, index) => (
                <div key={index} className={styles.formGroup}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      placeholder="Skill name (e.g., React)"
                      style={{ flex: 2 }}
                    />
                    <input
                      type="number"
                      value={skill.percentage}
                      onChange={(e) => updateSkill(index, 'percentage', Number(e.target.value))}
                      placeholder="Percentage"
                      min="0"
                      max="100"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className={`${styles.button} ${styles.dangerButton}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addSkill}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Skill
              </button>
            </div>

            <div className={styles.section}>
              <h3>Work Experience</h3>
              {content.experience.map((exp, index) => (
                <div key={index} className={styles.formGroup}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Job Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        placeholder="Full Stack Developer"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        placeholder="Tech Company"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                        placeholder="Remote"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                        placeholder="2022"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        placeholder="Present"
                        disabled={exp.isCurrentJob}
                      />
                    </div>

                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id={`current-job-${index}`}
                        checked={exp.isCurrentJob}
                        onChange={(e) => updateExperience(index, 'isCurrentJob', e.target.checked)}
                      />
                      <label htmlFor={`current-job-${index}`}>Current Job</label>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className={styles.textarea}
                      rows={3}
                      placeholder="Job description and responsibilities..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className={`${styles.button} ${styles.dangerButton}`}
                  >
                    Remove Experience
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addExperience}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Experience
              </button>
            </div>

            <div className={styles.section}>
              <h3>Education</h3>
              {content.education.map((edu, index) => (
                <div key={index} className={styles.formGroup}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        placeholder="Bachelor of Science in Computer Science"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        placeholder="University Name"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Location</label>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => updateEducation(index, 'location', e.target.value)}
                        placeholder="City, Country"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Start Date</label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                        placeholder="2020"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>End Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                        placeholder="2024"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(index, 'description', e.target.value)}
                      className={styles.textarea}
                      rows={3}
                      placeholder="Education details and achievements..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className={`${styles.button} ${styles.dangerButton}`}
                  >
                    Remove Education
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addEducation}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                + Add Education
              </button>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                disabled={loading}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
