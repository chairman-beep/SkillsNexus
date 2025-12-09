
import { VALID_REFERRAL_CODES } from '../constants';
import { ReferralCode } from '../types';

// Declare YocoSDK on window for TypeScript
declare global {
  interface Window {
    YocoSDK?: any;
  }
}

// ------------------------------------------------------------------
// YOCO CONFIGURATION
// Replace with your actual Yoco Public Key in production
// ------------------------------------------------------------------
const YOCO_PUBLIC_KEY = 'pk_test_ed360be6q5E9f2X94033'; // Test key provided by Yoco docs

export const initializeYoco = async (): Promise<any> => {
  if (typeof window.YocoSDK !== 'undefined') {
    return new window.YocoSDK({
      publicKey: YOCO_PUBLIC_KEY,
    });
  }
  return null;
};

export const validateReferralCode = (code: string): ReferralCode | null => {
  const normalized = code.trim().toUpperCase();
  const found = VALID_REFERRAL_CODES.find(rc => rc.code === normalized && rc.isActive);
  return found || null;
};

export const processPayment = async (amountInCents: number, currency: string, token: string, referralCode?: string) => {
  // SIMULATION: In a real app, you send the 'token' to your backend.
  // Your backend then calls Yoco API to charge the card.
  
  console.log(`Processing Payment: ${amountInCents / 100} ${currency}`);
  console.log(`Token: ${token}`);
  if (referralCode) console.log(`Referral Applied: ${referralCode}`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success
      resolve({
        id: 'ch_' + Math.random().toString(36).substr(2, 9),
        status: 'successful',
        amount: amountInCents,
        currency: currency
      });
    }, 2000);
  });
};
