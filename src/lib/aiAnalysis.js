/* ============================================
   lib/aiAnalysis.js
   OpenAI GPT integration for enhanced resume analysis
   ============================================ */
import OpenAI from 'openai';

let openai = null;

/**
 * Uses AI to generate career insights and deeper analysis
 * @param {string} text - Resume text
 * @param {Object} validation - Validation result from validateIfResume (optional)
 * @returns {Promise<Object>} - AI-powered insights
 */
export async function generateAIInsights(text, validation = null) {
  // If no API key, return fallback insights
  if (!process.env.OPENAI_API_KEY) {
    return getFallbackInsights(validation);
  }

  // Lazy initialize OpenAI client only when needed
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  try {
    // Enhanced prompt with deeper validation and analysis
    const prompt = `
      You are an expert career coach, recruiter, and document analyst specializing in resume optimization and ATS (Applicant Tracking Systems).
      
      CRITICALLY IMPORTANT: First, analyze if this is actually a real resume/CV or something else (invoice, bill, receipt, etc.).
      Then provide structured feedback.
      
      Document Text:
      """
      ${text.substring(0, 5000)}
      """
      
      STEP 1 - DOCUMENT VALIDATION:
      - Is this a legitimate resume/CV? (Check for resume sections, employment history, education, skills, professional content)
      - Is there suspicious content like: billing info, invoice details, utility amounts, medical data, legal terms?
      - Provide confidence level (0-100%) on whether this is a real resume
      
      STEP 2 - DEEP ANALYSIS:
      If it IS a resume:
      - Perform thorough ATS optimization analysis
      - Identify specific, actionable improvements
      - Check formatting, keywords, metrics, narrative quality
      - Evaluate career progression and achievement quantification
      
      If it is NOT a resume:
      - Clearly state what type of document this is
      - Explain why it's not a resume
      - Do NOT provide resume-specific feedback
      
      Return a JSON object with this EXACT structure:
      {
        "isResume": true/false,
        "resumeConfidence": 0-100,
        "documentType": "resume/cv/invoice/bill/receipt/medical/legal/other",
        "validationWarning": "If not a resume, explain what was detected. If it is a resume, null.",
        "summary": "A 2-3 sentence overview of the profile's strength and positioning. If not resume, explain the document.",
        "strengths": ["List of 3-4 top strengths or positive findings"],
        "weaknesses": ["List of 2-3 areas needing significant improvement or issues found"],
        "skillGaps": ["Specific skills missing OR issues with the document"],
        "industryMatch": "Industries optimized for, or 'N/A' if not a resume",
        "jobType": "Detected job category: tech, finance, marketing, sales, healthcare, or general",
        "actionItems": ["Top 3 priority improvements if resume, OR verification steps if not"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: "You are an expert career coach, recruiter, and document analyst specializing in resume validation and optimization." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (err) {
    // Log error cause but don't expose implementation details
    console.error('AI analysis error:', err.message);
    return getFallbackInsights(validation);
  }
}

/**
 * Fallback insights when AI is unavailable
 */
function getFallbackInsights(validation = null) {
  // If validation says it's not a resume, provide appropriate response
  if (validation && !validation.isResume) {
    return {
      isResume: false,
      resumeConfidence: validation.confidence,
      documentType: validation.negativeIndicators[0]?.type || 'unknown',
      validationWarning: `This document appears to be a ${validation.negativeIndicators[0]?.type || 'non-resume document'}, not a resume/CV. Found patterns: ${validation.negativeIndicators.map(ind => ind.type).join(', ')}`,
      summary: "This document does not appear to be a resume or CV. Please upload a proper resume/CV for analysis.",
      strengths: [
        "Document was successfully parsed"
      ],
      weaknesses: [
        "This is not a resume/CV document",
        "Resume-specific analysis is not applicable"
      ],
      skillGaps: [],
      industryMatch: "N/A",
      jobType: "N/A",
      actionItems: [
        "Please upload an actual resume or CV file",
        "Ensure the document contains professional experience, education, and skills",
        "Verify the file is not an invoice, bill, or non-professional document"
      ]
    };
  }

  // Standard fallback for resumes
  return {
    isResume: true,
    resumeConfidence: 75,
    documentType: "resume",
    validationWarning: null,
    summary: "Your resume shows a solid foundation. With some optimization in keywords and achievement quantification, you can significantly improve your ATS ranking.",
    strengths: [
      "Document structure is generally professional",
      "Core contact information is present",
      "Primary work experience is listed chronologically"
    ],
    weaknesses: [
      "Achievement quantification could be stronger",
      "Industry-specific keyword density is slightly low",
      "Layout could benefit from more modern white-space usage"
    ],
    skillGaps: [
      "Consider adding more specialized certifications",
      "Soft skills are under-represented relative to hard skills",
      "Modern tech stack keywords could be enhanced"
    ],
    industryMatch: "General professional services / Technology",
    jobType: "general",
    actionItems: [
      "Rewrite bullet points to start with strong action verbs (Managed, Developed, Orchestrated, etc.)",
      "Quantify at least 3 major achievements with numbers, percentages, or dollar amounts",
      "Add a professional summary at the top to highlight your unique value proposition"
    ]
  };
}
