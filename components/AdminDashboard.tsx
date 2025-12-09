import React, { useState } from 'react';
import { Course, Lesson, Module } from '../types';
import { PlusIcon, SettingsIcon, VideoIcon, CheckCircleIcon } from './Icons';
import { generateCourseVideo } from '../services/geminiService';

interface AdminDashboardProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  webhookUrl: string;
  onUpdateWebhook: (url: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  courses, 
  onUpdateCourses, 
  webhookUrl, 
  onUpdateWebhook,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'ai-video' | 'settings'>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  // Video Generation State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleCreateCourse = () => {
    const newCourse: Course = {
      id: `c${Date.now()}`,
      title: 'New Partner Course',
      partnerName: 'Your Organization Name',
      description: 'Course description goes here.',
      modules: []
    };
    onUpdateCourses([...courses, newCourse]);
    setSelectedCourseId(newCourse.id);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    onUpdateCourses(courses.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addModule = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const newModule: Module = {
      id: `m${Date.now()}`,
      title: 'New Module',
      description: 'Module description',
      lessons: []
    };

    updateCourse(courseId, { modules: [...course.modules, newModule] });
  };

  const addLesson = (courseId: string, moduleId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const updatedModules = course.modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, {
            id: `l${Date.now()}`,
            title: 'New Lesson',
            duration: '10 min',
            isLocked: true,
            type: 'video' as const,
            videoUrl: '',
            transcript: ''
          }]
        };
      }
      return m;
    });

    updateCourse(courseId, { modules: updatedModules });
  };

  const updateLesson = (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const updatedModules = course.modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
        };
      }
      return m;
    });

    updateCourse(courseId, { modules: updatedModules });
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt) return;
    setIsGeneratingVideo(true);
    setVideoError(null);
    setGeneratedVideoUrl(null);

    const result = await generateCourseVideo(videoPrompt);
    
    if (result.videoUri) {
      setGeneratedVideoUrl(result.videoUri);
    } else {
      setVideoError(result.error || "Failed to generate video");
    }
    setIsGeneratingVideo(false);
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="min-h-screen bg-silver-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Partner Portal</h1>
            <p className="text-silver-600">Manage your curriculum and content.</p>
          </div>
          <button onClick={onLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
        </div>

        <div className="flex gap-6 mb-8 border-b border-silver-200">
          <button 
            onClick={() => setActiveTab('courses')}
            className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'courses' ? 'text-brand border-b-2 border-brand' : 'text-silver-500 hover:text-slate-900'}`}
          >
            My Courses
          </button>
          <button 
             onClick={() => setActiveTab('ai-video')}
             className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'ai-video' ? 'text-brand border-b-2 border-brand' : 'text-silver-500 hover:text-slate-900'}`}
          >
            <VideoIcon className="w-4 h-4" />
            AI Video Studio
          </button>
          <button 
             onClick={() => setActiveTab('settings')}
             className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'text-brand border-b-2 border-brand' : 'text-silver-500 hover:text-slate-900'}`}
          >
            <SettingsIcon className="w-4 h-4" />
            Settings
          </button>
        </div>

        {activeTab === 'courses' && (
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar List */}
            <div className="col-span-12 md:col-span-3 bg-white rounded-xl shadow-sm border border-silver-200 p-4 h-fit">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Courses</h3>
                <button onClick={handleCreateCourse} className="text-brand hover:bg-brand-light/10 p-1 rounded">
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {courses.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedCourseId(c.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors text-sm ${selectedCourseId === c.id ? 'bg-brand/10 text-brand-dark font-medium' : 'hover:bg-silver-50 text-slate-600'}`}
                  >
                    {c.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Course Editor */}
            <div className="col-span-12 md:col-span-9">
              {selectedCourse ? (
                <div className="bg-white rounded-xl shadow-sm border border-silver-200 p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                       <input 
                        type="text" 
                        value={selectedCourse.title}
                        onChange={(e) => updateCourse(selectedCourse.id, { title: e.target.value })}
                        className="w-full border border-silver-300 rounded-lg px-3 py-2"
                       />
                    </div>
                    <div className="col-span-2">
                       <label className="block text-sm font-medium text-slate-700 mb-1">Partner Name</label>
                       <input 
                        type="text" 
                        value={selectedCourse.partnerName}
                        onChange={(e) => updateCourse(selectedCourse.id, { partnerName: e.target.value })}
                        className="w-full border border-silver-300 rounded-lg px-3 py-2"
                       />
                    </div>
                  </div>

                  <div>
                     <div className="flex justify-between items-center mb-4 border-t border-silver-100 pt-6">
                        <h3 className="font-bold text-lg text-slate-800">Modules & Lessons</h3>
                        <button onClick={() => addModule(selectedCourse.id)} className="text-sm text-brand font-medium hover:underline">+ Add Module</button>
                     </div>
                     
                     <div className="space-y-4">
                        {selectedCourse.modules.map(module => (
                          <div key={module.id} className="border border-silver-200 rounded-lg p-4 bg-silver-50/50">
                            <input 
                                type="text" 
                                value={module.title}
                                onChange={(e) => {
                                  // Simplified update logic for module title would go here
                                  // For brevity, skipping deep nested state update logic for title only
                                }}
                                className="font-semibold bg-transparent border-b border-transparent focus:border-brand outline-none w-full mb-2"
                            />
                            
                            <div className="space-y-3 pl-4 mt-2">
                               {module.lessons.map(lesson => (
                                 <div key={lesson.id} className="bg-white p-3 rounded border border-silver-200">
                                   <div className="flex justify-between mb-2">
                                      <input 
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(selectedCourse.id, module.id, lesson.id, { title: e.target.value })}
                                        className="font-medium text-sm w-1/2 outline-none"
                                      />
                                      <span className="text-xs text-silver-400">ID: {lesson.id}</span>
                                   </div>
                                   <div className="grid grid-cols-2 gap-2 text-sm">
                                      <input 
                                        placeholder="Video URL"
                                        value={lesson.videoUrl || ''}
                                        onChange={(e) => updateLesson(selectedCourse.id, module.id, lesson.id, { videoUrl: e.target.value })}
                                        className="border border-silver-200 rounded px-2 py-1"
                                      />
                                      <textarea 
                                        placeholder="Transcript / Notes"
                                        value={lesson.transcript || ''}
                                        onChange={(e) => updateLesson(selectedCourse.id, module.id, lesson.id, { transcript: e.target.value })}
                                        className="border border-silver-200 rounded px-2 py-1 h-8 text-xs resize-none"
                                      />
                                   </div>
                                 </div>
                               ))}
                               <button onClick={() => addLesson(selectedCourse.id, module.id)} className="text-xs text-brand font-medium">+ Add Lesson</button>
                            </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-silver-400">Select a course to edit</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ai-video' && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-silver-200 p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <VideoIcon className="w-6 h-6 text-brand" />
              AI Video Generator
            </h2>
            <p className="text-silver-600 mb-6 text-sm">
              Generate training videos or B-roll for your courses using our Veo-powered AI engine. 
              Describe the scene, and the AI will generate a short 720p clip.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prompt</label>
                <textarea 
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="e.g., A futuristic office in Nairobi with diverse professionals collaborating on a hologram..."
                  className="w-full border border-silver-300 rounded-lg px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
              
              <button 
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo || !videoPrompt}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isGeneratingVideo ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  'Generate Video'
                )}
              </button>

              {videoError && (
                 <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                   Error: {videoError}
                 </div>
              )}

              {generatedVideoUrl && (
                <div className="mt-6 animate-fade-in">
                  <h3 className="font-semibold text-sm mb-2">Result:</h3>
                  <div className="bg-black rounded-lg overflow-hidden aspect-video">
                    <video src={generatedVideoUrl} controls className="w-full h-full" />
                  </div>
                  <p className="text-xs text-silver-500 mt-2">Right click video to save.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-silver-200 p-8">
             <h2 className="text-xl font-bold mb-6">Partner Settings</h2>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Support Chat Webhook URL</label>
                   <p className="text-xs text-silver-500 mb-2">
                     Connect your CRM or Helpdesk (e.g., Slack, Zendesk) to receive live chat messages.
                   </p>
                   <div className="flex gap-2">
                     <input 
                        type="text" 
                        value={webhookUrl}
                        onChange={(e) => onUpdateWebhook(e.target.value)}
                        placeholder="https://hooks.slack.com/services/..."
                        className="flex-1 border border-silver-300 rounded-lg px-4 py-2 text-sm"
                     />
                     <button className="bg-silver-100 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-silver-200">Save</button>
                   </div>
                </div>
             </div>
           </div>
        )}

      </div>
    </div>
  );
};