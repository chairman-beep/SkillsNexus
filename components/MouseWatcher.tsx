
import React, { useEffect, useRef, useState } from 'react';

export const MouseWatcher: React.FC = () => {
  const [leftEyePosition, setLeftEyePosition] = useState({ x: 0, y: 0 });
  const [rightEyePosition, setRightEyePosition] = useState({ x: 0, y: 0 });
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!anchorRef.current) return;
      
      const rekt = anchorRef.current.getBoundingClientRect();
      const anchorX = rekt.left + rekt.width / 2;
      const anchorY = rekt.top + rekt.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const angleDeg = Math.atan2(mouseY - anchorY, mouseX - anchorX) * 180 / Math.PI;
      
      // Limit eye movement distance
      const distance = Math.min(3, Math.sqrt(Math.pow(mouseX - anchorX, 2) + Math.pow(mouseY - anchorY, 2)) / 100);
      
      const eyeX = Math.cos(angleDeg * Math.PI / 180) * distance * 2;
      const eyeY = Math.sin(angleDeg * Math.PI / 180) * distance * 2;

      setLeftEyePosition({ x: eyeX, y: eyeY });
      setRightEyePosition({ x: eyeX, y: eyeY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={anchorRef} className="fixed bottom-10 left-10 w-24 h-24 z-40 hidden lg:block transition-all hover:scale-110 cursor-pointer group">
      {/* Robot Head */}
      <div className="relative w-full h-full">
        {/* Antenna */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-400"></div>
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-red-500/50 shadow-lg"></div>

        {/* Face Shape */}
        <div className="w-full h-full bg-slate-900 rounded-2xl border-4 border-slate-700 shadow-2xl overflow-hidden relative">
           {/* Screen Gradient */}
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent"></div>
           
           {/* Eyes Container */}
           <div className="absolute top-1/3 left-0 right-0 flex justify-center gap-4 px-2">
             {/* Left Eye */}
             <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600">
               <div 
                  className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]"
                  style={{ transform: `translate(${leftEyePosition.x}px, ${leftEyePosition.y}px)` }}
               ></div>
             </div>
             {/* Right Eye */}
             <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600">
               <div 
                  className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]"
                  style={{ transform: `translate(${rightEyePosition.x}px, ${rightEyePosition.y}px)` }}
               ></div>
             </div>
           </div>

           {/* Mouth */}
           <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-700 rounded-full group-hover:h-3 group-hover:bg-slate-600 transition-all duration-300"></div>
        </div>

        {/* Tooltip */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-white text-slate-900 text-xs py-1 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
           I'm watching your progress!
           <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-transparent border-r-white"></div>
        </div>
      </div>
    </div>
  );
};
