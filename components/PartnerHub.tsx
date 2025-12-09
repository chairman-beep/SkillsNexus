
import React, { useState } from 'react';
import { Course, Lesson, Module } from '../types';
import { PlusIcon, SettingsIcon, VideoIcon, CheckCircleIcon, LockIcon, TagIcon } from './Icons';
import { generateCourseVideo } from '../services/geminiService';
import { VALID_REFERRAL_CODES } from '../constants';

interface PartnerHubProps {
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  webhookUrl: string;
  onUpdateWebhook: (url: string) => void;
  onLogout: () => void;
  userEmail: string | null;
  onLogin: (email: string) => void;
}

export const PartnerHub: React.FC<PartnerHubProps> = ({ 
  courses, 
  onUpdateCourses, 
  webhookUrl, 
  onUpdateWebhook,
  onLogout,
  userEmail,
  onLogin
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'ai-video' | 'settings' | 'referrals'>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Video Generation State
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const allowedDomains = ['@thedccsa.org', '@jmdev.co.za'];
    const email = loginEmail.toLowerCase();
    
    const isValid = allowedDomains.some(domain => email.endsWith(domain));
    
    if (isValid) {
      onLogin(email);
      setLoginError('');
    } else {
      setLoginError('Access Restricted: Only authorized partners (@thedccsa.org, @jmdev.co.za) may access this portal.');
    }
  };

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

  // LOGIN SCREEN
  if (!userEmail) {
    return (
      <div className="min-h-screen bg-silver-50 flex items-center justify-center p-4 pt-20">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 border border-silver-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif font-bold text-slate-900">Partner Hub Login</h1>
            <p className="text-silver-500 text-sm mt-2">Restricted access for content partners</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@thedccsa.org"
                className="w-full border border-silver-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              />
            </div>
            
            {loginError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                <LockIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {loginError}
              </div>
            )}
            
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
            >
              Access Portal
            </button>
            <button type="button" onClick={onLogout} className="w-full text-sm text-silver-400 hover:text-silver-600">
              Return to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED IN VIEW
  return (
    <div className="min-h-screen bg-silver-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Partner Hub</h1>
            <p className="text-silver-600">Welcome, {userEmail}</p>
          </div>
          <button onClick={onLogout} className="text-sm text-red-600 hover:text-red-800 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50">Logout</button>
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
             onClick={() => setActiveTab('referrals')}
             className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'referrals' ? 'text-brand border-b-2 border-brand' : 'text-silver-500 hover:text-slate-900'}`}
          >
            <TagIcon className="w-4 h-4" />
            Referral Codes
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
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-slate-900">Edit Course Content</h2>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                  </div>
                  
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
                       <label className="block text-sm font-medium text-slate-700 mb-1">Partner/Organization Name</label>
                       <input 
                        type="text" 
                        value={selectedCourse.partnerName}
                        onChange={(e) => updateCourse(selectedCourse.id, { partnerName: e.target.value })}
                        className="w-full border border-silver-300 rounded-lg px-3 py-2"
                       />
                    </div>
                    <div className="col-span-2">
                       <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                       <textarea 
                        value={selectedCourse.description}
                        onChange={(e) => updateCourse(selectedCourse.id, { description: e.target.value })}
                        className="w-full border border-silver-300 rounded-lg px-3 py-2 h-24 resize-none"
                       />
                    </div>
                  </div>

                  <div>
                     <div className="flex justify-between items-center mb-4 border-t border-silver-100 pt-6">
                        <h3 className="font-bold text-lg text-slate-800">Curriculum</h3>
                        <button onClick={() => addModule(selectedCourse.id)} className="text-sm text-brand font-medium hover:underline flex items-center gap-1"><PlusIcon className="w-3 h-3"/> Add Module</button>
                     </div>
                     
                     <div className="space-y-4">
                        {selectedCourse.modules.map(module => (
                          <div key={module.id} className="border border-silver-200 rounded-lg p-4 bg-silver-50/50">
                            <input 
                                type="text" 
                                value={module.title}
                                placeholder="Module Title"
                                onChange={(e) => {
                                   const updatedModules = selectedCourse.modules.map(m => m.id === module.id ? {...m, title: e.target.value} : m);
                                   updateCourse(selectedCourse.id, { modules: updatedModules });
                                }}
                                className="font-semibold bg-transparent border-b border-transparent focus:border-brand outline-none w-full mb-2"
                            />
                            
                            <div className="space-y-3 pl-4 mt-2">
                               {module.lessons.map(lesson => (
                                 <div key={lesson.id} className="bg-white p-3 rounded border border-silver-200 shadow-sm">
                                   <div className="flex justify-between mb-2">
                                      <input 
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(selectedCourse.id, module.id, lesson.id, { title: e.target.value })}
                                        className="font-medium text-sm w-1/2 outline-none border-b border-transparent focus:border-silver-300"
                                      />
                                      <span className="text-xs text-silver-400">ID: {lesson.id}</span>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <label className="text-xs text-silver-500 block mb-1">Video Link (MP4, YouTube, Synthesia)</label>
                                        <input 
                                          placeholder="https://..."
                                          value={lesson.videoUrl || ''}
                                          onChange={(e) => updateLesson(selectedCourse.id, module.id, lesson.id, { videoUrl: e.target.value })}
                                          className="w-full border border-silver-200 rounded px-2 py-1 text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-silver-500 block mb-1">Transcript / AI Context</label>
                                        <textarea 
                                          placeholder="Paste lesson text here for AI Tutor..."
                                          value={lesson.transcript || ''}
                                          onChange={(e) => updateLesson(selectedCourse.id, module.id, lesson.id, { transcript: e.target.value })}
                                          className="w-full border border-silver-200 rounded px-2 py-1 h-8 focus:h-20 transition-all resize-none text-xs"
                                        />
                                      </div>
                                   </div>
                                 </div>
                               ))}
                               <button onClick={() => addLesson(selectedCourse.id, module.id)} className="text-xs text-brand font-medium flex items-center gap-1 opacity-70 hover:opacity-100">+ Add Lesson</button>
                            </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-silver-400 bg-white rounded-xl border border-silver-200 border-dashed">Select a course to edit or create a new one.</div>
              )}
            </div>
          </div>
        )}

        {/* AI Video Generator - Unchanged logic, just keeping structure */}
        {activeTab === 'ai-video' && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-silver-200 p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <VideoIcon className="w-6 h-6 text-brand" />
              AI Video Creator (Beta)
            </h2>
            <p className="text-silver-600 mb-6 text-sm">
              Create custom video content for your lessons using our Veo-powered engine.
            </p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-2">Scene Description Prompt</label>
              <textarea 
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="e.g., A diverse group of South African tech professionals..."
                className="w-full border border-silver-300 rounded-lg px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-brand focus:border-transparent mb-4"
              />
              
              <button 
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo || !videoPrompt}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2 transition-all"
              >
                {isGeneratingVideo ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating with Veo...
                  </>
                ) : (
                  'Generate Video Asset'
                )}
              </button>

              {videoError && (
                 <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                   Error: {videoError}
                 </div>
              )}

              {generatedVideoUrl && (
                <div className="mt-6 animate-fade-in">
                  <h3 className="font-semibold text-sm mb-2 text-green-700 flex items-center gap-2"><CheckCircleIcon className="w-4 h-4"/> Generation Complete</h3>
                  <div className="bg-black rounded-lg overflow-hidden aspect-video shadow-lg">
                    <video src={generatedVideoUrl} controls className="w-full h-full" />
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-xs text-silver-500">Right click video to save as MP4.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'referrals' && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-silver-200 p-8">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-slate-900">Active Referral Codes</h2>
               <button className="text-sm bg-brand text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-dark">+ Generate New</button>
             </div>
             
             <div className="overflow-hidden rounded-lg border border-silver-200">
               <table className="min-w-full divide-y divide-silver-200">
                 <thead className="bg-silver-50">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wider">Code</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wider">Discount</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wider">Assigned By</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-silver-500 uppercase tracking-wider">Status</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-silver-200">
                   {VALID_REFERRAL_CODES.map((rc, idx) => (
                     <tr key={idx}>
                       <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{rc.code}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-brand font-medium">{rc.discountPercent}%</td>
                       <td className="px-6 py-4 whitespace-nowrap text-silver-600">{rc.assignedBy}</td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rc.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                           {rc.isActive ? 'Active' : 'Inactive'}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-silver-200 p-8">
             <h2 className="text-xl font-bold mb-6">Partner Settings</h2>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Support Chat Webhook URL</label>
                   <input 
                      type="text" 
                      value={webhookUrl}
                      onChange={(e) => onUpdateWebhook(e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                      className="flex-1 w-full border border-silver-300 rounded-lg px-4 py-2 text-sm"
                   />
                </div>
             </div>
           </div>
        )}

      </div>
    </div>
  );
};