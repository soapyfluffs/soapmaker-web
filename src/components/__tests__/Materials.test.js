import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/testUtils';
import Materials from '../Materials';
import { mockMaterial } from '../../utils/testUtils';

describe('Materials Component', () => {
  test('renders material list', () => {
    renderWithProviders(<Materials />);
    expect(screen.getByText('Materials')).toBeInTheDocument();
  });

  test('can add new material', () => {
    renderWithProviders(<Materials />);
    fireEvent.click(screen.getByText('Add New Material'));
    expect(screen.getByText('Add New Material')).toBeInTheDocument();
  });

  test('displays material details', () => {
    renderWithProviders(<Materials />);
    const material = mockMaterial;
    expect(screen.getByText(material.name)).toBeInTheDocument();
    expect(screen.getByText(`SAP Value: ${material.sapValue}`)).toBeInTheDocument();
  });

  test('can edit material', () => {
    renderWithProviders(<Materials />);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Edit Material')).toBeInTheDocument();
  });

  test('can delete material', () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(jest.fn(() => true));

    renderWithProviders(<Materials />);
    fireEvent.click(screen.getByText('Delete'));
    
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  test('validates material form inputs', () => {
    renderWithProviders(<Materials />);
    fireEvent.click(screen.getByText('Add New Material'));
    
    // Try to save without required fields
    fireEvent.click(screen.getByText('Save Material'));
    expect(screen.getByText('Material Name is required')).toBeInTheDocument();
  });

  test('handles unit conversions', () => {
    renderWithProviders(<Materials />);
    fireEvent.click(screen.getByText('Edit'));
    
    const unitSelect = screen.getByLabelText('Unit');
    fireEvent.change(unitSelect, { target: { value: 'kg' } });
    
    const stockInput = screen.getByLabelText('Stock');
    expect(stockInput.value).toBe('0.1'); // 100g converted to kg
  });

  test('validates SAP value', () => {
    renderWithProviders(<Materials />);
    fireEvent.click(screen.getByText('Add New Material'));
    
    const sapInput = screen.getByLabelText('SAP Value');
    fireEvent.change(sapInput, { target: { value: '-0.1' } });
    
    expect(screen.getByText('SAP Value must be positive')).toBeInTheDocument();
  });

  test('validates cost', () => {
    renderWithProviders(<Materials />);
    fireEvent.click(screen.getByText('Add New Material'));
    
    const costInput = screen.getByLabelText('Cost');
    fireEvent.change(costInput, { target: { value: '-10' } });
    
    expect(screen.getByText('Cost must be positive')).toBeInTheDocument();
  });
});