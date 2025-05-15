import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function Products() {
  const { state, dispatch } = useApp();
  const { products, recipes } = state;
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const addProduct = () => {
    setIsAddingNew(true);
    setEditingProduct({
      id: Date.now(),
      name: '',
      description: '',
      weight: 100,
      price: 0,
      cost: 0,
      sku: '',
      shopifyId: null,
      recipe: null,
      status: 'active'
    });
  };

  const editProduct = (product) => {
    setIsAddingNew(false);
    setEditingProduct({ ...product });
  };

  const deleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    }
  };

  const saveProduct = (e) => {
    e.preventDefault();
    if (isAddingNew) {
      dispatch({ type: 'ADD_PRODUCT', payload: editingProduct });
    } else {
      dispatch({ type: 'UPDATE_PRODUCT', payload: editingProduct });
    }
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const ProductList = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={addProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Product
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editProduct(product)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="text-sm text-gray-500">
              <p>Weight: {product.weight}g</p>
              <p>Price: ${product.price}</p>
              <p>Cost: ${product.cost}</p>
              <p>Status: {product.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (editingProduct) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">
          {isAddingNew ? 'Add New Product' : 'Edit Product'}
        </h2>
        
        <form onSubmit={saveProduct} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight (g)</label>
              <input
                type="number"
                value={editingProduct.weight}
                onChange={(e) => setEditingProduct({ ...editingProduct, weight: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                value={editingProduct.sku}
                onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                step="0.01"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost</label>
              <input
                type="number"
                step="0.01"
                value={editingProduct.cost}
                onChange={(e) => setEditingProduct({ ...editingProduct, cost: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Recipe</label>
              <select
                value={editingProduct.recipe || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, recipe: e.target.value ? parseInt(e.target.value) : null })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">No Recipe</option>
                {recipes.map(recipe => (
                  <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={editingProduct.status}
                onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Shopify ID</label>
            <input
              type="text"
              value={editingProduct.shopifyId || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, shopifyId: e.target.value || null })}
              placeholder="Optional"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
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
              Save Product
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <ProductList />;
}

export default Products;