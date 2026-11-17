import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { serviceRequestApi } from '../../api/serviceRequestApi';
import { useToast } from '../../context/ToastContext';
import { ServiceRequest } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { MapPin, Calendar, Clock, Image as ImageIcon, ShieldAlert, FileText, IndianRupee } from 'lucide-react';

export function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      serviceRequestApi.getById(parseInt(id))
        .then(setRequest)
        .catch(() => {
          toast('Failed to load request details', 'error');
          navigate('/user/requests');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, navigate, toast]);

  const handleCancel = async () => {
    if (!id) return;
    setIsCancelling(true);
    try {
      await serviceRequestApi.cancel(parseInt(id));
      toast('Request cancelled successfully', 'success');
      setRequest(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
      setShowCancelModal(false);
    } catch (error) {
      toast('Failed to cancel request', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!request) return null;

  const canCancel = ['OPEN', 'REQUESTED', 'ACCEPTED', 'DELAYED', 'REOPENED'].includes(request.status);
  const canFindTechnicians = ['OPEN', 'REQUESTED', 'REOPENED'].includes(request.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center">
            {request.skill.skillName.replace('_', ' ')} Service
          </h1>
          <p className="text-slate-500 mt-1">Request ID: #{request.requestId}</p>
        </div>
        <StatusBadge status={request.status} className="text-sm px-3 py-1 text-center shadow-sm" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                Issue Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{request.description}</p>

              {(() => {
                const photos: string[] = Array.isArray(request.issuePhotos) ? request.issuePhotos : [];
                return photos.length > 0 ? (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
                      <ImageIcon className="h-4 w-4 mr-1 text-slate-400" /> Attached Photos
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {photos.map((photo, idx) => (
                        <div key={idx} className="aspect-square rounded-lg bg-slate-100 border border-slate-200 overflow-hidden group">
                          <img
                            src={photo}
                            alt={`Issue ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-start">
                <div className="bg-slate-100 p-2 rounded-lg mr-4">
                  <MapPin className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">Address</p>
                  <p className="text-slate-600">{request.serviceAddress}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-slate-100 p-2 rounded-lg mr-4">
                  <Clock className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">Scheduled Time</p>
                  <p className="text-slate-600">
                    {request.scheduledDate} • {request.scheduledStartTime} to {request.scheduledEndTime}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center">
                <IndianRupee className="h-5 w-5 mr-2 text-emerald-500" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {request.finalPrice ? (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Final Amount</p>
                  <p className="text-3xl font-bold text-slate-900 text-emerald-600">₹{request.finalPrice}</p>
                </div>
              ) : request.estimatedPriceMin && request.estimatedPriceMax ? (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Estimated Range</p>
                  <p className="text-xl font-semibold text-slate-900">₹{request.estimatedPriceMin} - ₹{request.estimatedPriceMax}</p>
                </div>
              ) : (
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                  <IndianRupee className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Pricing will be estimated once a technician is assigned.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            {canFindTechnicians && (
              <Link to={`/user/requests/${request.requestId}/technicians`} className="block w-full">
                <Button className="w-full text-base h-12 shadow-sm shadow-indigo-600/20">
                  Find Technicians
                </Button>
              </Link>
            )}

            {canCancel && (
              <Button
                variant="danger"
                className="w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100 shadow-none"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Request
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Request"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-full w-20 h-20 mx-auto mb-4 border-4 border-red-100">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <p className="text-center text-slate-600 text-lg px-4">
            Are you sure you want to cancel this service request?
          </p>
          <p className="text-center text-sm text-slate-500 mb-6">
            This action cannot be undone and you will need to create a new request.
          </p>
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowCancelModal(false)} className="w-full">No, Keep it</Button>
            <Button variant="danger" onClick={handleCancel} isLoading={isCancelling} className="w-full">Yes, Cancel it</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
