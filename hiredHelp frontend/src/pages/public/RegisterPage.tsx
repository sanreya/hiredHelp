import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'technician' ? 'TECHNICIAN' : 'USER';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: initialRole
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.register(formData);
      toast('Registration successful. Please login.', 'success');
      navigate('/login');
    } catch (error) {
      toast('Registration failed', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-lg shadow-xl border-slate-100">
        <CardHeader className="space-y-1 text-center py-8">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Create an account</CardTitle>
          <p className="text-slate-500">Join HiredHelp today</p>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required className="bg-slate-50" />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required className="bg-slate-50" />
            </div>
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required className="bg-slate-50" />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required className="bg-slate-50" />
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} required className="bg-slate-50" />
            
            <div className="space-y-2 pt-2">
              <label className="block text-sm font-medium text-slate-700">I want to join as</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${formData.role === 'USER' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'}`}>
                  <input type="radio" name="role" value="USER" checked={formData.role === 'USER'} onChange={handleChange} className="sr-only" />
                  <span className="font-semibold text-sm">Customer</span>
                </label>
                <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${formData.role === 'TECHNICIAN' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'}`}>
                  <input type="radio" name="role" value="TECHNICIAN" checked={formData.role === 'TECHNICIAN'} onChange={handleChange} className="sr-only" />
                  <span className="font-semibold text-sm">Technician</span>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg mt-6" isLoading={isLoading}>
              Register
            </Button>
          </form>
          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
