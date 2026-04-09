/* ============================================
   lib/parseResume.js
   Extract text from PDF and DOCX files
   ============================================ */
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';

/**
 * OCR fallback for scanned image-based PDFs.
 * Uses pdfjs-dist + canvas + tesseract.js when available.
 */
async function ocrPdf(fileBuffer, fileName) {
  try {
    // Gracefully skip OCR if canvas is not available (common in build environments)
    // Canvas requires native bindings that may not be available on all platforms
    let canvasAvailable = false;
    try {
      require.resolve('canvas');
      canvasAvailable = true;
    } catch (e) {
      // Canvas not available, skip OCR
      return '';
    }

    if (!canvasAvailable) {
      return '';
    }

    const pdfjsLib = require('pdfjs-dist');
    const { createCanvas } = require('canvas');
    const { createWorker } = require('tesseract.js');

    const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
    const pdfDocument = await loadingTask.promise;
    const worker = await createWorker({ logger: () => null });

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    let resultText = '';
    const maxPages = Math.min(pdfDocument.numPages, 5);

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');

      await page.render({ canvasContext: context, viewport }).promise;
      const pngBuffer = canvas.toBuffer('image/png');

      const { data: { text } } = await worker.recognize(pngBuffer);
      resultText += `${text}\n`;
    }

    await worker.terminate();

    if (resultText.trim()) {
      return cleanText(resultText);
    }
    return '';
  } catch (ocrErr) {
    // OCR failed, but that's OK - we'll fall back to regular PDF parsing
    return '';
  }
}

/**
 * Extracts text from a resume file based on its extension
 * @param {Buffer} fileBuffer - File content as Buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} - Extracted text
 */
export async function parseResume(fileBuffer, fileName) {
  try {
    const extension = fileName.split('.').pop().toLowerCase();

    if (extension === 'pdf') {
      try {
        const data = await pdfParse(fileBuffer);

        if (data && data.text && data.text.trim()) {
          return cleanText(data.text);
        }

        // No extractable text from PDF layer: try OCR fallback
        const ocrText = await ocrPdf(fileBuffer, fileName);
        if (ocrText && ocrText.trim()) {
          return ocrText;
        }

        throw new Error('No extractable text found. This may be a scanned or malformed PDF.');
      } catch (pdfErr) {
        const ocrText = await ocrPdf(fileBuffer, fileName);

        if (ocrText && ocrText.trim()) {
          return ocrText;
        }

        const lowerMsg = (pdfErr.message || '').toLowerCase();
        if (lowerMsg.includes('invalid pdf structure') || lowerMsg.includes('no pdf header') || lowerMsg.includes('unexpected')) {
          throw new Error('Invalid PDF structure. Please upload a valid text-based PDF (not scanned/embedded images), or export as new PDF/DOCX.');
        }

        throw new Error(pdfErr.message || 'Failed to parse PDF. Try converting to DOCX or re-exporting the PDF.');
      }
    } else if (extension === 'docx') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return cleanText(result.value);
    } else if (extension === 'doc') {
      // Legacy .doc format doesn't have a great Node.js lib, 
      // suggest user to convert to .docx or .pdf
      throw new Error('Legacy .doc format not supported. Please use .pdf or .docx.');
    } else {
      throw new Error(`Unsupported file format: .${extension}`);
    }
  } catch (err) {
    console.error(`Error parsing resume (${fileName}):`, err);
    throw err;
  }
}

/**
 * Normalizes text, removes extra whitespace and illegal chars
 * @param {string} text 
 * @returns {string}
 */
function cleanText(text) {
  if (!text) return '';
  
  return text
    .replace(/\r/g, '\n') // Standardize line breaks
    .replace(/\n\s*\n/g, '\n\n') // Merge multiple empty lines
    .replace(/\t/g, ' ') // Tabs to spaces
    .replace(/[ \f\r\t\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/g, ' ') // Multiple spaces to single space
    .trim();
}
