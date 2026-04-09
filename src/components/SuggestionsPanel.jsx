/* ============================================
   SuggestionsPanel Component
   Categorized improvement suggestions with
   priority indicators and expandable cards
   ============================================ */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Category config
const CATEGORIES = [
  { key: 'formatting', label: 'Formatting', color: '#818cf8', desc: 'Layout, structure & visual appeal' },
  { key: 'content', label: 'Content', color: '#06b6d4', desc: 'Clarity, impact & achievements' },
  { key: 'skills', label: 'Skills', color: '#10b981', desc: 'Technical & soft skills coverage' },
  { key: 'keywords', label: 'Keywords', color: '#f59e0b', desc: 'ATS optimization & industry terms' },
];

// Render category icon as an inline SVG to avoid relying on external icon fonts
function renderIcon(key) {
  switch (key) {
    case 'formatting':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h10M8 12h10M8 18h10M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
      );
    case 'content':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" />
        </svg>
      );
    case 'skills':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 3l7 7-4 4-7-7 4-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l6-6" />
        </svg>
      );
    case 'keywords':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 1 1 2 2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 21l4-4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 11l6-6 4 4-6 6z" />
        </svg>
      );
    default:
      return null;
  }
}

// Priority badge component
function PriorityBadge({ priority }) {
  const config = {
    high: { label: 'High', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
    medium: { label: 'Medium', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    low: { label: 'Low', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  };
  const c = config[priority] || config.medium;
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${c.bg} ${c.border} ${c.text} border`}>
      {c.label}
    </span>
  );
}

export default function SuggestionsPanel({ suggestions }) {
  const [activeCategory, setActiveCategory] = useState('formatting');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentSuggestions = suggestions?.[activeCategory] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="glass-card p-8 md:p-10"
    >
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-display font-bold text-white mb-2">
          Improvement Suggestions
        </h3>
        <p className="text-surface-400">
          Actionable insights to improve your resume&apos;s impact
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          const count = (suggestions?.[cat.key] || []).length;

          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                isActive
                  ? 'bg-white/[0.08] border-white/[0.15] text-white shadow-lg'
                  : 'bg-transparent border-transparent text-surface-400 hover:text-surface-300 hover:bg-white/[0.03]'
              }`}
              id={`tab-${cat.key}`}
            >
              <span className="flex items-center justify-center text-base text-surface-300">{renderIcon(cat.key)}</span>
              {cat.label}
              {count > 0 && (
                <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-primary-500/20 text-primary-300' : 'bg-surface-700 text-surface-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category description */}
      <div className="text-sm text-surface-500 mb-6">
        {CATEGORIES.find((c) => c.key === activeCategory)?.desc}
      </div>

      {/* Suggestions list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-3"
        >
          {currentSuggestions.length === 0 ? (
            <div className="text-center py-12 text-surface-500">
              <p className="text-lg">No suggestions in this category ✨</p>
              <p className="text-sm mt-1">Great job on this section!</p>
            </div>
          ) : (
            currentSuggestions.map((item, idx) => (
              <motion.div
                key={`${activeCategory}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="suggestion-card cursor-pointer"
                onClick={() => toggleExpand(`${activeCategory}-${idx}`)}
              >
                <div className="flex items-start gap-3">
                  {/* Indicator dot */}
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: CATEGORIES.find((c) => c.key === activeCategory)?.color }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <p className="font-medium text-white text-sm">{item.title}</p>
                      <PriorityBadge priority={item.priority} />
                    </div>

                    {/* Expandable detail */}
                    <AnimatePresence>
                      {expandedItems[`${activeCategory}-${idx}`] ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-surface-400 text-sm mt-2 leading-relaxed">
                            {item.detail}
                          </p>
                          {item.example && (
                            <div className="mt-3 p-3 rounded-lg bg-surface-800/50 border border-white/[0.04]">
                              <p className="text-xs text-surface-500 mb-1">Example:</p>
                              <p className="text-sm text-primary-300 font-mono">{item.example}</p>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <p className="text-surface-500 text-xs truncate">{item.detail}</p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Expand icon */}
                  <motion.div
                    animate={{ rotate: expandedItems[`${activeCategory}-${idx}`] ? 180 : 0 }}
                    className="text-surface-500 flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
