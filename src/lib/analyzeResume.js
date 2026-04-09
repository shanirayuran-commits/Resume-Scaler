/* ============================================
   lib/analyzeResume.js
   Rule-based analysis engine for resumes
   ============================================ */

/**
 * Analyzes resume text using pre-defined rules and heuristics
 * @param {string} text - Cleaned resume text
 * @returns {Object} - Suggestions and data
 */
export async function analyzeResume(text) {
  const suggestions = {
    formatting: [],
    content: [],
    skills: [],
    keywords: [],
  };

  const textLower = text.toLowerCase();

  // --- 1. DEEPER Formatting & Structure Analysis ---
  const sections = ['education', 'experience', 'skills', 'projects', 'summary', 'contact', 'objective', 'certification', 'award', 'publication'];
  const foundSections = sections.filter(s => textLower.includes(s));
  
  // Enhanced section checking - deeper analysis
  if (foundSections.length < 4) {
    suggestions.formatting.push({
      priority: 'high',
      title: 'Missing Essential Sections',
      detail: 'Your resume seems to be missing standard sections like Experience, Education, or Skills.',
      example: 'Ensure you have clear headings for "Professional Experience" and "Education".'
    });
  } else if (foundSections.length < 6) {
    suggestions.formatting.push({
      priority: 'low',
      title: 'Consider Adding Advanced Sections',
      detail: 'You could strengthen your resume with sections like Certifications, Awards, or Publications.',
    });
  }

  // Deep analysis: content density
  if (text.length < 500) {
    suggestions.formatting.push({
      priority: 'high',
      title: 'Resume is too brief',
      detail: 'Your resume is quite short. Aim for at least one full page of dense content.',
    });
  } else if (text.length < 800) {
    suggestions.formatting.push({
      priority: 'medium',
      title: 'Resume could be more detailed',
      detail: 'Consider expanding your experience descriptions and achievements.',
    });
  } else if (text.length > 8000) {
    suggestions.formatting.push({
      priority: 'medium',
      title: 'Resume is too long',
      detail: 'Recruiters usually prefer 1-2 pages. Consider condensing your older experience.',
    });
  }

  // Deep analysis: bullet point quality and structure
  const bulletCount = (text.match(/[•\*\-\u2022\u2023\u25E6]/g) || []).length;
  if (bulletCount < 5) {
    suggestions.formatting.push({
      priority: 'high',
      title: 'Insufficient Bullet Points',
      detail: 'Use bullet points to make your experience readable and easy to scan.',
      example: '• Managed a team of 5 developers\n• Increased revenue by 20%'
    });
  } else if (bulletCount < 8) {
    suggestions.formatting.push({
      priority: 'medium',
      title: 'Could use more bullet points',
      detail: 'Each job should have 3-5 well-crafted bullet points highlighting key achievements.',
    });
  }

  // Deep analysis: formatting consistency (check for line breaks, spacing)
  const lines = text.split('\n').filter(l => l.trim());
  const averageLineLength = text.length / (lines.length || 1);
  
  if (averageLineLength > 120) {
    suggestions.formatting.push({
      priority: 'medium',
      title: 'Long lines detected - consider better formatting',
      detail: 'Break up long paragraphs into digestible bullet points for better readability.',
    });
  }

  // Deep analysis: check for proper date formatting
  const datePattern = /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})|(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})|(19|20)\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/gi;
  const dates = text.match(datePattern) || [];
  
  if (dates.length < 2) {
    suggestions.formatting.push({
      priority: 'high',
      title: 'Employment dates might be missing',
      detail: 'Include clear employment dates (MM/YYYY or Month YYYY format) for each position.',
    });
  }

  // --- 2. DEEPER Content & Impact Rules ---
  const actionVerbs = ['managed', 'developed', 'coordinated', 'increased', 'led', 'designed', 'built', 'created', 'implemented', 'optimized', 'architected', 'orchestrated', 'spearheaded', 'transformed', 'accelerated', 'cultivated', 'directed', 'engineered'];
  const foundActionVerbs = actionVerbs.filter(v => textLower.includes(v));
  
  if (foundActionVerbs.length < 3) {
    suggestions.content.push({
      priority: 'high',
      title: 'Use More Action Verbs',
      detail: 'Start your bullet points with strong action verbs to demonstrate impact.',
      example: 'Led, Managed, Developed, Orchestrated, Optimized.'
    });
  } else if (foundActionVerbs.length < 6) {
    suggestions.content.push({
      priority: 'low',
      title: 'Vary your action verbs more',
      detail: 'Using diverse action verbs keeps your resume engaging and shows versatility.',
    });
  }

  // Deep analysis: metrics and quantification (expanded patterns)
  const metricsPattern = /\d+%|\$\d+[KMB]?|\d+\s*million|\d+\s*billion|\d+\s*thousand|\d+x\s*growth|\d+\s*percent|\d+\+\s*years|\increased|improved|boosted|grew|achieved|reduced|saved/gi;
  const metrics = text.match(metricsPattern) || [];
  
  if (metrics.length < 2) {
    suggestions.content.push({
      priority: 'high',
      title: 'Quantify Your Achievements',
      detail: 'Add numbers, percentages, or dollar amounts to prove your impact.',
      example: 'Improved website performance by 40% using React and Next.js.'
    });
  } else if (metrics.length < 5) {
    suggestions.content.push({
      priority: 'medium',
      title: 'More specific quantification needed',
      detail: 'Each major accomplishment should include metrics. Current count: ' + metrics.length + ' (aim for 5+).',
    });
  }

  // Deep analysis: achievement depth (check sentence structure)
  const bulletPoints = text.split('\n').filter(line => line.match(/^[\s]*[•\*\-\u2022\u2023\u25E6]/));
  const avgBulletLength = bulletPoints.reduce((sum, bp) => sum + bp.length, 0) / (bulletPoints.length || 1);
  
  if (avgBulletLength < 40) {
    suggestions.content.push({
      priority: 'medium',
      title: 'Bullet points are too brief',
      detail: 'Your bullet points average only ' + Math.round(avgBulletLength) + ' characters. Aim for 50-100+ for better detail.',
    });
  }

  // Deep analysis: check for results-oriented language
  const resultsKeywords = ['achieved', 'generated', 'delivered', 'completed', 'established', 'expanded', 'improved', 'increased', 'reduced', 'decreased', 'minimized', 'maximized', 'streamlined', 'enhanced'];
  const resultsCount = resultsKeywords.filter(k => textLower.includes(k)).length;
  
  if (resultsCount < 2) {
    suggestions.content.push({
      priority: 'medium',
      title: 'Add more results-oriented language',
      detail: 'Emphasize outcomes and achievements, not just tasks. Use words like "achieved", "delivered", "improved".',
    });
  }

  // Check for summary/professional statement
  if (!textLower.includes('summary') && !textLower.includes('profile') && !textLower.includes('professional')) {
    suggestions.content.push({
      priority: 'medium',
      title: 'Add a Professional Summary',
      detail: 'A strong summary at the top helps recruiters quickly understand your value proposition.',
    });
  } else if (textLower.includes('summary') || textLower.includes('profile')) {
    // Check summary depth
    const summaryMatch = text.match(/(?:summary|profile|professional)[\s\n]*:?([\s\S]{0,300}?)(?=\n\n|experience|education)/i);
    if (summaryMatch && summaryMatch[1]) {
      const summaryLength = summaryMatch[1].trim().length;
      if (summaryLength < 80) {
        suggestions.content.push({
          priority: 'low',
          title: 'Expand your Professional Summary',
          detail: 'Your summary is quite brief. Consider expanding to 2-3 sentences highlighting key strengths.',
        });
      }
    }
  }

  // --- 3. DEEPER Skills Analysis ---
  const technicalSkills = ['javascript', 'python', 'java', 'react', 'node', 'aws', 'sql', 'git', 'docker', 'api', 'cloud', 'data', 'typescript', 'golang', 'rust', 'kubernetes', 'gcp', 'azure'];
  const foundTech = technicalSkills.filter(s => textLower.includes(s));
  
  if (foundTech.length < 3) {
    suggestions.skills.push({
      priority: 'medium',
      title: 'Add More Technical Skills',
      detail: 'List specific tools and technologies you are proficient in. Current count: ' + foundTech.length + '.',
    });
  } else if (foundTech.length < 6) {
    suggestions.skills.push({
      priority: 'low',
      title: 'Consider adding more specialized skills',
      detail: 'A well-rounded tech skillset (6+) shows versatility and adaptability.',
    });
  }

  const softSkills = ['communication', 'teamwork', 'leadership', 'problem solving', 'agile', 'management', 'collaboration', 'mentoring', 'strategic thinking', 'critical thinking'];
  const foundSoft = softSkills.filter(s => textLower.includes(s));
  
  if (foundSoft.length < 2) {
    suggestions.skills.push({
      priority: 'low',
      title: 'Include Soft Skills',
      detail: 'Highlight your interpersonal and organizational skills. Current count: ' + foundSoft.length + '.',
    });
  }

  // Deep analysis: industry-specific skills
  const industrySkillsPattern = /(?:certified|certification|trained|proficient|expert|advanced|intermediate)/gi;
  const industrySkills = text.match(industrySkillsPattern) || [];
  
  if (industrySkills.length < 2) {
    suggestions.skills.push({
      priority: 'low',
      title: 'Specify proficiency levels',
      detail: 'Consider explicitly stating your proficiency level (e.g., "Expert", "Advanced", "Certified").',
    });
  }

  // --- 4. DEEPER Keywords & ATS Optimization ---
  const atsKeywords = ['strategic', 'cross-functional', 'stakeholder', 'optimization', 'full-stack', 'enterprise', 'scalability', 'innovation', 'agile', 'scrum', 'kpi', 'roi', 'pipeline', 'revenue'];
  const foundKeywords = atsKeywords.filter(k => textLower.includes(k));
  
  if (foundKeywords.length < 2) {
    suggestions.keywords.push({
      priority: 'medium',
      title: 'Missing Industry Keywords',
      detail: 'Incorporate more industry-standard terminology to pass ATS filters. Current keywords: ' + foundKeywords.length + '.',
    });
  } else if (foundKeywords.length < 5) {
    suggestions.keywords.push({
      priority: 'low',
      title: 'Add more industry-specific keywords',
      detail: 'Enhance ATS compatibility by including more technical and industry keywords.',
    });
  }

  // Check for contact info placeholders
  if (textLower.includes('[phone]') || textLower.includes('[email]') || textLower.includes('[linkedin]')) {
    suggestions.keywords.push({
      priority: 'high',
      title: 'Placeholder Text Detected',
      detail: 'Remove all placeholder text like [Phone Number] or [Email] from your final resume.',
    });
  }

  // Deep analysis: check for common mistakes
  const commonMistakes = [
    { pattern: /references available upon request|personal pronouns|i |my /gi, title: 'Avoid Personal Pronouns', priority: 'medium' },
    { pattern: /objective:/gi, title: 'Consider removing Objective section', detail: 'Modern resumes use Professional Summary instead of Objective', priority: 'low' },
    { pattern: /years experience|years in the|currently working/gi, title: 'More dynamic phrasing could help', priority: 'low' }
  ];

  for (const mistake of commonMistakes) {
    const matches = text.match(mistake.pattern) || [];
    if (matches.length > 0) {
      suggestions.keywords.push({
        priority: mistake.priority || 'medium',
        title: mistake.title,
        detail: mistake.detail || 'This phrasing is outdated or unprofessional.',
      });
    }
  }

  return suggestions;
}
