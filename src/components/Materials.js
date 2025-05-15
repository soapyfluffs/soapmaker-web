import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { units } from '../utils/dataModels';

function Materials() {
  const { state, dispatch } = useApp();
  const { materials } = state;
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const addMaterial = () => {
    setIsAddingNew(true);
    setEditingMaterial({
      id: Date.now(),
      name: '',
      type: 'oil',
      sapValue: 0,
      cost: 0,
      unit: 'kg',
      alternativeUnits: ['g', 'oz', 'lb'],
      conversionRates: {
        'g': 1000,
        'oz': 35.274,
        'lb': 2.20462
      },
      stock: 0,
      supplier: '',
      notes: ''
    });
  };

  const editMaterial = (material) => {
    setIsAddingNew(false);
    setEditingMaterial({ ...material });
  };

  const deleteMaterial = (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      dispatch({ type: 'DELETE_MATERIAL', payload: id });
    }
  };

  const saveMaterial = (e) => {
    e.preventDefault();
    if (isAddingNew) {
      dispatch({ type: 'ADD_MATERIAL', payload: editingMaterial });
    } else {
      dispatch({ type: 'UPDATE_MATERIAL', payload: editingMaterial });
    }
    setEditingMaterial(null);
    setIsAddingNew(false);
  };

  const MaterialList = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Materials</h2>
        <button
          onClick={addMaterial}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Material
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {materials.map(material => (
          <div key={material.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{material.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => editMaterial(material)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMaterial(material.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <p>Type: {material.type}</p>
              <p>SAP Value: {material.sapValue}</p>
              <p>Cost: ${material.cost}/{material.unit}</p>
              <p>Stock: {material.stock} {material.unit}</p>
              <p>Supplier: {material.supplier}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (editingMaterial) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isAddingNew ? 'Add New Material' : 'Edit Material'}
        </h2>
        
        <form onSubmit={saveMaterial} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Material Name</label>
            <input
              type="text"
              value={editingMaterial.name}
              onChange={(e) => setEditingMaterial({ ...editingMaterial, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={editingMaterial.type}
              onChange={(e) => setEditingMaterial({ ...editingMaterial, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="oil">Oil</option>
              <option value="butter">Butter</option>
              <option value="additive">Additive</option>
              <option value="fragrance">Fragrance</option>
              <option value="colorant">Colorant</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">SAP Value</label>
              <input
                type="number"
                step="0.001"
                value={editingMaterial.sapValue}
                onChange={(e) => setEditingMaterial({ ...editingMaterial, sapValue: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost</label>
              <input
                type="number"
                step="0.01"
                value={editingMaterial.cost}
                onChange={(e) => setEditingMaterial({ ...editingMaterial, cost: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Unit</label>
              <select
                value={editingMaterial.unit}
                onChange={(e) => setEditingMaterial({ ...editingMaterial, unit: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {units.weight.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                value={editingMaterial.stock}
                onChange={(e) => setEditingMaterial({ ...editingMaterial, stock: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier</label>
            <input
              type="text"
              value={editingMaterial.supplier}
              onChange={(e) => setEditingMaterial({ ...editingMaterial, supplier: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={editingMaterial.notes}
              onChange={(e) => setEditingMaterial({ ...editingMaterial, notes: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setEditingMaterial(null);
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
              Save Material
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <MaterialList />;
}

export default Materials;