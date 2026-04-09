/* ============================================
   lib/scoring.js
   Scoring logic for resume evaluation
   ============================================ */

/**
 * Calculates a score (0-100) based on suggestions and heuristics
 * @param {Object} suggestions - Suggestions from analysis
 * @returns {Object} - Total score and category breakdown
 */
export function calculateScore(suggestions) {
  // Base score
  let score = 100;

  // Deduction rules
  const deductions = {
    formatting: (suggestions.formatting || []).reduce((acc, s) => acc + (s.priority === 'high' ? 10 : s.priority === 'medium' ? 5 : 2), 0),
    content: (suggestions.content || []).reduce((acc, s) => acc + (s.priority === 'high' ? 12 : s.priority === 'medium' ? 7 : 3), 0),
    skills: (suggestions.skills || []).reduce((acc, s) => acc + (s.priority === 'high' ? 8 : s.priority === 'medium' ? 4 : 2), 0),
    keywords: (suggestions.keywords || []).reduce((acc, s) => acc + (s.priority === 'high' ? 10 : s.priority === 'medium' ? 5 : 2), 0),
  };

  const totalDeductions = deductions.formatting + deductions.content + deductions.skills + deductions.keywords;
  
  // Calculate final score (min 0)
  score = Math.max(10, 100 - totalDeductions);

  // Breakdown is normalized to 100 for display
  const breakdown = {
    formatting: Math.max(0, 100 - deductions.formatting * 4),
    content: Math.max(0, 100 - deductions.content * 4),
    skills: Math.max(0, 100 - deductions.skills * 5),
    keywords: Math.max(0, 100 - deductions.keywords * 4.5),
  };

  return {
    score: Math.round(score),
    breakdown: {
      formatting: Math.round(breakdown.formatting),
      content: Math.round(breakdown.content),
      skills: Math.round(breakdown.skills),
      keywords: Math.round(breakdown.keywords),
    }
  };
}
