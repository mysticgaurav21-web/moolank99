import { jsPDF } from "jspdf";
import { MoolankReading } from "../types";

/**
 * Generates a gorgeous, publication-quality Celestial Destiny Blueprint PDF on the client side.
 * This is 100% self-contained and avoids iframe layout breaking issues.
 */
export function exportBlueprintPDF(
  name: string,
  dob: string,
  language: string,
  reading: MoolankReading,
  t: (text: string) => string
) {
  // Create instance of A4 Portrait PDF
  const doc = new jsPDF("p", "mm", "a4");
  const totalPages = 3;

  // Colors
  const cGold = [171, 133, 41]; // Deep Amber/Gold (rgb: 171, 133, 41)
  const cGoldLight = [218, 192, 128]; // Pale Gold
  const cCharcoal = [15, 23, 42]; // Midnight Charcoal
  const cSlate = [71, 85, 105]; // Slate Gray
  const cCream = [253, 251, 247]; // Soft Cream backdrop
  const cWhite = [255, 255, 255];

  // Margins & Dimensions
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - 2 * margin; // 174mm

  // Helper: Draw borders and footer
  function applyPageTemplate(pageNum: number) {
    // Gold Double-Line Border Frame
    doc.setDrawColor(cGoldLight[0], cGoldLight[1], cGoldLight[2]);
    doc.setLineWidth(0.4);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Outer frame
    doc.setLineWidth(0.15);
    doc.rect(11.5, 11.5, pageWidth - 23, pageHeight - 23); // Inner subtle border

    // Running Header (For pages > 1)
    if (pageNum > 1) {
      doc.setFont("Helvetica", "oblique");
      doc.setFontSize(8);
      doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
      doc.text(`CELESTIAL DESTINY BLUEPRINT • ${name.toUpperCase()}`, margin, 7);
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, 7, { align: "right" });
    }

    // Running Footer
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
    doc.text("Vedic Astro-Numerology Synthesis • Cosmic Resonance", margin, pageHeight - 8);
    doc.text(`Digitally Crafted for ${name} • ${dob}`, pageWidth - margin, pageHeight - 8, { align: "right" });
  }

  // Helper: Draw a decorative star/mandala emblem at a coordinate
  function drawMandalaEmblem(x: number, y: number, r: number) {
    doc.setDrawColor(cGold[0], cGold[1], cGold[2]);
    doc.setLineWidth(0.2);
    
    // Draw concentric circles
    doc.circle(x, y, r);
    doc.circle(x, y, r * 0.7);
    doc.circle(x, y, r * 0.35);

    // Draw crossed lines (compass points)
    doc.line(x - r, y, x + r, y);
    doc.line(x, y - r, x, y + r);

    // Draw 45-degree diagonal lines
    const offset = r * 0.707;
    doc.line(x - offset, y - offset, x + offset, y + offset);
    doc.line(x - offset, y + offset, x + offset, y - offset);
  }

  // ==========================================
  // PAGE 1: TITLE & CORE TRINITY STATS
  // ==========================================
  applyPageTemplate(1);

  // Decorative Mandala at top center
  drawMandalaEmblem(pageWidth / 2, 32, 14);

  let currentY = 54;

  // Title
  doc.setFont("Times", "bold");
  doc.setFontSize(23);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text("CELESTIAL DESTINY BLUEPRINT", pageWidth / 2, currentY, { align: "center" });

  currentY += 6;
  doc.setFont("Times", "italic");
  doc.setFontSize(11.5);
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text("A Personalized Vedic Numerology & Astrological Soul Map", pageWidth / 2, currentY, { align: "center" });

  currentY += 4;
  doc.setDrawColor(cGoldLight[0], cGoldLight[1], cGoldLight[2]);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 45, currentY, pageWidth / 2 + 45, currentY);

  currentY += 10;

  // Metadata Table (Cream background)
  doc.setFillColor(cCream[0], cCream[1], cCream[2]);
  doc.rect(margin, currentY, contentWidth, 24, "F");
  doc.setDrawColor(cGoldLight[0], cGoldLight[1], cGoldLight[2]);
  doc.setLineWidth(0.25);
  doc.rect(margin, currentY, contentWidth, 24);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text("COSMIC RECORD INDENTIFICATION", margin + 5, currentY + 5);

  doc.setFontSize(9);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text(`Full Name: ${name}`, margin + 5, currentY + 12);
  doc.text(`Date of Birth: ${dob}`, margin + 5, currentY + 18);

  doc.text(`Language Mode: ${language === "hinglish" ? "Hinglish (Vedic Mix)" : "English (Pure Vedic)"}`, margin + 85, currentY + 12);
  doc.text(`Ruling Planet: ${reading.rulingPlanet}`, margin + 85, currentY + 18);

  currentY += 34;

  // Section Header: The Numerical Trinity
  doc.setFont("Times", "bolditalic");
  doc.setFontSize(13);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text("The Sacred Numerical Trinity", margin, currentY);
  
  currentY += 2;
  doc.setDrawColor(cGoldLight[0], cGoldLight[1], cGoldLight[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // Draw 3 Trinity Cards side by side
  const cardWidth = (contentWidth - 8) / 3; // ~55mm each
  const cardHeight = 32;

  const trinityData = [
    {
      title: "Moolank (Root)",
      val: reading.moolank,
      desc: "Dictates core character, inner psychology, and baseline personality traits.",
      color: [212, 175, 55]
    },
    {
      title: "Bhagyank (Destiny)",
      val: reading.bhagyank,
      desc: "Reveals life destiny vector, true cosmic path, and karmic mission.",
      color: [34, 150, 180]
    },
    {
      title: "Namank (Name Vibration)",
      val: reading.namank,
      desc: "The phonetic frequency and social aura computed via Chaldean codes.",
      color: [16, 155, 110]
    }
  ];

  trinityData.forEach((card, idx) => {
    const cardX = margin + idx * (cardWidth + 4);
    
    // Card backdrop
    doc.setFillColor(cCream[0], cCream[1], cCream[2]);
    doc.rect(cardX, currentY, cardWidth, cardHeight, "F");
    
    // Card border
    doc.setDrawColor(card.color[0], card.color[1], card.color[2]);
    doc.setLineWidth(0.4);
    doc.rect(cardX, currentY, cardWidth, cardHeight);

    // Title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.text(card.title, cardX + cardWidth / 2, currentY + 5, { align: "center" });

    // Number
    doc.setFont("Times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(card.color[0], card.color[1], card.color[2]);
    doc.text(String(card.val), cardX + cardWidth / 2, currentY + 14, { align: "center" });

    // Description text wrapped inside card
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
    const wrappedDesc = doc.splitTextToSize(card.desc, cardWidth - 6);
    doc.text(wrappedDesc, cardX + 3, currentY + 19);
  });

  currentY += cardHeight + 10;

  // Section: Cosmic Correspondences Table
  doc.setFont("Times", "bolditalic");
  doc.setFontSize(13);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text("Planetary & Cosmic Correspondences", margin, currentY);

  currentY += 2;
  doc.setDrawColor(cGoldLight[0], cGoldLight[1], cGoldLight[2]);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // Align table items
  const leftColX = margin;
  const rightColX = margin + 90;
  let tableY = currentY;

  const leftTable = [
    { label: "Ruling Deity", val: reading.rulingPlanetDeity || "Vedic Energies" },
    { label: "Lucky Gemstone", val: reading.gemstone },
    { label: "Lucky Colors", val: reading.luckyColors.join(", ") },
    { label: "Lucky Days", val: reading.luckyDays.join(", ") }
  ];

  const rightTable = [
    { label: "Lucky Numbers", val: reading.luckyNumbers.join(", ") },
    { label: "Friendly Vibration", val: reading.friendlyNumbers.join(", ") },
    { label: "Neutral Vibration", val: reading.neutralNumbers.join(", ") },
    { label: "Enemy Vibration", val: reading.enemyNumbers.join(", ") }
  ];

  // Draw Left Column Elements
  leftTable.forEach((item, idx) => {
    const yCoord = tableY + idx * 8;
    // Row border
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.15);
    doc.line(leftColX, yCoord + 6, leftColX + 80, yCoord + 6);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(cGold[0], cGold[1], cGold[2]);
    doc.text(item.label, leftColX, yCoord + 4);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.text(item.val, leftColX + 30, yCoord + 4);
  });

  // Draw Right Column Elements
  rightTable.forEach((item, idx) => {
    const yCoord = tableY + idx * 8;
    // Row border
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.15);
    doc.line(rightColX, yCoord + 6, rightColX + 80, yCoord + 6);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(cGold[0], cGold[1], cGold[2]);
    doc.text(item.label, rightColX, yCoord + 4);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.text(item.val, rightColX + 32, yCoord + 4);
  });

  currentY += 38;

  // Radical Remedy (Maha Upay) Highlight Box
  doc.setFillColor(cCream[0], cCream[1], cCream[2]);
  doc.rect(margin, currentY, contentWidth, 24, "F");
  doc.setDrawColor(cGold[0], cGold[1], cGold[2]);
  doc.setLineWidth(0.35);
  doc.rect(margin, currentY, contentWidth, 24);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text("THE RADICAL VEDIC REMEDY (MAHA UPAY)", margin + 5, currentY + 5);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.2);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  const wrappedRemedy = doc.splitTextToSize(t(reading.radicalRemedy), contentWidth - 10);
  doc.text(wrappedRemedy, margin + 5, currentY + 10);

  // ==========================================
  // PAGE 2: DEEP ASTROLOGICAL INSIGHTS (CORE & PURPOSE)
  // ==========================================
  doc.addPage();
  applyPageTemplate(2);

  currentY = 22;

  // Section 1: Core Personality Insight
  doc.setFont("Times", "bolditalic");
  doc.setFontSize(13);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text(`1. Core Personality Insight • Moolank ${reading.moolank}`, margin, currentY);

  currentY += 2;
  doc.setDrawColor(cGoldLight[0], cGoldLight[1], cGoldLight[2]);
  doc.setLineWidth(0.35);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // Title of category
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text(t(reading.categories.personality.title), margin, currentY);

  currentY += 4.5;

  // Summary
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  const personalitySummary = doc.splitTextToSize(t(reading.categories.personality.summary), contentWidth);
  doc.text(personalitySummary, margin, currentY);
  currentY += personalitySummary.length * 4.2 + 2;

  // Deep insight
  const personalityDeep = doc.splitTextToSize(t(reading.categories.personality.deepInsight), contentWidth);
  doc.text(personalityDeep, margin, currentY);
  currentY += personalityDeep.length * 4.2 + 5;

  // Strengths & Challenges grid
  const boxW = (contentWidth - 6) / 2;
  const startBoxY = currentY;

  // Draw Strengths Box
  doc.setFillColor(245, 249, 245); // very light subtle green/tint
  doc.rect(margin, startBoxY, boxW, 40, "F");
  doc.setDrawColor(200, 225, 200);
  doc.rect(margin, startBoxY, boxW, 40);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(16, 120, 80);
  doc.text("ASTROLOGICAL STRENGTHS", margin + 4, startBoxY + 4.5);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  reading.categories.personality.strengths.slice(0, 3).forEach((st, sidx) => {
    doc.text(`• ${t(st)}`, margin + 4, startBoxY + 11 + sidx * 5.5);
  });

  // Draw Challenges Box
  doc.setFillColor(254, 245, 245); // very light subtle rose/red
  doc.rect(margin + boxW + 6, startBoxY, boxW, 40, "F");
  doc.setDrawColor(240, 200, 200);
  doc.rect(margin + boxW + 6, startBoxY, boxW, 40);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(200, 60, 60);
  doc.text("COSMIC CHALLENGES", margin + boxW + 10, startBoxY + 4.5);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  reading.categories.personality.challenges.slice(0, 3).forEach((ch, cidx) => {
    doc.text(`• ${t(ch)}`, margin + boxW + 10, startBoxY + 11 + cidx * 5.5);
  });

  currentY += 48;

  // Section 2: Destiny & Cosmic Purpose (Bhagyank)
  doc.setFont("Times", "bolditalic");
  doc.setFontSize(13);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text(`2. Life Destiny & Karma Vector • Bhagyank ${reading.bhagyank}`, margin, currentY);

  currentY += 2;
  doc.setDrawColor(cGoldLight[0], cGoldLight[1], cGoldLight[2]);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // Title of destiny
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text(t(reading.categories.purpose.title), margin, currentY);

  currentY += 4.5;

  // Destiny summary
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  const purposeSummary = doc.splitTextToSize(t(reading.categories.purpose.summary), contentWidth);
  doc.text(purposeSummary, margin, currentY);
  currentY += purposeSummary.length * 4.2 + 2;

  // Destiny deep
  const purposeDeep = doc.splitTextToSize(t(reading.categories.purpose.deepInsight), contentWidth);
  doc.text(purposeDeep, margin, currentY);
  currentY += purposeDeep.length * 4.2 + 4;

  // Destiny Action Steps
  doc.setFillColor(cCream[0], cCream[1], cCream[2]);
  doc.rect(margin, currentY, contentWidth, 24, "F");
  doc.setDrawColor(cGoldLight[0], cGoldLight[1], cGoldLight[2]);
  doc.rect(margin, currentY, contentWidth, 24);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text("KARMIC PATH ALIGNMENT STEPS", margin + 4, currentY + 4.5);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  reading.categories.purpose.actionableTips.slice(0, 3).forEach((tip, tidx) => {
    doc.text(`[${tidx + 1}] ${t(tip)}`, margin + 4, currentY + 10 + tidx * 5);
  });


  // ==========================================
  // PAGE 3: SECTOR ENERGY (CAREER, WEALTH, HEALTH & SYNCHRONICITY)
  // ==========================================
  doc.addPage();
  applyPageTemplate(3);

  currentY = 22;

  // Section 3: Material Success & Career Focus
  doc.setFont("Times", "bolditalic");
  doc.setFontSize(13);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text("3. Wealth, Career & Material Attraction", margin, currentY);

  currentY += 2;
  doc.setDrawColor(cGoldLight[0], cGoldLight[1], cGoldLight[2]);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // Title
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text(t(reading.categories.career.title), margin, currentY);

  currentY += 4.5;

  // Career/Wealth Summary
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  const careerSummary = doc.splitTextToSize(t(reading.categories.career.summary), contentWidth);
  doc.text(careerSummary, margin, currentY);
  currentY += careerSummary.length * 4.2 + 2;

  const careerDeep = doc.splitTextToSize(t(reading.categories.career.deepInsight), contentWidth);
  doc.text(careerDeep, margin, currentY);
  currentY += careerDeep.length * 4.2 + 8;


  // Section 4: Aura, Health & Somatics
  doc.setFont("Times", "bolditalic");
  doc.setFontSize(13);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text("4. Aura Alignment, Vitality & Spiritual Sadhana", margin, currentY);

  currentY += 2;
  doc.setDrawColor(cGoldLight[0], cGoldLight[1], cGoldLight[2]);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // Health summary
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  const healthSummary = doc.splitTextToSize(t(reading.categories.health.summary), contentWidth);
  doc.text(healthSummary, margin, currentY);
  currentY += healthSummary.length * 4.2 + 2;

  // Growth summary (Divine sadhana)
  const growthSummary = doc.splitTextToSize(t(reading.categories.growth.summary), contentWidth);
  doc.text(growthSummary, margin, currentY);
  currentY += growthSummary.length * 4.2 + 8;


  // Section 5: Love & Relationships Matrix
  doc.setFont("Times", "bolditalic");
  doc.setFontSize(13);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text("5. Love, Connection & Relationship Resonance", margin, currentY);

  currentY += 2;
  doc.setDrawColor(cGoldLight[0], cGoldLight[1], cGoldLight[2]);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // Relationships Summary
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  const relationsSummary = doc.splitTextToSize(t(reading.categories.relationships.summary), contentWidth);
  doc.text(relationsSummary, margin, currentY);
  currentY += relationsSummary.length * 4.2 + 10;


  // Closure Seal / Signature-like design at the bottom
  doc.setFont("Times", "italic");
  doc.setFontSize(10.5);
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text("May the celestial forces align in your absolute favor.", pageWidth / 2, currentY, { align: "center" });

  currentY += 5;
  drawMandalaEmblem(pageWidth / 2, currentY + 6, 5);


  // Save the PDF
  const safeName = name.trim().toLowerCase().replace(/\s+/g, "_");
  doc.save(`celestial_blueprint_${safeName || "soul"}.pdf`);
}
