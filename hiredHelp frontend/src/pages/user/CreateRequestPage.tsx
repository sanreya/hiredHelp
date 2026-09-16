import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { serviceRequestApi } from '../../api/serviceRequestApi';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Camera, MapPin, Wrench } from 'lucide-react';

export function CreateRequestPage() {
  const [searchParams] = useSearchParams();
  const initialSkillId = searchParams.get('skillId') || '1';

  const [formData, setFormData] = useState({
    customer: { userId: parseInt(localStorage.getItem('userId')!) },
    skill: { skillId: parseInt(initialSkillId) },
    isuedPhotos: '',
    description: '',
    serviceAddress: '',
    scheduledDate: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    latitude: '',
    longitude: '',
    status: "REQUESTED",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await serviceRequestApi.create(formData);
      toast('Request created! Now pick a technician to confirm it.', 'success');
      navigate(`/user/requests/${response.requestId}/technicians`);
    } catch (error) {
      toast('Failed to create request', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Request a Service</h1>
        <p className="text-slate-500 mt-2">Fill in the details below, then choose a technician to confirm your request.</p>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center border-b pb-2 border-slate-100">
                <Wrench className="h-5 w-5 mr-2 text-indigo-500" />
                Service Details
              </h2>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Category</label>
                <select
                  name="skillId"
                  value={formData.skill.skillId}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                >
                  <option value={1}>Plumbing</option>
                  <option value={2}>Electrical</option>
                  <option value={3}>Cleaning</option>
                  <option value={4}>Painting</option>
                  <option value={5}>Carpentry</option>
                  <option value={6}>AC Repair</option>
                  <option value={7}>Appliance Repair</option>
                  <option value={8}>Beauty</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Describe the issue</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="E.g., The kitchen sink is leaking continuously from the pipe underneath..."
                  className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-shadow"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Photos (Optional)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-indigo-300 transition-colors cursor-pointer bg-slate-50/50">
                  <Camera className="h-8 w-8 mb-2 text-slate-400" />
                  <p className="text-sm font-medium">Click to upload photos</p>
                  <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center border-b pb-2 border-slate-100">
                <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                Location & Schedule
              </h2>

              <Input
                label="Service Address"
                name="serviceAddress"
                value={formData.serviceAddress}
                onChange={handleChange}
                required
                placeholder="Full address with landmark"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Date"
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Start Time"
                  type="time"
                  name="scheduledStartTime"
                  value={formData.scheduledStartTime}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="End Time"
                  type="time"
                  name="scheduledEndTime"
                  value={formData.scheduledEndTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" className="w-full text-lg h-12 shadow-md shadow-indigo-600/20" isLoading={isLoading}>
                Continue to Find Technicians →
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
