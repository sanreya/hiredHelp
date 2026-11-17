import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { serviceRequestApi } from '../../api/serviceRequestApi';
import { ServiceRequest } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { ArrowRight, PlusCircle } from 'lucide-react';

export function UserDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    serviceRequestApi.getMyRequests()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const activeRequests = requests.filter(r => !['COMPLETED', 'CANCELLED'].includes(r.status));
  const recentCompleted = requests.filter(r => r.status === 'COMPLETED').slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-600/20">
        <h1 className="text-3xl font-bold mb-2">Good morning, {user?.firstName + " " + user?.lastName}</h1>
        <p className="text-indigo-100 text-lg mb-6">What do you need help with today?</p>
        <Link to="/user/services" className="inline-flex items-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
          <PlusCircle className="mr-2 h-5 w-5" />
          Request a Service
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Active Requests</h2>
            <Link to="/user/requests" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
          ) : activeRequests.length > 0 ? (
            <div className="space-y-4">
              {activeRequests.map(request => (
                <Link key={request.requestId} to={`/user/requests/${request.requestId}`}>
                  <Card className="hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{request.skill.skillName.replace('_', ' ')} Service</h3>
                          <p className="text-sm text-slate-500">{request.scheduledDate} at {request.scheduledStartTime}</p>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-1">{request.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 bg-slate-50">
              <CardContent className="p-12 text-center">
                <p className="text-slate-500 mb-4">No active requests.</p>
                <Link to="/user/services" className="text-indigo-600 font-medium hover:underline">Find a service to get started</Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Completed */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Recently Completed</h2>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : recentCompleted.length > 0 ? (
            <div className="space-y-4">
              {recentCompleted.map(request => (
                <Card key={request.requestId} className="bg-slate-50 border-transparent">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-slate-900">{request.skill.skillName.replace('_', ' ')}</h3>
                    <p className="text-sm text-slate-500 mb-2">{request.scheduledDate}</p>
                    <StatusBadge status={request.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-50 border-transparent">
              <CardContent className="p-8 text-center text-slate-500 text-sm">
                No completed jobs yet.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
