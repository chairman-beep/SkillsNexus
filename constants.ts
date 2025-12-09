
import { Course, PricingTier, ReferralCode } from './types';

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Silver Intelligence: AI Masterclass',
    partnerName: 'JM Dev.co.za',
    description: 'The complete blueprint for professionals 35+ to leverage AI without coding.',
    progress: 12,
    xp: 2500,
    levelRequired: 1,
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: AI Foundations Made Simple',
        description: 'Demystifying technology without the jargon.',
        lessons: [
          { 
            id: 'l1', 
            title: 'Demystifying AI: What It Really Means for Your Career', 
            duration: '15 min', 
            isLocked: false, 
            type: 'video',
            videoUrl: 'https://share.synthesia.io/f23236d2-fef5-4a37-b6e1-5d3c1cff43f9',
            transcript: 'Welcome to Module 1. In this video, we break down AI into simple terms...'
          },
          { id: 'l2', title: 'AI History Without the Hype', duration: '18 min', isLocked: true, type: 'video' },
          { id: 'l3', title: 'Key Concepts Explained (ML, NLP) in Plain English', duration: '20 min', isLocked: true, type: 'video' },
          { id: 'l4', title: 'Practical: Self-assessment of AI opportunities', duration: '30 min', isLocked: true, type: 'practical' },
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Everyday AI Tools',
        description: 'Immediate productivity gains for professionals.',
        lessons: [
          { id: 'l5', title: 'Mastering ChatGPT for Professional Writing', duration: '22 min', isLocked: true, type: 'video' },
          { id: 'l6', title: 'AI-Powered Research: Beyond Google Search', duration: '15 min', isLocked: true, type: 'video' },
          { id: 'l7', title: 'Automating Repetitive Tasks', duration: '25 min', isLocked: true, type: 'video' },
          { id: 'l8', title: 'Practical: Create your AI productivity toolkit', duration: '45 min', isLocked: true, type: 'practical' },
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: Visual & Creative AI Applications',
        description: 'Enhancing presentations and visual assets.',
        lessons: [
          { id: 'l9', title: 'Image Generation with Midjourney for Business', duration: '20 min', isLocked: true, type: 'video' },
          { id: 'l10', title: 'Video Creation & Editing with AI Tools', duration: '18 min', isLocked: true, type: 'video' },
          { id: 'l11', title: 'AI-Enhanced Presentations', duration: '20 min', isLocked: true, type: 'video' },
        ]
      },
      {
        id: 'm4',
        title: 'Module 4: AI for Career Advancement',
        description: 'Future-proofing your professional journey.',
        lessons: [
          { id: 'l12', title: 'AI-Assisted Skill Development', duration: '15 min', isLocked: true, type: 'video' },
          { id: 'l13', title: 'Optimizing Your Resume & LinkedIn with AI', duration: '25 min', isLocked: true, type: 'video' },
          { id: 'l14', title: 'AI in Interview Preparation', duration: '20 min', isLocked: true, type: 'video' },
        ]
      },
      {
        id: 'm5',
        title: 'Module 5: Industry-Specific Applications',
        description: 'Tailored strategies for your sector.',
        lessons: [
          { id: 'l15', title: 'AI for Marketing & Sales', duration: '20 min', isLocked: true, type: 'video' },
          { id: 'l16', title: 'AI for Managers & Team Leaders', duration: '20 min', isLocked: true, type: 'video' },
          { id: 'l17', title: 'AI for Consultants', duration: '20 min', isLocked: true, type: 'video' },
        ]
      },
      {
        id: 'm6',
        title: 'Module 6: Future-Proofing & Ethics',
        description: 'Navigating the changing landscape responsibly.',
        lessons: [
          { id: 'l18', title: 'Navigating AI Ethics', duration: '15 min', isLocked: true, type: 'video' },
          { id: 'l19', title: 'Identifying AI Opportunities', duration: '15 min', isLocked: true, type: 'video' },
          { id: 'l20', title: 'Practical: 12-month AI integration roadmap', duration: '60 min', isLocked: true, type: 'practical' },
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Advanced Data Strategy',
    partnerName: 'JM Dev.co.za',
    description: 'Deep dive into data analytics and backend integration for managers.',
    progress: 0,
    xp: 5000,
    levelRequired: 5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    modules: []
  },
  {
    id: 'c3',
    title: 'Circular Economy & Recycling Systems',
    partnerName: 'EcoXpand.co.za',
    description: 'Leading courses in recycling, waste-to-value systems, and sustainable expansion strategies.',
    progress: 0,
    xp: 3500,
    levelRequired: 2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    modules: []
  },
  {
    id: 'c4',
    title: 'Strategic Brand Innovation',
    partnerName: 'R&D Marketing',
    description: 'Using AI to revolutionize brand storytelling and market penetration.',
    progress: 0,
    xp: 4200,
    levelRequired: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    modules: []
  },
  {
    id: 'c5',
    title: 'Ubuntu-led Digital Transformation',
    partnerName: 'thedccsa.org',
    description: 'Business Leadership and Social Entrepreneurship for Community GDP and MSME Growth.',
    progress: 0,
    xp: 6000,
    levelRequired: 1,
    thumbnailUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    modules: [
      {
        id: 'm1_ub',
        title: 'Module 1: The DNA of SA Social Entrepreneurship',
        description: 'IKS as a Business Asset and Ubuntu philosophy.',
        lessons: [
          { 
            id: 'l1_ub', 
            title: 'IKS as a Business Asset: Ubuntu in Business', 
            duration: '20 min', 
            isLocked: false, 
            type: 'video', 
            videoUrl: 'https://share.synthesia.io/3e7f0e4f-f3c2-4398-afbd-f2016e088a44',
            transcript: 'In this module, we explore how traditional African philosophy can drive modern business success...'
          },
          { id: 'l2_ub', title: 'Traditional Knowledge in Modern Economy', duration: '25 min', isLocked: true, type: 'video' },
          { id: 'l3_ub', title: 'Practical: Develop Community-Centric Business Thesis', duration: '45 min', isLocked: true, type: 'practical' }
        ]
      },
      {
        id: 'm2_ub',
        title: 'Module 2: Identifying Market Needs',
        description: 'Unemployment Landscape and Community Needs.',
        lessons: [
          { id: 'l4_ub', title: 'Community Needs Assessment Tools', duration: '30 min', isLocked: true, type: 'video' },
          { id: 'l5_ub', title: 'Mapping Local Skills & Resources', duration: '25 min', isLocked: true, type: 'video' },
          { id: 'l6_ub', title: 'Practical: Community Asset Mapping', duration: '60 min', isLocked: true, type: 'practical' }
        ]
      },
      {
        id: 'm3_ub',
        title: 'Module 3: Principles of Sustainable Social Enterprise',
        description: 'Profit, Impact, and Legal Structures.',
        lessons: [
          { id: 'l7_ub', title: 'The Double Bottom Line (Profit and Impact)', duration: '20 min', isLocked: true, type: 'video' },
          { id: 'l8_ub', title: 'Legal Structures & SROI in SA', duration: '25 min', isLocked: true, type: 'video' },
          { id: 'l9_ub', title: 'Practical: Create Social Impact Mandate', duration: '45 min', isLocked: true, type: 'practical' }
        ]
      },
      {
        id: 'm4_ub',
        title: 'Module 4: Business Leadership in a Volatile Market',
        description: 'Ethical Leadership and Strategic Planning.',
        lessons: [
          { id: 'l10_ub', title: 'Ethical Leadership & Governance for MSMEs', duration: '25 min', isLocked: true, type: 'video' },
          { id: 'l11_ub', title: 'Strategic Planning in High-Unemployment Contexts', duration: '30 min', isLocked: true, type: 'video' },
          { id: 'l12_ub', title: 'Practical: Mentorship Model Design', duration: '40 min', isLocked: true, type: 'practical' }
        ]
      },
      {
        id: 'm5_ub',
        title: 'Module 5: Financial Management and Access to Capital',
        description: 'Budgeting, Funding, and Investor Readiness.',
        lessons: [
          { id: 'l13_ub', title: 'MSME Finance Fundamentals', duration: '35 min', isLocked: true, type: 'video' },
          { id: 'l14_ub', title: 'Alternative Funding Models (CSI, Crowdfunding)', duration: '30 min', isLocked: true, type: 'video' },
          { id: 'l15_ub', title: 'Practical: 3-Year Financial Projection', duration: '90 min', isLocked: true, type: 'practical' }
        ]
      },
      {
        id: 'm6_ub',
        title: 'Module 6: Market Strategy and Value Chain Integration',
        description: 'Local Market Penetration and Branding.',
        lessons: [
          { id: 'l16_ub', title: 'Local Market Penetration & Value Proposition', duration: '25 min', isLocked: true, type: 'video' },
          { id: 'l17_ub', title: 'Branding & Competitive Analysis', duration: '25 min', isLocked: true, type: 'video' },
          { id: 'l18_ub', title: 'Practical: Marketing and Sales Strategy', duration: '60 min', isLocked: true, type: 'practical' }
        ]
      },
      {
        id: 'm7_ub',
        title: 'Module 7: Digital Transformation for the MSME',
        description: 'Foundational Digital Tools and 4IR.',
        lessons: [
          { id: 'l19_ub', title: 'Foundational Digital Tools (Cloud, Accounting)', duration: '30 min', isLocked: true, type: 'video' },
          { id: 'l20_ub', title: 'Understanding 4IR for Small Business', duration: '20 min', isLocked: true, type: 'video' },
          { id: 'l21_ub', title: 'Practical: Setup Digital Productivity Suite', duration: '45 min', isLocked: true, type: 'practical' }
        ]
      },
      {
        id: 'm8_ub',
        title: 'Module 8: E-Commerce and Digital Market Access',
        description: 'Online Presence and Digital Marketing.',
        lessons: [
          { id: 'l22_ub', title: 'Building an Affordable E-Commerce Platform', duration: '40 min', isLocked: true, type: 'video' },
          { id: 'l23_ub', title: 'Digital Marketing & SEO Fundamentals', duration: '35 min', isLocked: true, type: 'video' },
          { id: 'l24_ub', title: 'Practical: Launch E-Commerce Draft', duration: '90 min', isLocked: true, type: 'practical' }
        ]
      },
      {
        id: 'm9_ub',
        title: 'Module 9: Scaling, Job Creation, and Community GDP',
        description: 'Operational Scaling and Economic Impact.',
        lessons: [
          { id: 'l25_ub', title: 'Operational Scaling Strategies', duration: '30 min', isLocked: true, type: 'video' },
          { id: 'l26_ub', title: 'Measuring Community GDP Impact', duration: '25 min', isLocked: true, type: 'video' },
          { id: 'l27_ub', title: 'Practical: Growth and Scaling Plan', duration: '60 min', isLocked: true, type: 'practical' }
        ]
      },
      {
        id: 'm10_ub',
        title: 'Module 10: Pitch and Sustainability Road-Map (Capstone)',
        description: 'Refining Plans and Pitching.',
        lessons: [
          { id: 'l28_ub', title: 'Refining the Business Plan', duration: '45 min', isLocked: true, type: 'video' },
          { id: 'l29_ub', title: 'Pitching to Investors', duration: '45 min', isLocked: true, type: 'video' },
          { id: 'l30_ub', title: 'Practical: Final Sustainability Road-Map', duration: '120 min', isLocked: true, type: 'practical' }
        ]
      }
    ]
  }
];

export const PARTNER_DESCRIPTIONS: Record<string, string> = {
  'thedccsa.org': 'The Digital Content Chamber of SA. Empowering professionals through digital literacy and AI adoption.',
  'JM Dev.co.za': 'Leading software development house specializing in enterprise systems and data architecture.',
  'EcoXpand.co.za': 'Pioneers in sustainable expansion strategies, recycling systems, and green-tech implementation.',
  'R&D Marketing': 'A research-driven marketing agency focusing on data-backed creative strategies.'
};

export const LEARNING_PERSONAS = [
  {
    id: 'social_impact',
    title: 'Social Impact Innovator',
    description: 'You want to build sustainable businesses, solve community problems, and lead with Ubuntu values.',
    partners: ['thedccsa.org', 'R&D Marketing', 'EcoXpand.co.za'],
    icon: '🌱'
  },
  {
    id: 'tech_visionary',
    title: 'Tech Visionary',
    description: 'You want to master AI tools, data strategy, and build scalable digital systems for the future.',
    partners: ['JM Dev.co.za'],
    icon: '🚀'
  }
];

export const PROVINCE_DATA: any[] = []; 
export const SA_CHAPTERS = ['Cape Town Innovation Hub', 'Jozi Digital Exchange', 'Durban Coastal Node', 'Gqeberha Tech Port'];

export const VALID_REFERRAL_CODES: ReferralCode[] = [
  { code: 'JMDEV20', discountPercent: 20, assignedBy: 'JM Dev', isActive: true },
  { code: 'DCCSA15', discountPercent: 15, assignedBy: 'The DCC', isActive: true },
  { code: 'EARLYBIRD', discountPercent: 10, assignedBy: 'System', isActive: true },
  { code: 'ADMIN100', discountPercent: 100, assignedBy: 'Admin', isActive: true },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic_tier',
    name: 'Basic',
    priceZAR: 1997,
    priceUSD: 147,
    features: ['Self-paced course access', 'Downloadable resources', 'Lifetime access to updates', 'Certificate of Completion'],
    cta: 'Start Learning',
    isRecommended: false
  },
  {
    id: 'premium_tier',
    name: 'Premium',
    priceZAR: 3997,
    priceUSD: 297,
    features: ['Everything in Basic', 'Bi-weekly live Q&A sessions', 'Private Community Access', 'Exclusive Case Studies'],
    cta: 'Join the Community',
    isRecommended: true
  },
  {
    id: 'elite_tier',
    name: 'Elite',
    priceZAR: 7997,
    priceUSD: 597,
    features: ['Everything in Premium', '1:1 Implementation Coaching', 'Personalized Roadmap Review', 'Accredited Executive Certification'],
    cta: 'Apply for Elite',
    isRecommended: false
  }
];

export const TESTIMONIALS = [
  {
    name: "Thabo Mokoena",
    role: "Marketing Director, Sandton",
    quote: "In the fast-paced financial district, falling behind isn't an option. This course helped me automate our reporting workflows without needing to hire a developer. It's tailored perfectly for the SA market context.",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Sarah Van Der Merwe",
    role: "Operations Manager, Cape Town",
    quote: "I was skeptical about AI, fearing it would replace my team. SkillsNexus taught me how to use it to empower them instead. The load shedding productivity hacks using offline AI tools were a game changer!",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Priya Naidoo",
    role: "SME Owner, Durban",
    quote: "Running a logistics business in KZN comes with challenges. This course gave me practical tools to optimize my routes and customer service instantly. Real ROI in Rands, not just theory.",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const TRENDY_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWc1bnd4dG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG4x/l0HlHFRbmaZtBRhXG/giphy.gif", // Success
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWc1bnd4dG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG4x/xT5LMHxhOfscxPfIfm/giphy.gif", // Mind blown
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWc1bnd4dG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG4x/d31vTpVi1LAcDvdm/giphy.gif", // Coding
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWc1bnd4dG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG41eDN5d3Y5eGx5eG4x/26u4lOMA8JKSnL9Uk/giphy.gif"  // High five
];
