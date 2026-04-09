/* ============================================
   app/api/analyze/route.js
   POST handler for resume analysis
   Works with file data passed directly (Netlify compatible)
   ============================================ */
import { NextResponse } from 'next/server';
import { parseResume } from '../../../lib/parseResume';
import { analyzeResume } from '../../../lib/analyzeResume';
import { generateAIInsights } from '../../../lib/aiAnalysis';
import { validateIfResume, getValidationMessage } from '../../../lib/validateResume';
import { calculateScore } from '../../../lib/scoring';

export async function POST(req) {
  try {
    const { fileId, fileName, jobType, fileData } = await req.json();

    if (!fileId || !fileName || !fileData) {
      return NextResponse.json({ error: 'Missing file metadata' }, { status: 400 });
    }

    // Convert base64 file data back to Buffer
    const buffer = Buffer.from(fileData, 'base64');

    // 1. Parse text from document
    const text = await parseResume(buffer, fileName);

    // 2. VALIDATE FIRST: Check if this is actually a resume/CV
    const validation = validateIfResume(text);

    // ⛔ STOP HERE IF NOT A RESUME - Return error immediately
    if (!validation.isResume) {
      const validationMessage = getValidationMessage(validation);
      return NextResponse.json({ 
        error: validationMessage,
        validation: {
          isResume: false,
          confidence: validation.confidence,
          documentType: validation.negativeIndicators[0]?.type || 'unknown',
          message: validationMessage
        }
      }, { status: 400 });
    }

    // 3. Run rule-based analysis (only for valid resumes)
    const suggestions = await analyzeResume(text);

    // 4. Generate AI insights (only for valid resumes)
    const insights = await generateAIInsights(text, validation);

    // 5. Calculate final score
    const { score, breakdown } = calculateScore(suggestions);

    // Returning complete analysis results (only for valid resumes)
    return NextResponse.json({
        fileId,
        fileName,
        jobType: jobType || 'general',
        score,
        breakdown,
        suggestions,
        insights: insights || {},
        validation: {
          isResume: true,
          confidence: validation.confidence,
          message: 'Resume validated successfully'
        }
    });

  } catch (err) {
    console.error('Analysis error:', err.message);
    return NextResponse.json({ 
        error: err.message || 'Failed to analyze resume. Please try a different format.' 
    }, { status: 500 });
  }
}
