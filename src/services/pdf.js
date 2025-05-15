import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

class PDFService {
  constructor() {
    this.doc = new jsPDF();
  }

  generateRecipePDF(recipe) {
    this.doc = new jsPDF();
    
    // Header
    this.doc.setFontSize(20);
    this.doc.text(recipe.name, 20, 20);
    
    // Description
    this.doc.setFontSize(12);
    this.doc.text(recipe.description || '', 20, 30);
    
    // Oils Table
    const oilsTableData = recipe.oils.map(oil => [
      oil.material.name,
      `${oil.weight}g`,
      `${((oil.weight / recipe.totalWeight) * 100).toFixed(1)}%`
    ]);
    
    this.doc.autoTable({
      startY: 40,
      head: [['Oil', 'Weight', 'Percentage']],
      body: oilsTableData,
    });
    
    // Recipe Details
    let y = this.doc.lastAutoTable.finalY + 10;
    this.doc.text(`Water Ratio: ${recipe.waterRatio}%`, 20, y);
    this.doc.text(`Super Fat: ${recipe.superFat}%`, 20, y + 7);
    this.doc.text(`Total Weight: ${recipe.totalWeight}g`, 20, y + 14);
    this.doc.text(`Expected Yield: ${recipe.yield} bars`, 20, y + 21);
    
    // Instructions
    if (recipe.instructions) {
      y += 35;
      this.doc.setFontSize(14);
      this.doc.text('Instructions:', 20, y);
      this.doc.setFontSize(12);
      this.doc.text(this.doc.splitTextToSize(recipe.instructions, 170), 20, y + 10);
    }
    
    // Notes
    if (recipe.notes) {
      y = this.doc.internal.pageSize.height - 40;
      this.doc.setFontSize(14);
      this.doc.text('Notes:', 20, y);
      this.doc.setFontSize(12);
      this.doc.text(this.doc.splitTextToSize(recipe.notes, 170), 20, y + 10);
    }
    
    return this.doc;
  }

  generateBatchPDF(batch) {
    this.doc = new jsPDF();
    
    // Header
    this.doc.setFontSize(20);
    this.doc.text(`Batch: ${batch.batchNumber}`, 20, 20);
    
    // Recipe Info
    this.doc.setFontSize(14);
    this.doc.text(`Recipe: ${batch.recipe.name}`, 20, 35);
    
    // Batch Details
    this.doc.setFontSize(12);
    let y = 50;
    this.doc.text(`Start Date: ${new Date(batch.startDate).toLocaleDateString()}`, 20, y);
    this.doc.text(`Status: ${batch.status}`, 20, y + 7);
    this.doc.text(`Yield: ${batch.yield} bars`, 20, y + 14);
    this.doc.text(`Actual Cost: $${batch.actualCost}`, 20, y + 21);
    this.doc.text(`Labor Hours: ${batch.laborHours}`, 20, y + 28);
    
    // Quality Checks
    if (batch.qualityChecks.length > 0) {
      y += 40;
      this.doc.setFontSize(14);
      this.doc.text('Quality Checks:', 20, y);
      
      const qualityData = batch.qualityChecks.map(check => [
        new Date(check.date).toLocaleDateString(),
        check.name,
        check.value
      ]);
      
      this.doc.autoTable({
        startY: y + 10,
        head: [['Date', 'Check', 'Result']],
        body: qualityData,
      });
    }
    
    // Notes
    if (batch.notes) {
      y = this.doc.internal.pageSize.height - 40;
      this.doc.setFontSize(14);
      this.doc.text('Notes:', 20, y);
      this.doc.setFontSize(12);
      this.doc.text(this.doc.splitTextToSize(batch.notes, 170), 20, y + 10);
    }
    
    return this.doc;
  }

  generateBatchHistoryPDF(batches) {
    this.doc = new jsPDF();
    
    // Header
    this.doc.setFontSize(20);
    this.doc.text('Batch Production History', 20, 20);
    
    // Batch Table
    const tableData = batches.map(batch => [
      batch.batchNumber,
      batch.recipe.name,
      new Date(batch.startDate).toLocaleDateString(),
      batch.status,
      batch.yield,
      `$${batch.actualCost}`,
      batch.laborHours
    ]);
    
    this.doc.autoTable({
      startY: 30,
      head: [['Batch #', 'Recipe', 'Start Date', 'Status', 'Yield', 'Cost', 'Labor (h)']],
      body: tableData,
    });
    
    return this.doc;
  }
}

export default PDFService;