export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle special cases (arrays, objects, null, undefined)
        if (value === null || value === undefined) {
          return '';
        }
        if (typeof value === 'object') {
          return JSON.stringify(value).replace(/"/g, '""');
        }
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToJSON = (data, filename) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const formatBatchForExport = (batch) => ({
  batchNumber: batch.batchNumber,
  recipeName: batch.recipe.name,
  startDate: new Date(batch.startDate).toLocaleDateString(),
  status: batch.status,
  yield: batch.yield,
  actualCost: batch.actualCost,
  laborHours: batch.laborHours,
  qualityChecks: batch.qualityChecks.map(check => 
    `${check.name}: ${check.value} (${new Date(check.date).toLocaleDateString()})`
  ).join('; '),
  notes: batch.notes || ''
});

export const formatRecipeForExport = (recipe) => ({
  name: recipe.name,
  description: recipe.description || '',
  oils: recipe.oils.map(oil => 
    `${oil.material.name}: ${oil.weight}g`
  ).join('; '),
  waterRatio: recipe.waterRatio,
  superFat: recipe.superFat,
  yield: recipe.yield,
  totalWeight: recipe.totalWeight,
  laborTime: recipe.laborTime,
  laborCost: recipe.laborCost,
  instructions: recipe.instructions || '',
  notes: recipe.notes || ''
});