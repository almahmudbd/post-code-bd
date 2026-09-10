/**
 * Client-side High-Resolution Image Generator for District Post Codes
 * Generates beautiful, shareable PNG cards with crisp Bengali & English typography.
 */

class DistrictImageGenerator {
  /**
   * Generates a high-res image data URL for a district
   * @param {Object} district - The district object
   * @param {Object} options - Customization options
   * @returns {Promise<string>} Data URL (PNG)
   */
  static async generateDistrictCard(district, options = {}) {
    const isDark = options.theme === 'dark';
    const scale = 2; // 2x for Retina sharpness
    const width = 1200;
    
    // Canvas setup
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate layout & height
    const items = district.postOffices || [];
    const cols = items.length > 28 ? 3 : (items.length > 12 ? 2 : 1);
    const rows = Math.ceil(items.length / cols);
    const rowHeight = 44;
    const headerHeight = 220;
    const footerHeight = 70;
    const padding = 40;
    
    const contentHeight = Math.max(300, rows * rowHeight + 40);
    const height = headerHeight + contentHeight + footerHeight;
    
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);
    
    // Background
    const bgColor = isDark ? '#0f172a' : '#f8fafc';
    const cardBg = isDark ? '#1e293b' : '#ffffff';
    const borderColor = isDark ? '#334155' : '#e2e8f0';
    const primaryText = isDark ? '#f8fafc' : '#0f172a';
    const secondaryText = isDark ? '#94a3b8' : '#64748b';
    const brandRed = '#e11d48';
    const brandGreen = '#059669';
    const accentBlue = '#2563eb';
    
    // Outer Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Inner Card Container
    ctx.save();
    ctx.fillStyle = cardBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    this.roundRect(ctx, padding, padding, width - padding * 2, height - padding * 2, 24);
    ctx.fill();
    ctx.restore();
    
    // Card Border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.5;
    this.roundRect(ctx, padding, padding, width - padding * 2, height - padding * 2, 24);
    ctx.stroke();

    // Top Accent Bar (Flat brand green)
    ctx.save();
    ctx.beginPath();
    ctx.rect(padding, padding, width - padding * 2, 6);
    ctx.clip();
    ctx.fillStyle = brandGreen;
    ctx.fillRect(padding, padding, width - padding * 2, 6);
    ctx.restore();

    // Header Content
    const innerX = padding + 36;
    let currentY = padding + 48;
    
    // Badge / Category
    ctx.font = '600 14px "Inter", -apple-system, sans-serif';
    ctx.fillStyle = brandGreen;
    ctx.fillText(`BANGLADESH POSTAL DIRECTORY • ${district.divisionEn.toUpperCase()} DIVISION (${district.divisionBn})`, innerX, currentY);
    
    currentY += 40;
    
    // Title: District Name (English + Bengali)
    ctx.font = '800 36px "Google Sans", "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
    ctx.fillStyle = primaryText;
    ctx.fillText(`${district.districtEn} District`, innerX, currentY);

    // Measure English text width BEFORE switching font to Bengali
    const enWidth = ctx.measureText(`${district.districtEn} District`).width;

    // Bengali District Name beside, offset past the English text
    ctx.font = '600 30px "Noto Sans Bengali", sans-serif';
    ctx.fillStyle = accentBlue;
    ctx.fillText(`(জেলা: ${district.districtBn})`, innerX + enWidth + 24, currentY);
    
    currentY += 32;
    
    // Sub-info: Post office count
    ctx.font = '500 15px "Google Sans", "Noto Sans Bengali", sans-serif';
    ctx.fillStyle = secondaryText;
    ctx.fillText(`Total Post Offices: ${items.length}  |  Source: Bangladesh Post Office (বাংলাদেশ ডাক বিভাগ)`, innerX, currentY);
    
    // Divider line
    currentY += 24;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(innerX, currentY);
    ctx.lineTo(width - innerX, currentY);
    ctx.stroke();

    // Table / Grid Content
    const gridStartY = currentY + 24;
    const colWidth = (width - innerX * 2 - (cols - 1) * 20) / cols;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const colIndex = Math.floor(i / rows);
      const rowIndex = i % rows;
      
      const itemX = innerX + colIndex * (colWidth + 20);
      const itemY = gridStartY + rowIndex * rowHeight;
      
      // Item row background for alternate rows
      if (rowIndex % 2 === 1) {
        ctx.fillStyle = isDark ? '#182234' : '#f8fafc';
        this.roundRect(ctx, itemX - 6, itemY - 6, colWidth + 12, rowHeight - 6, 8);
        ctx.fill();
      }
      
      // Thana & Post Office
      ctx.font = '600 14px "Noto Sans Bengali", sans-serif';
      ctx.fillStyle = primaryText;
      const label = `${item.thanaBn} - ${item.postOfficeBn}`;
      // Truncate if too long for column
      const maxTextWidth = colWidth - 110;
      const truncatedLabel = this.truncateText(ctx, label, maxTextWidth);
      ctx.fillText(truncatedLabel, itemX + 4, itemY + 18);
      
      // Postcode Badge
      const codeBadgeWidth = 90;
      const codeBadgeX = itemX + colWidth - codeBadgeWidth;
      const codeBadgeY = itemY;
      
      ctx.fillStyle = isDark ? '#0284c726' : '#e0f2fe';
      this.roundRect(ctx, codeBadgeX, codeBadgeY, codeBadgeWidth, 26, 6);
      ctx.fill();
      
      ctx.strokeStyle = isDark ? '#38bdf844' : '#bae6fd';
      ctx.lineWidth = 1;
      this.roundRect(ctx, codeBadgeX, codeBadgeY, codeBadgeWidth, 26, 6);
      ctx.stroke();
      
      // Post Code Text (EN + BN) or EDBO Tag
      ctx.font = item.postCodeEn 
        ? '700 13px "JetBrains Mono", "Noto Sans Bengali", monospace'
        : '600 11px "Noto Sans Bengali", sans-serif';
      ctx.fillStyle = item.postCodeEn 
        ? (isDark ? '#38bdf8' : '#0369a1')
        : (isDark ? '#fbbf24' : '#d97706');
      ctx.textAlign = 'center';
      const badgeText = item.postCodeEn ? `${item.postCodeEn} (${item.postCodeBn})` : 'শাখা ডাকঘর';
      ctx.fillText(badgeText, codeBadgeX + codeBadgeWidth / 2, codeBadgeY + 17);
      ctx.textAlign = 'left'; // reset
    }

    // Footer
    const footerY = height - padding - 24;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(innerX, footerY - 18);
    ctx.lineTo(width - innerX, footerY - 18);
    ctx.stroke();

    ctx.font = '500 13px "Inter", sans-serif';
    ctx.fillStyle = secondaryText;
    ctx.fillText(`Generated by BD Post Codes • postcodebd.vercel.app`, innerX, footerY + 6);

    ctx.textAlign = 'right';
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    ctx.fillText(`Updated: ${dateStr}`, width - innerX, footerY + 6);
    ctx.textAlign = 'left';

    return canvas.toDataURL('image/png');
  }

  /**
   * Helper: Truncate text with ellipsis if exceeding maxWidth
   */
  static truncateText(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let truncated = text;
    while (truncated.length > 0 && ctx.measureText(truncated + '...').width > maxWidth) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + '...';
  }

  /**
   * Helper: Draw rounded rectangle path
   */
  static roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Triggers download of generated image
   */
  static downloadImage(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// Export for browser
window.DistrictImageGenerator = DistrictImageGenerator;
