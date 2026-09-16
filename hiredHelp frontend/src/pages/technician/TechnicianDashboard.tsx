import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { technicianApi } from '../../api/technicianApi';
import { TechnicianProfile, PendingRequest, ActiveJob, Review } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Briefcase, CheckCircle, Clock, Star, TrendingUp, AlertTriangle } from 'lucide-react';

export function TechnicianDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, pending, active, reviews] = await Promise.all([
          technicianApi.getProfile(),
          technicianApi.getPendingRequests(),
          technicianApi.getActiveJobs(),
          technicianApi.getReviews(25) // mock ID
        ]);
        setProfile(prof);
        setPendingRequests(pending);
        setActiveJobs(active);
        setRecentReviews(reviews.slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName + " " + user?.lastName}</h1>
          <p className="text-slate-400">Here's what's happening with your business today.</p>
        </div>
        <div className="absolute right-0 top-0 h-full opacity-10 pointer-events-none">
          <TrendingUp className="h-64 w-64 -mt-10 -mr-10 text-indigo-400" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <CheckCircle className="h-6 w-6 text-emerald-500 mb-2" />
            <p className="text-2xl font-bold text-slate-900">{profile.completedJobs}</p>
            <p className="text-xs text-slate-500 font-medium">Completed Jobs</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <Briefcase className="h-6 w-6 text-indigo-500 mb-2" />
            <p className="text-2xl font-bold text-slate-900">{profile.acceptedJobs}</p>
            <p className="text-xs text-slate-500 font-medium">Accepted Jobs</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <Star className="h-6 w-6 text-amber-400 mb-2 fill-amber-400" />
            <p className="text-2xl font-bold text-slate-900">{profile.averageRating}</p>
            <p className="text-xs text-slate-500 font-medium">Average Rating</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
            <AlertTriangle className="h-6 w-6 text-emerald-500 mb-2" />
            <p className="text-2xl font-bold text-slate-900">{profile.slaScore}%</p>
            <p className="text-xs text-slate-500 font-medium">SLA Score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Active Job</h2>
            <Link to="/technician/jobs/active" className="text-sm font-medium text-indigo-600 hover:underline">View all</Link>
          </div>
          {activeJobs.length > 0 ? (
            <Card className="border-indigo-100 shadow-md shadow-indigo-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{activeJobs[0].request.customer.firstName + " " + activeJobs[0].request.customer.lastName}</h3>
                    <p className="text-sm text-slate-500">{activeJobs[0].request.skill.skillName} Service</p>
                  </div>
                  <StatusBadge status={activeJobs[0].status} />
                </div>
                <div className="text-sm text-slate-600 space-y-1 mb-4">
                  <p>{activeJobs[0].request.scheduledDate} at {activeJobs[0].request.scheduledStartTime}</p>
                  <p className="line-clamp-1">{activeJobs[0].request.serviceAddress}</p>
                </div>
                <Link to="/technician/jobs/active" className="block w-full text-center py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                  Manage Job
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-50 border-dashed border-2">
              <CardContent className="p-8 text-center text-slate-500 text-sm">
                No active jobs currently.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pending Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Pending Requests</h2>
            <Link to="/technician/requests" className="text-sm font-medium text-indigo-600 hover:underline">View all</Link>
          </div>
          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingRequests.slice(0, 2).map(req => (
                <Card key={req.assignmentId} className="hover:border-indigo-200 transition-colors">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900">{req.request.skill.skillName}</p>
                      <p className="text-sm text-slate-500">{req.request.scheduledDate} • {req.request.scheduledStartTime}</p>
                    </div>
                    <Link to="/technician/requests" className="text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg font-medium transition-colors text-slate-700">
                      Review
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-50 border-dashed border-2">
              <CardContent className="p-8 text-center text-slate-500 text-sm">
                No pending requests.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
