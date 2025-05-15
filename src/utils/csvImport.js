import Papa from 'papaparse';

// Utility function to generate unique IDs
const generateUniqueId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

// Flexible mapping function
const mapMaterialData = (row) => {
  // Flexible header matching
  const nameFields = ['name', 'material', 'item'];
  const typeFields = ['type', 'category'];
  const sapFields = ['sapValue', 'sap', 'sapvalue'];
  const costFields = ['cost', 'price'];
  const unitFields = ['unit', 'measureUnit'];
  const stockFields = ['stock', 'quantity', 'amount'];
  const supplierFields = ['supplier', 'vendor'];
  const notesFields = ['notes', 'description'];

  // Find first matching field
  const findField = (fields) => {
    for (let field of fields) {
      if (row[field] !== undefined) return row[field];
    }
    return '';
  };

  return {
    id: generateUniqueId(),
    name: findField(nameFields),
    type: findField(typeFields) || 'oil',
    sapValue: parseFloat(findField(sapFields)) || 0,
    cost: parseFloat(findField(costFields)) || 0,
    unit: findField(unitFields) || 'kg',
    stock: parseFloat(findField(stockFields)) || 0,
    supplier: findField(supplierFields) || '',
    notes: findField(notesFields) || '',
    alternativeUnits: ['g', 'oz', 'lb'],
    conversionRates: {
      'g': 1000,
      'oz': 35.274,
      'lb': 2.20462
    }
  };
};

// Flexible mapping for products
const mapProductData = (row) => {
  // Flexible header matching
  const nameFields = ['name', 'product', 'title'];
  const descFields = ['description', 'desc', 'details'];
  const weightFields = ['weight', 'size'];
  const priceFields = ['price', 'cost'];
  const skuFields = ['sku', 'code'];
  const statusFields = ['status', 'state'];

  // Find first matching field
  const findField = (fields) => {
    for (let field of fields) {
      if (row[field] !== undefined) return row[field];
    }
    return '';
  };

  return {
    id: generateUniqueId(),
    name: findField(nameFields),
    description: findField(descFields),
    weight: parseFloat(findField(weightFields)) || 100,
    price: parseFloat(findField(priceFields)) || 0,
    cost: parseFloat(findField(priceFields)) || 0,
    sku: findField(skuFields),
    shopifyId: null,
    recipe: null,
    status: findField(statusFields) || 'active'
  };
};

// Flexible mapping for supply orders
const mapSupplyOrderData = (row) => {
  // Flexible header matching
  const materialIdFields = ['materialId', 'material', 'itemId'];
  const quantityFields = ['quantity', 'amount', 'volume'];
  const unitFields = ['unit', 'measureUnit'];
  const supplierFields = ['supplier', 'vendor'];
  const dateFields = ['date', 'orderDate'];
  const costFields = ['cost', 'price'];
  const statusFields = ['status', 'state'];

  // Find first matching field
  const findField = (fields) => {
    for (let field of fields) {
      if (row[field] !== undefined) return row[field];
    }
    return '';
  };

  return {
    id: generateUniqueId(),
    materialId: findField(materialIdFields),
    quantity: parseFloat(findField(quantityFields)) || 0,
    unit: findField(unitFields) || 'kg',
    supplier: findField(supplierFields) || '',
    date: findField(dateFields) || new Date().toISOString().split('T')[0],
    cost: parseFloat(findField(costFields)) || 0,
    status: findField(statusFields) || 'pending'
  };
};

// Import Materials from CSV
export const importMaterialsFromCSV = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const materials = results.data
            .filter(row => Object.keys(row).length > 0) // Filter out empty rows
            .map(mapMaterialData)
            .filter(material => material.name); // Ensure name exists
          
          resolve(materials);
        } catch (error) {
          console.error('Materials import error:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('CSV Parsing Error:', error);
        reject(error);
      }
    });
  });
};

// Import Products from CSV
export const importProductsFromCSV = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const products = results.data
            .filter(row => Object.keys(row).length > 0) // Filter out empty rows
            .map(mapProductData)
            .filter(product => product.name); // Ensure name exists
          
          resolve(products);
        } catch (error) {
          console.error('Products import error:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('CSV Parsing Error:', error);
        reject(error);
      }
    });
  });
};

// Import Supply Orders from CSV
export const importSupplyOrdersFromCSV = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const supplyOrders = results.data
            .filter(row => Object.keys(row).length > 0) // Filter out empty rows
            .map(mapSupplyOrderData)
            .filter(order => order.materialId); // Ensure materialId exists
          
          resolve(supplyOrders);
        } catch (error) {
          console.error('Supply Orders import error:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('CSV Parsing Error:', error);
        reject(error);
      }
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
    console.error('Comprehensive import error:', error);
    throw error;
  }
};