import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to SoapMaker
      </h1>
      <div className="text-center mb-12">
        <p className="text-xl text-gray-600 mb-4">
          Your ultimate companion for soap making calculations and recipe management
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Soap Calculator</h2>
          <p className="text-gray-600 mb-4">
            Calculate the perfect amount of lye and water for your soap recipes
          </p>
          <Link
            to="/calculator"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Calculating
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Recipe Management</h2>
          <p className="text-gray-600 mb-4">
            Save and manage your favorite soap recipes
          </p>
          <Link
            to="/recipes"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            View Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;