/* ============================================
   Results Page
   Displays the analysis results for the resume
   ============================================ */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import ScoreDisplay from '../../components/ScoreDisplay';
import SuggestionsPanel from '../../components/SuggestionsPanel';
import InsightsPanel from '../../components/InsightsPanel';
import DownloadReport from '../../components/DownloadReport';
import Footer from '../../components/Footer';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    // Retrieve results from session storage
    if (typeof window !== 'undefined') {
      const storedResults = sessionStorage.getItem('resume_analysis_results');
      if (storedResults) {
        try {
          setResults(JSON.parse(storedResults));
        } catch (e) {
          console.error("Failed to parse results", e);
          router.push('/');
        }
      } else {
        // No results found, redirect back to home
        router.push('/');
      }
      setLoading(false);
    }
  }, [router]);

  // Navigate back to upload section
  const handleUploadAgain = () => {
    sessionStorage.removeItem('resume_analysis_results');
    router.push('/#upload');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center">
        <div className="loader mb-4" />
        <p className="text-surface-400">Loading your results...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center">
        <p className="text-red-400 text-lg mb-4">No results found</p>
        <button
          onClick={() => router.push('/')}
          className="btn-primary"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  // ⛔ CHECK IF THIS IS A NON-RESUME DOCUMENT - Show error only
  const isNonResume = results.validation && !results.validation.isResume;

  if (isNonResume) {
    return (
      <main className="min-h-screen bg-surface-950 font-sans pb-24">
        <Header />
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="orb w-[600px] h-[600px] bg-primary-900/10 top-[-20%] right-[-10%]" />
          <div className="orb w-[400px] h-[400px] bg-accent-violet/10 bottom-[-10%] left-[-10%]" />
        </div>

        <div className="relative z-10 pt-32 px-6 sm:px-8 max-w-3xl mx-auto">
          {/* Error Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium mb-4"
              >
                Invalid Document Type
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-display font-bold text-white mb-2"
              >
                Cannot Analyze <span className="gradient-text">This Document</span>
              </motion.h1>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={handleUploadAgain}
              className="px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span className="material-icons text-base">arrow_back</span>
              Analyze Resume
            </motion.button>
          </div>

          {/* Error Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500/30 backdrop-blur-sm"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="text-4xl">⛔</div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-red-300 mb-3">
                  Not a Resume/CV Document
                </h2>
                <p className="text-red-200 mb-4 leading-relaxed whitespace-pre-wrap">
                  {results.validation.message}
                </p>
                
                <div className="mt-4 pt-4 border-t border-red-500/20">
                  <p className="text-sm text-red-300 font-medium mb-3">What happened:</p>
                  <ul className="text-sm text-red-200 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>The document you uploaded appears to be a <strong>{results.validation.documentType}</strong>, not a resume or CV</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>We cannot analyze this document type for resume optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>Please upload an actual resume or CV file to proceed</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUploadAgain}
                    className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-icons">upload_file</span>
                    Upload Correct Document
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/')}
                    className="px-6 py-3 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-200 font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-icons">home</span>
                    Back to Home
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </main>
    );
  }

  // ✅ VALID RESUME - Show normal analysis
  return (
    <main className="min-h-screen bg-surface-950 font-sans pb-24">
      <Header />
      
      {/* Background orbs for results page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="orb w-[600px] h-[600px] bg-primary-900/10 top-[-20%] right-[-10%]" />
          <div className="orb w-[400px] h-[400px] bg-accent-violet/10 bottom-[-10%] left-[-10%]" />
      </div>

      <div className="relative z-10 pt-32 px-6 sm:px-8 max-w-7xl mx-auto">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-medium mb-4"
                >
                    Analysis Complete
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl font-display font-bold text-white mb-2"
                >
                    Resume <span className="gradient-text">Analysis</span>
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-2"
                >
                    <p className="text-surface-400">
                        Detailed report for: <span className="text-surface-200 font-semibold">{results.fileName || 'Your Resume'}</span>
                    </p>
                    {results.jobType && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20"
                        >
                            <span className="material-icons text-blue-300 text-sm">work</span>
                            <span className="text-sm font-medium text-blue-300">
                                Category: {results.jobType.charAt(0).toUpperCase() + results.jobType.slice(1)}
                            </span>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={handleUploadAgain}
              className="px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span className="material-icons text-base">arrow_back</span>
              Analyze Resume
            </motion.button>
        </div>

        {/* Dashboard Layout - Full Width Vertical Stack */}
        <div className="space-y-8">
            {/* Success Badge */}
            {results.validation && results.validation.isResume && results.validation.confidence >= 60 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3"
              >
                <span className="text-lg">✓</span>
                <p className="text-green-300 text-sm">
                  Resume validated successfully ({results.validation.confidence}% confidence). Starting deep analysis...
                </p>
              </motion.div>
            )}
            
            {/* Score Display */}
            <ScoreDisplay 
                score={results.score} 
                breakdown={results.breakdown} 
            />
            
            {/* Suggestions Panel */}
            <SuggestionsPanel suggestions={results.suggestions} />

            {/* AI Insights Panel */}
            {results.insights && (
              <InsightsPanel insights={{ ...results.insights, jobType: results.jobType }} />
            )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
