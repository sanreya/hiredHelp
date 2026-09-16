import React, { useEffect, useState } from 'react';
import { technicianApi } from '../../api/technicianApi';
import { assignmentApi } from '../../api/assignmentApi';
import { ActiveJob } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Calendar, Clock, User as UserIcon, CheckCircle, Navigation, PlayCircle, Briefcase } from 'lucide-react';

export function ActiveJobsPage() {
  const [jobs, setJobs] = useState<ActiveJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<string>('');

  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await technicianApi.getActiveJobs();
      setJobs(data);
    } catch (error) {
      toast('Failed to load active jobs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (jobId: number, action: 'arrive' | 'start') => {
    setActionId(jobId);
    try {
      if (action === 'arrive') {
        await assignmentApi.arrive(jobId);
        toast('Marked as arrived', 'success');
        setJobs(jobs.map(j => j.request.requestId === jobId ? { ...j, status: 'TECHNICIAN_ARRIVED' } : j));
      } else {
        await assignmentApi.start(jobId);
        toast('Job started', 'success');
        setJobs(jobs.map(j => j.request.requestId === jobId ? { ...j, status: 'IN_PROGRESS' } : j));
      }
    } catch (error) {
      toast(`Failed to ${action}`, 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleCompleteClick = (jobId: number) => {
    setSelectedJobId(jobId);
    setFinalPrice('');
    setShowCompleteModal(true);
  };

  const handleCompleteConfirm = async () => {
    if (!selectedJobId) return;
    if (!finalPrice || isNaN(Number(finalPrice))) {
      toast('Please enter a valid amount', 'error');
      return;
    }

    setActionId(selectedJobId);
    try {
      await assignmentApi.complete(selectedJobId, Number(finalPrice));
      toast('Job completed successfully', 'success');
      setJobs(jobs.filter(j => j.request.requestId !== selectedJobId));
      setShowCompleteModal(false);
    } catch (error) {
      toast('Failed to complete job', 'error');
    } finally {
      setActionId(null);
      setSelectedJobId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Active Jobs</h1>
        <p className="text-slate-500 mt-1">Manage your ongoing service requests</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-6">
          {jobs.map(job => (
            <Card key={job.request.requestId} className="border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-indigo-500">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-900">{job.request.customer.firstName + " " + job.request.customer.lastName}</CardTitle>
                <StatusBadge status={job.status} />
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-slate-600">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{job.request.customer.phone}</p>
                        <p className="text-xs">Contact</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{job.request.serviceAddress}</p>
                        <p className="text-xs">Address</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{job.request.scheduledDate}</p>
                        <p className="text-xs">{job.request.scheduledStartTime} - {job.request.scheduledEndTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-2">Service Details</h4>
                      <p className="text-sm font-medium text-indigo-600 mb-1">{job.request.skill.skillName}</p>
                      <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {job.request.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      {job.status === 'ACCEPTED' && (
                        <Button
                          className="w-full flex items-center justify-center bg-indigo-600 shadow-sm"
                          onClick={() => handleAction(job.request.requestId, 'arrive')}
                          isLoading={actionId === job.request.requestId}
                        >
                          <Navigation className="h-4 w-4 mr-2" /> Mark Arrived
                        </Button>
                      )}
                      {job.status === 'TECHNICIAN_ARRIVED' && (
                        <Button
                          className="w-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm"
                          onClick={() => handleAction(job.request.requestId, 'start')}
                          isLoading={actionId === job.request.requestId}
                        >
                          <PlayCircle className="h-4 w-4 mr-2" /> Start Job
                        </Button>
                      )}
                      {job.status === 'IN_PROGRESS' && (
                        <Button
                          className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm"
                          onClick={() => handleCompleteClick(job.request.requestId)}
                          isLoading={actionId === job.request.requestId}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Complete Job
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-slate-50 mt-8">
          <CardContent className="p-16 text-center">
            <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No active jobs</h3>
            <p className="text-slate-500">You don't have any ongoing jobs at the moment.</p>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Job"
      >
        <div className="space-y-4">
          <div className="bg-emerald-50 p-4 rounded-lg flex items-start space-x-3 text-emerald-800 mb-4 border border-emerald-100">
            <CheckCircle className="h-5 w-5 mt-0.5 text-emerald-600" />
            <p className="text-sm font-medium">You are about to mark this job as completed. Please enter the final amount charged.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Final Price (₹)</label>
            <input
              type="number"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
              className="flex h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
              placeholder="e.g. 1500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 mt-6">
            <Button variant="outline" onClick={() => setShowCompleteModal(false)}>Cancel</Button>
            <Button onClick={handleCompleteConfirm} isLoading={actionId !== null} className="bg-emerald-600 hover:bg-emerald-700 text-white">Confirm Completion</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
