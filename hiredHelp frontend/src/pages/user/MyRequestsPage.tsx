import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceRequestApi } from '../../api/serviceRequestApi';
import { ServiceRequest } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Calendar, MapPin, ChevronRight, FileText } from 'lucide-react';

export function MyRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    serviceRequestApi.getMyRequests()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filters = ['ALL', 'OPEN', 'REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  const filteredRequests = filter === 'ALL'
    ? requests
    : requests.filter(r => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">My Requests</h1>
        <div className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar space-x-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map(request => (
            <Link key={request.requestId} to={`/user/requests/${request.requestId}`}>
              <Card className="hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between md:justify-start gap-4">
                        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {request.skill.skillName.replace('_', ' ')} Service
                        </h3>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-1">{request.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {request.scheduledDate}</span>
                        <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {request.serviceAddress.split(',')[0]}</span>
                      </div>
                    </div>
                    <div className="hidden md:flex text-indigo-600 group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-slate-50 mt-8">
          <CardContent className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No requests found</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">You don't have any requests matching this status.</p>
            {filter !== 'ALL' ? (
              <button onClick={() => setFilter('ALL')} className="text-indigo-600 font-medium hover:underline">Clear filters</button>
            ) : (
              <Link to="/user/services" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">
                Request a Service
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
