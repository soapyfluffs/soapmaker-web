import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { units } from '../utils/dataModels';
import { importAllData } from '../utils/csvImport';

function Settings() {
  const { state, dispatch } = useApp();
  const { settings } = state;
  const [importStatus, setImportStatus] = useState('');
  const materialsFileRef = useRef(null);
  const productsFileRef = useRef(null);
  const supplyOrdersFileRef = useRef(null);

  const updateSettings = (key, value) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { [key]: value }
    });
  };

  const handleImportData = async () => {
    try {
      const materialsFile = materialsFileRef.current.files[0];
      const productsFile = productsFileRef.current.files[0];
      const supplyOrdersFile = supplyOrdersFileRef.current.files[0];

      if (!materialsFile || !productsFile || !supplyOrdersFile) {
        setImportStatus('Please select all three files');
        return;
      }

      console.log('Importing files:', {
        materials: materialsFile.name,
        products: productsFile.name,
        supplyOrders: supplyOrdersFile.name
      });

      const importedData = await importAllData(
        materialsFile, 
        productsFile, 
        supplyOrdersFile
      );

      console.log('Imported data:', importedData);

      // Check if any data was actually imported
      const totalImportedItems = 
        (importedData.materials?.length || 0) + 
        (importedData.products?.length || 0) + 
        (importedData.supplyOrders?.length || 0);

      if (totalImportedItems === 0) {
        setImportStatus('No data was imported. Check your CSV files and headers.');
        return;
      }

      dispatch({
        type: 'IMPORT_DATA',
        payload: importedData
      });

      setImportStatus(`Data imported successfully! 
        Materials: ${importedData.materials?.length || 0}, 
        Products: ${importedData.products?.length || 0}, 
        Supply Orders: ${importedData.supplyOrders?.length || 0}`);
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus(`Failed to import data: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Default Units</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight Unit</label>
              <select
                value={settings.defaultWeightUnit}
                onChange={(e) => updateSettings('defaultWeightUnit', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {units.weight.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Cost Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => updateSettings('defaultCurrency', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Labor Cost (per hour)</label>
              <input
                type="number"
                step="0.01"
                value={settings.laborCostPerHour}
                onChange={(e) => updateSettings('laborCostPerHour', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Recipe Defaults</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Super Fat (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.defaultSuperFat}
                onChange={(e) => updateSettings('defaultSuperFat', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Water Ratio (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.defaultWaterRatio}
                onChange={(e) => updateSettings('defaultWaterRatio', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Shopify Integration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Shop Domain</label>
              <input
                type="text"
                value={settings.shopifyDomain || ''}
                onChange={(e) => updateSettings('shopifyDomain', e.target.value)}
                placeholder="your-store.myshopify.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Access Token</label>
              <input
                type="password"
                value={settings.shopifyAccessToken || ''}
                onChange={(e) => updateSettings('shopifyAccessToken', e.target.value)}
                placeholder="shpat_..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <p className="text-sm text-gray-500">
              To integrate with Shopify, you'll need to create a custom app in your Shopify admin and generate an access token.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Import Data</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Materials CSV</label>
            <input 
              type="file" 
              ref={materialsFileRef} 
              accept=".csv"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Products CSV</label>
            <input 
              type="file" 
              ref={productsFileRef} 
              accept=".csv"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Supply Orders CSV</label>
            <input 
              type="file" 
              ref={supplyOrdersFileRef} 
              accept=".csv"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-blue-100"
            />
          </div>
          <button 
            onClick={handleImportData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Import Data
          </button>
          {importStatus && (
            <p className={`mt-2 text-sm ${importStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {importStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;