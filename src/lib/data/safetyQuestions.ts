// src/lib/data/safetyQuestions.ts

export interface Answer {
  text: string;
  correct: boolean;
  explanation?: string;
}

export interface SafetyQuestion {
  id: string;
  category: 'online' | 'street' | 'home' | 'travel' | 'general';
  question: string;
  answers: Answer[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export const safetyQuestions: SafetyQuestion[] = [
  // ====================== ONLINE SAFETY ======================
  {
    id: "q1",
    category: "online",
    question: "You receive a message from someone you just met online asking for your home address. What should you do?",
    answers: [
      { text: "Send it — they seem really nice", correct: false },
      { text: "Share it only after video calling them", correct: false },
      { text: "Never share your address with someone you met online", correct: true, explanation: "Never give personal address to new online contacts. Wait until you know someone well in real life." },
      { text: "Give a fake address to test them", correct: false }
    ],
    difficulty: "easy",
    tags: ["personal-info", "dating-apps"]
  },
  {
    id: "q2",
    category: "online",
    question: "A stranger online offers you money or gifts if you send them intimate photos. You should:",
    answers: [
      { text: "Send them — it's easy money", correct: false },
      { text: "Block and report the account immediately", correct: true, explanation: "This is a common sextortion tactic. They will likely blackmail you afterward." },
      { text: "Ask for more money first", correct: false },
      { text: "Agree but use fake photos", correct: false }
    ],
    difficulty: "medium",
    tags: ["sextortion", "scams"]
  },
  {
    id: "q3",
    category: "online",
    question: "You get an email saying your bank account is locked and you need to click a link to verify. What do you do?",
    answers: [
      { text: "Click the link and enter your details", correct: false },
      { text: "Call your bank using the number on their official website", correct: true, explanation: "Never click links in suspicious emails. Always contact banks through official channels." },
      { text: "Reply to the email asking if it's real", correct: false },
      { text: "Forward it to all your contacts to warn them", correct: false }
    ],
    difficulty: "easy",
    tags: ["phishing", "scams"]
  },
  {
    id: "q4",
    category: "online",
    question: "A dating app match wants to move the conversation to WhatsApp immediately. This is:",
    answers: [
      { text: "A great sign they really like you", correct: false },
      { text: "A red flag — they may be trying to get your phone number quickly", correct: true, explanation: "Scammers often try to move off-platform quickly to avoid detection and get personal info." },
      { text: "Normal behavior everyone does", correct: false },
      { text: "Required by the app's terms", correct: false }
    ],
    difficulty: "medium",
    tags: ["dating-apps", "privacy"]
  },
  {
    id: "q5",
    category: "online",
    question: "Your friend sends a message saying they're stranded abroad and need money wired urgently. You should:",
    answers: [
      { text: "Send money immediately — they're your friend", correct: false },
      { text: "Call them on a known number to verify it's really them", correct: true, explanation: "Hackers often compromise accounts and message friends. Always verify through another channel." },
      { text: "Reply to the message asking for proof", correct: false },
      { text: "Post on social media asking if others got the message", correct: false }
    ],
    difficulty: "medium",
    tags: ["hacking", "scams"]
  },
  {
    id: "q6",
    category: "online",
    question: "When creating passwords, the best practice is:",
    answers: [
      { text: "Use the same strong password everywhere", correct: false },
      { text: "Use unique passwords and enable two-factor authentication", correct: true, explanation: "Unique passwords prevent one breach from compromising all accounts. 2FA adds crucial protection." },
      { text: "Change passwords weekly", correct: false },
      { text: "Use simple passwords you can remember easily", correct: false }
    ],
    difficulty: "easy",
    tags: ["passwords", "security"]
  },
  {
    id: "q7",
    category: "online",
    question: "Someone you've been talking to online for months finally wants to meet, but only in a private location. You should:",
    answers: [
      { text: "Agree — you trust them after all this time", correct: false },
      { text: "Insist on a public place and tell someone where you're going", correct: true, explanation: "Always meet online contacts in public first, tell friends your plans, and have an exit strategy." },
      { text: "Bring a weapon for protection", correct: false },
      { text: "Video call them instead and postpone the meeting", correct: false }
    ],
    difficulty: "medium",
    tags: ["dating-apps", "meetups"]
  },
  {
    id: "q8",
    category: "online",
    question: "You receive a friend request from someone with no mutual friends but an attractive profile photo. You should:",
    answers: [
      { text: "Accept — they might be interesting", correct: false },
      { text: "Check if the photo appears elsewhere online and be cautious", correct: true, explanation: "Fake profiles often use stolen photos. Reverse image search can reveal catfish attempts." },
      { text: "Accept and immediately share personal info to be friendly", correct: false },
      { text: "Report them without checking — better safe than sorry", correct: false }
    ],
    difficulty: "medium",
    tags: ["catfishing", "social-media"]
  },

  // ====================== STREET SAFETY ======================
  {
    id: "q9",
    category: "street",
    question: "You notice someone following you while walking at night. The best immediate action is:",
    answers: [
      { text: "Confront them angrily", correct: false },
      { text: "Go into the nearest open shop, cafe, or well-lit area", correct: true, explanation: "Public places with people are safest. Trust your instincts and seek safety in numbers." },
      { text: "Run as fast as you can", correct: false },
      { text: "Ignore them completely", correct: false }
    ],
    difficulty: "medium",
    tags: ["night-safety", "awareness"]
  },
  {
    id: "q10",
    category: "street",
    question: "When using public transport at night, where is the safest place to sit?",
    answers: [
      { text: "At the back where it's quiet", correct: false },
      { text: "Near the driver or conductor", correct: true, explanation: "Being close to authority figures increases safety and makes it easier to get help if needed." },
      { text: "Next to the emergency exit", correct: false },
      { text: "Anywhere, it doesn't matter", correct: false }
    ],
    difficulty: "easy",
    tags: ["transport", "night-safety"]
  },
  {
    id: "q11",
    category: "street",
    question: "You're walking alone and a car pulls up asking for directions. The safest response is:",
    answers: [
      { text: "Approach the car window to hear them better", correct: false },
      { text: "Stay at least 6 feet away and keep walking if uncomfortable", correct: true, explanation: "Never approach unknown vehicles. Maintain distance and trust your instincts if something feels off." },
      { text: "Get in to show them the way personally", correct: false },
      { text: "Turn your back to check your phone for directions", correct: false }
    ],
    difficulty: "easy",
    tags: ["awareness", "boundaries"]
  },
  {
    id: "q12",
    category: "street",
    question: "You realize your phone is dead while walking in an unfamiliar area at night. Best action:",
    answers: [
      { text: "Ask the first person you see to use their phone", correct: false },
      { text: "Enter the nearest open business to charge it or ask for help", correct: true, explanation: "Established businesses are safer than approaching random individuals when vulnerable." },
      { text: "Keep walking until you find a dark quiet spot to figure things out", correct: false },
      { text: "Sit on the sidewalk and wait for someone to offer help", correct: false }
    ],
    difficulty: "medium",
    tags: ["preparedness", "night-safety"]
  },
  {
    id: "q13",
    category: "street",
    question: "Someone grabs your bag and runs. You should:",
    answers: [
      { text: "Chase them immediately", correct: false },
      { text: "Let go and note their description, direction, and call police", correct: true, explanation: "No possession is worth your safety. Be a good witness rather than risking injury." },
      { text: "Scream but stay frozen in place", correct: false },
      { text: "Tackle them to get your bag back", correct: false }
    ],
    difficulty: "easy",
    tags: ["theft", "response"]
  },
  {
    id: "q14",
    category: "street",
    question: "You're being harassed on the street by a group. Best response:",
    answers: [
      { text: "Yell insults back to show you're not scared", correct: false },
      { text: "Cross the street, enter a business, or approach a security guard", correct: true, explanation: "De-escalation and removing yourself from the situation is safer than confrontation." },
      { text: "Stop and record them for social media", correct: false },
      { text: "Challenge the leader to a one-on-one", correct: false }
    ],
    difficulty: "medium",
    tags: ["harassment", "de-escalation"]
  },
  {
    id: "q15",
    category: "street",
    question: "While jogging, you notice the same car has passed you three times. You should:",
    answers: [
      { text: "Wave to show you noticed them", correct: false },
      { text: "Change your route and head toward a populated area", correct: true, explanation: "Pattern recognition is key. Vary your routine and move toward safety when you feel watched." },
      { text: "Confront the driver at the next intersection", correct: false },
      { text: "Put in headphones and ignore it", correct: false }
    ],
    difficulty: "medium",
    tags: ["awareness", "exercise-safety"]
  },
  {
    id: "q16",
    category: "street",
    question: "You're waiting for a rideshare and a car pulls up claiming to be your driver. Safest action:",
    answers: [
      { text: "Get in if they know your name", correct: false },
      { text: "Verify the license plate, car model, and driver photo in the app before entering", correct: true, explanation: "Always confirm all details match the app. Ask 'Who are you here for?' rather than giving your name first." },
      { text: "Ask them to roll down the window and show ID", correct: false },
      { text: "Wave them on and order another ride", correct: false }
    ],
    difficulty: "easy",
    tags: ["rideshare", "verification"]
  },

  // ====================== HOME SAFETY ======================
  {
    id: "q17",
    category: "home",
    question: "You're home alone and someone knocks claiming to be from a delivery service but you didn't order anything. You should:",
    answers: [
      { text: "Open the door to check", correct: false },
      { text: "Ask them to leave the package outside and watch through the window", correct: true, explanation: "Verify through a window or peephole. If suspicious, don't open the door and call the company." },
      { text: "Tell them to come back later", correct: false },
      { text: "Invite them in to wait while you check", correct: false }
    ],
    difficulty: "medium",
    tags: ["home-safety", "strangers"]
  },
  {
    id: "q18",
    category: "home",
    question: "You smell gas in your home. Immediate action:",
    answers: [
      { text: "Light a candle to find the source", correct: false },
      { text: "Open windows, don't use switches, and evacuate to call for help", correct: true, explanation: "Never create sparks near gas leaks. Ventilate, evacuate, and call emergency services from outside." },
      { text: "Turn on all lights to inspect the stove", correct: false },
      { text: "Spray air freshener to mask the smell", correct: false }
    ],
    difficulty: "easy",
    tags: ["emergency", "gas-leak"]
  },
  {
    id: "q19",
    category: "home",
    question: "You're leaving for a two-week vacation. Best security practice:",
    answers: [
      { text: "Post about your trip on social media to show you're away", correct: false },
      { text: "Ask a trusted neighbor to collect mail and vary lights with timers", correct: true, explanation: "Make your home look occupied. Avoid advertising your absence online." },
      { text: "Leave a spare key under the doormat for emergencies", correct: false },
      { text: "Turn off all security systems to save electricity", correct: false }
    ],
    difficulty: "easy",
    tags: ["travel", "burglary-prevention"]
  },
  {
    id: "q20",
    category: "home",
    question: "You hear a window break downstairs at 2 AM. You should:",
    answers: [
      { text: "Go downstairs with a baseball bat to confront the intruder", correct: false },
      { text: "Lock your bedroom door, stay quiet, and call emergency services", correct: true, explanation: "Never confront intruders. Secure yourself, stay hidden, and let professionals handle it." },
      { text: "Yell 'I have a gun!' to scare them off", correct: false },
      { text: "Hide in the closet without calling for help", correct: false }
    ],
    difficulty: "medium",
    tags: ["burglary", "emergency-response"]
  },
  {
    id: "q21",
    category: "home",
    question: "Your smoke alarm goes off but you don't see fire. You should:",
    answers: [
      { text: "Disable it and go back to sleep — it's probably malfunctioning", correct: false },
      { text: "Evacuate immediately and investigate from outside", correct: true, explanation: "Smoke alarms detect danger before visible flames. Always treat activations as real emergencies." },
      { text: "Wave a towel at it to stop the noise", correct: false },
      { text: "Check each room slowly while staying inside", correct: false }
    ],
    difficulty: "easy",
    tags: ["fire-safety", "emergency"]
  },
  {
    id: "q22",
    category: "home",
    question: "A repair person arrives unannounced saying your neighbor called about a leak. You should:",
    answers: [
      { text: "Let them in immediately — leaks are urgent", correct: false },
      { text: "Verify with your neighbor and the company before allowing entry", correct: true, explanation: "Scammers pose as utility workers. Always verify unexpected visitors through independent channels." },
      { text: "Watch them work but stay silent", correct: false },
      { text: "Ask to see their ID and let them in if it looks official", correct: false }
    ],
    difficulty: "medium",
    tags: ["scams", "home-security"]
  },
  {
    id: "q23",
    category: "home",
    question: "You're doing laundry and the dryer suddenly smells like burning. Action:",
    answers: [
      { text: "Add fabric softener sheets to mask the smell", correct: false },
      { text: "Turn off and unplug the dryer immediately, then evacuate if smoke appears", correct: true, explanation: "Burning smells from appliances indicate fire risk. Cut power and prepare to leave." },
      { text: "Open the dryer door to air it out", correct: false },
      { text: "Continue the cycle — it's probably just lint", correct: false }
    ],
    difficulty: "easy",
    tags: ["fire-prevention", "appliances"]
  },
  {
    id: "q24",
    category: "home",
    question: "You live alone and want to feel safer. Best long-term investment:",
    answers: [
      { text: "Buy a guard dog", correct: false },
      { text: "Install smart locks, cameras, and a monitored alarm system", correct: true, explanation: "Layered security with professional monitoring provides the most reliable protection." },
      { text: "Put up 'Beware of Dog' signs without a dog", correct: false },
      { text: "Keep a weapon under your pillow", correct: false }
    ],
    difficulty: "medium",
    tags: ["home-security", "prevention"]
  },

  // ====================== TRAVEL SAFETY ======================
  {
    id: "q25",
    category: "travel",
    question: "Your taxi driver is taking a route that doesn't match your map app. You should:",
    answers: [
      { text: "Stay quiet to avoid offending them", correct: false },
      { text: "Ask why they're going this way and share your live location with a friend", correct: true, explanation: "Speak up about concerns and ensure someone knows where you are in real-time." },
      { text: "Jump out at the next red light", correct: false },
      { text: "Grab the steering wheel to correct the route", correct: false }
    ],
    difficulty: "medium",
    tags: ["taxis", "navigation"]
  },
  {
    id: "q26",
    category: "travel",
    question: "At a hotel, you receive a call from 'front desk' asking to confirm your credit card. You should:",
    answers: [
      { text: "Provide the number — they're just doing their job", correct: false },
      { text: "Hang up and call the front desk directly from the hotel phone or known number", correct: true, explanation: "Scammers call hotel rooms pretending to be staff. Never give card info to incoming calls." },
      { text: "Ask them to come to your room so you can give it in person", correct: false },
      { text: "Give them a different card number to test if they're real", correct: false }
    ],
    difficulty: "medium",
    tags: ["hotels", "scams"]
  },
  {
    id: "q27",
    category: "travel",
    question: "You're in a foreign country and a 'police officer' asks for your passport and wallet. You should:",
    answers: [
      { text: "Hand them over immediately — they're authority", correct: false },
      { text: "Ask to see badge/ID and offer to go to the nearest police station together", correct: true, explanation: "Fake police scams are common. Real officers won't mind verification, scammers will flee." },
      { text: "Run away as fast as possible", correct: false },
      { text: "Give them your wallet but hide your passport", correct: false }
    ],
    difficulty: "hard",
    tags: ["scams", "abroad", "police"]
  },
  {
    id: "q28",
    category: "travel",
    question: "Your flight is cancelled and a 'helpful stranger' offers to book you a hotel at a discount. You should:",
    answers: [
      { text: "Accept — you need a room and they're being kind", correct: false },
      { text: "Book directly through official hotel websites or apps", correct: true, explanation: "Airport scams prey on stranded travelers. Only book through verified, official channels." },
      { text: "Ask to see their travel agent credentials", correct: false },
      { text: "Give them cash and your ID to book for you", correct: false }
    ],
    difficulty: "medium",
    tags: ["airports", "scams", "booking"]
  },
  {
    id: "q29",
    category: "travel",
    question: "You're backpacking and meet someone who offers to show you 'hidden local spots' alone at night. You should:",
    answers: [
      { text: "Go — authentic experiences require trust", correct: false },
      { text: "Suggest a daytime group tour instead and stay in public areas", correct: true, explanation: "Isolated locations with strangers are high-risk. Stick to public, populated areas with new contacts." },
      { text: "Go but text your mom the person's name", correct: false },
      { text: "Bring pepper spray and go cautiously", correct: false }
    ],
    difficulty: "medium",
    tags: ["abroad", "strangers", "night-safety"]
  },
  {
    id: "q30",
    category: "travel",
    question: "Your rental car breaks down on a remote road. Best action:",
    answers: [
      { text: "Accept the first ride that stops to help", correct: false },
      { text: "Stay in the locked car and call roadside assistance or emergency services", correct: true, explanation: "Remain in your vehicle with doors locked until verified help arrives. Call emergency services if no signal." },
      { text: "Walk to the nearest town for help", correct: false },
      { text: "Flag down a truck and ask to borrow their phone", correct: false }
    ],
    difficulty: "medium",
    tags: ["driving", "breakdown", "rural"]
  },
  {
    id: "q31",
    category: "travel",
    question: "At a busy tourist attraction, someone spills coffee on you and offers to help clean it. You should:",
    answers: [
      { text: "Let them help — accidents happen", correct: false },
      { text: "Secure your belongings and move away — this is a common distraction theft tactic", correct: true, explanation: "Distraction thefts use spills, petitions, or questions while accomplices steal. Secure valuables and move on." },
      { text: "Yell at them for being clumsy", correct: false },
      { text: "Accept their napkin but check your pockets after", correct: false }
    ],
    difficulty: "hard",
    tags: ["theft", "distraction", "tourists"]
  },
  {
    id: "q32",
    category: "travel",
    question: "You're swimming at a resort and notice a strong current pulling you out. You should:",
    answers: [
      { text: "Swim directly against the current toward shore", correct: false },
      { text: "Swim parallel to shore to escape the current, then angle in", correct: true, explanation: "Rip currents are stronger than swimmers. Swimming parallel is the only way to escape. Signal for help." },
      { text: "Float on your back and wait for rescue", correct: false },
      { text: "Dive under to find the bottom and walk back", correct: false }
    ],
    difficulty: "hard",
    tags: ["water-safety", "emergency"]
  },

  // ====================== GENERAL SAFETY ======================
  {
    id: "q33",
    category: "general",
    question: "You're at a party and your drink was unattended for 5 minutes. You should:",
    answers: [
      { text: "Drink it — that's wasteful otherwise", correct: false },
      { text: "Get a new drink — never consume unattended beverages", correct: true, explanation: "Drink spiking is common. If you lose sight of your drink, discard it and get a fresh one." },
      { text: "Smell it to check if anything was added", correct: false },
      { text: "Ask a friend to taste it first", correct: false }
    ],
    difficulty: "easy",
    tags: ["drink-spiking", "parties"]
  },
  {
    id: "q34",
    category: "general",
    question: "A friend seems intoxicated and wants to drive home. You should:",
    answers: [
      { text: "Let them — they're responsible for themselves", correct: false },
      { text: "Take their keys and arrange alternative transportation", correct: true, explanation: "Real friends prevent drunk driving. Be persistent — it's better to have an angry friend than a dead one." },
      { text: "Follow them home to make sure they get there", correct: false },
      { text: "Suggest they drink coffee first to sober up", correct: false }
    ],
    difficulty: "easy",
    tags: ["drunk-driving", "friends"]
  },
  {
    id: "q35",
    category: "general",
    question: "You witness a fight breaking out near you. Safest response:",
    answers: [
      { text: "Film it for social media evidence", correct: false },
      { text: "Move away immediately and call emergency services from a safe distance", correct: true, explanation: "Don't become a casualty. Remove yourself from danger, then alert authorities." },
      { text: "Try to break it up to help", correct: false },
      { text: "Yell 'Stop fighting!' from close range", correct: false }
    ],
    difficulty: "easy",
    tags: ["bystander", "violence"]
  },
  {
    id: "q36",
    category: "general",
    question: "Someone collapses in front of you and isn't breathing. First action:",
    answers: [
      { text: "Start CPR immediately", correct: false },
      { text: "Call emergency services and begin CPR if trained, or follow dispatcher instructions", correct: true, explanation: "Always call for help first. Emergency dispatchers can guide you through CPR if untrained." },
      { text: "Run to find a doctor in the area", correct: false },
      { text: "Splash water on their face to wake them", correct: false }
    ],
    difficulty: "medium",
    tags: ["medical-emergency", "cpr"]
  },
  {
    id: "q37",
    category: "general",
    question: "You're hiking and encounter a bear on the trail. You should:",
    answers: [
      { text: "Run downhill — bears are slow going downhill", correct: false },
      { text: "Back away slowly, speak calmly, and make yourself look bigger without turning your back", correct: true, explanation: "Never run from bears — it triggers chase instinct. Back away, don't play dead unless attacked." },
      { text: "Climb a tree immediately", correct: false },
      { text: "Take a selfie from a safe distance", correct: false }
    ],
    difficulty: "medium",
    tags: ["wildlife", "hiking"]
  },
  {
    id: "q38",
    category: "general",
    question: "You're in an elevator that gets stuck between floors. You should:",
    answers: [
      { text: "Pry the doors open and climb out", correct: false },
      { text: "Press the emergency button and wait for professional rescue", correct: true, explanation: "Elevator shafts are dangerous. Stay put, use emergency communications, and never force doors." },
      { text: "Jump up and down to shake it loose", correct: false },
      { text: "Climb through the ceiling hatch like in movies", correct: false }
    ],
    difficulty: "easy",
    tags: ["elevator", "emergency"]
  },
  {
    id: "q39",
    category: "general",
    question: "You smell smoke in a crowded theater. Before exiting, you should:",
    answers: [
      { text: "Shout 'Fire!' to alert everyone immediately", correct: false },
      { text: "Stay low, find the nearest exit, and move calmly toward it", correct: true, explanation: "Panic causes stampedes. Stay low to avoid smoke, move calmly to exits, help others if possible." },
      { text: "Run to your car to get your valuables first", correct: false },
      { text: "Use the elevator to get out faster", correct: false }
    ],
    difficulty: "medium",
    tags: ["fire", "crowds", "evacuation"]
  },
  {
    id: "q40",
    category: "general",
    question: "A tornado warning is issued and you're in a car. You should:",
    answers: [
      { text: "Drive away from the tornado as fast as possible", correct: false },
      { text: "Abandon the car and lie flat in a ditch or low area, covering your head", correct: true, explanation: "Cars become projectiles in tornadoes. Low ground offers more protection than a vehicle." },
      { text: "Park under an overpass for shelter", correct: false },
      { text: "Stay in the car with seatbelts on", correct: false }
    ],
    difficulty: "hard",
    tags: ["weather", "tornado", "emergency"]
  }
];

export const getQuestionsByCategory = (category: SafetyQuestion['category']) => {
  return safetyQuestions.filter(q => q.category === category);
};

export const getRandomQuestions = (count: number = 8) => {
  const shuffled = [...safetyQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getQuestionsByDifficulty = (difficulty: SafetyQuestion['difficulty']) => {
  return safetyQuestions.filter(q => q.difficulty === difficulty);
};
