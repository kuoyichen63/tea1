import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Frontend from './pages/Frontend';
import Admin from './pages/Admin';
import { seedProducts } from './services/api';

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    seedProducts().finally(() => setIsInitializing(false));
  }, []);

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-orange-50">
        <div className="text-xl font-medium text-orange-800">載入中 / Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <nav className="bg-orange-600 text-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold tracking-wider">
            找好茶 / Tea Shop
          </Link>
          <div className="space-x-4">
            <Link to="/" className="hover:text-amber-200 transition">Frontend</Link>
            <Link to="/admin" className="hover:text-amber-200 transition">Admin Dashboard</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4 py-8">
        <Routes>
          <Route path="/" element={<Frontend />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}
