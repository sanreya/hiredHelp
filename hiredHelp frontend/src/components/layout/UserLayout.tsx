import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wrench, FileText, CheckCircle, UserCircle, LogOut, Menu, X, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export function UserLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
    { name: 'Find a Service', href: '/user/services', icon: Wrench },
    { name: 'My Requests', href: '/user/requests', icon: FileText },
    { name: 'Completed Jobs', href: '/user/completed', icon: CheckCircle },
    { name: 'Profile', href: '/user/profile', icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white fixed inset-y-0 z-10">
        <div className="p-6 flex items-center space-x-2 text-indigo-600 border-b border-slate-100">
          <Home className="h-6 w-6" />
          <span className="font-bold text-xl tracking-tight text-slate-900">HiredHelp</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href) && (item.href !== '/user/dashboard' || location.pathname === '/user/dashboard');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-indigo-600" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3 text-slate-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile menu logic */}
      <div className="flex-1 md:pl-64 flex flex-col">
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between">
          <Link to="/user/dashboard" className="flex items-center space-x-2 text-indigo-600">
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl text-slate-900">HiredHelp</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-500">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-10 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <aside className="w-64 bg-white h-full shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
               <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto mt-16">
                {navigation.map((item) => {
                  const isActive = location.pathname.startsWith(item.href) && (item.href !== '/user/dashboard' || location.pathname === '/user/dashboard');
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg",
                        isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-indigo-600" : "text-slate-400")} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
