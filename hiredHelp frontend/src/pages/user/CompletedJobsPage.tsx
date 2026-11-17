import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { CheckCircle, Calendar, Star, IndianRupee, User as UserIcon, Pencil }
  from 'lucide-react';
import { CompletedJobUser } from '../../types';
import { userApi } from '../../api/userApi';

export function CompletedJobsPage() {
  const [jobs, setJobs] = useState<CompletedJobUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await userApi.getCompletedJobs();
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
          <h1 className="text-3xl font-bold text-slate-900">
            Completed Jobs
          </h1>
          <p className="text-slate-500 mt-1">
            Your past service history
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton
              key={i}
              className="h-32 w-full rounded-xl"
            />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map(job => {
            const request =
              job.serviceRequestAssignment.request;

            const technician =
              job.serviceRequestAssignment.technician;

            const review = job.review;

            return (
              <Card key={request.requestId} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                    {/* LEFT */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="font-bold text-lg text-slate-900">
                          {request.skill.skillName} Service
                        </h3>

                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Done
                        </span>
                      </div>

                      <div className="text-sm text-slate-600 space-y-2">
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                          {new Date(
                            job.serviceRequestAssignment.completedAt
                          ).toLocaleDateString()}
                        </p>

                        <p className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-2 text-slate-400" />
                          {technician.user.firstName}{' '}
                          {technician.user.lastName}
                        </p>
                      </div>

                      {/* EXISTING REVIEW */}
                      {review && (
                        <div className="mt-4 bg-slate-50 border border-slate-100 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= review.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300'
                                    }`}
                                />
                              ))}
                            </div>

                            <span className="text-sm font-medium text-slate-700">
                              {review.rating}/5
                            </span>
                          </div>

                          <p className="text-sm text-slate-600">
                            {review.review}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-start md:items-end space-y-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">

                      <div className="text-left md:text-right w-full">
                        <p className="text-sm text-slate-500 mb-1">
                          Final Price
                        </p>

                        <p className="text-2xl font-bold text-slate-900 flex items-center justify-start md:justify-end">
                          <IndianRupee className="h-5 w-5 mr-0.5 text-slate-500" />
                          {request.finalPrice}
                        </p>
                      </div>

                      {/* REVIEW BUTTON */}
                      {review ? (
                        <Link
                          to={`/user/requests/${request.requestId}/review`}
                          className="text-indigo-600 font-medium text-sm hover:bg-indigo-100 transition-colors flex items-center justify-center w-full bg-indigo-50 px-4 py-2 rounded-lg"
                        >
                          <Pencil className="h-4 w-4 mr-1.5" />
                          Edit Review
                        </Link>
                      ) : (
                        <Link
                          to={`/user/requests/${request.requestId}/review`}
                          className="text-indigo-600 font-medium text-sm hover:bg-indigo-100 transition-colors flex items-center justify-center w-full bg-indigo-50 px-4 py-2 rounded-lg"
                        >
                          <Star className="h-4 w-4 mr-1.5" />
                          Rate Technician
                        </Link>
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed border-2 bg-slate-50 mt-8">
          <CardContent className="p-16 text-center">
            <CheckCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />

            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No completed jobs yet
            </h3>

            <p className="text-slate-500 max-w-sm mx-auto">
              Once your service requests are completed, they will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}