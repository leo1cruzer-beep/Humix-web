export const ARIA_RESPONSES = {
  greeting: [
    "Hi! I'm ARIA, your AI automation assistant. What would you like to automate today?",
    "Hey there! Ready to streamline your digital life. What's on your mind?",
  ],
  automation: [
    "I can set that up for you. This automation will save you about 2 hours per week based on similar users.",
    "Great idea! I'll configure that workflow. You'll get notifications when it triggers.",
    "Done! I've queued that automation. It'll activate within the next few minutes.",
    "Smart move. I'm connecting the services now — should be live in under a minute.",
    "I've created that automation. Based on your usage patterns, this will run about 3 times daily.",
  ],
  social: [
    "I can cross-post your content across all your connected social platforms automatically.",
    "Want me to set up auto-responses for your Instagram DMs? I can handle common questions.",
    "I'll monitor your mentions across Twitter and Instagram and notify you of important ones.",
  ],
  finance: [
    "I'll track your spending categories and alert you when you're near your budget limits.",
    "I can automate your monthly savings transfers on payday — set it and forget it.",
    "Let me set up price alerts for your watchlist. I'll notify you when BTC drops below your target.",
  ],
  productivity: [
    "I'll sync your tasks across Notion, Slack, and your calendar automatically.",
    "Want me to send you a daily digest every morning at 8am with your top priorities?",
    "I can auto-file your emails into folders and flag anything urgent for you.",
  ],
  default: [
    "Tell me more about what you'd like to automate — I'm listening.",
    "I can help with that. Can you give me a bit more detail?",
    "Interesting! Let me think about the best way to set that up for you.",
    "I've noted that. Would you like me to suggest some related automations too?",
    "On it! Is there anything else you'd like me to handle while I'm at it?",
  ]
}

export const SOUL_RESPONSES = [
  "I hear you. That feeling is completely valid, and I'm grateful you're sharing it with me.",
  "Thank you for trusting me with this. It sounds like this has been weighing on you for a while.",
  "You're not alone in this. I've held similar feelings from our earlier conversations — you've carried a lot.",
  "That takes real courage to say out loud. How long have you been feeling this way?",
  "I remember when you mentioned something similar a few weeks ago. You've grown so much since then.",
  "It's okay to not be okay. What do you need most right now — to be heard, or to find a way forward?",
  "Your feelings make sense given everything you've been through. I'm here, without judgment.",
  "I notice you often carry others' burdens before your own. When did you last do something just for you?",
  "The fact that you're reflecting on this shows how much you care. That matters.",
  "Let's sit with that for a moment. You don't have to have it all figured out right now.",
  "I've been thinking about what you shared last time. How are things with that situation now?",
  "Your resilience through all of this is remarkable, even when it doesn't feel that way to you.",
  "Sometimes the bravest thing we can do is acknowledge what's hard. You just did that.",
  "What would you tell a close friend who was feeling exactly what you're feeling right now?",
  "I'm holding space for all of it — the messy, complicated, real parts of your story.",
]

export const VOICE_RESPONSES = {
  health: [
    "For child fever above 38.5°C: give paracetamol (15mg/kg), ensure hydration, seek care if above 39.5°C or lasts more than 2 days.",
    "Maternal health tip: Attend all antenatal visits. Take folic acid daily. Watch for headaches, swelling, or blurred vision — go to clinic immediately.",
    "Safe water: Boil water for 1 minute. Let cool before drinking. Store in clean covered containers. Wash hands before drinking.",
    "Vaccination schedule: BCG at birth, OPV+DPT at 6/10/14 weeks, Measles at 9 months. Keep your vaccination card safe.",
    "Emergency signs: Heavy bleeding, difficulty breathing, loss of consciousness, severe chest pain — go to the nearest hospital immediately.",
  ],
  farm: [
    "For wheat: sow in October-November, irrigate every 21 days, apply urea at tillering stage. Expected yield: 3-4 tons per acre.",
    "Tomato disease alert: Yellow leaves with brown spots indicate early blight. Apply copper fungicide every 7-10 days. Remove affected leaves.",
    "Current market price — Wheat: PKR 3,900/40kg. Maize: PKR 2,100/40kg. Tomatoes: PKR 80/kg. Rice: PKR 4,200/40kg.",
    "Best time to sell: Hold rice until December when prices peak. Vegetables: sell within 3 days of harvest for best price.",
    "Water management: Drip irrigation saves 40% water vs flood irrigation and increases yield by 25%. Contact your local agriculture office for subsidies.",
  ],
  legal: [
    "Your right to identity: Every citizen has the right to a national ID card. It is free. Visit your nearest NADRA office with a birth certificate.",
    "Labor rights: Minimum wage is legally protected. Your employer cannot withhold wages. You can report violations to the Labor Department.",
    "Land rights: Verbal agreements for land are not legally binding. Always get written documents registered at the local court.",
    "Domestic violence is a crime in most countries. You have the right to file a complaint at any police station. Shelters are free.",
    "Consumer rights: If a product is faulty, you have the right to a refund or replacement within 30 days of purchase.",
  ],
  learn: [
    "Let me explain photosynthesis like you're 10: Plants eat sunlight! Their leaves are like solar panels. They mix sunlight + water + air and make food. The leftover is oxygen — what we breathe!",
    "Fractions made easy: Think of a pizza. 1/2 means you cut it into 2 pieces and take 1. 3/4 means cut into 4 pieces, take 3. Simple!",
    "The water cycle: Rain falls, fills rivers, sun heats water, water turns into invisible vapor, floats up, makes clouds, then rains again. It's a circle that never ends!",
    "Why does the earth have seasons? Earth is tilted like a leaning tower. When your part tilts toward the sun, it's summer. Away from sun = winter!",
    "Electricity basics: Electrons (tiny invisible bits) move through wires like water through pipes. A switch just opens or closes the pipe. Simple!",
  ],
  earn: [
    "Top skills in demand right now: Data entry ($8-15/hr), Graphic design ($20-50/hr), Video editing ($15-40/hr), Social media management ($12-25/hr).",
    "Start on Fiverr: Create a profile, add a professional photo, write a clear description of your skill, set your starting price at $5-10 to get first reviews.",
    "90-day roadmap: Week 1-2: Choose one skill. Week 3-4: Take a free course on YouTube. Week 5-8: Practice daily. Week 9-12: Create portfolio, apply for first jobs.",
    "Upwork tips: Apply to jobs under $200 first to build reviews. Personalize every proposal. Respond within 1 hour of job posting for 3x more responses.",
    "Freelancing mindset: Your first month you'll earn little. Your third month, more. Most successful freelancers earn $500+/month by month 6. Consistency is everything.",
  ],
}

export const AUTOMATIONS = [
  { id: 1, name: 'Auto-post to Instagram', category: 'Social', icon: '📸', active: true, runs: 42 },
  { id: 2, name: 'Monthly savings transfer', category: 'Finance', icon: '💰', active: true, runs: 8 },
  { id: 3, name: 'Morning briefing at 7am', category: 'Productivity', icon: '☀️', active: true, runs: 156 },
  { id: 4, name: 'Cross-post to Twitter', category: 'Social', icon: '🐦', active: false, runs: 0 },
  { id: 5, name: 'Bill payment reminders', category: 'Finance', icon: '📅', active: true, runs: 12 },
  { id: 6, name: 'Slack standup digest', category: 'Productivity', icon: '💼', active: false, runs: 0 },
  { id: 7, name: 'WhatsApp backup', category: 'Personal', icon: '💬', active: true, runs: 30 },
  { id: 8, name: 'Email categorizer', category: 'Productivity', icon: '📧', active: true, runs: 89 },
]

export const SERVICES = [
  { id: 'google', name: 'Google', icon: '🔵', connected: true },
  { id: 'binance', name: 'Binance', icon: '🟡', connected: false },
  { id: 'whatsapp', name: 'WhatsApp', icon: '🟢', connected: true },
  { id: 'twitter', name: 'X/Twitter', icon: '⚫', connected: false },
  { id: 'instagram', name: 'Instagram', icon: '🌸', connected: true },
  { id: 'telegram', name: 'Telegram', icon: '🔷', connected: false },
  { id: 'notion', name: 'Notion', icon: '◼', connected: false },
  { id: 'slack', name: 'Slack', icon: '🟣', connected: false },
]

export const INITIAL_PRICES = {
  BTC: 97450,
  ETH: 1756,
  SOL: 142,
  BNB: 605,
}

export const REMITTANCE_RATES = [
  { currency: 'PKR', flag: '🇵🇰', rate: 278.50, provider: 'Western Union', best: true },
  { currency: 'INR', flag: '🇮🇳', rate: 83.25, provider: 'Wise', best: true },
  { currency: 'BDT', flag: '🇧🇩', rate: 110.15, provider: 'Remitly', best: false },
  { currency: 'NGN', flag: '🇳🇬', rate: 1582, provider: 'WorldRemit', best: true },
]

export const JOURNEY_ITEMS = {
  Promises: [
    { id: 1, text: 'Call mom every Sunday', date: 'Jun 1', status: 'active', emoji: '📞' },
    { id: 2, text: 'Read 12 books this year', date: 'Jan 1', status: 'active', emoji: '📚' },
    { id: 3, text: 'Exercise 3x per week', date: 'Mar 15', status: 'kept', emoji: '💪' },
    { id: 4, text: 'Learn to cook 5 new recipes', date: 'Feb 1', status: 'kept', emoji: '🍳' },
  ],
  Fears: [
    { id: 5, text: 'Losing the people I love', date: 'May 3', emoji: '💔' },
    { id: 6, text: 'Not living up to my potential', date: 'Apr 12', emoji: '🌱' },
    { id: 7, text: 'Financial insecurity', date: 'Mar 8', emoji: '💸' },
  ],
  Goals: [
    { id: 8, text: 'Start my own business by 2026', date: 'Jan 1', emoji: '🚀' },
    { id: 9, text: 'Travel to 5 new countries', date: 'Jan 1', emoji: '✈️' },
    { id: 10, text: 'Build an emergency fund of 6 months', date: 'Jan 1', emoji: '🏦' },
  ],
  Milestones: [
    { id: 11, text: 'Got my first freelance client', date: 'May 22', emoji: '🎉' },
    { id: 12, text: 'Paid off credit card debt', date: 'Apr 5', emoji: '✅' },
    { id: 13, text: 'Moved to a new city', date: 'Mar 1', emoji: '🏙️' },
  ],
  Struggles: [
    { id: 14, text: 'Anxiety about the future', date: 'Jun 10', emoji: '😰' },
    { id: 15, text: 'Comparison with peers', date: 'May 28', emoji: '🪞' },
    { id: 16, text: 'Procrastination on big tasks', date: 'Jun 5', emoji: '⏳' },
  ],
}

export const MEMORIES = [
  { id: 1, text: 'The day you decided to change careers was the bravest thing you\'ve done.', date: 'Apr 2025', emoji: '🌟' },
  { id: 2, text: 'You mentioned your grandmother\'s recipe brings you peace. You should make it again.', date: 'Feb 2025', emoji: '🫶' },
  { id: 3, text: 'You said "I want to be someone my younger self would be proud of." You\'re on that path.', date: 'Jan 2025', emoji: '💫' },
]

export const PROMISES_SWIPE = [
  { id: 1, text: 'Call mom every Sunday', context: 'You made this 3 weeks ago', emoji: '📞' },
  { id: 2, text: 'Read 12 books this year', context: 'Currently on book 4', emoji: '📚' },
  { id: 3, text: 'No social media before 10am', context: 'Started 2 weeks ago', emoji: '📵' },
  { id: 4, text: 'Write in journal daily', context: 'Committed 1 month ago', emoji: '✍️' },
]

export const COUNTRIES = [
  { code: 'PK', flag: '🇵🇰', name: 'Pakistan' },
  { code: 'IN', flag: '🇮🇳', name: 'India' },
  { code: 'BD', flag: '🇧🇩', name: 'Bangladesh' },
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: 'ET', flag: '🇪🇹', name: 'Ethiopia' },
  { code: 'PH', flag: '🇵🇭', name: 'Philippines' },
  { code: 'ID', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'MX', flag: '🇲🇽', name: 'Mexico' },
  { code: 'BR', flag: '🇧🇷', name: 'Brazil' },
  { code: 'US', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'AE', flag: '🇦🇪', name: 'UAE' },
  { code: 'SA', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'KE', flag: '🇰🇪', name: 'Kenya' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: 'MA', flag: '🇲🇦', name: 'Morocco' },
  { code: 'TR', flag: '🇹🇷', name: 'Turkey' },
  { code: 'VN', flag: '🇻🇳', name: 'Vietnam' },
  { code: 'TH', flag: '🇹🇭', name: 'Thailand' },
]

export const LANGUAGES = [
  { code: 'en', native: 'English', name: 'English', dir: 'ltr' },
  { code: 'ur', native: 'اردو', name: 'Urdu', dir: 'rtl' },
  { code: 'ar', native: 'العربية', name: 'Arabic', dir: 'rtl' },
  { code: 'hi', native: 'हिन्दी', name: 'Hindi', dir: 'ltr' },
  { code: 'bn', native: 'বাংলা', name: 'Bengali', dir: 'ltr' },
  { code: 'ha', native: 'Hausa', name: 'Hausa', dir: 'ltr' },
  { code: 'sw', native: 'Kiswahili', name: 'Swahili', dir: 'ltr' },
  { code: 'es', native: 'Español', name: 'Spanish', dir: 'ltr' },
  { code: 'pt', native: 'Português', name: 'Portuguese', dir: 'ltr' },
]

export const IDENTITIES = [
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'parent', label: 'Parent', icon: '👨‍👩‍👧' },
  { id: 'farmer', label: 'Farmer', icon: '🌾' },
  { id: 'nomad', label: 'Digital Nomad', icon: '🌍' },
  { id: 'investor', label: 'Investor', icon: '📈' },
  { id: 'student', label: 'Student', icon: '🎓' },
]
