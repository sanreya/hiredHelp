import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Home, LogIn, UserPlus } from 'lucide-react';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-indigo-600">
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight text-slate-900">HiredHelp</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center transition-colors">
              <LogIn className="h-4 w-4 mr-1" /> Login
            </Link>
            <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-sm">
              <UserPlus className="h-4 w-4 mr-1" /> Register
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} HiredHelp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
