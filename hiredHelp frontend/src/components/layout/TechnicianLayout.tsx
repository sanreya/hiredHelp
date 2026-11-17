import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserCircle, Settings, Clock, Briefcase, CheckSquare, Star, LogOut, Menu, X, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export function TechnicianLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/technician/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', href: '/technician/profile', icon: UserCircle },
    { name: 'My Skills', href: '/technician/skills', icon: Settings },
    { name: 'Pending Requests', href: '/technician/requests', icon: Clock },
    { name: 'Active Jobs', href: '/technician/jobs/active', icon: Briefcase },
    { name: 'Completed Jobs', href: '/technician/jobs/completed', icon: CheckSquare },
    { name: 'Reviews', href: '/technician/reviews', icon: Star },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900 text-white fixed inset-y-0 z-10 shadow-xl">
        <div className="p-6 flex items-center space-x-2 text-indigo-400 border-b border-slate-800">
          <Home className="h-6 w-6" />
          <span className="font-bold text-xl tracking-tight text-white">HiredHelp Pro</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href) && (item.href !== '/technician/dashboard' || location.pathname === '/technician/dashboard');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-indigo-200" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="mb-4 px-3">
            <p className="text-sm font-medium truncate text-white">{user?.name}</p>
            <p className="text-xs text-slate-400">Technician</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3 text-slate-400" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 md:pl-64 flex flex-col">
        <header className="md:hidden sticky top-0 z-20 bg-slate-900 text-white px-4 h-16 flex items-center justify-between shadow-md">
          <Link to="/technician/dashboard" className="flex items-center space-x-2 text-indigo-400">
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl text-white">HiredHelp Pro</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-10 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <aside className="w-64 bg-slate-900 h-full shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
               <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto mt-16 text-white">
                {navigation.map((item) => {
                  const isActive = location.pathname.startsWith(item.href) && (item.href !== '/technician/dashboard' || location.pathname === '/technician/dashboard');
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg",
                        isActive ? "bg-indigo-600" : "text-slate-300 hover:bg-slate-800"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
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
