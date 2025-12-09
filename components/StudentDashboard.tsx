import React, { useState } from 'react';
import { Course } from '../types';
import { PlayIcon, LockIcon, SparklesIcon, CheckCircleIcon } from './Icons';
import { MouseWatcher } from './MouseWatcher';
import { PARTNER_DESCRIPTIONS, LEARNING_PERSONAS } from '../constants';

interface StudentDashboardProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onEnterBreakout?: (roomName: string) => void;
}

interface CourseCardProps {
  course: Course;
  isElective?: boolean;
  onSelectCourse: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isElective = false, onSelectCourse }) => {
  const isLocked = (course.levelRequired || 0) > 1 && !isElective; // Make electives accessible for browsing
  return (
    <div 
      onClick={() => !isLocked && onSelectCourse(course)}
      className={`group relative bg-white rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full ${
        isLocked 
          ? 'border-silver-200 opacity-70 hover:opacity-100' 
          : isElective
            ? 'border-silver-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10'
            : 'border-silver-200 hover:border-brand hover:shadow-xl hover:shadow-brand/20'
      }`}
    >
      <div className="h-32 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${isElective ? 'bg-purple-500 text-white' : 'bg-brand text-white'}`}>
              {isElective ? 'Elective' : 'Core'}
            </span>
            {course.xp && <span className="text-[10px] text-white/90 font-medium">{course.xp} XP</span>}
          </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-slate-900 mb-1 leading-tight group-hover:text-brand transition-colors">{course.title}</h3>
          <p className="text-xs text-brand font-medium mb-3">{course.partnerName}</p>
          <p className="text-xs text-silver-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
          
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-silver-100">
            <div className="flex items-center gap-2">
                {isLocked ? (
                  <span className="flex items-center gap-1 text-xs text-silver-400 font-medium">
                    <LockIcon className="w-3 h-3" /> Lvl {course.levelRequired} Req
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <PlayIcon className="w-3 h-3" /> Start Now
                  </span>
                )}
            </div>
            <div className="w-6 h-6 rounded-full bg-silver-100 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                <PlayIcon className="w-3 h-3" />
            </div>
          </div>
      </div>
    </div>
  );
};

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ courses, onSelectCourse, onEnterBreakout }) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);

  const selectedPersona = LEARNING_PERSONAS.find(p => p.id === selectedPersonaId);

  // Filter courses
  const coreCourses = selectedPersona 
    ? courses.filter(c => selectedPersona.partners.includes(c.partnerName))
    : [];
    
  const electiveCourses = selectedPersona
    ? courses.filter(c => !selectedPersona.partners.includes(c.partnerName))
    : [];

  if (!selectedPersonaId) {
    return (
      <div className="min-h-screen bg-silver-50 pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
        <MouseWatcher />
        
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>

        <div className="max-w-4xl mx-auto px-4 w-full z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Choose Your Character</h1>
          <p className="text-silver-500 text-lg mb-12 max-w-2xl mx-auto">
            Select the path that best describes your professional goals. Don't worry, you can still access all courses regardless of your choice.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {LEARNING_PERSONAS.map(persona => (
              <button
                key={persona.id}
                onClick={() => setSelectedPersonaId(persona.id)}
                className="group relative bg-white p-8 rounded-3xl border-2 border-silver-100 hover:border-brand transition-all duration-300 hover:shadow-2xl hover:scale-105 text-left flex flex-col items-start"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 block">
                  {persona.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-brand transition-colors">
                  {persona.title}
                </h3>
                <p className="text-silver-500 leading-relaxed mb-6">
                  {persona.description}
                </p>
                <div className="mt-auto">
                   <p className="text-xs font-bold text-silver-400 uppercase tracking-wider mb-2">Powered By</p>
                   <div className="flex flex-wrap gap-2">
                      {persona.partners.map(p => (
                        <span key={p} className="text-xs bg-silver-100 text-slate-600 px-2 py-1 rounded-md border border-silver-200">
                          {p}
                        </span>
                      ))}
                   </div>
                </div>
                
                <div className="absolute top-8 right-8 w-8 h-8 rounded-full border-2 border-silver-200 flex items-center justify-center group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all">
                  <PlayIcon className="w-4 h-4 ml-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-silver-50 pt-24 pb-12">
      <MouseWatcher />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setSelectedPersonaId(null)} className="text-xs text-silver-500 hover:text-brand transition-colors">
                ← Switch Persona
              </button>
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3">
              <span className="text-4xl">{selectedPersona?.icon}</span>
              {selectedPersona?.title} Dashboard
            </h1>
            <p className="text-silver-500 mt-2">Track your progress and expand your skill tree.</p>
          </div>
          
          <div className="flex gap-3">
             <div className="bg-white px-5 py-3 rounded-xl border border-silver-200 shadow-sm flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                 <SparklesIcon className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-xs text-silver-400 uppercase font-bold">Current XP</p>
                 <p className="font-bold text-slate-900">2,500</p>
               </div>
             </div>
             <button 
               onClick={() => onEnterBreakout && onEnterBreakout("General Lounge")}
               className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2"
             >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Enter Breakout Room
             </button>
          </div>
        </div>

        {/* Core Path Section */}
        <div className="mb-12">
           <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-brand rounded-full"></div>
              <h2 className="text-xl font-bold text-slate-800">Your Core Path</h2>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreCourses.length > 0 ? (
                coreCourses.map(course => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    onSelectCourse={onSelectCourse} 
                  />
                ))
              ) : (
                <div className="col-span-full p-8 text-center border-2 border-dashed border-silver-200 rounded-2xl text-silver-400">
                  No core courses currently available for this persona. Check back soon!
                </div>
              )}
           </div>
        </div>

        {/* Electives Section */}
        <div>
           <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-slate-800">Explore Electives</h2>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Cross-Training</span>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {electiveCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  isElective={true} 
                  onSelectCourse={onSelectCourse} 
                />
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};