import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  initialMaterials,
  initialProducts,
  initialRecipes,
  initialBatches,
  defaultSettings
} from '../utils/dataModels';
import { importAllData } from '../utils/csvImport';

const AppContext = createContext();

const initialState = {
  materials: [],
  products: [],
  recipes: [],
  batches: [],
  settings: defaultSettings,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        materials: action.payload.materials || state.materials,
        products: action.payload.products || state.products,
        recipes: action.payload.recipes || state.recipes,
        batches: action.payload.batches || state.batches,
        settings: action.payload.settings || state.settings,
      };
    case 'ADD_MATERIAL':
      return {
        ...state,
        materials: [...state.materials, action.payload]
      };
    case 'UPDATE_MATERIAL':
      return {
        ...state,
        materials: state.materials.map(material =>
          material.id === action.payload.id ? action.payload : material
        )
      };
    case 'DELETE_MATERIAL':
      return {
        ...state,
        materials: state.materials.filter(material => material.id !== action.payload)
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    case 'ADD_RECIPE':
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.id === action.payload.id ? action.payload : recipe
        )
      };
    case 'DELETE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload)
      };
    case 'ADD_BATCH':
      return {
        ...state,
        batches: [...state.batches, action.payload]
      };
    case 'UPDATE_BATCH':
      return {
        ...state,
        batches: state.batches.map(batch =>
          batch.id === action.payload.id ? action.payload : batch
        )
      };
    case 'DELETE_BATCH':
      return {
        ...state,
        batches: state.batches.filter(batch => batch.id !== action.payload)
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'IMPORT_DATA':
      return {
        ...state,
        materials: action.payload.materials || state.materials,
        products: action.payload.products || state.products,
        supplyOrders: action.payload.supplyOrders || state.supplyOrders
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem('soapmakerData');
      if (savedData) {
        dispatch({ type: 'LOAD_DATA', payload: JSON.parse(savedData) });
      } else {
        // Load initial data if nothing in localStorage
        dispatch({
          type: 'LOAD_DATA',
          payload: {
            materials: initialMaterials,
            products: initialProducts,
            recipes: initialRecipes,
            batches: initialBatches,
            settings: defaultSettings,
          }
        });
      }
    };
    loadData();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('soapmakerData', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}