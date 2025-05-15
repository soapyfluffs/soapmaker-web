import React, { useState } from 'react';

function Recipes() {
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: 'Basic Olive Oil Soap',
      ingredients: [
        { name: 'Olive Oil', weight: 1000, sapValue: 0.135 },
        { name: 'Coconut Oil', weight: 250, sapValue: 0.183 }
      ],
      instructions: 'Mix oils, add lye solution, blend until trace, pour into mold.'
    }
  ]);

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