import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';

export const renderWithProviders = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    ...render(
      <AppProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </AppProvider>
    ),
  };
};

export const mockMaterial = {
  id: 1,
  name: 'Test Oil',
  type: 'oil',
  sapValue: 0.135,
  cost: 10.0,
  unit: 'kg',
  alternativeUnits: ['g', 'oz', 'lb'],
  conversionRates: {
    g: 1000,
    oz: 35.274,
    lb: 2.20462,
  },
  stock: 100,
  supplier: 'Test Supplier',
  notes: 'Test notes',
};

export const mockRecipe = {
  id: 1,
  name: 'Test Recipe',
  description: 'Test description',
  oils: [
    {
      materialId: 1,
      weight: 500,
      material: mockMaterial,
    },
  ],
  waterRatio: 38,
  superFat: 5,
  instructions: 'Test instructions',
  yield: 12,
  totalWeight: 1000,
  laborTime: 45,
  laborCost: 15,
  notes: 'Test notes',
};

export const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test description',
  weight: 100,
  price: 6.99,
  cost: 2.5,
  sku: 'TEST-001',
  shopifyId: null,
  recipe: mockRecipe,
  recipeId: 1,
  status: 'active',
};

export const mockBatch = {
  id: 1,
  batchNumber: 'B2024-001',
  recipe: mockRecipe,
  recipeId: 1,
  startDate: '2024-01-15',
  status: 'completed',
  yield: 12,
  actualCost: 30.25,
  laborHours: 1,
  notes: 'Test notes',
  qualityChecks: [
    {
      id: 1,
      name: 'pH Test',
      value: '8.5',
      date: '2024-01-16',
    },
  ],
  documents: [],
};

export const mockSettings = {
  id: 1,
  defaultWeightUnit: 'g',
  defaultCurrency: 'USD',
  laborCostPerHour: 15,
  defaultSuperFat: 5,
  defaultWaterRatio: 38,
  shopifyDomain: null,
  shopifyAccessToken: null,
};