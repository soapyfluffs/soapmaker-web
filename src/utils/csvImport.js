import Papa from 'papaparse';

// Utility function to generate unique IDs
const generateUniqueId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

// Import Materials from CSV
export const importMaterialsFromCSV = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const materials = results.data
          .filter(row => row.name) // Filter out empty rows
          .map(row => ({
            id: generateUniqueId(),
            name: row.name || '',
            type: row.type || 'oil',
            sapValue: parseFloat(row.sapValue) || 0,
            cost: parseFloat(row.cost) || 0,
            unit: row.unit || 'kg',
            stock: parseFloat(row.stock) || 0,
            supplier: row.supplier || '',
            notes: row.notes || '',
            alternativeUnits: row.alternativeUnits 
              ? row.alternativeUnits.split(',') 
              : ['g', 'oz', 'lb'],
            conversionRates: {
              'g': 1000,
              'oz': 35.274,
              'lb': 2.20462
            }
          }));
        resolve(materials);
      },
      error: (error) => reject(error)
    });
  });
};

// Import Products from CSV
export const importProductsFromCSV = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const products = results.data
          .filter(row => row.name) // Filter out empty rows
          .map(row => ({
            id: generateUniqueId(),
            name: row.name || '',
            description: row.description || '',
            weight: parseFloat(row.weight) || 100,
            price: parseFloat(row.price) || 0,
            cost: parseFloat(row.cost) || 0,
            sku: row.sku || '',
            shopifyId: row.shopifyId || null,
            recipe: parseInt(row.recipeId) || null,
            status: row.status || 'active'
          }));
        resolve(products);
      },
      error: (error) => reject(error)
    });
  });
};

// Import Supply Orders from CSV
export const importSupplyOrdersFromCSV = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const supplyOrders = results.data
          .filter(row => row.materialId) // Filter out empty rows
          .map(row => ({
            id: generateUniqueId(),
            materialId: row.materialId,
            quantity: parseFloat(row.quantity) || 0,
            unit: row.unit || 'kg',
            supplier: row.supplier || '',
            date: row.date || new Date().toISOString().split('T')[0],
            cost: parseFloat(row.cost) || 0,
            status: row.status || 'pending'
          }));
        resolve(supplyOrders);
      },
      error: (error) => reject(error)
    });
  });
};

// Comprehensive import function
export const importAllData = async (materialsFile, productsFile, supplyOrdersFile) => {
  try {
    const materials = await importMaterialsFromCSV(materialsFile);
    const products = await importProductsFromCSV(productsFile);
    const supplyOrders = await importSupplyOrdersFromCSV(supplyOrdersFile);

    return {
      materials,
      products,
      supplyOrders
    };
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};