import React, { useState } from 'react';

function Calculator() {
  const [oils, setOils] = useState([
    { name: '', weight: '', sapValue: '' }
  ]);
  const [results, setResults] = useState(null);

  const addOil = () => {
    setOils([...oils, { name: '', weight: '', sapValue: '' }]);
  };

  const updateOil = (index, field, value) => {
    const newOils = [...oils];
    newOils[index][field] = value;
    setOils(newOils);
  };

  const calculateLye = () => {
    let totalLye = 0;
    oils.forEach(oil => {
      if (oil.weight && oil.sapValue) {
        totalLye += (parseFloat(oil.weight) * parseFloat(oil.sapValue));
      }
    });

    setResults({
      lye: totalLye.toFixed(2),
      water: (totalLye * 2.5).toFixed(2) // Using a 2.5:1 water:lye ratio
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Soap Calculator</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {oils.map((oil, index) => (
          <div key={index} className="mb-4 grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Oil name"
              className="border rounded p-2"
              value={oil.name}
              onChange={(e) => updateOil(index, 'name', e.target.value)}
            />
            <input
              type="number"
              placeholder="Weight (g)"
              className="border rounded p-2"
              value={oil.weight}
              onChange={(e) => updateOil(index, 'weight', e.target.value)}
            />
            <input
              type="number"
              placeholder="SAP value"
              className="border rounded p-2"
              value={oil.sapValue}
              onChange={(e) => updateOil(index, 'sapValue', e.target.value)}
            />
          </div>
        ))}
        
        <button
          onClick={addOil}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          Add Oil
        </button>
        
        <button
          onClick={calculateLye}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Calculate
        </button>

        {results && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Results:</h3>
            <p>Lye (NaOH) needed: {results.lye}g</p>
            <p>Water needed: {results.water}g</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;