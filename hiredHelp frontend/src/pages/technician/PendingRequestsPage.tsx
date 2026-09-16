import React, { useEffect, useState } from 'react';
import { technicianApi } from '../../api/technicianApi';
import { assignmentApi } from '../../api/assignmentApi';
import { PendingRequest } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Calendar, Clock, User as UserIcon } from 'lucide-react';

export function PendingRequestsPage() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await technicianApi.getPendingRequests();
      setRequests(data);
    } catch (error) {
      toast('Failed to load pending requests', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (assignmentId: number) => {
    setActionId(assignmentId);
    try {
      await assignmentApi.accept(assignmentId);
      toast('Request accepted successfully', 'success');
      setRequests(requests.filter(r => r.assignmentId !== assignmentId));
    } catch (error) {
      toast('Failed to accept request', 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleRejectClick = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedAssignmentId) return;
    if (!rejectReason.trim()) {
      toast('Please provide a reason', 'error');
      return;
    }

    setActionId(selectedAssignmentId);
    try {
      await assignmentApi.reject(selectedAssignmentId, rejectReason);
      toast('Request rejected', 'info');
      setRequests(requests.filter(r => r.assignmentId !== selectedAssignmentId));
      setShowRejectModal(false);
    } catch (error) {
      toast('Failed to reject request', 'error');
    } finally {
      setActionId(null);
      setSelectedAssignmentId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pending Requests</h1>
        <p className="text-slate-500 mt-1">Customers requesting your service</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-6">
          {requests.map(request => (
            <Card key={request.assignmentId} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-3 flex justify-between items-center">
                <span className="font-semibold text-indigo-900">{request.request.skill.skillName} Service</span>
                <span className="text-xs text-indigo-600 font-medium bg-indigo-100 px-2.5 py-1 rounded-md">
                  Requested {new Date(request.requestedAt).toLocaleDateString()}
                </span>
              </div>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <UserIcon className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900">{request.request.customer.firstName + request.request.customer.lastName}</p>
                        <p className="text-sm text-slate-500">{request.request.customer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                      <p className="text-sm text-slate-700">{request.request.serviceAddress}</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                      <p className="text-sm text-slate-700">{request.request.scheduledDate} • {request.request.scheduledStartTime} to {request.request.scheduledEndTime}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-2">Issue Description</h4>
                      <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        {request.request.description}
                      </p>
                    </div>
                    <div className="flex space-x-3 mt-6">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleRejectClick(request.assignmentId)}
                        disabled={actionId === request.assignmentId}
                      >
                        Reject
                      </Button>
                      <Button
                        className="flex-1 shadow-sm"
                        onClick={() => handleAccept(request.assignmentId)}
                        isLoading={actionId === request.assignmentId}
                      >
                        Accept Job
                      </Button>
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
            <Clock className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">You're all caught up!</h3>
            <p className="text-slate-500">There are no pending requests at the moment.</p>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Request"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-2">Please provide a reason for rejecting this request.</p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow"
            placeholder="e.g., I am unavailable during the requested time."
          />
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 mt-4">
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleRejectConfirm} isLoading={actionId !== null}>Reject Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
