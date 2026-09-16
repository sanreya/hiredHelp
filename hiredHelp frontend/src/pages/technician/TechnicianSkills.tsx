import React, { useEffect, useState } from 'react';
import { skillApi } from '../../api/skillApi';
import { technicianApi } from '../../api/technicianApi';
import { Skill } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { Wrench, Zap, Sparkles, Paintbrush, Hammer, Thermometer, Settings2, Bug, Scissors, Wand2, Heart, HardHat, Star, Plus, Trash2 } from 'lucide-react';

export function TechnicianSkills() {
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [mySkills, setMySkills] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skills = await skillApi.getAll();
        const technicianSkills = await technicianApi.getSkills();

        setAllSkills(skills);

        setMySkills(
          technicianSkills.map(
            technicianSkill => technicianSkill.skill.skillId
          )
        );

      } catch (error) {
        toast('Failed to load skills', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, [toast]);

  const getIcon = (skillName: string) => {
    switch (skillName) {
      case 'PLUMBING': return <Wrench className="h-5 w-5 text-blue-500" />;
      case 'ELECTRICAL': return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'HOUSE_CLEANING': return <Sparkles className="h-5 w-5 text-emerald-500" />;
      case 'PAINTING': return <Paintbrush className="h-5 w-5 text-purple-500" />;
      case 'CARPENTRY': return <Hammer className="h-5 w-5 text-amber-600" />;
      case 'AC_REPAIR': return <Thermometer className="h-5 w-5 text-cyan-500" />;
      case 'APPLIANCE_REPAIR': return <Settings2 className="h-5 w-5 text-orange-500" />;
      case 'PEST_CONTROL': return <Bug className="h-5 w-5 text-red-500" />;
      case 'SALON': return <Scissors className="h-5 w-5 text-pink-500" />;
      case 'MAKEUP': return <Wand2 className="h-5 w-5 text-rose-500" />;
      case 'BEAUTY': return <Heart className="h-5 w-5 text-fuchsia-500" />;
      case 'HANDYMAN': return <HardHat className="h-5 w-5 text-slate-500" />;
      default: return <Star className="h-5 w-5 text-indigo-500" />;
    }
  };

  const handleAddSkill = () => {
    if (selectedSkillId === 0) return;
    if (mySkills.includes(selectedSkillId)) {
      toast('You already have this skill', 'error');
      return;
    }

    setMySkills([...mySkills, selectedSkillId]);
    toast('Skill added successfully', 'success');
    setShowAddModal(false);
    setSelectedSkillId(0);
  };

  const handleRemoveSkill = (skillId: number) => {
    setMySkills(mySkills.filter(id => id !== skillId));
    toast('Skill removed', 'info');
  };

  const mySkillObjects = allSkills.filter(s => mySkills.includes(s.skillId));
  const availableSkills = allSkills.filter(s => !mySkills.includes(s.skillId));

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Skills</h1>
          <p className="text-slate-500 mt-1">Manage the services you offer to customers</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Add Skill
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {mySkillObjects.map(skill => (
          <Card key={skill.skillId} className="border-indigo-100 hover:shadow-md transition-shadow group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    {getIcon(skill.skillName)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{skill.skillName.replace('_', ' ')}</h3>
                    <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">Verified</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSkill(skill.skillId)}
                  className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  title="Remove Skill"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-4 line-clamp-2">{skill.description}</p>
            </CardContent>
          </Card>
        ))}

        {mySkillObjects.length === 0 && (
          <Card className="md:col-span-2 border-dashed bg-slate-50">
            <CardContent className="p-12 text-center">
              <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No skills added yet</h3>
              <p className="text-slate-500 mb-6">Add skills to start receiving service requests.</p>
              <Button onClick={() => setShowAddModal(true)}>Add your first skill</Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setSelectedSkillId(0); }}
        title="Add New Skill"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 mb-4">Select a service category you are qualified to perform.</p>

          {availableSkills.length > 0 ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Skill Category</label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(Number(e.target.value))}
                className="flex h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              >
                <option value={0}>Select a skill...</option>
                {availableSkills.map(s => (
                  <option key={s.skillId} value={s.skillId}>{s.skillName.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-100">
              You have already added all available skills.
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button
              onClick={handleAddSkill}
              disabled={selectedSkillId === 0}
              className="shadow-sm"
            >
              Add Skill
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
