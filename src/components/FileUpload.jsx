/* ============================================
   FileUpload Component
   Drag-and-drop file upload with validation
   ============================================ */
'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Job type options
const JOB_TYPES = [
  { value: 'tech', label: 'Software/Tech', icon: 'code' },
  { value: 'finance', label: 'Finance/Banking', icon: 'trending_up' },
  { value: 'marketing', label: 'Marketing/Creative', icon: 'campaign' },
  { value: 'sales', label: 'Sales/Business Dev', icon: 'handshake' },
  { value: 'healthcare', label: 'Healthcare/Medical', icon: 'health_and_safety' },
  { value: 'general', label: 'General Professional', icon: 'business_center' },
];

export default function FileUpload({ onFileAnalyzed }) {
  const [file, setFile] = useState(null);
  const [jobType, setJobType] = useState('general');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Allowed file types
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  // Validate file type and size
  const validateFile = (f) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      const ext = f.name.split('.').pop().toUpperCase() || 'Unknown';
      setError(`❌ File type not supported: .${ext}\n\nPlease upload a PDF or DOCX file only.`);
      return false;
    }
    if (f.size === 0) {
      setError('📭 File is empty. Please select a valid resume file.');
      return false;
    }
    if (f.size > MAX_SIZE) {
      setError(`📦 File is too large (${(f.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed is 10MB.`);
      return false;
    }
    setError('');
    return true;
  };

  // Handle file selection
  const handleFileSelect = (selectedFile) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  // Drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  // Upload and analyze
  const handleAnalyze = async () => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Upload file to get metadata
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.error || 'Upload failed');
      }

      const { fileId, fileName, fileData } = await uploadRes.json();
      setUploadProgress(90);

      // Step 2: Analyze with file data
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, fileName, jobType, fileData }),
      });

      if (!analyzeRes.ok) {
        const errData = await analyzeRes.json();
        throw new Error(errData.error || 'Analysis failed');
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      const results = await analyzeRes.json();

      // Small delay to show 100% progress
      setTimeout(() => {
        onFileAnalyzed(results);
      }, 500);
    } catch (err) {
      setError(err.message);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Reset
  const handleReset = () => {
    setFile(null);
    setError('');
    setUploadProgress(0);
    setUploading(false);
  };

  // Get file extension icon
  const getFileIcon = () => {
    if (!file) return null;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      return (
        <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="material-icons text-red-400 text-3xl">picture_as_pdf</span>
        </div>
      );
    }
    return (
      <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
        <span className="material-icons text-blue-400 text-3xl">description</span>
      </div>
    );
  };

  return (
    <section id="upload" className="py-24 px-6 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Upload Your <span className="gradient-text">Resume</span>
          </h2>
          <p className="text-surface-400 text-lg">
            Drop your PDF or DOCX file below and let our AI do the magic
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {/* Upload card */}
          <div className="glass-card p-8 space-y-6">
            <AnimatePresence mode="wait">
              {!file ? (
                /* Dropzone */
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div
                    className={`dropzone ${isDragging ? 'active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files[0]) handleFileSelect(e.target.files[0]);
                      }}
                      id="resume-upload-input"
                    />

                    <div className="flex flex-col items-center gap-4">
                    {/* Upload icon */}
                    <div className="w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-2">
                      <svg className="w-10 h-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-lg font-semibold text-white mb-1">
                        {isDragging ? 'Drop your resume here' : 'Drag & drop your resume'}
                      </p>
                      <p className="text-surface-400 text-sm">
                        or <span className="text-primary-400 underline">browse files</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-surface-500 mt-2">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        PDF or DOCX
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Max 10MB
                      </span>
                    </div>
                  </div>
                  </div>
                </motion.div>
              ) : (
                /* File selected view */
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* File info */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/50 border border-white/[0.06]">
                    {getFileIcon()}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{file.name}</p>
                      <p className="text-sm text-surface-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {!uploading && (
                      <button
                        onClick={handleReset}
                        className="p-2 rounded-lg hover:bg-surface-700 transition-colors text-surface-400 hover:text-white"
                        id="remove-file-btn"
                      >
                        <span className="material-icons">close</span>
                      </button>
                    )}
                  </div>

                  {/* Progress bar (visible during upload) */}
                  {uploading && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <div className="flex justify-between text-sm mb-3">
                            <span className="text-surface-400">
                              {uploadProgress < 90 ? 'Uploading...' : uploadProgress < 100 ? 'Analyzing...' : 'Complete!'}
                            </span>
                            <span className="text-primary-300 font-medium">
                              {Math.round(uploadProgress)}%
                            </span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-surface-800 overflow-hidden border border-surface-700/50">
                            <motion.div
                              className="h-full rounded-full progress-bar"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Display selected category during analysis */}
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-500/[0.08] border border-primary-500/20">
                        <span className="material-icons text-primary-300 text-sm">work</span>
                        <div className="flex-1">
                          <p className="text-xs text-surface-500">Selected Category</p>
                          <p className="text-sm font-semibold text-primary-300">
                            {JOB_TYPES.find(t => t.value === jobType)?.label || 'General Professional'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Job Type Selection */}
                  {!uploading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-xl bg-blue-500/[0.08] border border-blue-500/20 space-y-4"
                    >
                      <label className="block text-sm font-semibold text-white">
                        <span className="material-icons text-base mr-2 inline-block align-text-bottom">work</span>
                        What type of role are you targeting?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {JOB_TYPES.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => setJobType(type.value)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 text-xs min-h-[80px] justify-center ${
                              jobType === type.value
                                ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                                : 'border-white/[0.1] bg-white/[0.02] text-surface-400 hover:border-primary-500/50'
                            }`}
                          >
                            <span className="material-icons text-xl">{type.icon}</span>
                            <span className="font-medium text-center leading-tight">{type.label}</span>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-surface-500">This helps us provide industry-specific recommendations</p>
                    </motion.div>
                  )}

                  {/* Analyze button */}
                  {!uploading && (
                    <button
                      onClick={handleAnalyze}
                      className="btn-glow w-full text-lg !py-4"
                      id="analyze-btn"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-icons">lightbulb</span>
                        Analyze My Resume
                      </span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 justify-between"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="material-icons flex-shrink-0 text-red-400 mt-0.5">error</span>
                    <p className="text-red-400 text-sm whitespace-pre-line flex-1">{error}</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="whitespace-nowrap px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 font-medium text-xs transition-all border border-red-500/30 hover:border-red-500/50 flex-shrink-0"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
