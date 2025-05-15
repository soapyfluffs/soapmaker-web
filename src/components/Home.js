import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function Home() {
  const { state } = useApp();
  const { recipes, materials, products, batches } = state;

  const stats = {
    recipes: recipes.length,
    materials: materials.length,
    products: products.length,
    activeBatches: batches.filter(b => b.status !== 'completed').length
  };

  const features = [
    {
      title: 'Recipe Management',
      description: 'Create and manage soap recipes with automatic lye and water calculations',
      link: '/recipes',
      count: stats.recipes,
      label: 'Recipes'
    },
    {
      title: 'Materials Inventory',
      description: 'Track your materials, costs, and stock levels',
      link: '/materials',
      count: stats.materials,
      label: 'Materials'
    },
    {
      title: 'Product Catalog',
      description: 'Manage your product line with costs and pricing',
      link: '/products',
      count: stats.products,
      label: 'Products'
    },
    {
      title: 'Batch Production',
      description: 'Track production batches and their status',
      link: '/batches',
      count: stats.activeBatches,
      label: 'Active Batches'
    },
    {
      title: 'Lye Calculator',
      description: 'Calculate precise lye and water amounts for your recipes',
      link: '/calculator',
    },
    {
      title: 'Settings',
      description: 'Configure application settings and integrations',
      link: '/settings',
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to SoapMaker
        </h1>
        <p className="text-xl text-gray-600">
          Your complete soap making management solution
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {feature.description}
            </p>
            {feature.count !== undefined && (
              <div className="text-sm font-medium text-blue-600">
                {feature.count} {feature.label}
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/recipes"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            New Recipe
          </Link>
          <Link
            to="/materials"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Material
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            New Product
          </Link>
          <Link
            to="/batches"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Batch
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;