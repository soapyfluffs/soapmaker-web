import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/testUtils';
import Settings from '../Settings';
import { mockSettings } from '../../utils/testUtils';

describe('Settings Component', () => {
  test('renders settings form', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('displays default settings', () => {
    renderWithProviders(<Settings />);
    const settings = mockSettings;
    
    expect(screen.getByDisplayValue(settings.defaultWeightUnit)).toBeInTheDocument();
    expect(screen.getByDisplayValue(settings.defaultCurrency)).toBeInTheDocument();
    expect(screen.getByDisplayValue(settings.laborCostPerHour.toString())).toBeInTheDocument();
  });

  test('can change weight unit', () => {
    renderWithProviders(<Settings />);
    const unitSelect = screen.getByLabelText('Weight Unit');
    fireEvent.change(unitSelect, { target: { value: 'oz' } });
    
    expect(unitSelect.value).toBe('oz');
  });

  test('can change currency', () => {
    renderWithProviders(<Settings />);
    const currencySelect = screen.getByLabelText('Currency');
    fireEvent.change(currencySelect, { target: { value: 'EUR' } });
    
    expect(currencySelect.value).toBe('EUR');
  });

  test('validates labor cost', () => {
    renderWithProviders(<Settings />);
    const laborCostInput = screen.getByLabelText('Default Labor Cost (per hour)');
    fireEvent.change(laborCostInput, { target: { value: '-15' } });
    
    expect(screen.getByText('Labor cost must be positive')).toBeInTheDocument();
  });

  test('validates recipe defaults', () => {
    renderWithProviders(<Settings />);
    const superFatInput = screen.getByLabelText('Default Super Fat (%)');
    fireEvent.change(superFatInput, { target: { value: '-5' } });
    
    expect(screen.getByText('Super Fat must be between 0 and 100')).toBeInTheDocument();
    
    const waterRatioInput = screen.getByLabelText('Default Water Ratio (%)');
    fireEvent.change(waterRatioInput, { target: { value: '150' } });
    
    expect(screen.getByText('Water Ratio must be between 0 and 100')).toBeInTheDocument();
  });

  test('can save Shopify settings', () => {
    renderWithProviders(<Settings />);
    const domainInput = screen.getByLabelText('Shop Domain');
    fireEvent.change(domainInput, { target: { value: 'test-store.myshopify.com' } });
    
    const tokenInput = screen.getByLabelText('Access Token');
    fireEvent.change(tokenInput, { target: { value: 'shpat_test_token' } });
    
    expect(domainInput.value).toBe('test-store.myshopify.com');
    expect(tokenInput.value).toBe('shpat_test_token');
  });

  test('validates Shopify domain format', () => {
    renderWithProviders(<Settings />);
    const domainInput = screen.getByLabelText('Shop Domain');
    fireEvent.change(domainInput, { target: { value: 'invalid-domain' } });
    
    expect(screen.getByText('Invalid Shopify domain format')).toBeInTheDocument();
  });

  test('validates Shopify access token format', () => {
    renderWithProviders(<Settings />);
    const tokenInput = screen.getByLabelText('Access Token');
    fireEvent.change(tokenInput, { target: { value: 'invalid-token' } });
    
    expect(screen.getByText('Invalid Shopify access token format')).toBeInTheDocument();
  });
});