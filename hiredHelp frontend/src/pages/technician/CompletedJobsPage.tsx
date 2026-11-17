import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { CheckCircle, Calendar, Star, IndianRupee, MapPin } from 'lucide-react';
import { technicianApi } from '../../api/technicianApi';
import { CompletedJob } from '../../types';

export function CompletedJobsPage() {
  const [jobs, setJobs] = useState<CompletedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await technicianApi.getCompletedJobs();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch completed jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Completed Jobs</h1>
          <p className="text-slate-500 mt-1">Your work history and earnings</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map(job => (
            <Card key={job.request.requestId} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 className="font-bold text-lg text-slate-900">{job.request.skill.skillName} Service</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Done
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 space-y-2">
                      <p className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-slate-400" /> {new Date(job.completedAt).toLocaleDateString()}</p>
                      <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-slate-400" /> {job.request.customer.firstName + " " + job.request.customer.lastName}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end space-y-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                    <div className="text-left md:text-right w-full">
                      <p className="text-sm text-slate-500 mb-1">Earned</p>
                      <p className="text-2xl font-bold text-emerald-600 flex items-center justify-start md:justify-end">
                        <IndianRupee className="h-5 w-5 mr-0.5 text-emerald-600" />{job.request.finalPrice}
                      </p>
                    </div>
                    {job.rating && (
                      <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-full justify-center md:justify-end">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1.5" />
                        <span className="font-medium text-amber-700">{job.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-slate-50 mt-8">
          <CardContent className="p-16 text-center">
            <CheckCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No completed jobs yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Complete your first job to see it listed here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
