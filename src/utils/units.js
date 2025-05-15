// Base conversion rates (to grams)
const baseConversions = {
  // Weight
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
  
  // Volume
  ml: 1,
  l: 1000,
  'fl oz': 29.5735,
  gal: 3785.41,
};

export const convertWeight = (value, fromUnit, toUnit) => {
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
      return ['g', 'kg', 'oz', 'lb'];
    case 'fragrance':
    case 'colorant':
      return ['g', 'oz'];
    case 'additive':
      return ['g', 'oz', 'ml', 'fl oz'];
    default:
      return ['g', 'kg'];
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