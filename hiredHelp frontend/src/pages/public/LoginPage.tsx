import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'USER' | 'TECHNICIAN'>('USER');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password }, selectedRole);
      if (selectedRole === 'TECHNICIAN') {
        navigate('/technician/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-100">
        <CardHeader className="space-y-1 text-center py-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</CardTitle>
          <p className="text-slate-500">Sign in to your {selectedRole === 'USER' ? 'user' : 'technician'} account</p>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset className="space-y-2">
              <legend className="block text-sm font-medium text-slate-700">Continue as</legend>
              <div className="grid grid-cols-2 rounded-full bg-slate-100 p-1">
                {(['USER', 'TECHNICIAN'] as const).map((role) => (
                  <label
                    key={role}
                    className={`cursor-pointer rounded-full px-4 py-2 text-center text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 ${
                      selectedRole === role
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value={role}
                      checked={selectedRole === role}
                      onChange={() => setSelectedRole(role)}
                      className="sr-only"
                    />
                    {role === 'USER' ? 'User' : 'Technician'}
                  </label>
                ))}
              </div>
            </fieldset>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-50"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-50"
            />
            <Button type="submit" className="w-full h-12 text-lg" isLoading={isLoading}>
              Login
            </Button>
          </form>
          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">Don't have an account? </span>
            <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
