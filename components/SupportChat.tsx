import React, { useState, useEffect, useRef } from 'react';
import { MessageCircleIcon, XIcon, UserIcon, SparklesIcon } from './Icons';
import { ChatMessage } from '../types';
import { getAITutorResponse } from '../services/geminiService';

interface SupportChatProps {
  webhookUrl?: string;
}

export const SupportChat: React.FC<SupportChatProps> = ({ webhookUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'system',
          text: 'Welcome to SkillsNexus Support. How can we help you today?',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendToWebhook = async (msg: ChatMessage) => {
    if (!webhookUrl) return;
    try {
      // Simulate webhook call
      // In a real app: await fetch(webhookUrl, { method: 'POST', body: JSON.stringify(msg) });
      console.log(`[Webhook] Sending message to ${webhookUrl}:`, msg);
    } catch (e) {
      console.error("Webhook failed", e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    
    // Notify external system via webhook if configured
    await sendToWebhook(userMsg);

    // Heuristic: If message contains "course", "learn", "explain" -> Route to AI Tutor
    // If message contains "pricing", "cost", "refund", "human" -> Route to simulated Support Agent
    const lowerText = userMsg.text.toLowerCase();
    const isSupportRequest = lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('human') || lowerText.includes('support') || lowerText.includes('refund');

    if (isSupportRequest) {
      // Simulate Human Agent Delay
      setTimeout(() => {
        const agentMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          text: "I'm connecting you with a live specialist. They typically respond within 2 minutes. While you wait, check our 'Pricing' section for detailed tier information.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, agentMsg]);
        setIsTyping(false);
      }, 1500);
    } else {
      // AI Tutor Response via Gemini
      try {
        const responseText = await getAITutorResponse(userMsg.text, "General Inquiry from Landing Page");
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: responseText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      } catch (e) {
         const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'system',
          text: "We are experiencing high volume. Please try again later.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-brand-dark hover:bg-brand text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 group"
      >
        {isOpen ? <XIcon className="w-6 h-6" /> : <MessageCircleIcon className="w-6 h-6" />}
        {!isOpen && <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">Chat with us</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-silver-200 animate-fade-in-up" style={{ maxHeight: '600px', height: '80vh' }}>
          {/* Header */}
          <div className="bg-brand-dark p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-brand-dark"></div>
            </div>
            <div className="text-white">
              <h3 className="font-semibold text-sm">Concierge & Support</h3>
              <p className="text-xs text-white/70">Typically replies instantly</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-silver-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand text-white rounded-br-none' 
                    : msg.role === 'ai' 
                      ? 'bg-purple-100 text-purple-900 border border-purple-200 rounded-bl-none'
                      : msg.role === 'system' 
                        ? 'bg-silver-200 text-silver-600 text-xs text-center w-full bg-transparent'
                        : 'bg-white text-silver-800 border border-silver-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.role === 'ai' && <div className="flex items-center gap-1 text-xs font-bold text-purple-700 mb-1"><SparklesIcon className="w-3 h-3" /> AI Tutor</div>}
                  {msg.role === 'agent' && <div className="flex items-center gap-1 text-xs font-bold text-brand-dark mb-1"><UserIcon className="w-3 h-3" /> Support Agent</div>}
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-silver-200 p-3 rounded-2xl rounded-bl-none flex gap-1">
                   <div className="w-2 h-2 bg-silver-500 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-silver-500 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-silver-500 rounded-full animate-bounce delay-150"></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-silver-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question..."
                className="flex-1 bg-silver-100 border-transparent focus:border-brand focus:bg-white rounded-lg px-4 py-2 text-sm outline-none transition-all"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-brand text-white p-2 rounded-lg disabled:opacity-50 hover:bg-brand-dark transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
            <div className="text-[10px] text-center text-silver-400 mt-2">
              Our AI & Live Agents work together to support you.
            </div>
          </div>
        </div>
      )}
    </>
  );
};