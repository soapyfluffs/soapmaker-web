import React, { useState } from 'react';

const DEFAULT_OILS = [
  { name: 'Olive Oil', sapValue: 0.135 },
  { name: 'Coconut Oil', sapValue: 0.183 },
  { name: 'Palm Oil', sapValue: 0.142 },
  { name: 'Shea Butter', sapValue: 0.128 },
  { name: 'Castor Oil', sapValue: 0.128 },
];

function Calculator() {
  const [oils, setOils] = useState([
    { name: 'Olive Oil', weight: '', sapValue: 0.135 },
  ]);
  const [waterRatio, setWaterRatio] = useState(38); // Water:Lye ratio
  const [superFat, setSuperFat] = useState(5); // Superfat percentage

  const addOil = () => {
    setOils([...oils, { name: 'Olive Oil', weight: '', sapValue: 0.135 }]);
  };

  const removeOil = (index) => {
    setOils(oils.filter((_, i) => i !== index));
  };

  const updateOil = (index, field, value) => {
    const newOils = [...oils];
    if (field === 'name') {
      const selectedOil = DEFAULT_OILS.find(oil => oil.name === value);
      newOils[index] = {
        ...newOils[index],
        name: value,
        sapValue: selectedOil.sapValue
      };
    } else {
      newOils[index] = { ...newOils[index], [field]: value };
    }
    setOils(newOils);
  };

  const calculateLye = () => {
    let totalLye = 0;
    oils.forEach(oil => {
      if (oil.weight && oil.sapValue) {
        totalLye += (parseFloat(oil.weight) * oil.sapValue);
      }
    });
    
    // Apply superfat reduction
    totalLye = totalLye * (1 - (superFat / 100));
    
    return totalLye.toFixed(2);
  };

  const calculateWater = () => {
    const lye = calculateLye();
    return (lye * (waterRatio / 100)).toFixed(2);
  };

  const totalOilWeight = () => {
    return oils.reduce((sum, oil) => sum + (parseFloat(oil.weight) || 0), 0).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Soap Calculator</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Water:Lye Ratio (%)</label>
            <input
              type="number"
              value={waterRatio}
              onChange={(e) => setWaterRatio(parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Superfat (%)</label>
            <input
              type="number"
              value={superFat}
              onChange={(e) => setSuperFat(parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Oils</h3>
        {oils.map((oil, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <select
                value={oil.name}
                onChange={(e) => updateOil(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {DEFAULT_OILS.map(defaultOil => (
                  <option key={defaultOil.name} value={defaultOil.name}>
                    {defaultOil.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                value={oil.weight}
                onChange={(e) => updateOil(index, 'weight', e.target.value)}
                placeholder="Weight (g)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <button
                onClick={() => removeOil(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addOil}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Oil
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Results</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Oil Weight</p>
            <p className="text-xl font-semibold">{totalOilWeight()}g</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Lye (NaOH) Amount</p>
            <p className="text-xl font-semibold">{calculateLye()}g</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Water Amount</p>
            <p className="text-xl font-semibold">{calculateWater()}g</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;