// Base conversion rates (to grams)
const baseConversions = {
  // Weight
  g: 1,
  kg: 1000,
  oz: 28.34952,  // More precise conversion
  lb: 453.592,   // More precise conversion
  
  // Volume
  ml: 1,
  l: 1000,
  'fl oz': 29.5735,
  gal: 3785.41,
  // Special case for 'each'
  each: 1};

export const convertWeight = (value, fromUnit, toUnit) => {
  // If units are the same, return the value
  if (fromUnit === toUnit) {
    return value;
  }

  // If either unit is 'each', return the value
  if (fromUnit === 'each' || toUnit === 'each') {
    return value;
  }
  
  // Existing conversion logic
  if (fromUnit === toUnit) {
    return value;
  }
  
  // Convert to grams first
  const grams = value * baseConversions[fromUnit];
  
  // Convert from grams to target unit
  return grams / baseConversions[toUnit];
};

export const formatWeight = (value, unit) => {
  const precision = unit === 'g' ? 0 : 2;
  return `${value.toFixed(precision)} ${unit}`;
};

export const parseWeight = (input, defaultUnit = 'g') => {
  // Remove any whitespace
  input = input.trim();
  
  // Try to match number and unit
  const match = input.match(/^(\d+\.?\d*)\s*([a-zA-Z]+)?$/);
  
  if (!match) {
    throw new Error('Invalid weight format');
  }
  
  const value = parseFloat(match[1]);
  const unit = match[2]?.toLowerCase() || defaultUnit;
  
  if (!baseConversions[unit]) {
    throw new Error('Invalid unit');
  }
  
  return { value, unit };
};

export const getCommonUnits = (materialType) => {
  switch (materialType) {
    case 'oil':
    case 'butter':
      return ['each', 'g', 'kg', 'oz', 'lb'];
    case 'fragrance':
    case 'colorant':
      return ['each', 'g', 'oz'];
    case 'additive':
      return ['each', 'g', 'oz', 'ml', 'fl oz'];
    default:
      return ['each', 'g', 'kg'];
  }
};

export const validateConversion = (value, fromUnit, toUnit) => {
  // Check if units are valid
  if (!baseConversions[fromUnit] || !baseConversions[toUnit]) {
    return false;
  }
  
  // Check if value is numeric and positive
  if (typeof value !== 'number' || isNaN(value) || value < 0) {
    return false;
  }
  
  return true;
};

export const roundToSignificantDigits = (number, digits = 3) => {
  if (number === 0) {
    return 0;
  }
  const magnitude = Math.floor(Math.log10(Math.abs(number)));
  const factor = Math.pow(10, digits - magnitude - 1);
  return Math.round(number * factor) / factor;
};