import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { technicianApi } from '../../api/technicianApi';
import { assignmentApi } from '../../api/assignmentApi';
import { PendingRequest } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Thermometer,
  Settings2,
  Bug,
  Scissors,
  Wand2,
  Heart,
  HardHat,
  Star,
  IndianRupee,
  ExternalLink
} from 'lucide-react';

export function ReviewRequestPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [pendingRequest, setPendingRequest] = useState<PendingRequest | null>(
    (location.state as { request?: PendingRequest })?.request || null
  );
  const [isLoading, setIsLoading] = useState(!pendingRequest);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const predefinedReasons = [
    'Unavailable at requested time',
    'Location is too far away',
    'Required equipment not available',
    'Outside current service scope',
    'Personal emergency/Scheduling conflict'
  ];

  const fetchRequest = async () => {
    if (!id) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const allPending = await technicianApi.getPendingRequests();
      const targetId = parseInt(id, 10);
      const found = allPending.find(
        (r) => r.assignmentId === targetId || r.request?.requestId === targetId
      );
      if (found) {
        setPendingRequest(found);
      } else {
        setErrorMsg('Request not found or it may have already been accepted/rejected.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.userMessage || 'Unable to connect to backend server. Please make sure the server is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!pendingRequest) {
      fetchRequest();
    }
  }, [id]);

  const handleAccept = async () => {
    if (!pendingRequest) return;
    setIsAccepting(true);
    try {
      await assignmentApi.accept(pendingRequest.assignmentId);
      toast('Request accepted successfully! Job is now active.', 'success');
      navigate('/technician/jobs/active');
    } catch (err: any) {
      toast(err.userMessage || 'Failed to accept request. Please try again.', 'error');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!pendingRequest) return;
    if (!rejectReason.trim()) {
      toast('Please select or provide a rejection reason.', 'error');
      return;
    }

    setIsRejecting(true);
    try {
      await assignmentApi.reject(pendingRequest.assignmentId, rejectReason.trim());
      toast('Request rejected.', 'info');
      setShowRejectModal(false);
      navigate('/technician/requests');
    } catch (err: any) {
      toast(err.userMessage || 'Failed to reject request. Please try again.', 'error');
    } finally {
      setIsRejecting(false);
    }
  };

  const getSkillIcon = (skillName?: string) => {
    switch (skillName) {
      case 'PLUMBING': return <Wrench className="h-6 w-6 text-blue-500" />;
      case 'ELECTRICAL': return <Zap className="h-6 w-6 text-yellow-500" />;
      case 'HOUSE_CLEANING': return <Sparkles className="h-6 w-6 text-emerald-500" />;
      case 'PAINTING': return <Paintbrush className="h-6 w-6 text-purple-500" />;
      case 'CARPENTRY': return <Hammer className="h-6 w-6 text-amber-600" />;
      case 'AC_REPAIR': return <Thermometer className="h-6 w-6 text-cyan-500" />;
      case 'APPLIANCE_REPAIR': return <Settings2 className="h-6 w-6 text-orange-500" />;
      case 'PEST_CONTROL': return <Bug className="h-6 w-6 text-red-500" />;
      case 'SALON': return <Scissors className="h-6 w-6 text-pink-500" />;
      case 'MAKEUP': return <Wand2 className="h-6 w-6 text-rose-500" />;
      case 'BEAUTY': return <Heart className="h-6 w-6 text-fuchsia-500" />;
      case 'HANDYMAN': return <HardHat className="h-6 w-6 text-slate-500" />;
      default: return <Star className="h-6 w-6 text-indigo-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (errorMsg || !pendingRequest) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center">
        <Card className="border-red-200 bg-red-50/50 shadow-sm">
          <CardContent className="p-8 space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">
              {errorMsg?.includes('backend') ? 'Connection Error' : 'Request Unavailable'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {errorMsg || 'Could not load the requested job assignment.'}
            </p>
            <div className="pt-4 flex justify-center space-x-3">
              <Button variant="outline" onClick={() => navigate('/technician/requests')}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Requests
              </Button>
              <Button onClick={fetchRequest}>
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const req = pendingRequest.request;
  const customer = req.customer;
  const customerName = `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'Customer';

  // Parse issue photos safely
  const photos: string[] = Array.isArray(req.issuePhotos)? req.issuePhotos : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/technician/requests"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to All Pending Requests
        </Link>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
            Assignment #{pendingRequest.assignmentId}
          </span>
          <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100">
            Request #{req.requestId}
          </span>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
              {getSkillIcon(req.skill?.skillName)}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {(req.skill?.skillName || 'Service').replace('_', ' ')}
                </h1>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Action Required
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-1">
                Requested by <span className="font-semibold text-white">{customerName}</span> on{' '}
                {new Date(pendingRequest.requestedAt || Date.now()).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowRejectModal(true)}
              disabled={isAccepting}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <XCircle className="h-4 w-4 mr-2 text-rose-400" /> Reject
            </Button>
            <Button
              onClick={handleAccept}
              isLoading={isAccepting}
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 font-semibold px-6"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" /> Accept Job
            </Button>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Job & Service Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule & Address */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/75 border-b border-slate-100 py-4">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-indigo-600" /> Appointment Schedule & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Timing</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">{req.scheduledDate}</p>
                    <p className="text-sm text-slate-600 font-medium mt-0.5">
                      {req.scheduledStartTime} {req.scheduledEndTime ? `– ${req.scheduledEndTime}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-2.5 rounded-lg bg-rose-100 text-rose-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Location</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 leading-relaxed">
                      {req.serviceAddress || customer?.address || 'Address not specified'}
                    </p>
                    {req.serviceAddress && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(req.serviceAddress)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-2"
                      >
                        Open in Google Maps <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issue Description */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/75 border-b border-slate-100 py-4">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-indigo-600" /> Customer Problem Description
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {req.description || 'No description provided by the customer.'}
              </div>

              {/* Photos Gallery */}
              {photos.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2 text-indigo-600" /> Attached Issue Photos ({photos.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photos.map((photo, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedPhoto(photo)}
                        className="aspect-video sm:aspect-square rounded-xl bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer group relative shadow-sm"
                      >
                        <img
                          src={photo}
                          alt={`Issue photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                          Click to enlarge
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Info if applicable */}
          {(req.estimatedPriceMin != null || req.estimatedPriceMax != null) && (
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Estimated Price Range</p>
                    <p className="text-lg font-bold text-slate-900">
                      ₹{req.estimatedPriceMin || 0} – ₹{req.estimatedPriceMax || 0}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">Final price will be settled after work completion</span>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Customer Info & Decision Card */}
        <div className="space-y-6">
          {/* Customer Profile Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/75 border-b border-slate-100 py-4">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-indigo-600" /> Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
                <div className="h-12 w-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{customerName}</h3>
                  <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    Verified Customer
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {customer?.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-slate-400" /> Phone
                    </span>
                    <a
                      href={`tel:${customer.phone}`}
                      className="font-medium text-indigo-600 hover:underline flex items-center"
                    >
                      {customer.phone}
                    </a>
                  </div>
                )}

                {customer?.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-slate-400" /> Email
                    </span>
                    <a
                      href={`mailto:${customer.email}`}
                      className="font-medium text-indigo-600 hover:underline truncate max-w-[160px]"
                      title={customer.email}
                    >
                      {customer.email}
                    </a>
                  </div>
                )}

                {customer?.address && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                      Customer City / Area
                    </span>
                    <p className="text-slate-700 font-medium">{customer.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Decision Card */}
          <Card className="border-indigo-100 bg-indigo-50/40 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Ready to take this job?</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Accepting will add this job directly to your active schedule and notify the customer immediately.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <Button
                  onClick={handleAccept}
                  isLoading={isAccepting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 font-semibold py-3"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Accept Request
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowRejectModal(true)}
                  disabled={isAccepting}
                  className="w-full bg-white hover:bg-rose-50 text-rose-600 border-rose-200"
                >
                  <XCircle className="h-4 w-4 mr-2" /> Decline Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Reason Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Decline Service Request"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Please choose or provide a reason for declining this request. The customer will be informed promptly.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quick reasons:</label>
            <div className="flex flex-wrap gap-2">
              {predefinedReasons.map((reason, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRejectReason(reason)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${rejectReason === reason
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Reason or Additional Details:
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., I have an overlapping appointment scheduled at this time..."
              rows={3}
              className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setShowRejectModal(false)}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRejectConfirm}
              isLoading={isRejecting}
            >
              Confirm Decline
            </Button>
          </div>
        </div>
      </Modal>

      {/* Lightbox photo modal */}
      {selectedPhoto && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPhoto(null)}
          title="Issue Photo Preview"
        >
          <div className="p-2">
            <img
              src={selectedPhoto}
              alt="Enlarged issue"
              className="max-h-[70vh] w-full object-contain rounded-lg"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
