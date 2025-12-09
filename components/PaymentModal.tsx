
import React, { useState, useEffect } from 'react';
import { PricingTier, UserContext } from '../types';
import { initializeYoco, processPayment, validateReferralCode } from '../services/yoco.ts';
import { XIcon, CreditCardIcon, CheckCircleIcon, LockIcon, TagIcon } from './Icons';

interface PaymentModalProps {
  tier: PricingTier;
  onClose: () => void;
  onSuccess: () => void;
  userContext: UserContext;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ tier, onClose, onSuccess, userContext }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');
  const [sdkLoaded, setSdkLoaded] = useState(false);
  
  // Referral State
  const [referralCode, setReferralCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountMessage, setDiscountMessage] = useState('');
  const [discountError, setDiscountError] = useState('');

  // Payment Form State (Simulation)
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const isZAR = userContext.currency === 'ZAR';
  const originalPrice = isZAR ? tier.priceZAR : tier.priceUSD;
  const finalPrice = Math.floor(originalPrice * (1 - appliedDiscount / 100));
  
  useEffect(() => {
    // Check if Yoco SDK is available
    const checkYoco = async () => {
       const yoco = await initializeYoco();
       if (yoco) {
         setSdkLoaded(true);
         // In a real implementation, we would mount the Yoco Inline Form here using a ref
       }
    };
    checkYoco();
  }, []);

  const handleApplyReferral = () => {
    if (!referralCode) return;
    setDiscountError('');
    setDiscountMessage('');

    const validCode = validateReferralCode(referralCode);
    if (validCode) {
      setAppliedDiscount(validCode.discountPercent);
      setDiscountMessage(`Success! ${validCode.discountPercent}% discount applied.`);
    } else {
      setAppliedDiscount(0);
      setDiscountError('Invalid or expired referral code.');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStep('processing');

    try {
      // 1. In real Yoco Inline, the SDK handles tokenization:
      // const result = await yoco.showPopup({ amountInCents: finalPrice * 100, currency: isZAR ? 'ZAR' : 'USD' });
      // Here we simulate the token generation and backend charge
      const fakeToken = 'tok_' + Math.random().toString(36).substr(2, 9);
      
      await processPayment(
        finalPrice * 100, 
        isZAR ? 'ZAR' : 'USD', 
        fakeToken, 
        appliedDiscount > 0 ? referralCode : undefined
      );

      setPaymentStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (error) {
      console.error("Payment failed", error);
      setPaymentStep('details');
      setLoading(false);
      alert("Payment simulation failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold font-serif">Secure Checkout</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <LockIcon className="w-3 h-3" /> Encrypted via Yoco
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {paymentStep === 'success' ? (
          <div className="p-12 flex flex-col items-center justify-center text-center animate-fade-in">
             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
               <CheckCircleIcon className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
             <p className="text-silver-500 mb-6">Welcome to the {tier.name} Plan. Redirecting you to your dashboard...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Order Summary */}
            <div className="bg-silver-50 p-4 rounded-xl border border-silver-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <h3 className="font-bold text-slate-900">{tier.name} Access</h3>
                   <p className="text-xs text-silver-500">Lifetime course access + Community</p>
                </div>
                <div className="text-right">
                   {appliedDiscount > 0 && (
                     <p className="text-xs text-silver-400 line-through">
                        {isZAR ? 'R' : '$'}{originalPrice.toLocaleString()}
                     </p>
                   )}
                   <p className="text-lg font-bold text-brand">
                     {isZAR ? 'R' : '$'}{finalPrice.toLocaleString()}
                   </p>
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <label className="text-xs font-bold text-silver-500 uppercase tracking-wide mb-2 block flex items-center gap-1">
                 <TagIcon className="w-3 h-3" /> Referral Code
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Enter code (e.g. JMDEV20)"
                  className="flex-1 border border-silver-300 rounded-lg px-3 py-2 text-sm uppercase"
                  disabled={appliedDiscount > 0}
                />
                {appliedDiscount > 0 ? (
                  <button onClick={() => { setAppliedDiscount(0); setReferralCode(''); setDiscountMessage(''); }} className="text-xs text-red-500 font-medium hover:underline">
                    Remove
                  </button>
                ) : (
                  <button onClick={handleApplyReferral} className="bg-silver-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-silver-300 transition-colors">
                    Apply
                  </button>
                )}
              </div>
              {discountMessage && <p className="text-xs text-green-600 mt-2 font-medium">{discountMessage}</p>}
              {discountError && <p className="text-xs text-red-500 mt-2">{discountError}</p>}
            </div>

            {/* Payment Form (Simulated Yoco Inline) */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-4 border-t border-silver-100">
               <div className="flex items-center gap-2 mb-2">
                  <CreditCardIcon className="w-5 h-5 text-brand" />
                  <span className="font-bold text-slate-800">Card Details</span>
               </div>
               
               {/* This simulates where the Yoco SDK Iframe would be */}
               <div className="space-y-3">
                 <div>
                   <label className="block text-xs text-silver-500 mb-1">Card Number</label>
                   <input 
                     type="text" 
                     placeholder="0000 0000 0000 0000"
                     required
                     className="w-full border border-silver-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-shadow"
                     value={cardNumber}
                     onChange={e => setCardNumber(e.target.value)}
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-silver-500 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        required
                        className="w-full border border-silver-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-silver-500 mb-1">CVC</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        required
                        className="w-full border border-silver-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                        value={cvc}
                        onChange={e => setCvc(e.target.value)}
                      />
                    </div>
                 </div>
               </div>

               <div className="pt-4">
                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-brand text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-dark transition-all shadow-lg hover:shadow-brand/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                   {loading ? (
                     <>Processing...</>
                   ) : (
                     <>Pay {isZAR ? 'R' : '$'}{finalPrice.toLocaleString()}</>
                   )}
                 </button>
                 <div className="mt-4 flex justify-center opacity-50 grayscale gap-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6" alt="Mastercard" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-6" alt="Visa" />
                    {/* Yoco logo simulation */}
                    <span className="text-xs font-bold text-slate-600 flex items-center">Powered by Yoco</span>
                 </div>
               </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
