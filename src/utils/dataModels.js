// Data models and initial state
export const initialMaterials = [
  { 
    id: 1,
    name: 'Olive Oil',
    type: 'oil',
    sapValue: 0.135,
    cost: 10.00,
    unit: 'kg',
    alternativeUnits: ['g', 'oz', 'lb'],
    conversionRates: {
      'g': 1000,
      'oz': 35.274,
      'lb': 2.20462
    },
    stock: 100,
    supplier: 'Bulk Supplier Inc.',
    notes: 'Extra virgin olive oil'
  }
];

export const initialProducts = [
  {
    id: 1,
    name: 'Lavender Soap Bar',
    description: 'Gentle lavender soap with olive oil base',
    weight: 100, // in grams
    price: 6.99,
    cost: 2.50,
    sku: 'LAV-100',
    shopifyId: null,
    recipe: 1, // references recipeId
    status: 'active'
  }
];

export const initialRecipes = [
  {
    id: 1,
    name: 'Basic Olive Oil Soap',
    description: 'A gentle, moisturizing soap',
    oils: [
      { materialId: 1, weight: 1000 }
    ],
    waterRatio: 38,
    superFat: 5,
    instructions: 'Mix oils, add lye solution, blend until trace, pour into mold.',
    yield: 12, // number of bars
    totalWeight: 1200, // in grams
    laborTime: 45, // in minutes
    laborCost: 15, // per hour
    notes: 'Good for sensitive skin'
  }
];

export const initialBatches = [
  {
    id: 1,
    recipeId: 1,
    batchNumber: 'B2024-001',
    startDate: '2024-01-15',
    status: 'completed',
    yield: 12,
    actualCost: 30.25,
    laborHours: 1,
    notes: 'Batch came out perfect',
    qualityChecks: [
      { name: 'pH Test', value: '8.5', date: '2024-01-16' }
    ],
    documents: [] // for PDF attachments
  }
];

export const batchStatuses = [
  'planned',
  'in-progress',
  'curing',
  'completed',
  'quality-check',
  'packaged',
  'shipped'
];

export const units = {
  weight: ['g', 'kg', 'oz', 'lb'],
  volume: ['ml', 'l', 'fl oz', 'gal'],
  temperature: ['°C', '°F']
};

export const defaultSettings = {
  defaultWeightUnit: 'g',
  defaultCurrency: 'USD',
  laborCostPerHour: 15,
  defaultSuperFat: 5,
  defaultWaterRatio: 38
};