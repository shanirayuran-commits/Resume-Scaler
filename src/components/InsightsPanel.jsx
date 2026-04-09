/* ============================================
   InsightsPanel Component
   AI-powered career insights & skill analysis
   ============================================ */
'use client';

import { motion } from 'framer-motion';

export default function InsightsPanel({ insights }) {
  if (!insights) return null;

  const { summary, strengths, weaknesses, skillGaps, industryMatch, actionItems, jobType } = insights;

  // Job-specific CV structure recommendations
  const getCVStructureRecommendations = (type) => {
    const recommendations = {
      tech: {
        title: "Software/Tech Roles",
        sections: [
          { name: "Projects", importance: "Critical", reason: "Showcase real work and technical depth" },
          { name: "GitHub/Portfolio Link", importance: "Critical", reason: "Demonstrate live code and contributions" },
          { name: "Technical Skills", importance: "Critical", reason: "List programming languages, frameworks, tools" },
          { name: "Open Source Contributions", importance: "High", reason: "Shows collaborative development" },
        ]
      },
      finance: {
        title: "Finance/Banking Roles",
        sections: [
          { name: "Relevant Certifications", importance: "Critical", reason: "CFA, CPA, GMAT scores" },
          { name: "Quantifiable Results", importance: "Critical", reason: "% returns, cost savings, revenue impact" },
          { name: "Industry Experience", importance: "High", reason: "Stability and sector knowledge" },
          { name: "Regulatory Knowledge", importance: "High", reason: "Compliance, risk management" },
        ]
      },
      marketing: {
        title: "Marketing/Creative Roles",
        sections: [
          { name: "Portfolio/Case Studies", importance: "Critical", reason: "Show campaigns and creative work" },
          { name: "Metrics & Results", importance: "Critical", reason: "ROI, engagement rates, conversions" },
          { name: "Brand Management", importance: "High", reason: "Product launches, brand positioning" },
          { name: "Digital Marketing Skills", importance: "High", reason: "SEO, SEM, Analytics, Social Media" },
        ]
      },
      sales: {
        title: "Sales/Business Development",
        sections: [
          { name: "Quantified Achievements", importance: "Critical", reason: "Revenue closed, quota attainment %" },
          { name: "Client Portfolio", importance: "Critical", reason: "Enterprise clients, deal sizes" },
          { name: "Territory Growth", importance: "High", reason: "Market expansion, pipeline building" },
          { name: "Industry Knowledge", importance: "High", reason: "Vertical expertise, competitor knowledge" },
        ]
      },
      healthcare: {
        title: "Healthcare/Medical Roles",
        sections: [
          { name: "Licenses & Certifications", importance: "Critical", reason: "Medical board, specializations" },
          { name: "Clinical Experience", importance: "Critical", reason: "Patient care hours, procedures" },
          { name: "Research/Publications", importance: "High", reason: "Academic credentials" },
          { name: "Compliance Training", importance: "High", reason: "HIPAA, patient safety" },
        ]
      },
      general: {
        title: "General Professional Roles",
        sections: [
          { name: "Professional Summary", importance: "High", reason: "Quickly convey your value proposition" },
          { name: "Core Competencies", importance: "High", reason: "Quick scan of key skills" },
          { name: "Achievements (not duties)", importance: "Critical", reason: "Show impact, not just tasks" },
          { name: "Metrics & Impact", importance: "High", reason: "Quantify your contributions" },
        ]
      }
    };
    return recommendations[type?.toLowerCase()] || recommendations.general;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="glass-card p-8 md:p-10"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center">
          <span className="material-icons text-white text-lg">lightbulb</span>
        </div>
        <div>
          <h3 className="text-2xl font-display font-bold text-white">AI Insights</h3>
          <p className="text-surface-400 text-sm">Powered by artificial intelligence</p>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="p-5 rounded-xl bg-gradient-to-br from-primary-500/[0.07] to-accent-violet/[0.07] border border-primary-500/10 mb-8">
          <p className="text-surface-200 leading-relaxed">{summary}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        {strengths?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <span className="material-icons text-white text-lg">thumb_up</span>
              </div>
              <h4 className="text-lg font-semibold text-white">Strengths</h4>
            </div>
            <ul className="space-y-2.5">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-surface-300">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Weaknesses */}
        {weaknesses?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <span className="material-icons text-white text-lg">trending_up</span>
              </div>
              <h4 className="text-lg font-semibold text-white">Areas to Improve</h4>
            </div>
            <ul className="space-y-2.5">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-surface-300">
                  <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  {w}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Skill Gaps */}
      {skillGaps?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <span className="material-icons text-white text-lg">search</span>
            </div>
            <h4 className="text-lg font-semibold text-white">Skill Gaps to Address</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillGaps.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/[0.07] border border-cyan-500/15 text-cyan-300 text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Industry Match */}
      {industryMatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-emerald-300 text-lg">public</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                Industry Match & Opportunities
              </h4>
              <p className="text-surface-200 text-sm leading-relaxed font-medium mb-3">{industryMatch}</p>
              <p className="text-xs text-surface-400">
                This resume is optimized for opportunities in these sectors. Consider tailoring keywords and highlighting relevant achievements for maximum impact in your target industry.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommended CV Structure */}
      {(() => {
        const cvStructure = getCVStructureRecommendations(jobType);
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-8 p-5 rounded-xl bg-blue-500/[0.08] border border-blue-500/20"
          >
            <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4">
              <span className="material-icons text-blue-300 text-sm">assignment</span>
              {cvStructure.title} — Recommended Structure
            </h4>
            <div className="space-y-3">
              {cvStructure.sections.map((section, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-1">
                    {section.importance === "Critical" ? (
                      <span className="material-icons text-red-400 text-sm">priority_high</span>
                    ) : (
                      <span className="material-icons text-blue-300 text-sm">info</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-blue-200">
                      {section.name}
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        section.importance === 'Critical' 
                          ? 'bg-red-500/20 text-red-300' 
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {section.importance}
                      </span>
                    </p>
                    <p className="text-xs text-surface-400 mt-1">{section.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })()}

      {/* Contact Expert Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-violet/15 border border-primary-500/30"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-white text-lg">person_add</span>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-1 text-lg">Get Expert Guidance</h4>
            <p className="text-surface-300 text-sm mb-4">Our career experts can provide personalized 1-on-1 resume audits and job-specific optimization strategies.</p>
            <button 
              onClick={() => {
                const email = 'crazyjesko@gmail.com';
                const subject = 'Resume Assistance Request';
                const body = 'Hi,\n\nI would like to schedule an expert review of my resume. I need assistance with optimizing my resume for better results.\n\nThank you!';
                window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              }}
              className="w-full btn-glow !py-3 !text-sm flex items-center justify-center gap-2 group"
            >
              <span className="material-icons text-sm group-hover:rotate-12 transition-transform">connect_without_contact</span>
              <span>Schedule Expert Review</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Action Items */}
      {actionItems?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="mt-8"
        >
          <h4 className="flex items-center gap-2 text-sm font-semibold text-violet-400 uppercase tracking-wider mb-4">
            <span className="material-icons text-violet-400 text-sm">rocket_launch</span>
            Top Action Items
          </h4>
          <div className="space-y-3">
            {actionItems.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-surface-800/30 border border-white/[0.04]"
              >
                <span className="w-6 h-6 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400 flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-surface-300">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
