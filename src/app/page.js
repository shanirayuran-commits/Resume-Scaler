/* ============================================
   Landing Page
   Main entry point for the application
   ============================================ */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FileUpload from '../components/FileUpload';
import Footer from '../components/Footer';

export default function LandingPage() {
  const router = useRouter();

  const handleFileAnalyzed = (results) => {
    // Store results in sessionStorage to pass to results page
    // In a real app, you might use a state management library or URL params
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('resume_analysis_results', JSON.stringify(results));
      router.push('/results');
    }
  };

  return (
    <main className="min-h-screen bg-surface-950 font-sans">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Upload Section */}
      <FileUpload onFileAnalyzed={handleFileAnalyzed} />

      {/* Features Section (Inline for simplicity) */}
      <section id="features" className="py-24 px-6 sm:px-8 bg-surface-900/50">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Powerful Features</h2>
                <p className="text-surface-400 text-base md:text-lg max-w-2xl mx-auto">Everything you need to optimize your resume and land your next role.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        title: 'Instant Scoring',
                        desc: 'Get an objective score based on industry standards and ATS requirements.',
                        icon: '🎯'
                    },
                    {
                        title: 'AI Analysis',
                        desc: 'Powered by advanced AI to detect skill gaps and content quality.',
                        icon: '🤖'
                    },
                    {
                        title: 'Actionable Tips',
                        desc: 'Specific suggestions to improve formatting, grammar, and impact.',
                        icon: '💡'
                    }
                ].map((feature, i) => (
                    <div key={i} className="glass-card p-8 hover:bg-white/[0.05] transition-all duration-300">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-surface-400 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">How It Works</h2>
                    <p className="text-surface-400 text-base md:text-lg max-w-2xl mx-auto">Three simple steps to a better resume.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-12 md:gap-8 items-start justify-between relative">
                    {/* Connection lines (desktop only) */}
                    <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[2px] bg-white/[0.05] z-0" />

                    {[
                        { step: '01', title: 'Upload', desc: 'Securely upload your resume in PDF or DOCX format.' },
                        { step: '02', title: 'Analyze', desc: 'Our AI processes your text and evaluates it against industry benchmarks.' },
                        { step: '03', title: 'Improve', desc: 'Get your detailed report and start making improvements.' }
                    ].map((step, i) => (
                        <div key={i} className="flex-1 relative z-10 text-center flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center text-xl font-bold text-white mb-6 shadow-glow-sm">
                                {step.step}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-surface-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
          </div>
      </section>

      <Footer />
    </main>
  );
}
