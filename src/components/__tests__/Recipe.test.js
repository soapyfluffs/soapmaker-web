import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/testUtils';
import Recipes from '../Recipes';
import { mockRecipe } from '../../utils/testUtils';

describe('Recipes Component', () => {
  test('renders recipe list', () => {
    renderWithProviders(<Recipes />);
    expect(screen.getByText('Recipes')).toBeInTheDocument();
  });

  test('can add new recipe', () => {
    renderWithProviders(<Recipes />);
    fireEvent.click(screen.getByText('Add New Recipe'));
    expect(screen.getByText('Add New Recipe')).toBeInTheDocument();
  });

  test('displays recipe details', () => {
    renderWithProviders(<Recipes />);
    const recipe = mockRecipe;
    expect(screen.getByText(recipe.name)).toBeInTheDocument();
    expect(screen.getByText(recipe.description)).toBeInTheDocument();
  });

  test('can edit recipe', () => {
    renderWithProviders(<Recipes />);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Edit Recipe')).toBeInTheDocument();
  });

  test('can delete recipe', () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(jest.fn(() => true));

    renderWithProviders(<Recipes />);
    fireEvent.click(screen.getByText('Delete'));
    
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});