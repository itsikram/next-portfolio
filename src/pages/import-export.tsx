import React, { useState, useEffect } from 'react';
import adminApi from '../config/adminApi';
import { Download, Upload, FileText, AlertCircle, CheckCircle, Trash2, Database, Shield, Clock, ArrowRight, Sparkles } from 'lucide-react';
import styles from '../styles/ImportExport.module.css';

interface DataSummary {
  aboutContent: number;
  blogs: number;
  contact: number;
  generalDetails: number;
  homeContent: number;
  portfolios: number;
  processContent: number;
  resumeContent: number;
  services: number;
}

interface ImportResult {
  success: string[];
  failed: string[];
}

const ImportExport: React.FC = () => {
  const [summary, setSummary] = useState<DataSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [clearExisting, setClearExisting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await adminApi.get('/import-export/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get('/import-export/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `portfolio-export-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const handleImport = async (file: File) => {
    setLoading(true);
    setImportResult(null);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Handle regular database data
      const response = await adminApi.post('/import-export/import', {
        ...data,
        clearExisting
      });
      
      setImportResult(response.data.results);
      fetchSummary(); // Refresh summary after import
    } catch (error) {
      console.error('Import failed:', error);
      setImportResult({
        success: [],
        failed: ['Import failed: Invalid JSON file or server error']
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImport(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImport(e.dataTransfer.files[0]);
    }
  };

  const totalItems = summary ? Object.values(summary).reduce((sum, count) => sum + count, 0) : 0;

  return (
    <div className={styles.importExportContainer}>
      <div className={styles.importExportContent}>
        {/* Header */}
        <div className={styles.headerSection}>
          <div className={styles.headerIcon}>
            <Database className="text-white" size={32} />
          </div>
          <h1 className={styles.headerTitle}>
            Data Management Center
          </h1>
          <p className={styles.headerDescription}>
            Seamlessly backup, restore, and manage your entire portfolio data with our advanced import/export system
          </p>
        </div>

        {/* Data Summary */}
        {summary && (
          <div className={styles.dataSummary}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <div className={styles.summaryIcon}>
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <h2 className={styles.summaryTitle}>Data Overview</h2>
                  <p className={styles.summarySubtitle}>Real-time snapshot of your portfolio content</p>
                </div>
                <div className={styles.summaryTotal}>
                  <div className={styles.totalNumber}>{totalItems}</div>
                  <div className={styles.totalLabel}>Total Items</div>
                </div>
              </div>
              
              <div className={styles.summaryGrid}>
                <div className={`${styles.summaryItem} ${styles.summaryItemBlue}`}>
                  <div className={styles.itemNumber}>{summary.aboutContent}</div>
                  <div className={styles.itemLabel}>About</div>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryItemGreen}`}>
                  <div className={styles.itemNumber}>{summary.blogs}</div>
                  <div className={styles.itemLabel}>Blogs</div>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryItemPurple}`}>
                  <div className={styles.itemNumber}>{summary.contact}</div>
                  <div className={styles.itemLabel}>Contact</div>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryItemOrange}`}>
                  <div className={styles.itemNumber}>{summary.portfolios}</div>
                  <div className={styles.itemLabel}>Portfolios</div>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryItemPink}`}>
                  <div className={styles.itemNumber}>{summary.services}</div>
                  <div className={styles.itemLabel}>Services</div>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryItemIndigo}`}>
                  <div className={styles.itemNumber}>{summary.generalDetails}</div>
                  <div className={styles.itemLabel}>General</div>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryItemTeal}`}>
                  <div className={styles.itemNumber}>{summary.homeContent}</div>
                  <div className={styles.itemLabel}>Home</div>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryItemRed}`}>
                  <div className={styles.itemNumber}>{summary.processContent}</div>
                  <div className={styles.itemLabel}>Process</div>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryItemYellow}`}>
                  <div className={styles.itemNumber}>{summary.resumeContent}</div>
                  <div className={styles.itemLabel}>Resume</div>
                </div>
                <div className={`${styles.summaryItem} ${styles.summaryItemGray}`}>
                  <div className={styles.itemNumber}>{totalItems}</div>
                  <div className={styles.itemLabel}>Total</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.mainGrid}>
          {/* Export Section */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={`${styles.cardIcon} ${styles.exportIcon}`}>
                <Download className="text-white" size={24} />
              </div>
              <div>
                <h2 className={styles.cardTitle}>Export Data</h2>
                <p className={styles.cardSubtitle}>Create a complete backup</p>
              </div>
            </div>
            
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <div className={`${styles.featureIcon} ${styles.exportFeatureIcon}`}>
                  <Shield className="text-green-300" size={16} />
                </div>
                <div className={styles.featureContent}>
                  <h3>Complete Backup</h3>
                  <p>All your portfolio data in a single JSON file</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={`${styles.featureIcon} ${styles.exportFeatureIcon}`}>
                  <Clock className="text-green-300" size={16} />
                </div>
                <div className={styles.featureContent}>
                  <h3>Timestamped</h3>
                  <p>Files are named with export date for easy tracking</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={`${styles.featureIcon} ${styles.exportFeatureIcon}`}>
                  <Sparkles className="text-green-300" size={16} />
                </div>
                <div className={styles.featureContent}>
                  <h3>Portable Format</h3>
                  <p>Standard JSON format for maximum compatibility</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleExport}
              disabled={loading || totalItems === 0}
              className={styles.primaryButton}
            >
              {loading ? (
                <span>
                  <div className={styles.loadingSpinner}></div>
                  Exporting...
                </span>
              ) : (
                <>
                  <Download className="mr-3" size={20} />
                  Export All Data
                  <ArrowRight className="ml-3" size={20} />
                </>
              )}
            </button>
            {totalItems === 0 && (
              <p className="text-sm text-gray-400 mt-3 text-center">No data available to export</p>
            )}
            

          </div>

          {/* Import Section */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={`${styles.cardIcon} ${styles.importIcon}`}>
                <Upload className="text-white" size={24} />
              </div>
              <div>
                <h2 className={styles.cardTitle}>Import Data</h2>
                <p className={styles.cardSubtitle}>Restore from backup</p>
              </div>
            </div>
            
            <div className={styles.checkboxSection}>
              <div className={styles.checkboxContainer}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={clearExisting}
                    onChange={(e) => setClearExisting(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <div className={styles.checkboxContent}>
                    <span className={styles.checkboxTitle}>Clear existing data before import</span>
                    <p className={styles.checkboxDescription}>Replace all current data with imported content</p>
                  </div>
                </label>
                {clearExisting && (
                  <div className={styles.warningBox}>
                    <p className={styles.warningText}>
                      <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                      <span>⚠️ This will permanently delete all existing data. Consider creating a backup first.</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`${styles.uploadArea} ${
                dragActive ? styles.uploadAreaActive : styles.uploadAreaDefault
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className={styles.uploadIcon}>
                <Upload className={dragActive ? 'text-blue-300' : 'text-gray-400'} size={48} />
              </div>
              <p className={styles.uploadTitle}>
                {dragActive ? 'Drop your file here' : 'Drag and drop your JSON file here'}
              </p>
              <p className={styles.uploadSubtitle}>or click to browse</p>
              <label className={styles.secondaryButton}>
                <span>
                  <Upload className="mr-2" size={18} />
                  Choose File
                </span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={loading}
                />
              </label>
              <p className={styles.uploadNote}>Only JSON files exported from this system are supported</p>
            </div>
          </div>
        </div>

        {/* Import Results */}
        {importResult && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsIcon}>
                <Database className="text-white" size={20} />
              </div>
              <h3 className={styles.resultsTitle}>Import Results</h3>
            </div>
            
            {importResult.success.length > 0 && (
              <div className={styles.resultGroup}>
                <h4 className={`${styles.resultHeader} ${styles.successHeader}`}>
                  <CheckCircle className="mr-2" size={20} />
                  Successfully Imported ({importResult.success.length})
                </h4>
                <div className={styles.resultList}>
                  <ul>
                    {importResult.success.map((item, index) => (
                      <li key={index} className={styles.resultItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {importResult.failed.length > 0 && (
              <div className={styles.resultGroup}>
                <h4 className={`${styles.resultHeader} ${styles.errorHeader}`}>
                  <AlertCircle className="mr-2" size={20} />
                  Failed to Import ({importResult.failed.length})
                </h4>
                <div className={`${styles.resultList} ${styles.errorList}`}>
                  <ul>
                    {importResult.failed.map((item, index) => (
                      <li key={index} className={`${styles.resultItem} ${styles.errorItem}`}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className={styles.instructionsSection}>
          <div className={styles.instructionsHeader}>
            <div className={styles.instructionsIcon}>
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h3 className={styles.instructionsTitle}>Quick Guide</h3>
              <p className={styles.instructionsSubtitle}>Everything you need to know about data management</p>
            </div>
          </div>
          
          <div className={styles.instructionsGrid}>
            <div className={styles.instructionColumn}>
              <div className={styles.instructionItem}>
                <div className={`${styles.instructionItemIcon} ${styles.exportFeatureIcon}`}>
                  <Download className="text-blue-300" size={16} />
                </div>
                <div className={styles.instructionItemContent}>
                  <h4>Export</h4>
                  <p>Creates a complete backup of all your portfolio data in JSON format with automatic timestamping.</p>
                </div>
              </div>
              <div className={styles.instructionItem}>
                <div className={`${styles.instructionItemIcon} ${styles.importFeatureIcon}`}>
                  <Upload className="text-purple-300" size={16} />
                </div>
                <div className={styles.instructionItemContent}>
                  <h4>Import</h4>
                  <p>Restores data from a previously exported JSON file with validation and error handling.</p>
                </div>
              </div>
            </div>
            
            <div className={styles.instructionColumn}>
              <div className={styles.instructionItem}>
                <div className={`${styles.instructionItemIcon} ${styles.exportFeatureIcon}`}>
                  <Trash2 className="text-orange-300" size={16} />
                </div>
                <div className={styles.instructionItemContent}>
                  <h4>Clear Existing Data</h4>
                  <p>When enabled, deletes all current data before importing new content.</p>
                </div>
              </div>
              <div className={styles.instructionItem}>
                <div className={`${styles.instructionItemIcon} ${styles.exportFeatureIcon}`}>
                  <Shield className="text-green-300" size={16} />
                </div>
                <div className={styles.instructionItemContent}>
                  <h4>Best Practices</h4>
                  <p>Always export a backup before making major changes or importing new data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;
