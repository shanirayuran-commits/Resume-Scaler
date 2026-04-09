/* ============================================
   lib/validateResume.js
   Detect if uploaded document is actually a resume/CV
   or something else (e-bill, invoice, etc.)
   ============================================ */

/**
 * Comprehensive validation to check if document is a real resume/CV
 * @param {string} text - Document text content
 * @returns {Object} - Validation result with isResume flag and confidence
 */
export function validateIfResume(text) {
  const textLower = text.toLowerCase();
  const result = {
    isResume: false,
    confidence: 0, // 0-100
    issues: [],
    positiveIndicators: [],
    negativeIndicators: [],
  };

  // ===== NEGATIVE INDICATORS (Non-Resume Content) =====
  const nonResumePatterns = [
    { pattern: /invoice|billing|bill amount|due date|tax|sales invoice/gi, type: 'invoice' },
    { pattern: /purchase|product code|sku|quantity|price|total|payment/gi, type: 'receipt' },
    { pattern: /electricity|water|gas|utility|meter|consumption|kilowatt/gi, type: 'utility_bill' },
    { pattern: /customer id|account number|reference number|order id/gi, type: 'billing_reference' },
    { pattern: /thank you for your purchase|thank you for your order/gi, type: 'receipt_thanks' },
    { pattern: /balance due|amount outstanding|overdue|late fee/gi, type: 'debt_collection' },
    { pattern: /medical|prescription|diagnosis|patient|doctor|hospital|health insurance/gi, type: 'medical' },
    { pattern: /contract|terms and conditions|legal|liability|intellectual property/gi, type: 'legal' },
    { pattern: /lorem ipsum|dummy text|sample content/gi, type: 'placeholder' },
  ];

  for (const { pattern, type } of nonResumePatterns) {
    const matches = text.match(pattern) || [];
    if (matches.length > 0) {
      result.negativeIndicators.push({ type, count: matches.length });
    }
  }

  // ===== POSITIVE INDICATORS (Resume Content) =====
  
  // Check for resume sections
  const resumeSections = ['experience', 'education', 'skills', 'professional summary', 'profile', 'objective'];
  const foundSections = resumeSections.filter(s => textLower.includes(s));
  
  if (foundSections.length >= 3) {
    result.positiveIndicators.push({ type: 'sections', count: foundSections.length });
  } else if (foundSections.length > 0) {
    result.positiveIndicators.push({ type: 'sections', count: foundSections.length });
  }

  // Check for job-related keywords
  const jobKeywords = ['job title', 'position', 'employed', 'worked as', 'senior', 'junior', 'manager', 'engineer', 'developer', 'analyst', 'specialist', 'coordinator', 'officer'];
  const jobMatches = jobKeywords.filter(k => textLower.includes(k)).length;
  
  if (jobMatches >= 2) {
    result.positiveIndicators.push({ type: 'job_keywords', count: jobMatches });
  }

  // Check for education keywords
  const educationKeywords = ['bachelor', 'master', 'diploma', 'degree', 'university', 'college', 'school', 'graduated', 'gpa', 'coursework'];
  const eduMatches = educationKeywords.filter(k => textLower.includes(k)).length;
  
  if (eduMatches >= 2) {
    result.positiveIndicators.push({ type: 'education_keywords', count: eduMatches });
  }

  // Check for contact information (name, email, phone)
  const emailPattern = /\b[A-Za-z0-9._%±]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phonePattern = /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\+\d{1,3}[\s.-]?\d{1,14}/;
  const hasEmail = emailPattern.test(text);
  const hasPhone = phonePattern.test(text);
  
  if (hasEmail) result.positiveIndicators.push({ type: 'email' });
  if (hasPhone) result.positiveIndicators.push({ type: 'phone' });

  // Check for action verbs (typical in resumes)
  const actionVerbs = ['managed', 'developed', 'coordinated', 'increased', 'led', 'designed', 'built', 'created', 'implemented', 'optimized', 'launched', 'improved', 'achieved'];
  const verbCount = actionVerbs.filter(v => textLower.includes(v)).length;
  
  if (verbCount >= 3) {
    result.positiveIndicators.push({ type: 'action_verbs', count: verbCount });
  }

  // Check for dates (employment/education dates)
  const datePattern = /\b(19|20)\d{2}\b|\b(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/gi;
  const dates = text.match(datePattern) || [];
  
  if (dates.length >= 2) {
    result.positiveIndicators.push({ type: 'dates', count: dates.length });
  }

  // Check for achievements/metrics (numbers with context)
  const metricsPattern = /(\d+%|\$\d+|\d+\s*(?:million|billion|thousand|K|M|B)|increased|improved|achieved|grew|boosted).{0,50}/gi;
  const metrics = text.match(metricsPattern) || [];
  
  if (metrics.length >= 2) {
    result.positiveIndicators.push({ type: 'metrics', count: metrics.length });
  }

  // Check text length (resumes typically 500-8000 chars)
  if (text.length < 300) {
    result.issues.push('Document is too short to be a resume (< 300 characters)');
  } else if (text.length > 15000) {
    result.issues.push('Document is unusually long for a resume (> 15,000 characters)');
  }

  // ===== CALCULATE CONFIDENCE SCORE =====
  
  let positiveScore = 0;
  let negativeScore = 0;

  // Scoring positive indicators
  if (foundSections.length >= 4) positiveScore += 30;
  else if (foundSections.length >= 3) positiveScore += 20;
  else if (foundSections.length > 0) positiveScore += 10;

  if (jobMatches >= 3) positiveScore += 20;
  else if (jobMatches >= 1) positiveScore += 10;

  if (eduMatches >= 2) positiveScore += 15;
  else if (eduMatches > 0) positiveScore += 8;

  if (hasEmail && hasPhone) positiveScore += 10;
  else if (hasEmail || hasPhone) positiveScore += 5;

  if (verbCount >= 5) positiveScore += 15;
  else if (verbCount >= 3) positiveScore += 10;

  if (dates.length >= 3) positiveScore += 10;
  else if (dates.length >= 2) positiveScore += 5;

  if (metrics.length >= 3) positiveScore += 10;
  else if (metrics.length >= 1) positiveScore += 5;

  // Scoring negative indicators
  negativeScore = Math.min(100, result.negativeIndicators.length * 25);

  // Calculate final confidence
  result.confidence = Math.round(Math.max(0, positiveScore - negativeScore));
  result.isResume = result.confidence >= 40; // Threshold: 40% confidence

  return result;
}

/**
 * Generates a human-readable validation message
 * @param {Object} validation - Validation result from validateIfResume
 * @returns {string} - Message explaining the validation
 */
export function getValidationMessage(validation) {
  if (validation.isResume) {
    return `This appears to be a resume/CV (${validation.confidence}% confidence). Analysis results below:`;
  } else {
    return `This document does not appear to be a valid resume. Please upload a proper resume for analysis.`;
  }
}
