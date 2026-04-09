/* ============================================
   ScoreDisplay Component
   Animated circular score gauge with breakdown
   ============================================ */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScoreDisplay({ score, breakdown }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score count-up
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Determine score color
  const getScoreColor = (s) => {
    if (s >= 80) return { ring: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Excellent', icon: 'emoji_events' };
    if (s >= 60) return { ring: '#06b6d4', bg: 'rgba(6,182,212,0.1)', label: 'Good', icon: 'thumb_up' };
    if (s >= 40) return { ring: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Needs Work', icon: 'edit_note' };
    return { ring: '#f43f5e', bg: 'rgba(244,63,94,0.1)', label: 'Poor', icon: 'warning' };
  };

  // Render small inline icons to avoid dependency on external icon fonts
  function renderScoreIcon(name) {
    switch (name) {
      case 'emoji_events':
        return '🏆';
      case 'thumb_up':
        return '👍';
      case 'edit_note':
        return '✍️';
      case 'warning':
        return '⚠️';
      default:
        return '';
    }
  }

  // Letter grade
  const getGrade = (s) => {
    if (s >= 95) return 'A+';
    if (s >= 90) return 'A';
    if (s >= 85) return 'A-';
    if (s >= 80) return 'B+';
    if (s >= 75) return 'B';
    if (s >= 70) return 'B-';
    if (s >= 65) return 'C+';
    if (s >= 60) return 'C';
    if (s >= 55) return 'C-';
    if (s >= 50) return 'D+';
    if (s >= 45) return 'D';
    return 'F';
  };

  const scoreInfo = getScoreColor(score);
  const circumference = 2 * Math.PI * 80; // radius = 80
  const dashOffset = circumference - (animatedScore / 100) * circumference;

  // Category breakdown with icons
  const categories = [
    { key: 'formatting', label: 'Formatting', icon: 'description', color: '#818cf8' },
    { key: 'content', label: 'Content', icon: 'edit_note', color: '#06b6d4' },
    { key: 'skills', label: 'Skills', icon: 'tools', color: '#10b981' },
    { key: 'keywords', label: 'Keywords', icon: 'vpn_key', color: '#f59e0b' },
  ];

  function renderCategoryIcon(name) {
    switch (name) {
      case 'description':
        return (
          <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h10M8 12h10M8 18h10M4 6h.01M4 12h.01M4 18h.01" />
          </svg>
        );
      case 'edit_note':
        return (
          <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" />
          </svg>
        );
      case 'tools':
        return (
          <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 3l7 7-4 4-7-7 4-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l6-6" />
          </svg>
        );
      case 'vpn_key':
        return (
          <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 1 1 2 2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 21l4-4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 11l6-6 4 4-6 6z" />
          </svg>
        );
      default:
        return null;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="glass-card p-8 md:p-10"
    >
      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Score Circle */}
        <div className="relative flex-shrink-0">
          <svg className="score-ring w-52 h-52 -rotate-90" viewBox="0 0 180 180">
            {/* Background ring */}
            <circle
              cx="90" cy="90" r="80"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            {/* Score ring */}
            <motion.circle
              cx="90" cy="90" r="80"
              fill="none"
              stroke={scoreInfo.ring}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            {/* Glow effect */}
            <motion.circle
              cx="90" cy="90" r="80"
              fill="none"
              stroke={scoreInfo.ring}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              opacity="0.3"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              filter="url(#glow)"
            />
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Score text in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-display font-bold text-white">
              {animatedScore}
            </span>
            <span className="text-sm text-surface-400 mt-1">out of 100</span>
          </div>
        </div>

        {/* Score info + breakdown */}
        <div className="flex-1 w-full">
          {/* Grade badge */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="text-4xl font-display font-bold px-5 py-2 rounded-xl border"
              style={{ borderColor: `${scoreInfo.ring}40`, backgroundColor: scoreInfo.bg, color: scoreInfo.ring }}
            >
              {getGrade(score)}
            </span>
            <div>
              <p className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-xl">{renderScoreIcon(scoreInfo.icon)}</span>
                {scoreInfo.label}
              </p>
              <p className="text-sm text-surface-400">Overall Resume Quality</p>
            </div>
          </div>

          {/* Category breakdown bars */}
          <div className="space-y-4">
            {categories.map((cat, i) => {
              const catScore = breakdown?.[cat.key] ?? 0;
              return (
                <motion.div
                  key={cat.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-surface-300 flex items-center gap-2">
                      <span className="text-base inline-block align-middle">{renderCategoryIcon(cat.icon)}</span>
                      {cat.label}
                    </span>
                    <span className="text-sm font-bold" style={{ color: cat.color }}>
                      {catScore}/100
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-surface-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${catScore}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
