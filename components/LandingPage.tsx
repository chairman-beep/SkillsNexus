
import React, { useState } from 'react';
import { PRICING_TIERS, TESTIMONIALS } from '../constants';
import { CheckCircleIcon, PlayIcon, UserIcon, GlobeIcon, SparklesIcon } from './Icons';
import { UserContext, PricingTier } from '../types';
import { PaymentModal } from './PaymentModal';

interface LandingPageProps {
  onStartCourse: () => void;
  onOpenBreakout: () => void;
  userContext: UserContext;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartCourse, onOpenBreakout, userContext }) => {
  const isZAR = userContext.currency === 'ZAR';
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);

  const handleTierSelect = (tier: PricingTier) => {
    // If user is already authenticated, they might just go to dashboard, 
    // but typically premium upgrades happen even if logged in.
    // For this flow, we open the payment modal.
    setSelectedTier(tier);
  };

  const handlePaymentSuccess = () => {
    setSelectedTier(null);
    onStartCourse(); // Redirect to dashboard/login
  };

  return (
    <div className="bg-white">
      {/* Payment Modal Overlay */}
      {selectedTier && (
        <PaymentModal 
          tier={selectedTier} 
          onClose={() => setSelectedTier(null)} 
          onSuccess={handlePaymentSuccess}
          userContext={userContext}
        />
      )}

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="flex gap-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
               <GlobeIcon className="w-3 h-3 text-brand-light" />
               <span className="text-xs font-medium tracking-wide uppercase text-silver-200">{userContext.countryCode === 'ZA' ? 'South Africa Edition' : 'Global Edition'}</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6">
            Future-Proof Your Career <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-silver-200 via-white to-silver-400">
              Without Learning to Code
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-silver-300 mb-10 leading-relaxed">
            SkillsNexus connects professionals aged 35+ with industry-leading courses. Leverage your experience with the new power of Artificial Intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button 
              onClick={onStartCourse}
              className="bg-brand hover:bg-brand-light text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-brand/50"
            >
              Explore Courses
            </button>
            <button 
              onClick={onOpenBreakout}
              className="px-8 py-4 rounded-lg font-medium text-white border border-purple-500/50 hover:bg-purple-900/20 transition-colors flex items-center justify-center gap-2 text-purple-300 hover:text-purple-200"
            >
              <SparklesIcon className="w-5 h-5" /> Join Breakout Room
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-70">
            <div>
              <p className="text-3xl font-bold text-white">12k+</p>
              <p className="text-sm text-silver-400">African Professionals</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">4.9/5</p>
              <p className="text-sm text-silver-400">Student Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{isZAR ? 'ZAR' : 'USD'}</p>
              <p className="text-sm text-silver-400">Localized Pricing</p>
            </div>
             <div>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-silver-400">Live Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-silver-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Why SkillsNexus Africa?</h2>
            <p className="text-silver-600 max-w-2xl mx-auto">Designed for the unique challenges of the African market. We prioritize low-bandwidth friendly tools, mobile-first strategies, and real-world business ROI.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Contextualized for Africa",
                desc: "Learn to use AI tools that work well in our region, optimizing for data costs and local market relevance.",
                icon: "🌍"
              },
              {
                title: "Practical First",
                desc: "Walk away with a finished project. Whether it's automating your logistics or creating marketing assets.",
                icon: "🛠️"
              },
              {
                title: "Executive Networking",
                desc: "Join a community of Directors, Managers, and VPs from Johannesburg to Nairobi.",
                icon: "🤝"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-silver-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-silver-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-900 mb-12">Trusted by Leaders Across the Continent</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-silver-50 p-6 rounded-xl border border-silver-100">
                <p className="text-silver-600 italic mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-silver-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-slate-50 border-t border-silver-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Partner Course Pricing</h2>
            <p className="text-silver-600 mt-2">Flexible options for individual professionals and corporate teams.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier) => (
              <div 
                key={tier.name} 
                className={`relative rounded-2xl p-8 flex flex-col ${
                  tier.isRecommended 
                    ? 'bg-slate-900 text-white shadow-2xl scale-105 border-none z-10' 
                    : 'bg-white text-slate-900 shadow-lg border border-silver-200'
                }`}
              >
                {tier.isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">
                    {isZAR ? `R${tier.priceZAR.toLocaleString()}` : `$${tier.priceUSD}`}
                  </span>
                  <span className={`text-sm ${tier.isRecommended ? 'text-silver-400' : 'text-silver-500'}`}>
                    {isZAR ? 'ZAR' : 'USD'}
                  </span>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircleIcon className={`w-5 h-5 flex-shrink-0 ${tier.isRecommended ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`text-sm ${tier.isRecommended ? 'text-silver-200' : 'text-silver-600'}`}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleTierSelect(tier)}
                  className={`w-full py-4 rounded-lg font-bold transition-all ${
                    tier.isRecommended 
                      ? 'bg-brand hover:bg-brand-light text-white' 
                      : 'bg-silver-100 hover:bg-silver-200 text-slate-900'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};