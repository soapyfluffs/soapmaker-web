import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/testUtils';
import Products from '../Products';
import { mockProduct } from '../../utils/testUtils';

describe('Products Component', () => {
  test('renders product list', () => {
    renderWithProviders(<Products />);
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  test('can add new product', () => {
    renderWithProviders(<Products />);
    fireEvent.click(screen.getByText('Add New Product'));
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
  });

  test('displays product details', () => {
    renderWithProviders(<Products />);
    const product = mockProduct;
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(`SKU: ${product.sku}`)).toBeInTheDocument();
  });

  test('can edit product', () => {
    renderWithProviders(<Products />);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Edit Product')).toBeInTheDocument();
  });

  test('can delete product', () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(jest.fn(() => true));

    renderWithProviders(<Products />);
    fireEvent.click(screen.getByText('Delete'));
    
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  test('validates product form inputs', () => {
    renderWithProviders(<Products />);
    fireEvent.click(screen.getByText('Add New Product'));
    
    // Try to save without required fields
    fireEvent.click(screen.getByText('Save Product'));
    expect(screen.getByText('Product Name is required')).toBeInTheDocument();
  });

  test('validates SKU uniqueness', () => {
    renderWithProviders(<Products />);
    fireEvent.click(screen.getByText('Add New Product'));
    
    const skuInput = screen.getByLabelText('SKU');
    fireEvent.change(skuInput, { target: { value: mockProduct.sku } });
    
    expect(screen.getByText('SKU must be unique')).toBeInTheDocument();
  });

  test('validates price and cost', () => {
    renderWithProviders(<Products />);
    fireEvent.click(screen.getByText('Add New Product'));
    
    const priceInput = screen.getByLabelText('Price');
    fireEvent.change(priceInput, { target: { value: '-10' } });
    
    expect(screen.getByText('Price must be positive')).toBeInTheDocument();
    
    const costInput = screen.getByLabelText('Cost');
    fireEvent.change(costInput, { target: { value: '-5' } });
    
    expect(screen.getByText('Cost must be positive')).toBeInTheDocument();
  });

  test('can link to recipe', () => {
    renderWithProviders(<Products />);
    fireEvent.click(screen.getByText('Edit'));
    
    const recipeSelect = screen.getByLabelText('Recipe');
    fireEvent.change(recipeSelect, { target: { value: mockProduct.recipeId } });
    
    expect(recipeSelect.value).toBe(mockProduct.recipeId.toString());
  });

  test('can change status', () => {
    renderWithProviders(<Products />);
    fireEvent.click(screen.getByText('Edit'));
    
    const statusSelect = screen.getByLabelText('Status');
    fireEvent.change(statusSelect, { target: { value: 'inactive' } });
    
    expect(statusSelect.value).toBe('inactive');
  });
});