import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/testUtils';
import Calculator from '../Calculator';
import { mockMaterial } from '../../utils/testUtils';

describe('Calculator Component', () => {
  test('renders calculator form', () => {
    renderWithProviders(<Calculator />);
    expect(screen.getByText('Lye Calculator')).toBeInTheDocument();
  });

  test('can add oils', () => {
    renderWithProviders(<Calculator />);
    fireEvent.click(screen.getByText('Add Oil'));
    const oilInputs = screen.getAllByPlaceholderText('Weight (g)');
    expect(oilInputs.length).toBe(2);
  });

  test('calculates lye amount', () => {
    renderWithProviders(<Calculator />);
    const weightInput = screen.getByPlaceholderText('Weight (g)');
    fireEvent.change(weightInput, { target: { value: '1000' } });
    
    const superFatInput = screen.getByLabelText('Super Fat (%)');
    fireEvent.change(superFatInput, { target: { value: '5' } });
    
    fireEvent.click(screen.getByText('Calculate'));
    
    expect(screen.getByText(/Lye \(NaOH\):/)).toBeInTheDocument();
  });

  test('calculates water amount', () => {
    renderWithProviders(<Calculator />);
    const weightInput = screen.getByPlaceholderText('Weight (g)');
    fireEvent.change(weightInput, { target: { value: '1000' } });
    
    const waterRatioInput = screen.getByLabelText('Water Ratio (%)');
    fireEvent.change(waterRatioInput, { target: { value: '38' } });
    
    fireEvent.click(screen.getByText('Calculate'));
    
    expect(screen.getByText(/Water:/)).toBeInTheDocument();
  });

  test('validates inputs', () => {
    renderWithProviders(<Calculator />);
    const weightInput = screen.getByPlaceholderText('Weight (g)');
    fireEvent.change(weightInput, { target: { value: '-100' } });
    
    fireEvent.click(screen.getByText('Calculate'));
    
    expect(screen.getByText('Weight must be positive')).toBeInTheDocument();
  });

  test('can remove oils', () => {
    renderWithProviders(<Calculator />);
    fireEvent.click(screen.getByText('Add Oil'));
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
    
    const oilInputs = screen.getAllByPlaceholderText('Weight (g)');
    expect(oilInputs.length).toBe(1);
  });
});