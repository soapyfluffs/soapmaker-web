import React, { useState, useEffect } from 'react';

function Recipes() {
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('soapRecipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [
      {
        id: 1,
        name: 'Basic Olive Oil Soap',
        oils: [
          { name: 'Olive Oil', weight: 1000, sapValue: 0.135 },
          { name: 'Coconut Oil', weight: 250, sapValue: 0.183 }
        ],
        waterRatio: 38,
        superFat: 5,
        instructions: 'Mix oils, add lye solution, blend until trace, pour into mold.'
      }
    ];
  });

  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    localStorage.setItem('soapRecipes', JSON.stringify(recipes));
  }, [recipes]);

  const calculateLye = (oils, superFat) => {
    let totalLye = 0;
    oils.forEach(oil => {
      if (oil.weight && oil.sapValue) {
        totalLye += (parseFloat(oil.weight) * oil.sapValue);
      }
    });
    return (totalLye * (1 - (superFat / 100))).toFixed(2);
  };

  const calculateWater = (oils, waterRatio, superFat) => {
    const lye = calculateLye(oils, superFat);
    return (parseFloat(lye) * (waterRatio / 100)).toFixed(2);
  };

  const addRecipe = () => {
    setIsAddingNew(true);
    setEditingRecipe({
      id: Date.now(),
      name: '',
      oils: [{ name: 'Olive Oil', weight: '', sapValue: 0.135 }],
      waterRatio: 38,
      superFat: 5,
      instructions: ''
    });
  };

  const editRecipe = (recipe) => {
    setIsAddingNew(false);
    setEditingRecipe({ ...recipe });
  };

  const deleteRecipe = (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    }
  };

  const saveRecipe = (e) => {
    e.preventDefault();
    if (isAddingNew) {
      setRecipes([...recipes, editingRecipe]);
    } else {
      setRecipes(recipes.map(recipe => 
        recipe.id === editingRecipe.id ? editingRecipe : recipe
      ));
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
    setEditingRecipe({
      ...editingRecipe,
      oils: [...editingRecipe.oils, { name: 'Olive Oil', weight: '', sapValue: 0.135 }]
    });
  };

  const removeOil = (index) => {
    setEditingRecipe({
      ...editingRecipe,
      oils: editingRecipe.oils.filter((_, i) => i !== index)
    });
  };

  if (editingRecipe) {
    return (
      <div className="max-w-4xl mx-auto">
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
            <h3 className="text-lg font-semibold mb-4">Oils</h3>
            {editingRecipe.oils.map((oil, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  value={oil.name}
                  onChange={(e) => updateOil(index, 'name', e.target.value)}
                  placeholder="Oil Name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={oil.weight}
                  onChange={(e) => updateOil(index, 'weight', e.target.value)}
                  placeholder="Weight (g)"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex items-center">
                  <input
                    type="number"
                    value={oil.sapValue}
                    onChange={(e) => updateOil(index, 'sapValue', e.target.value)}
                    placeholder="SAP Value"
                    step="0.001"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeOil(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addOil}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Super Fat (%)</label>
              <input
                type="number"
                value={editingRecipe.superFat}
                onChange={(e) => setEditingRecipe({ ...editingRecipe, superFat: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Instructions</label>
            <textarea
              value={editingRecipe.instructions}
              onChange={(e) => setEditingRecipe({ ...editingRecipe, instructions: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setEditingRecipe(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
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

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Soap Recipes</h2>
      
      <div className="grid gap-6">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">{recipe.name}</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.name}: {ingredient.weight}g
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <p className="text-gray-600">{recipe.instructions}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recipes;