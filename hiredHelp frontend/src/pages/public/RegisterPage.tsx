import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

type RegistrationErrors = Partial<Record<'firstName' | 'lastName' | 'phone' | 'email' | 'password' | 'address', string>>;

const validateRegistration = (formData: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  address: string;
}): RegistrationErrors => {
  const errors: RegistrationErrors = {};
  const phone = formData.phone.trim();
  const phoneDigits = phone.replace(/\D/g, '');

  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }
  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }
  if (!/^\+?[\d\s().-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = 'Enter a valid phone number with 7 to 15 digits.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (
    formData.password.length < 8 ||
    !/[a-z]/.test(formData.password) ||
    !/[A-Z]/.test(formData.password) ||
    !/\d/.test(formData.password)
  ) {
    errors.password = 'Use at least 8 characters, including uppercase and lowercase letters and a number.';
  }
  if (!formData.address.trim()) {
    errors.address = 'Address is required.';
  }

  return errors;
};

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'technician' ? 'TECHNICIAN' : 'USER';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    userRole: initialRole
  });
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (
      name === 'firstName' ||
      name === 'lastName' ||
      name === 'phone' ||
      name === 'email' ||
      name === 'password' ||
      name === 'address'
    ) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRegistration(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      await authApi.register({
        ...formData,
        email: formData.email.trim(),
        phone: formData.phone.trim()
      });
      toast('Registration successful. Please login.', 'success');
      navigate('/login');
    } catch {
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
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required error={errors.firstName} className="bg-slate-50" />
              <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required error={errors.lastName} className="bg-slate-50" />
            </div>
            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              autoComplete="tel"
              inputMode="tel"
              error={errors.phone}
              className="bg-slate-50"
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              error={errors.email}
              className="bg-slate-50"
            />
            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                error={errors.password}
                className="bg-slate-50"
              />
              <p className="mt-1 text-xs text-slate-500">
                Use at least 8 characters, including uppercase and lowercase letters and a number.
              </p>
            </div>
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} required error={errors.address} className="bg-slate-50" />
            
            <div className="space-y-2 pt-2">
              <label className="block text-sm font-medium text-slate-700">I want to join as</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${formData.userRole === 'USER' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'}`}>
                  <input type="radio" name="userRole" value="USER" checked={formData.userRole === 'USER'} onChange={handleChange} className="sr-only" />
                  <span className="font-semibold text-sm">Customer</span>
                </label>
                <label className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${formData.userRole === 'TECHNICIAN' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'}`}>
                  <input type="radio" name="userRole" value="TECHNICIAN" checked={formData.userRole === 'TECHNICIAN'} onChange={handleChange} className="sr-only" />
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
