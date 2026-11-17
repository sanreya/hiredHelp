import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import { useToast } from '../../context/ToastContext';
import { User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { UserCircle, MapPin, Phone, Mail } from 'lucide-react';

export function UserProfile() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    userApi.getMe()
      .then(setProfile)
      .catch(() => toast('Failed to load profile', 'error'))
      .finally(() => setIsLoading(false));
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const updated = await userApi.updateMe(profile);
      setProfile(updated);
      toast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      toast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center space-y-0 pb-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-4">
            <UserCircle className="h-10 w-10" />
          </div>
          <div>
            <CardTitle className="text-xl">{profile.firstName + " " + profile.lastName}</CardTitle>
            <p className="text-sm text-slate-500 flex items-center mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Active Customer
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 border-b pb-2">Personal Details</h3>
              {isEditing ? (
                <>
                  <Input label="Full Name" name="name" value={profile.firstName + " " + profile.lastName} onChange={handleChange} />
                  <Input label="Phone Number" name="phone" value={profile.phone} onChange={handleChange} />
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><UserCircle className="h-4 w-4 mr-2" /> Name</p>
                    <p className="font-medium text-slate-900">{profile.firstName + " " + profile.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><Phone className="h-4 w-4 mr-2" /> Phone</p>
                    <p className="font-medium text-slate-900">{profile.phone}</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 border-b pb-2">Account & Location</h3>
              {isEditing ? (
                <>
                  <Input label="Email (Cannot be changed)" name="email" value={profile.email} disabled className="bg-slate-50 text-slate-500" />
                  <Input label="Address" name="address" value={profile.address} onChange={handleChange} />
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><Mail className="h-4 w-4 mr-2" /> Email</p>
                    <p className="font-medium text-slate-900">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1 flex items-center"><MapPin className="h-4 w-4 mr-2" /> Address</p>
                    <p className="font-medium text-slate-900">{profile.address}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
