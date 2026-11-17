import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Zap, Sparkles, Paintbrush, Hammer, Thermometer, ShieldCheck, Star, ArrowRight } from 'lucide-react';
import { skillApi } from '../../api/skillApi';
import { Skill } from '../../types';

export function LandingPage() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    skillApi.getAll().then(setSkills).catch(console.error);
  }, []);

  const getIcon = (skillName: string) => {
    switch (skillName) {
      case 'PLUMBING': return <Wrench className="h-8 w-8 text-blue-500" />;
      case 'ELECTRICAL': return <Zap className="h-8 w-8 text-yellow-500" />;
      case 'CLEANING': return <Sparkles className="h-8 w-8 text-emerald-500" />;
      case 'PAINTING': return <Paintbrush className="h-8 w-8 text-purple-500" />;
      case 'CARPENTRY': return <Hammer className="h-8 w-8 text-amber-600" />;
      case 'AC_REPAIR': return <Thermometer className="h-8 w-8 text-cyan-500" />;
      default: return <Star className="h-8 w-8 text-indigo-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden py-20 lg:py-32 border-b border-slate-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-white/50" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            Reliable help, <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              right when you need it.
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Find trusted professionals for your home services. Book easily, get the job done right, and enjoy peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-600/20 flex items-center justify-center">
              Find a Technician
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/register?role=technician" className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg border-2 border-indigo-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center">
              Become a Technician
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-lg text-slate-600">Expert help for every corner of your home.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <div key={skill.skillId} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {getIcon(skill.skillName.replace('_', ' '))}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{skill.skillName.replace('_', ' ')}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Your solution is just four steps away.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: '1. Tell us what you need', desc: 'Select a service and describe your issue.' },
              { title: '2. Choose a technician', desc: 'Browse available pros and pick the best fit.' },
              { title: '3. Get the job done', desc: 'The technician arrives and fixes your problem.' },
              { title: '4. Rate your experience', desc: 'Leave a review to help the community.' }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-5xl font-extrabold text-black-50/50 absolute -top-4 -left-4 z-0">{idx + 1}</div>
                <div className="relative z-10 p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title.split('. ')[1]}</h3>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Why trust HiredHelp?</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                We believe in transparency, quality, and community. Every technician on our platform goes through a verification process.
              </p>
              <ul className="space-y-4">
                {[
                  'Verified & Background-checked technicians',
                  'Transparent upfront pricing estimates',
                  'Genuine customer reviews and ratings',
                  'Satisfaction guarantee on all completed jobs'
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-200">
                    <ShieldCheck className="h-6 w-6 text-indigo-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />)}
                </div>
                <span className="font-medium">4.8/5 Average Rating</span>
              </div>
              <p className="text-lg italic text-slate-300 mb-6">
                "The plumber arrived on time, was extremely professional, and fixed our sink in under an hour. The pricing was exactly what was estimated."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xl mr-4">S</div>
                <div>
                  <p className="font-semibold text-white">Sanjana R.</p>
                  <p className="text-sm text-slate-400">Bangalore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
