import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { batchStatuses } from '../utils/dataModels';

function Batches() {
  const { state, dispatch } = useApp();
  const { batches, recipes } = state;
  const [editingBatch, setEditingBatch] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const addBatch = () => {
    setIsAddingNew(true);
    setEditingBatch({
      id: Date.now(),
      recipeId: recipes[0]?.id || null,
      batchNumber: `B${new Date().getFullYear()}-${String(batches.length + 1).padStart(3, '0')}`,
      startDate: new Date().toISOString().split('T')[0],
      status: 'planned',
      yield: recipes[0]?.yield || 0,
      actualCost: 0,
      laborHours: 0,
      notes: '',
      qualityChecks: [],
      documents: []
    });
  };

  const editBatch = (batch) => {
    setIsAddingNew(false);
    setEditingBatch({ ...batch });
  };

  const deleteBatch = (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      dispatch({ type: 'DELETE_BATCH', payload: id });
    }
  };

  const saveBatch = (e) => {
    e.preventDefault();
    if (isAddingNew) {
      dispatch({ type: 'ADD_BATCH', payload: editingBatch });
    } else {
      dispatch({ type: 'UPDATE_BATCH', payload: editingBatch });
    }
    setEditingBatch(null);
    setIsAddingNew(false);
  };

  const addQualityCheck = () => {
    setEditingBatch({
      ...editingBatch,
      qualityChecks: [
        ...editingBatch.qualityChecks,
        { name: '', value: '', date: new Date().toISOString().split('T')[0] }
      ]
    });
  };

  const updateQualityCheck = (index, field, value) => {
    const newChecks = [...editingBatch.qualityChecks];
    newChecks[index] = { ...newChecks[index], [field]: value };
    setEditingBatch({ ...editingBatch, qualityChecks: newChecks });
  };

  const removeQualityCheck = (index) => {
    setEditingBatch({
      ...editingBatch,
      qualityChecks: editingBatch.qualityChecks.filter((_, i) => i !== index)
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingBatch({
          ...editingBatch,
          documents: [
            ...editingBatch.documents,
            { name: file.name, content: event.target.result }
          ]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocument = (index) => {
    setEditingBatch({
      ...editingBatch,
      documents: editingBatch.documents.filter((_, i) => i !== index)
    });
  };

  const filteredBatches = filterStatus === 'all'
    ? batches
    : batches.filter(batch => batch.status === filterStatus);

  const BatchList = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Batches</h2>
          <div className="mt-2">
            <label className="mr-2">Filter by status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All</option>
              {batchStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={addBatch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Batch
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBatches.map(batch => {
          const recipe = recipes.find(r => r.id === batch.recipeId);
          return (
            <div key={batch.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold">{batch.batchNumber}</h3>
                  <p className="text-gray-600">{recipe?.name || 'Unknown Recipe'}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => editBatch(batch)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBatch(batch.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>Status: <span className="capitalize">{batch.status}</span></p>
                <p>Start Date: {batch.startDate}</p>
                <p>Yield: {batch.yield} bars</p>
                <p>Cost: ${batch.actualCost}</p>
                <p>Labor: {batch.laborHours} hours</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (editingBatch) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isAddingNew ? 'Add New Batch' : 'Edit Batch'}
        </h2>
        
        <form onSubmit={saveBatch} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Batch Number</label>
              <input
                type="text"
                value={editingBatch.batchNumber}
                onChange={(e) => setEditingBatch({ ...editingBatch, batchNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Recipe</label>
              <select
                value={editingBatch.recipeId || ''}
                onChange={(e) => setEditingBatch({ ...editingBatch, recipeId: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Recipe</option>
                {recipes.map(recipe => (
                  <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={editingBatch.startDate}
                onChange={(e) => setEditingBatch({ ...editingBatch, startDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={editingBatch.status}
                onChange={(e) => setEditingBatch({ ...editingBatch, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {batchStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Yield</label>
              <input
                type="number"
                value={editingBatch.yield}
                onChange={(e) => setEditingBatch({ ...editingBatch, yield: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Actual Cost</label>
              <input
                type="number"
                step="0.01"
                value={editingBatch.actualCost}
                onChange={(e) => setEditingBatch({ ...editingBatch, actualCost: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Labor Hours</label>
              <input
                type="number"
                step="0.5"
                value={editingBatch.laborHours}
                onChange={(e) => setEditingBatch({ ...editingBatch, laborHours: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality Checks</label>
            {editingBatch.qualityChecks.map((check, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                <input
                  type="text"
                  value={check.name}
                  onChange={(e) => updateQualityCheck(index, 'name', e.target.value)}
                  placeholder="Check Name"
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={check.value}
                  onChange={(e) => updateQualityCheck(index, 'value', e.target.value)}
                  placeholder="Result"
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex items-center">
                  <input
                    type="date"
                    value={check.date}
                    onChange={(e) => updateQualityCheck(index, 'date', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeQualityCheck(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addQualityCheck}
              className="mt-2 text-blue-500 hover:text-blue-700"
            >
              + Add Quality Check
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {editingBatch.documents.map((doc, index) => (
              <div key={index} className="flex items-center mt-2">
                <span className="text-sm text-gray-600">{doc.name}</span>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={editingBatch.notes}
              onChange={(e) => setEditingBatch({ ...editingBatch, notes: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setEditingBatch(null);
                setIsAddingNew(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Batch
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <BatchList />;
}

export default Batches;