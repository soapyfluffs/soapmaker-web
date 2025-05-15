import Papa from 'papaparse';

// Utility function to generate unique IDs
const generateUniqueId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

// Flexible field matching utility
const findField = (row, fields) => {
  // Normalize row keys to lowercase for case-insensitive matching
  const normalizedRow = Object.keys(row).reduce((acc, key) => {
    acc[key.toLowerCase().trim()] = row[key];
    return acc;
  }, {});

  // Try to match fields case-insensitively
  for (let field of fields) {
    const lowercaseField = field.toLowerCase().trim();
    if (normalizedRow[lowercaseField] !== undefined) {
      return normalizedRow[lowercaseField];
    }
  }
  
  console.log('No match found for fields:', fields);
  return '';
};

// Material mapping function
const mapMaterialData = (row) => {
  // Comprehensive list of possible field names (case-insensitive)
  const nameFields = ['Name', 'name', 'material', 'item'];
  const typeFields = ['Category', 'category', 'type'];
  const costFields = ['Unit Price', 'unit price', 'cost', 'price'];
  const unitFields = ['Unit', 'unit', 'measure unit'];
  const stockFields = ['Stock Level', 'stock level', 'stock', 'quantity', 'amount'];
  const supplierFields = ['Supplier', 'supplier', 'vendor'];
  const notesFields = ['Notes', 'notes', 'description'];

  // Log the entire row for debugging
  console.log('Processing material row:', row);

  const material = {
    id: generateUniqueId(),
    name: findField(row, nameFields),
    type: findField(row, typeFields) || 'material',
    cost: parseFloat(findField(row, costFields)) || 0,
    unit: findField(row, unitFields) || 'kg',
    stock: parseFloat(findField(row, stockFields)) || 0,
    supplier: findField(row, supplierFields) || '',
    notes: findField(row, notesFields) || '',
    alternativeUnits: ['g', 'oz', 'lb'],
    conversionRates: {
      'g': 1000,
      'oz': 35.274,
      'lb': 2.20462
    }
  };

  console.log('Mapped material:', material);
  return material;
};

// Product mapping function
const mapProductData = (row) => {
  // Comprehensive list of possible field names (case-insensitive)
  const nameFields = ['Name', 'name', 'product', 'title'];
  const descFields = ['Notes', 'notes', 'description', 'details'];
  const weightFields = ['Stock Level', 'stock level', 'weight', 'size'];
  const priceFields = ['Retail Price', 'retail price', 'Unit Price', 'unit price', 'price', 'cost'];
  const skuFields = ['SKU', 'sku', 'code'];
  const statusFields = ['Category', 'category', 'status', 'state'];

  // Log the entire row for debugging
  console.log('Processing product row:', row);

  const product = {
    id: generateUniqueId(),
    name: findField(row, nameFields),
    description: findField(row, descFields),
    weight: parseFloat(findField(row, weightFields)) || 100,
    price: parseFloat(findField(row, priceFields)) || 0,
    cost: parseFloat(findField(row, priceFields)) || 0,
    sku: findField(row, skuFields),
    shopifyId: null,
    recipe: null,
    status: findField(row, statusFields) || 'active'
  };

  console.log('Mapped product:', product);
  return product;
};

// Supply Order mapping function
const mapSupplyOrderData = (row) => {
  // Comprehensive list of possible field names (case-insensitive)
  const materialIdFields = ['Product', 'SKU', 'name', 'material', 'item', 'materialid'];
  const quantityFields = ['Quantity', 'quantity', 'amount', 'volume'];
  const unitFields = ['Unit Type', 'unit', 'measure unit'];
  const supplierFields = ['Supplier', 'supplier', 'vendor'];
  const dateFields = ['Placed Date', 'Expected Date', 'date', 'order date'];
  const costFields = ['Total Price', 'Unit Price', 'cost', 'price'];
  const statusFields = ['Status', 'status', 'state'];
  const orderNumberFields = ['Order Number', 'order number', 'order id'];

  // Log the entire row for debugging
  console.log('Processing supply order row:', row);

  const supplyOrder = {
    id: generateUniqueId(),
    orderNumber: findField(row, orderNumberFields),
    materialId: findField(row, materialIdFields),
    quantity: parseFloat(findField(row, quantityFields)) || 0,
    unit: findField(row, unitFields) || 'unit',
    supplier: findField(row, supplierFields) || '',
    date: findField(row, dateFields) || new Date().toISOString().split('T')[0],
    cost: parseFloat(findField(row, costFields)) || 0,
    status: findField(row, statusFields) || 'pending',
    notes: row['Notes'] || ''
  };

  console.log('Mapped supply order:', supplyOrder);
  return supplyOrder;
};

// Import Materials from CSV
export const importMaterialsFromCSV = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          console.log('Raw materials parse results:', results);
          
          const materials = results.data
            .filter(row => Object.keys(row).length > 0) // Filter out empty rows
            .map(mapMaterialData)
            .filter(material => material.name); // Ensure name exists
          
          console.log('Processed materials:', materials);
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
      skipEmptyLines: true,
      complete: (results) => {
        try {
          console.log('Raw products parse results:', results);
          
          const products = results.data
            .filter(row => Object.keys(row).length > 0) // Filter out empty rows
            .map(mapProductData)
            .filter(product => product.name); // Ensure name exists
          
          console.log('Processed products:', products);
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
      skipEmptyLines: true,
      complete: (results) => {
        try {
          console.log('Raw supply orders parse results:', results);
          
          const supplyOrders = results.data
            .filter(row => Object.keys(row).length > 0) // Filter out empty rows
            .map(mapSupplyOrderData)
            .filter(order => order.materialId); // Ensure materialId exists
          
          console.log('Processed supply orders:', supplyOrders);
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