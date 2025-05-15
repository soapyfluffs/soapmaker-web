import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/testUtils';
import Batches from '../Batches';
import { mockBatch } from '../../utils/testUtils';

describe('Batches Component', () => {
  test('renders batch list', () => {
    renderWithProviders(<Batches />);
    expect(screen.getByText('Batches')).toBeInTheDocument();
  });

  test('can add new batch', () => {
    renderWithProviders(<Batches />);
    fireEvent.click(screen.getByText('Add New Batch'));
    expect(screen.getByText('Add New Batch')).toBeInTheDocument();
  });

  test('displays batch details', () => {
    renderWithProviders(<Batches />);
    const batch = mockBatch;
    expect(screen.getByText(batch.batchNumber)).toBeInTheDocument();
    expect(screen.getByText(batch.recipe.name)).toBeInTheDocument();
  });

  test('can edit batch', () => {
    renderWithProviders(<Batches />);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Edit Batch')).toBeInTheDocument();
  });

  test('can delete batch', () => {
    const confirmSpy = jest.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(jest.fn(() => true));

    renderWithProviders(<Batches />);
    fireEvent.click(screen.getByText('Delete'));
    
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  test('can filter batches by status', () => {
    renderWithProviders(<Batches />);
    const statusFilter = screen.getByLabelText('Filter by status:');
    fireEvent.change(statusFilter, { target: { value: 'completed' } });
    
    expect(screen.getByText(mockBatch.batchNumber)).toBeInTheDocument();
  });

  test('can add quality checks', () => {
    renderWithProviders(<Batches />);
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('+ Add Quality Check'));
    
    const checkInputs = screen.getAllByPlaceholderText('Check Name');
    expect(checkInputs.length).toBe(mockBatch.qualityChecks.length + 1);
  });

  test('can upload documents', () => {
    renderWithProviders(<Batches />);
    fireEvent.click(screen.getByText('Edit'));
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/Documents/);
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });
});