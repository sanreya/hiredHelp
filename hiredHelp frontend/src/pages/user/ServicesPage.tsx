import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Zap, Sparkles, Paintbrush, Hammer, Thermometer, Settings2, Bug, Scissors, Wand2, Heart, HardHat, Star } from 'lucide-react';
import { skillApi } from '../../api/skillApi';
import { Skill } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';

export function ServicesPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    skillApi.getAll()
      .then(setSkills)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const getIcon = (skillName: string) => {
    switch (skillName) {
      case 'PLUMBING':        return <Wrench      className="h-8 w-8 text-blue-500" />;
      case 'ELECTRICAL':      return <Zap         className="h-8 w-8 text-yellow-500" />;
      case 'HOUSE_CLEANING':  return <Sparkles    className="h-8 w-8 text-emerald-500" />;
      case 'PAINTING':        return <Paintbrush  className="h-8 w-8 text-purple-500" />;
      case 'CARPENTRY':       return <Hammer      className="h-8 w-8 text-amber-600" />;
      case 'AC_REPAIR':       return <Thermometer className="h-8 w-8 text-cyan-500" />;
      case 'APPLIANCE_REPAIR':return <Settings2   className="h-8 w-8 text-orange-500" />;
      case 'PEST_CONTROL':    return <Bug         className="h-8 w-8 text-red-500" />;
      case 'SALON':           return <Scissors    className="h-8 w-8 text-pink-500" />;
      case 'MAKEUP':          return <Wand2       className="h-8 w-8 text-rose-500" />;
      case 'BEAUTY':          return <Heart       className="h-8 w-8 text-fuchsia-500" />;
      case 'HANDYMAN':        return <HardHat     className="h-8 w-8 text-slate-500" />;
      default:                return <Star        className="h-8 w-8 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Find a Service</h1>
        <p className="text-slate-500 mt-2">Select a category to book a professional.</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <Link key={skill.skillId} to={`/user/service-request/new?skillId=${skill.skillId}`}>
              <Card className="h-full hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer group overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                    {getIcon(skill.skillName)}
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {skill.skillName.replace('_', ' ')}
                  </h3>
                  <p className="text-sm text-slate-500">{skill.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
