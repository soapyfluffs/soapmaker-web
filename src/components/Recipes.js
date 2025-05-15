import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { convertWeight, getCommonUnits } from '../utils/units';

function Recipes() {
  const { state, dispatch } = useApp();
  const { recipes, materials } = state;
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const calculateLye = (oils, superFat) => {
    let totalLye = 0;
    oils.forEach(oil => {
      const material = materials.find(m => m.id === oil.materialId);
      if (oil.weight && material?.sapValue) {
        // Convert weight to grams for consistent calculation
        const weightInGrams = convertWeight(parseFloat(oil.weight), oil.unit, 'g');
        totalLye += (weightInGrams * material.sapValue);
      }
    });
    return (totalLye * (1 - (superFat / 100))).toFixed(2);
  };

  const calculateWater = (oils, waterRatio, superFat) => {
    const lye = calculateLye(oils, superFat);
    return (parseFloat(lye) * (waterRatio / 100)).toFixed(2);
  };

  const calculateCost = (recipe) => {
    let materialCost = 0;
    recipe.oils.forEach(oil => {
      const material = materials.find(m => m.id === oil.materialId);
      if (oil.weight && material?.cost) {
        // Convert weight to grams and calculate cost per gram
        const weightInGrams = convertWeight(parseFloat(oil.weight), oil.unit, 'g');
        const costPerGram = material.cost / 1000; // assuming cost is per kg
        materialCost += (weightInGrams * costPerGram);
      }
    });
    
    const laborCost = (recipe.laborTime / 60) * recipe.laborCost;
    return (materialCost + laborCost).toFixed(2);
  };

  const addRecipe = () => {
    setIsAddingNew(true);
    setEditingRecipe({
      id: Date.now(),
      name: '',
      description: '',
      oils: [{ materialId: materials[0]?.id || 1, weight: '' }],
      waterRatio: 38,
      superFat: 5,
      instructions: '',
      yield: 12,
      totalWeight: 1000,
      laborTime: 45,
      laborCost: 15,
      notes: ''
    });
  };

  const editRecipe = (recipe) => {
    setIsAddingNew(false);
    setEditingRecipe({ ...recipe });
  };

  const deleteRecipe = (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      dispatch({ type: 'DELETE_RECIPE', payload: id });
    }
  };

  const saveRecipe = (e) => {
    e.preventDefault();
    if (isAddingNew) {
      dispatch({ type: 'ADD_RECIPE', payload: editingRecipe });
    } else {
      dispatch({ type: 'UPDATE_RECIPE', payload: editingRecipe });
    }
    setEditingRecipe(null);
    setIsAddingNew(false);
  };

  const updateOil = (index, field, value) => {
    const newOils = [...editingRecipe.oils];
    newOils[index] = { ...newOils[index], [field]: value };
    setEditingRecipe({ ...editingRecipe, oils: newOils });
  };

  const addOil = () => {
    const defaultMaterial = materials[0] || { id: 1, type: 'oil' };
    const availableUnits = getCommonUnits(defaultMaterial.type);
    
    setEditingRecipe({
      ...editingRecipe,
      oils: [...editingRecipe.oils, { 
        materialId: defaultMaterial.id, 
        weight: '', 
        unit: availableUnits[0] || 'g' 
      }]
    });
  };

  const removeOil = (index) => {
    setEditingRecipe({
      ...editingRecipe,
      oils: editingRecipe.oils.filter((_, i) => i !== index)
    });
  };

  const RecipeList = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recipes</h2>
        <button
          onClick={addRecipe}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Recipe
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {recipes.map(recipe => (
          <div key={recipe.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{recipe.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => editRecipe(recipe)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRecipe(recipe.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{recipe.description}</p>
            <div className="text-sm text-gray-500">
              <p>Oils: {recipe.oils.length}</p>
              <p>Total Weight: {recipe.totalWeight}g</p>
              <p>Yield: {recipe.yield} bars</p>
              <p>Cost: ${calculateCost(recipe)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (editingRecipe) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isAddingNew ? 'Add New Recipe' : 'Edit Recipe'}
        </h2>
        
        <form onSubmit={saveRecipe} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipe Name</label>
            <input
              type="text"
              value={editingRecipe.name}
              onChange={(e) => setEditingRecipe({ ...editingRecipe, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editingRecipe.description}
              onChange={(e) => setEditingRecipe({ ...editingRecipe, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Oils</h3>
            {editingRecipe.oils.map((oil, index) => {
  const material = materials.find(m => m.id === oil.materialId);
  const availableUnits = getCommonUnits(material?.type || 'oil');
  
  return (
    <div key={index} className="grid grid-cols-3 gap-4 mb-4 items-center">
      <div>
        <select
          value={oil.materialId}
          onChange={(e) => {
            const selectedMaterial = materials.find(m => m.id === parseInt(e.target.value));
            const newUnits = getCommonUnits(selectedMaterial?.type || 'oil');
            updateOil(index, 'materialId', parseInt(e.target.value));
            updateOil(index, 'unit', newUnits[0] || 'g');
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {materials.map(material => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="number"
          value={oil.weight}
          onChange={(e) => updateOil(index, 'weight', e.target.value)}
          placeholder="Weight"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <select
          value={oil.unit}
          onChange={(e) => updateOil(index, 'unit', e.target.value)}
          className="ml-2 mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {availableUnits.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => removeOil(index)}
          className="text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
    </div>
  );
})}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addOil}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Add Oil
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Water Ratio (%)</label>
              <input
                type="number"
                value={editingRecipe.waterRatio}
                onChange={(e) => setEditingRecipe({ ...editingRecipe, waterRatio: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Super Fat (%)</label>
              <input
                type="number"
                value={editingRecipe.superFat}
                onChange={(e) => setEditingRecipe({ ...editingRecipe, superFat: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Instructions</label>
            <textarea
              value={editingRecipe.instructions}
              onChange={(e) => setEditingRecipe({ ...editingRecipe, instructions: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Yield (bars)</label>
              <input
                type="number"
                value={editingRecipe.yield}
                onChange={(e) => setEditingRecipe({ ...editingRecipe, yield: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Weight (g)</label>
              <input
                type="number"
                value={editingRecipe.totalWeight}
                onChange={(e) => setEditingRecipe({ ...editingRecipe, totalWeight: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Labor Time (minutes)</label>
              <input
                type="number"
                value={editingRecipe.laborTime}
                onChange={(e) => setEditingRecipe({ ...editingRecipe, laborTime: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Labor Cost ($/hour)</label>
              <input
                type="number"
                value={editingRecipe.laborCost}
                onChange={(e) => setEditingRecipe({ ...editingRecipe, laborCost: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={editingRecipe.notes}
              onChange={(e) => setEditingRecipe({ ...editingRecipe, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditingRecipe(null)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Recipe
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <RecipeList />;
}

export default Recipes;