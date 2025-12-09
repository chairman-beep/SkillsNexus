
import React, { useState, useEffect } from 'react';
import { ViewState, Course, UserContext } from './types';
import { DEFAULT_COURSES } from './constants';
import { LandingPage } from './components/LandingPage';
import { CourseViewer } from './components/CourseViewer';
import { StudentDashboard } from './components/StudentDashboard';
import { SupportChat } from './components/SupportChat';
import { PartnerHub } from './components/PartnerHub';
import { BreakoutRoom } from './components/BreakoutRoom';
import { LoginPortal } from './components/LoginPortal';
import { MenuIcon, XIcon, UserIcon, SettingsIcon, SparklesIcon } from './components/Icons';
import { onUserChange, logoutUser } from './services/firebase';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LANDING);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  
  // Admin/Partner State
  const [chatWebhook, setChatWebhook] = useState('');
  const [partnerEmail, setPartnerEmail] = useState<string | null>(null);

  // Active Course State
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  // Localization & User State
  const [userContext, setUserContext] = useState<UserContext>({
    currency: 'ZAR',
    countryCode: 'ZA',
    isAdmin: false,
    isAuthenticated: false
  });

  // Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onUserChange((user) => {
      if (user) {
        setUserContext(prev => ({
          ...prev,
          isAuthenticated: true,
          email: user.email || undefined,
          displayName: user.displayName || 'Student',
          photoURL: user.photoURL || undefined
        }));
      } else {
        setUserContext(prev => ({
          ...prev,
          isAuthenticated: false,
          displayName: undefined,
          photoURL: undefined,
          email: undefined
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timeZone.includes('Johannesburg') && !timeZone.includes('Africa')) {
       // logic for other zones if needed
    }
  }, []);
  
  const handleStartCourse = (course: Course) => {
    setActiveCourseId(course.id);
    setViewState(ViewState.COURSE);
  };

  const handleLogout = () => {
    logoutUser();
    setViewState(ViewState.LANDING);
  };

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  return (
    <div className="font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 border-b border-silver-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setViewState(ViewState.LANDING)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-brand-dark to-brand rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl shadow-md">
                S
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-slate-900">
                Skills<span className="text-brand">Nexus</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setViewState(ViewState.LANDING)} className="text-sm font-medium text-silver-600 hover:text-slate-900 transition-colors">Home</button>
              
              {viewState === ViewState.PARTNER_HUB ? (
                 <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded text-xs font-bold uppercase">Partner Portal</span>
              ) : !userContext.isAuthenticated ? (
                <>
                  <button 
                    onClick={() => setViewState(ViewState.PARTNER_HUB)} 
                    className="text-sm font-medium text-silver-500 hover:text-slate-900"
                  >
                    Partner Login
                  </button>
                  <button 
                    onClick={() => setViewState(ViewState.LOGIN)}
                    className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors shadow-sm"
                  >
                    Login / Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setViewState(ViewState.BREAKOUT)} 
                    className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
                  >
                    <SparklesIcon className="w-4 h-4" /> Breakout Room
                  </button>
                  <button onClick={() => setViewState(ViewState.STUDENT_DASHBOARD)} className="text-sm font-medium text-silver-600 hover:text-slate-900">Dashboard</button>
                  
                  <div className="flex items-center gap-3 pl-4 border-l border-silver-200">
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-bold text-slate-900">{userContext.displayName || 'Student'}</p>
                      <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700">Logout</button>
                    </div>
                    <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border border-silver-300">
                      {userContext.photoURL ? (
                        <img src={userContext.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-full h-full p-2 text-slate-400" />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-900 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-silver-200 absolute w-full shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <button onClick={() => { setViewState(ViewState.LANDING); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-slate-900">Home</button>
              
              {userContext.isAuthenticated ? (
                <>
                   <button onClick={() => { setViewState(ViewState.BREAKOUT); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-purple-600">Breakout Room</button>
                   <button onClick={() => { setViewState(ViewState.STUDENT_DASHBOARD); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-brand">Student Dashboard</button>
                   <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-red-600">Logout</button>
                </>
              ) : (
                <>
                   <button onClick={() => { setViewState(ViewState.PARTNER_HUB); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 text-base font-medium text-slate-900">Partner Login</button>
                   <button 
                    onClick={() => { setViewState(ViewState.LOGIN); setIsMobileMenuOpen(false); }}
                    className="block w-full text-center mt-4 bg-brand text-white px-5 py-3 rounded-lg font-bold"
                  >
                    Login / Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main View */}
      <main>
        {viewState === ViewState.LANDING && (
          <LandingPage 
            onStartCourse={() => {
              if (userContext.isAuthenticated) {
                setViewState(ViewState.STUDENT_DASHBOARD);
              } else {
                setViewState(ViewState.LOGIN);
              }
            }} 
            onOpenBreakout={() => {
              if (userContext.isAuthenticated) {
                setViewState(ViewState.BREAKOUT);
              } else {
                setViewState(ViewState.LOGIN);
              }
            }}
            userContext={userContext}
          />
        )}

        {viewState === ViewState.LOGIN && (
          <LoginPortal 
            onLoginSuccess={() => setViewState(ViewState.STUDENT_DASHBOARD)} 
          />
        )}

        {viewState === ViewState.STUDENT_DASHBOARD && (
          <StudentDashboard 
            courses={courses}
            onSelectCourse={handleStartCourse}
            onEnterBreakout={() => setViewState(ViewState.BREAKOUT)}
          />
        )}
        
        {viewState === ViewState.COURSE && (
          <CourseViewer 
            course={activeCourse} 
            onBack={() => setViewState(ViewState.STUDENT_DASHBOARD)}
          />
        )}

        {viewState === ViewState.PARTNER_HUB && (
          <PartnerHub 
            courses={courses} 
            onUpdateCourses={setCourses}
            webhookUrl={chatWebhook}
            onUpdateWebhook={setChatWebhook}
            onLogout={() => {
              setPartnerEmail(null);
              setViewState(ViewState.LANDING);
            }}
            userEmail={partnerEmail}
            onLogin={setPartnerEmail}
          />
        )}

        {viewState === ViewState.BREAKOUT && (
          <BreakoutRoom 
            onClose={() => setViewState(ViewState.LANDING)} 
            userContext={userContext}
          />
        )}
      </main>
      
      {/* Footer / Admin Link */}
      {viewState !== ViewState.PARTNER_HUB && viewState !== ViewState.BREAKOUT && viewState !== ViewState.STUDENT_DASHBOARD && viewState !== ViewState.COURSE && viewState !== ViewState.LOGIN && (
        <footer className="bg-white border-t border-silver-200 py-8 text-center text-xs text-silver-400">
           <div className="max-w-7xl mx-auto px-4">
             <div className="flex justify-center gap-6 mb-4">
               <span>© 2024 SkillsNexus Africa</span>
               <button onClick={() => setViewState(ViewState.PARTNER_HUB)} className="hover:text-brand flex items-center gap-1">
                 <SettingsIcon className="w-3 h-3" /> Partner Hub
               </button>
             </div>
           </div>
        </footer>
      )}

      {/* Global Support Widget - Hidden in specific views to prevent clutter */}
      {viewState !== ViewState.BREAKOUT && viewState !== ViewState.LOGIN && (
         <SupportChat webhookUrl={chatWebhook} />
      )}
    </div>
  );
};

export default App;
