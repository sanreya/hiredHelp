import React, { useEffect, useState } from 'react';
import { technicianApi } from '../../api/technicianApi';
import { userApi } from '../../api/userApi';
import { useToast } from '../../context/ToastContext';
import { TechnicianProfile as TechProfileType, User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { UserCircle, MapPin, Phone, Mail, Award, CheckCircle } from 'lucide-react';

export function TechnicianProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<TechProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const u = await userApi.getMe();
        const p = await technicianApi.getProfile();
        setUser(u);
        setProfile(p);
        setEditForm({
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone,
          address: u.address
        });
      } catch (error) {
        toast('Failed to load profile', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setEditForm({ ...editForm, [e.target.name]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (user) {
        await userApi.updateMe({ ...user, firstName: editForm.firstName, lastName: editForm.lastName, phone: editForm.phone, address: editForm.address });
        setUser({ ...user, firstName: editForm.firstName, lastName: editForm.lastName, phone: editForm.phone, address: editForm.address });
      }

      setProfile(prev => prev ? { ...prev } : null);

      toast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      toast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user || !profile) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your technician information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center space-y-0 pb-4">
          <img
            src={profile.profilePhoto || `https://ui-avatars.com/api/?name=${user.firstName + user.lastName}`}
            alt={user.firstName + user.lastName}
            className="w-16 h-16 rounded-full border-2 border-indigo-100 mr-4 object-cover shadow-sm"
          />
          <div>
            <CardTitle className="text-xl">{user.firstName + " " + user.lastName}</CardTitle>
            <p className="text-sm text-slate-500 flex items-center mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
              Verified Technician
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 border-b pb-2">Personal Details</h3>
              {isEditing ? (
                <>
                  <Input label="Full Name" name="name" value={editForm.firstName + editForm.lastName} onChange={handleChange} />
                  <Input label="Phone Number" name="phone" value={editForm.phone} onChange={handleChange} />
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><UserCircle className="h-4 w-4 mr-2" /> Name</p>
                    <p className="font-medium text-slate-900">{user.firstName + " " + user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><Phone className="h-4 w-4 mr-2" /> Phone</p>
                    <p className="font-medium text-slate-900">{user.phone}</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 border-b pb-2">Account & Location</h3>
              {isEditing ? (
                <>
                  <Input label="Email" name="email" value={user.email} disabled className="bg-slate-50 text-slate-500" />
                  <Input label="Address" name="address" value={editForm.address} onChange={handleChange} />
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><Mail className="h-4 w-4 mr-2" /> Email</p>
                    <p className="font-medium text-slate-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><MapPin className="h-4 w-4 mr-2" /> Base Address</p>
                    <p className="font-medium text-slate-900">{user.address}</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4 md:col-span-2 mt-4">
              <h3 className="font-semibold text-slate-900 border-b pb-2">Professional Details</h3>
              {!isEditing && (
                <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                  <h4 className="font-medium text-emerald-900 mb-2 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" /> Verification Status
                  </h4>
                  <p className="text-sm text-emerald-700">
                    Your background check is complete and your profile is fully verified and visible to customers.
                  </p>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} isLoading={isSaving} className="shadow-sm">Save Changes</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
