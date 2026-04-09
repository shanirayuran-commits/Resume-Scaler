/**
 * ============================================
 * lib/generateResumeReportPDF.js
 * Professional PDF Report Generator
 * Receipt/Invoice style layout
 * ============================================
 */

/**
 * Generate a unique Report ID
 * Format: REP-YYYY-XXXX
 */
function generateReportId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `REP-${year}-${randomNum}`;
}

/**
 * Get score recommendation
 */
function getRecommendation(score) {
  if (score >= 75) return { text: 'HIRE', color: [16, 185, 129] }; // Green
  if (score >= 50) return { text: 'MAYBE', color: [245, 158, 11] }; // Amber
  return { text: 'IMPROVE', color: [244, 63, 94] }; // Red
}

/**
 * Get score label
 */
function getScoreLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Poor';
}

/**
 * Main PDF Generation Function
 * @param {Object} reportData - Complete report data
 */
export async function generateResumeReportPDF(reportData) {
  // Dynamic import for client-side only
  const { jsPDF } = await import('jspdf');
  // Import autoTable plugin - it auto-registers itself
  await import('jspdf-autotable');

  const {
    fileName = 'Resume',
    candidateName = 'Candidate',
    score = 0,
    breakdown = {},
    suggestions = {},
    insights = {},
  } = reportData;

  // Create PDF document (A4 size)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // ============================================
  // HEADER SECTION
  // ============================================

  // App Logo/Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(99, 102, 241); // Indigo
  doc.text('CV ANALYZER', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Professional Resume Analysis Report', pageWidth / 2, yPosition, { align: 'center' });

  // Divider line
  yPosition += 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, yPosition, pageWidth - 15, yPosition);

  // Report Info Section (Left & Right)
  yPosition += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);

  const reportId = generateReportId();
  const analysisDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const analysisTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Left column - Report details
  doc.text('Report ID:', 15, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(reportId, 35, yPosition);

  // Right column - Date
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Date:', pageWidth - 50, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(analysisDate, pageWidth - 35, yPosition);

  yPosition += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Time:', pageWidth - 50, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(analysisTime, pageWidth - 35, yPosition);

  // Candidate & File info
  yPosition += 8;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Candidate:', 15, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(candidateName, 35, yPosition);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('File Name:', pageWidth - 50, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const truncatedFileName = fileName.length > 25 ? fileName.substring(0, 22) + '...' : fileName;
  doc.text(truncatedFileName, pageWidth - 35, yPosition, { align: 'left', maxWidth: 30 });

  // ============================================
  // OVERALL SCORE SECTION (Prominent)
  // ============================================

  yPosition += 14;

  // Score box background
  doc.setFillColor(245, 245, 250);
  doc.rect(15, yPosition, pageWidth - 30, 35, 'F');
  doc.setDrawColor(200, 200, 220);
  doc.rect(15, yPosition, pageWidth - 30, 35);

  // Score display
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(99, 102, 241); // Indigo
  doc.text(score.toString(), pageWidth / 2 - 15, yPosition + 20, { align: 'right' });

  doc.setFontSize(24);
  doc.setTextColor(150, 150, 150);
  doc.text('/ 100', pageWidth / 2 + 10, yPosition + 20, { align: 'left' });

  // Label and recommendation
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text(getScoreLabel(score), 20, yPosition + 12);

  // Recommendation badge
  const { text: recText, color: recColor } = getRecommendation(score);
  doc.setFillColor(recColor[0], recColor[1], recColor[2]);
  doc.rect(pageWidth - 45, yPosition + 7, 30, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(recText, pageWidth - 30, yPosition + 13, { align: 'center' });

  yPosition += 40;

  // ============================================
  // SCORE BREAKDOWN TABLE
  // ============================================

  yPosition += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('SCORE BREAKDOWN', 15, yPosition);

  yPosition += 5;

  // Create breakdown table
  const breakdownData = [
    ['Category', 'Score', 'Status'],
    [
      'Formatting',
      `${breakdown.formatting || 0}/100`,
      breakdown.formatting >= 70 ? '✓ Good' : breakdown.formatting >= 50 ? '~ Fair' : '✗ Low'
    ],
    [
      'Content Quality',
      `${breakdown.content || 0}/100`,
      breakdown.content >= 70 ? '✓ Good' : breakdown.content >= 50 ? '~ Fair' : '✗ Low'
    ],
    [
      'Skills Presentation',
      `${breakdown.skills || 0}/100`,
      breakdown.skills >= 70 ? '✓ Good' : breakdown.skills >= 50 ? '~ Fair' : '✗ Low'
    ],
    [
      'Keywords & ATS',
      `${breakdown.keywords || 0}/100`,
      breakdown.keywords >= 70 ? '✓ Good' : breakdown.keywords >= 50 ? '~ Fair' : '✗ Low'
    ],
  ];

  doc.autoTable({
    startY: yPosition,
    head: [breakdownData[0]],
    body: breakdownData.slice(1),
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center',
      cellPadding: 5,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 5,
      halign: 'center',
      textColor: [60, 60, 60],
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    margin: { left: 15, right: 15 },
  });

  yPosition = doc.lastAutoTable.finalY + 5;

  // ============================================
  // STRENGTHS SECTION
  // ============================================

  if (insights?.strengths && insights.strengths.length > 0) {
    yPosition += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('✓ STRENGTHS', 15, yPosition);

    yPosition += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);

    insights.strengths.slice(0, 5).forEach((strength, idx) => {
      const wrappedText = doc.splitTextToSize(`• ${strength}`, pageWidth - 35);
      wrappedText.forEach((line) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 15;
        }
        doc.text(line, 20, yPosition);
        yPosition += 4;
      });
    });
  }

  // ============================================
  // WEAKNESSES SECTION
  // ============================================

  if (insights?.weaknesses && insights.weaknesses.length > 0) {
    yPosition += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('⚠ AREAS FOR IMPROVEMENT', 15, yPosition);

    yPosition += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);

    insights.weaknesses.slice(0, 5).forEach((weakness, idx) => {
      const wrappedText = doc.splitTextToSize(`• ${weakness}`, pageWidth - 35);
      wrappedText.forEach((line) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 15;
        }
        doc.text(line, 20, yPosition);
        yPosition += 4;
      });
    });
  }

  // ============================================
  // SUGGESTIONS SECTION
  // ============================================

  const suggestionCategories = [
    { key: 'formatting', icon: '📋' },
    { key: 'content', icon: '✍️' },
    { key: 'skills', icon: '🔧' },
    { key: 'keywords', icon: '🔑' },
  ];

  let hasSuggestions = false;
  suggestionCategories.forEach(({ key, icon }) => {
    if (suggestions[key]?.length > 0) {
      hasSuggestions = true;
    }
  });

  if (hasSuggestions) {
    yPosition += 5;

    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 15;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('💡 IMPROVEMENT SUGGESTIONS', 15, yPosition);

    yPosition += 6;

    suggestionCategories.forEach(({ key, icon }) => {
      const items = suggestions[key] || [];
      if (items.length > 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text(`${icon} ${key.toUpperCase()}`, 15, yPosition);
        yPosition += 4;

        items.slice(0, 3).forEach((item) => {
          if (yPosition > pageHeight - 25) {
            doc.addPage();
            yPosition = 15;
          }

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(8);

          const priorityText = item.priority ? `[${item.priority.toUpperCase()}]` : '';
          const titleText = `${priorityText} ${item.title}`;
          const wrappedTitle = doc.splitTextToSize(titleText, pageWidth - 35);

          wrappedTitle.forEach((line) => {
            doc.text(line, 20, yPosition);
            yPosition += 3;
          });

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 100, 100);
          const wrappedDetail = doc.splitTextToSize(item.detail, pageWidth - 35);
          wrappedDetail.forEach((line) => {
            doc.text(line, 22, yPosition);
            yPosition += 3;
          });

          if (item.example) {
            doc.setTextColor(120, 120, 120);
            doc.setFont('helvetica', 'italic');
            const wrappedExample = doc.splitTextToSize(`Example: ${item.example}`, pageWidth - 40);
            wrappedExample.forEach((line) => {
              doc.text(line, 25, yPosition);
              yPosition += 3;
            });
          }

          yPosition += 2;
        });

        yPosition += 3;
      }
    });
  }

  // ============================================
  // FOOTER SECTION
  // ============================================

  // Add page numbers and footer to all pages
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer divider
    doc.setDrawColor(200, 200, 200);
    doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by CV Analyzer | www.cvanalyzer.com', pageWidth / 2, pageHeight - 10, {
      align: 'center',
    });

    // Page number
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 20,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // ============================================
  // DOWNLOAD PDF
  // ============================================

  const sanitizedName = candidateName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `Resume_Report_${sanitizedName}_${dateStr}.pdf`;

  doc.save(filename);

  return {
    success: true,
    message: `PDF downloaded as ${filename}`,
    reportId,
  };
}

export default generateResumeReportPDF;
