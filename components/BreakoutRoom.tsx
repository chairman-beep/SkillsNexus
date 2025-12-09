
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, UserContext } from '../types';
import { GifIcon, SparklesIcon, XIcon } from './Icons';
import { TRENDY_GIFS } from '../constants';

interface BreakoutRoomProps {
  onClose: () => void;
  userContext: UserContext;
}

export const BreakoutRoom: React.FC<BreakoutRoomProps> = ({ onClose, userContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showGifs, setShowGifs] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial dummy messages
    setMessages([
      { id: '1', role: 'user', text: "Has anyone tried the new Midjourney prompt strategy from Module 3?", timestamp: new Date(), senderName: "Sarah K.", avatar: "SK" },
      { id: '2', role: 'user', text: "Yes! Totally game changer for my pitch deck.", timestamp: new Date(), senderName: "Thabo M.", avatar: "TM" },
      { id: '3', role: 'user', text: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWc1bnd4dG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG4x/l0HlHFRbmaZtBRhXG/giphy.gif", timestamp: new Date(), senderName: "Thabo M.", avatar: "TM", type: 'gif' }
    ]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string, type: 'text' | 'gif' = 'text') => {
    if (!text.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
      senderName: 'You', // In a real app, this would be the logged-in user
      avatar: 'ME',
      type
    };
    
    setMessages([...messages, newMsg]);
    setInputValue('');
    setShowGifs(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4 flex justify-between items-center shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center animate-pulse">
            <SparklesIcon className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">The Breakout Room</h1>
            <p className="text-xs text-purple-400 font-medium">14 Members Online • {userContext.countryCode} Zone</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.senderName === 'You' ? 'flex-row-reverse' : ''}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${msg.senderName === 'You' ? 'bg-brand text-white' : 'bg-slate-700 text-slate-300'}`}>
               {msg.avatar}
             </div>
             <div className={`max-w-[70%] ${msg.type === 'gif' ? 'bg-transparent' : msg.senderName === 'You' ? 'bg-brand text-white' : 'bg-slate-800 text-slate-200'} rounded-2xl p-3 shadow-md`}>
               {msg.senderName !== 'You' && <p className="text-[10px] text-slate-400 mb-1">{msg.senderName}</p>}
               {msg.type === 'gif' ? (
                 <img src={msg.text} alt="GIF" className="rounded-xl w-full max-w-[200px]" />
               ) : (
                 <p className="text-sm">{msg.text}</p>
               )}
             </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-800 p-4 border-t border-slate-700 relative">
        {showGifs && (
          <div className="absolute bottom-full left-4 bg-slate-800 border border-slate-700 rounded-xl p-3 mb-2 shadow-2xl grid grid-cols-2 gap-2 w-64 animate-fade-in-up">
            {TRENDY_GIFS.map((gif, i) => (
              <img 
                key={i} 
                src={gif} 
                onClick={() => handleSend(gif, 'gif')}
                className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity w-full h-20 object-cover"
                alt="GIF option"
              />
            ))}
          </div>
        )}
        
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <button 
            onClick={() => setShowGifs(!showGifs)}
            className={`p-3 rounded-xl transition-colors ${showGifs ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
          >
            <GifIcon className="w-6 h-6" />
          </button>
          <div className="flex-1 bg-slate-700 rounded-xl flex items-center p-1">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              placeholder="Say something cool..."
              className="bg-transparent w-full text-white px-3 py-2 outline-none placeholder:text-slate-500"
            />
          </div>
          <button 
            onClick={() => handleSend(inputValue)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
