import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import adminApi from '@/config/adminApi';
import AdminLayout from '../../../components/AdminLayout';
import styles from '../../../styles/Admin.module.css';

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  order: number;
}

interface ProcessContent {
  _id: string;
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
  createdAt: string;
  updatedAt: string;
}

export default function ProcessContentManagement() {
  const [processContent, setProcessContent] = useState<ProcessContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchProcessContent();
  }, [router]);

  const fetchProcessContent = async () => {
    try {
      const response = await adminApi.get('/process-content');
      setProcessContent(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch process content');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = () => {
    if (!processContent) return;
    
    const newStep: ProcessStep = {
      step: String(processContent.steps.length + 1).padStart(2, '0'),
      title: '',
      description: '',
      order: processContent.steps.length
    };
    
    setProcessContent({
      ...processContent,
      steps: [...processContent.steps, newStep]
    });
  };

  const handleRemoveStep = (index: number) => {
    if (!processContent) return;
    
    const updatedSteps = processContent.steps.filter((_, i) => i !== index);
    // Reorder remaining steps
    const reorderedSteps = updatedSteps.map((step, i) => ({
      ...step,
      step: String(i + 1).padStart(2, '0'),
      order: i
    }));
    
    setProcessContent({
      ...processContent,
      steps: reorderedSteps
    });
  };

  const handleStepChange = (index: number, field: keyof ProcessStep, value: string) => {
    if (!processContent) return;
    
    const updatedSteps = [...processContent.steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value
    };
    
    setProcessContent({
      ...processContent,
      steps: updatedSteps
    });
  };

  const handleTitleChange = (field: 'title' | 'subtitle', value: string) => {
    if (!processContent) return;
    
    setProcessContent({
      ...processContent,
      [field]: value
    });
  };

  const handleSave = async () => {
    if (!processContent) return;
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      if (processContent._id) {
        // Update existing content
        await adminApi.put(`/process-content/${processContent._id}`, processContent);
      } else {
        // Create new content
        await adminApi.post('/process-content', processContent);
      }
      
      setSuccess('Process content saved successfully!');
      await fetchProcessContent(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save process content');
    } finally {
      setSaving(false);
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (!processContent) return;
    
    const steps = [...processContent.steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= steps.length) return;
    
    // Swap steps
    [steps[index], steps[newIndex]] = [steps[newIndex], steps[index]];
    
    // Update order and step numbers
    const reorderedSteps = steps.map((step, i) => ({
      ...step,
      step: String(i + 1).padStart(2, '0'),
      order: i
    }));
    
    setProcessContent({
      ...processContent,
      steps: reorderedSteps
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loading}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h2>Process Content Management</h2>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {processContent && (
          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.formLabel}>Section Title</label>
              <input
                type="text"
                id="title"
                className={styles.formInput}
                value={processContent.title}
                onChange={(e) => handleTitleChange('title', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subtitle" className={styles.formLabel}>Section Subtitle (Optional)</label>
              <input
                type="text"
                id="subtitle"
                className={styles.formInput}
                value={processContent.subtitle || ''}
                onChange={(e) => handleTitleChange('subtitle', e.target.value)}
                placeholder="Enter subtitle for the process section"
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.formGroupHeader}>
                <label className={styles.formLabel}>Process Steps</label>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className={styles.addButton}
                >
                  + Add Step
                </button>
              </div>
              
              {processContent.steps.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No process steps added yet. Click "Add Step" to get started.</p>
                </div>
              ) : (
                <div className={styles.stepsContainer}>
                  {processContent.steps.map((step, index) => (
                    <div key={index} className={styles.stepCard}>
                      <div className={styles.stepHeader}>
                        <h4>Step {step.step}</h4>
                        <div className={styles.stepActions}>
                          <button
                            type="button"
                            onClick={() => moveStep(index, 'up')}
                            disabled={index === 0}
                            className={`${styles.moveButton} ${index === 0 ? styles.disabled : ''}`}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveStep(index, 'down')}
                            disabled={index === processContent.steps.length - 1}
                            className={`${styles.moveButton} ${index === processContent.steps.length - 1 ? styles.disabled : ''}`}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(index)}
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className={styles.formGroup}>
                        <input
                          type="text"
                          className={styles.formInput}
                          value={step.title}
                          onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                          placeholder="Step title"
                          required
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <textarea
                          className={styles.formTextarea}
                          value={step.description}
                          onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                          placeholder="Step description"
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.saveButton}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Process Content'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
