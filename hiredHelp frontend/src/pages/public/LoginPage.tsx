import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export function LoginPage() {
  const [email, setEmail] = useState('sanjana@gmail.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      const role = email.includes('tech') ? 'TECHNICIAN' : 'USER';
      if (role === 'TECHNICIAN') {
        navigate('/technician/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-100">
        <CardHeader className="space-y-1 text-center py-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</CardTitle>
          <p className="text-slate-500">Enter your email and password to login</p>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
          <div className="mt-6 p-4 bg-slate-50 rounded-lg text-xs text-slate-500 text-center">
            <p>Hint: Use <span className="font-mono bg-slate-200 px-1 py-0.5 rounded">tech@hiredhelp.com</span> for technician role.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
