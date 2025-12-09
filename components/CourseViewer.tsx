
import React, { useState, useMemo } from 'react';
import { Course, Lesson } from '../types';
import { PlayIcon, LockIcon, CheckCircleIcon, ChevronDownIcon, SparklesIcon } from './Icons';
import { getAITutorResponse } from '../services/geminiService';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({ course, onBack }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>(course.modules[0]?.id || '');
  const [activeLesson, setActiveLesson] = useState<Lesson>(course.modules[0]?.lessons[0] || {} as Lesson);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  
  // AI Helper State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Flatten lessons for easy navigation
  const allLessons = useMemo(() => {
    return course.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })));
  }, [course]);

  const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
  const prevLesson = allLessons[currentIndex - 1];
  const nextLesson = allLessons[currentIndex + 1];

  const handleLessonChange = (lesson: Lesson, moduleId?: string) => {
    if (lesson.isLocked) return;
    setActiveLesson(lesson);
    // If the lesson belongs to a different module, expand that module
    if (moduleId && moduleId !== activeModuleId) {
      setActiveModuleId(moduleId);
    } else {
        // Fallback search if moduleId not explicitly passed
        const parentModule = course.modules.find(m => m.lessons.some(l => l.id === lesson.id));
        if (parentModule && parentModule.id !== activeModuleId) {
            setActiveModuleId(parentModule.id);
        }
    }
  };

  const handleNext = () => {
    if (nextLesson && !nextLesson.isLocked) {
      handleLessonChange(nextLesson);
    }
  };

  const handlePrev = () => {
    if (prevLesson) {
      handleLessonChange(prevLesson);
    }
  };

  const handleVideoEnded = () => {
    if (autoplayEnabled && nextLesson && !nextLesson.isLocked) {
      handleNext();
    }
  };

  const handleAskAI = async () => {
    if (!aiQuery.trim()) return;
    setIsAiThinking(true);
    setAiResponse('');
    
    const context = `Lesson: ${activeLesson.title}. Module: ${course.modules.find(m => m.id === activeModuleId)?.title}. Course: ${course.title}`;
    const response = await getAITutorResponse(aiQuery, context);
    
    setAiResponse(response);
    setIsAiThinking(false);
  };

  const renderVideoPlayer = () => {
    if (!activeLesson.videoUrl) {
      return (
        <>
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 group cursor-pointer">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform">
              <PlayIcon className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
            <h1 className="text-2xl font-bold text-white font-serif">{activeLesson.title}</h1>
            <p className="text-silver-300 text-sm mt-1">{activeLesson.duration} • {activeLesson.type?.toUpperCase()}</p>
          </div>
        </>
      );
    }

    // Check if URL is suitable for iframe (synthesia, youtube, vimeo)
    const isEmbeddable = activeLesson.videoUrl.includes('synthesia.io') || 
                        activeLesson.videoUrl.includes('youtube.com') || 
                        activeLesson.videoUrl.includes('youtu.be') || 
                        activeLesson.videoUrl.includes('vimeo.com');

    if (isEmbeddable) {
       return (
         <iframe 
           src={activeLesson.videoUrl} 
           title={activeLesson.title}
           className="w-full h-full border-0"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
           allowFullScreen
         ></iframe>
       );
    }

    // Default HTML5 video with onEnded handler
    return (
      <video 
        src={activeLesson.videoUrl} 
        controls 
        className="w-full h-full object-cover" 
        onEnded={handleVideoEnded}
      />
    );
  };

  return (
    <div className="min-h-screen bg-silver-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb / Partner Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
               ← Back to Dashboard
            </button>
            <span className="text-slate-300">|</span>
            <div>
              <p className="text-xs font-bold text-silver-400 uppercase tracking-widest">Presented By</p>
              <h2 className="text-xl font-serif font-bold text-slate-800">{course.partnerName}</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area (Video/Lesson) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-black rounded-xl overflow-hidden aspect-video relative shadow-2xl group">
               {/* Autoplay Toggle Overlay (visible on hover or always) */}
               <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-white font-medium">Autoplay Next</span>
                  <button 
                    onClick={() => setAutoplayEnabled(!autoplayEnabled)}
                    className={`w-8 h-4 rounded-full relative transition-colors ${autoplayEnabled ? 'bg-brand' : 'bg-slate-600'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${autoplayEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </button>
               </div>
               {renderVideoPlayer()}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button 
                onClick={handlePrev}
                disabled={!prevLesson}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronDownIcon className="w-4 h-4 rotate-90" /> Previous
              </button>
              
              <button 
                onClick={handleNext}
                disabled={!nextLesson || nextLesson.isLocked}
                className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
              >
                Next Lesson <ChevronDownIcon className="w-4 h-4 -rotate-90" />
              </button>
            </div>

            {/* AI Lesson Companion */}
            <div className="bg-white rounded-xl shadow-sm border border-silver-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-lg text-slate-800">AI Learning Companion</h2>
              </div>
              <p className="text-silver-600 text-sm mb-4">
                Confused by a concept in this lesson? Ask for a simple explanation.
              </p>
              
              <div className="flex gap-2">
                 <input 
                  type="text" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder={`Ask about "${activeLesson.title?.split(':')[0]}..."`}
                  className="flex-1 border border-silver-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                 />
                 <button 
                  onClick={handleAskAI}
                  disabled={isAiThinking || !aiQuery}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                 >
                   {isAiThinking ? 'Thinking...' : 'Explain'}
                 </button>
              </div>

              {aiResponse && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100 text-sm text-slate-700 leading-relaxed animate-fade-in">
                  <span className="font-semibold block mb-1 text-purple-800">Answer:</span>
                  {aiResponse}
                </div>
              )}
            </div>

            {/* Lesson Details & Transcript */}
            <div className="prose max-w-none text-silver-600">
               <h3 className="text-xl font-bold text-silver-800">Lesson Notes</h3>
               {activeLesson.transcript ? (
                 <p className="whitespace-pre-wrap">{activeLesson.transcript}</p>
               ) : (
                 <p>Select a lesson to view details.</p>
               )}
            </div>
          </div>

          {/* Sidebar Curriculum */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl shadow-lg border border-silver-200 overflow-hidden sticky top-24">
              <div className="p-4 bg-slate-900 text-white border-b border-slate-800">
                <h3 className="font-serif font-bold text-lg">Course Content</h3>
                <p className="text-xs text-slate-400 mt-1">{course.title}</p>
              </div>

              <div className="overflow-y-auto max-h-[600px]">
                {course.modules.map((module) => (
                  <div key={module.id} className="border-b border-silver-100 last:border-0">
                    <button 
                      onClick={() => setActiveModuleId(activeModuleId === module.id ? '' : module.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-silver-50 transition-colors text-left"
                    >
                      <div>
                        <span className="text-xs font-bold text-silver-400 uppercase tracking-wider">Module {module.id.replace('m', '').replace('_ub', '')}</span>
                        <h4 className={`text-sm font-semibold ${activeModuleId === module.id ? 'text-brand' : 'text-silver-700'}`}>
                          {module.title}
                        </h4>
                      </div>
                      <ChevronDownIcon className={`w-4 h-4 text-silver-400 transition-transform ${activeModuleId === module.id ? 'rotate-180' : ''}`} />
                    </button>

                    {activeModuleId === module.id && (
                      <div className="bg-silver-50">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => !lesson.isLocked && handleLessonChange(lesson, module.id)}
                            className={`w-full flex items-start gap-3 p-3 pl-6 text-sm hover:bg-silver-100 transition-colors border-l-4 ${activeLesson.id === lesson.id ? 'bg-white border-brand text-brand-dark shadow-sm' : 'border-transparent text-silver-600'}`}
                          >
                            <div className="mt-0.5">
                              {lesson.isLocked ? (
                                <LockIcon className="w-4 h-4 text-silver-400" />
                              ) : activeLesson.id === lesson.id ? (
                                <PlayIcon className="w-4 h-4 text-brand" />
                              ) : (
                                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <div className="text-left">
                              <p className={`font-medium ${lesson.isLocked ? 'text-silver-400' : ''}`}>{lesson.title}</p>
                              <p className="text-xs text-silver-400 mt-1">{lesson.duration}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
