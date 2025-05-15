import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Calculator from './components/Calculator';
import Recipes from './components/Recipes';
import Materials from './components/Materials';
import Products from './components/Products';
import Settings from './components/Settings';
import Batches from './components/Batches';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/products" element={<Products />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;