/* ============================================
   Hero Component
   Animated hero section with floating orbs
   ============================================ */
'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] bg-primary-600 top-[-10%] left-[-10%] animate-float" />
      <div className="orb w-[400px] h-[400px] bg-accent-violet top-[20%] right-[-5%] animate-float-delayed" />
      <div className="orb w-[300px] h-[300px] bg-accent-cyan bottom-[-10%] left-[30%] animate-float" />
      
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center pt-[120px]">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
          AI-Powered Resume Analysis
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6"
        >
          Rate Your{' '}
          <span className="gradient-text">Resume</span>
          <br />
          <span className="text-surface-300">In Seconds</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base md:text-lg text-surface-400 max-w-2xl mx-auto mb-10 text-balance"
        >
          Upload your resume and get an instant AI-powered score with actionable
          suggestions to land your dream job. Beat the ATS, impress recruiters.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap"
        >
          <a href="#upload" className="btn-glow !px-8 !py-3">
            <span>Upload Resume</span>
          </a>
          <a href="#how-it-works" className="btn-outline !px-8 !py-3">
            How It Works
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '10K+', label: 'Resumes Analyzed' },
            { value: '95%', label: 'User Satisfaction' },
            { value: '< 30s', label: 'Analysis Time' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-display font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-surface-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-surface-600 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-primary-400 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
}
