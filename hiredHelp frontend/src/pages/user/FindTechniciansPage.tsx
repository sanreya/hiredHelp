import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { serviceRequestApi } from '../../api/serviceRequestApi';
import { useToast } from '../../context/ToastContext';
import { TechnicianSearchItem, ServiceRequest } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Star, Award, Briefcase, ChevronLeft } from 'lucide-react';

export function FindTechniciansPage() {
  const { id } = useParams<{ id: string }>();
  const [technicians, setTechnicians] = useState<TechnicianSearchItem[]>([]);
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const fetchAll = async () => {
        try {
          const req = await serviceRequestApi.getById(parseInt(id));
          setRequest(req);
          const techs = await serviceRequestApi.getTechnicians(parseInt(req.skill?.skillId.toString()));
          setTechnicians(techs);
        } catch (error) {
          toast('Failed to load data', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAll();
    }
  }, [id, toast]);

  const handleRequestTechnician = async (technicianId: number) => {
    if (!id) return;
    setRequestingId(technicianId);
    try {
      await serviceRequestApi.requestTechnician(parseInt(id), technicianId);
      toast('Request sent successfully. Waiting for technician response.', 'success');
      navigate(`/user/requests/${id}`);
    } catch (error) {
      toast('Failed to request technician. They might be unavailable.', 'error');
    } finally {
      setRequestingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={`/user/requests/${id}`} className="p-2 rounded-full hover:bg-slate-200 transition-colors bg-slate-100">
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Find Technicians</h1>
          <p className="text-slate-500 mt-1">Select a technician below to confirm your request for <span className="font-medium text-slate-700">{request?.skill?.skillName ?? 'this'}</span> service.</p>
        </div>
      </div>

      {technicians.length === 0 ? (
        <Card className="border-dashed border-2 bg-slate-50 mt-8">
          <CardContent className="p-16 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No technicians available</h3>
            <p className="text-slate-500">There are currently no technicians available for this service in your area. Please try again later.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {technicians.map((tech) => (
            <Card key={tech.technician.technicianId} className="hover:shadow-lg transition-shadow border-slate-200 overflow-hidden group">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <img src={tech.technician.profilePhoto || `https://ui-avatars.com/api/?name=${tech.technician.user.firstName + ' ' + tech.technician.user.lastName}`} alt={tech.technician.user.firstName + ' ' + tech.technician.user.lastName} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 truncate">{tech.technician.user.firstName + ' ' + tech.technician.user.lastName}</h3>
                      <div className="flex items-center text-sm text-slate-600 mt-1 space-x-4">
                        <span className="flex items-center">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                          {tech.technician.averageRating} ({tech.technician.totalRatings})
                        </span>
                        <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-semibold">
                          SLA {tech.technician.slaScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                    <div className="flex items-center text-sm">
                      <div className="p-2 bg-indigo-50 rounded-lg mr-3 text-indigo-600">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{tech.technician.completedJobs}</p>
                        <p className="text-xs text-slate-500">Jobs Done</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="p-2 bg-purple-50 rounded-lg mr-3 text-purple-600">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{tech.technician.yearsExperience} Yrs</p>
                        <p className="text-xs text-slate-500">Experience</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <Button
                    className="w-full shadow-sm"
                    onClick={() => handleRequestTechnician(tech.technician.technicianId)}
                    isLoading={requestingId === tech.technician.technicianId}
                    disabled={requestingId !== null && requestingId !== tech.technician.technicianId}
                  >
                    Request & Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
