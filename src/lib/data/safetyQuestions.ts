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
  },
  // ====================== ONLINE SAFETY (continued) ======================
  {
    id: "q41",
    category: "online",
    question: "Someone you've been gaming with for months asks for your real name and city. You should:",
    answers: [
      { text: "Tell them — you're basically friends now", correct: false },
      { text: "Use a gaming alias and keep personal details private", correct: true, explanation: "Online friends should earn trust over time. Protect your identity until you're certain." },
      { text: "Give them a fake name and real city", correct: false },
      { text: "Ask for their info first as a trade", correct: false }
    ],
    difficulty: "easy",
    tags: ["gaming", "privacy"]
  },
  {
    id: "q42",
    category: "online",
    question: "You see a post claiming a celebrity died. The source is an unknown website. You should:",
    answers: [
      { text: "Share it immediately to inform others", correct: false },
      { text: "Check major news outlets for confirmation before believing or sharing", correct: true, explanation: "Death hoaxes are common clickbait. Verify through trusted sources before sharing." },
      { text: "Comment 'RIP' to show respect", correct: false },
      { text: "Ignore it completely — it's probably false", correct: false }
    ],
    difficulty: "easy",
    tags: ["misinformation", "social-media"]
  },
  {
    id: "q43",
    category: "online",
    question: "Your child wants to use a new social media app that collects location data. You should:",
    answers: [
      { text: "Allow it — all apps do that", correct: false },
      { text: "Review privacy settings and disable location sharing before allowing use", correct: true, explanation: "Location data can be exploited. Always audit privacy settings for minors." },
      { text: "Monitor their usage constantly", correct: false },
      { text: "Ban all social media completely", correct: false }
    ],
    difficulty: "medium",
    tags: ["parenting", "privacy", "location"]
  },
  {
    id: "q44",
    category: "online",
    question: "You receive a 'confirmation' email for a purchase you didn't make. The email has a 'Cancel Order' button. You should:",
    answers: [
      { text: "Click Cancel Order immediately", correct: false },
      { text: "Do not click anything — check your bank account directly and contact the company", correct: true, explanation: "This phishing scam uses urgency to make you click. Verify through official channels only." },
      { text: "Forward the email to friends to warn them", correct: false },
      { text: "Reply asking to stop the emails", correct: false }
    ],
    difficulty: "medium",
    tags: ["phishing", "scams"]
  },
  {
    id: "q45",
    category: "online",
    question: "You're setting up a smart home device. Best security practice for the default password:",
    answers: [
      { text: "Keep it — the manufacturer knows best", correct: false },
      { text: "Change it immediately to a strong, unique password", correct: true, explanation: "Default passwords are publicly known and easily exploited. Always change them." },
      { text: "Write it on the device so you don't forget", correct: false },
      { text: "Share it with trusted friends for backup access", correct: false }
    ],
    difficulty: "easy",
    tags: ["iot", "passwords", "smart-home"]
  },
  {
    id: "q46",
    category: "online",
    question: "A coworker shares a USB drive they found in the parking lot. You should:",
    answers: [
      { text: "Plug it in to see who it belongs to", correct: false },
      { text: "Do not use it — it could contain malware or tracking software", correct: true, explanation: "USB drops are a common social engineering tactic to install malware." },
      { text: "Scan it with antivirus first", correct: false },
      { text: "Format it before using", correct: false }
    ],
    difficulty: "medium",
    tags: ["malware", "social-engineering", "workplace"]
  },
  {
    id: "q47",
    category: "online",
    question: "Your social media account gets hacked and the password is changed. First step:",
    answers: [
      { text: "Create a new account with the same name", correct: false },
      { text: "Use 'Forgot Password' and follow account recovery process immediately", correct: true, explanation: "Most platforms have recovery options. Act quickly before the hacker locks you out further." },
      { text: "Message the hacker asking for it back", correct: false },
      { text: "Delete your email account to stop them", correct: false }
    ],
    difficulty: "easy",
    tags: ["hacking", "account-recovery"]
  },
  {
    id: "q48",
    category: "online",
    question: "You're asked to enter your password on a page that doesn't have 'https://' or a padlock icon. You should:",
    answers: [
      { text: "Enter it — the page probably works anyway", correct: false },
      { text: "Never enter personal information on unencrypted connections", correct: true, explanation: "HTTPS encryption protects your data in transit. Without it, anyone can intercept your password." },
      { text: "Check if the page looks professional first", correct: false },
      { text: "Use a weaker password just in case", correct: false }
    ],
    difficulty: "easy",
    tags: ["encryption", "security"]
  },
  {
    id: "q49",
    category: "online",
    question: "A 'tech support' popup appears saying your computer is infected and to call a number. You should:",
    answers: [
      { text: "Call the number for help", correct: false },
      { text: "Close the browser/tab and run a trusted antivirus scan", correct: true, explanation: "Tech support scams are fake. Real companies don't use urgent popups to contact you." },
      { text: "Pay the fee to unlock your computer", correct: false },
      { text: "Restart your computer immediately", correct: false }
    ],
    difficulty: "easy",
    tags: ["tech-support", "scams", "malware"]
  },
  {
    id: "q50",
    category: "online",
    question: "You want to download free software from a torrent site. The safest approach is:",
    answers: [
      { text: "Download it — free is free", correct: false },
      { text: "Only download from official developer websites", correct: true, explanation: "Torrent and crack sites frequently bundle malware. Pay for software or use legitimate free alternatives." },
      { text: "Scan the download with antivirus first", correct: false },
      { text: "Use a VPN to hide your activity", correct: false }
    ],
    difficulty: "medium",
    tags: ["piracy", "malware", "software"]
},

  // ====================== STREET SAFETY (10 questions) ======================
  {
    id: "q51",
    category: "street",
    question: "You're walking with headphones in at night. Best safety practice:",
    answers: [
      { text: "Keep music loud to stay motivated", correct: false },
      { text: "Keep volume low or use one earbud to hear surroundings", correct: true, explanation: "Situational awareness is critical at night. Being unable to hear approaching danger is risky." },
      { text: "Only use noise-cancelling headphones", correct: false },
      { text: "Take calls instead of listening to music", correct: false }
    ],
    difficulty: "easy",
    tags: ["awareness", "night-safety"]
  },
  {
    id: "q52",
    category: "street",
    question: "Someone on the street asks to use your phone for an 'emergency call'. You should:",
    answers: [
      { text: "Hand it over — emergencies happen", correct: false },
      { text: "Offer to make the call yourself while keeping your phone", correct: true, explanation: "Phone thefts often start with this request. Keep control of your device while helping." },
      { text: "Run away from them", correct: false },
      { text: "Tell them to find a payphone", correct: false }
    ],
    difficulty: "medium",
    tags: ["theft", "strangers"]
  },
  {
    id: "q53",
    category: "street",
    question: "You're out of town and your GPS takes you down an unlit, unpaved road. You should:",
    answers: [
      { text: "Trust the GPS — it's probably a shortcut", correct: false },
      { text: "Stop, reverse to the last known safe area, and find an alternate route", correct: true, explanation: "GPS errors can lead to dangerous areas. Trust your instincts and stick to well-traveled roads." },
      { text: "Continue but drive very slowly", correct: false },
      { text: "Turn off your headlights to be discreet", correct: false }
    ],
    difficulty: "medium",
    tags: ["driving", "gps", "navigation"]
  },
  {
    id: "q54",
    category: "street",
    question: "You see a child who looks lost and scared. You should:",
    answers: [
      { text: "Take them to find their parents yourself", correct: false },
      { text: "Stay nearby, call police, and don't leave the child alone until help arrives", correct: true, explanation: "Police can properly handle lost children. Never take a child somewhere without authorities involved." },
      { text: "Ask them to follow you to a safe place", correct: false },
      { text: "Give them money for a taxi", correct: false }
    ],
    difficulty: "medium",
    tags: ["children", "bystander"]
  },
  {
    id: "q55",
    category: "street",
    question: "You're at an ATM late at night and someone is standing too close behind you. You should:",
    answers: [
      { text: "Finish your transaction quickly", correct: false },
      { text: "Cancel the transaction, take your card, and leave immediately", correct: true, explanation: "ATM skimmers and thieves target isolated users. Your safety matters more than cash." },
      { text: "Turn around and ask them to back up", correct: false },
      { text: "Cover the keypad with your other hand", correct: false }
    ],
    difficulty: "easy",
    tags: ["atm", "theft", "night-safety"]
  },
  {
    id: "q56",
    category: "street",
    question: "You park in a parking garage and notice a van parked next to your driver's side. Best action:",
    answers: [
      { text: "Get in through the passenger side instead", correct: false },
      { text: "Enter through passenger side, lock doors immediately, and drive away", correct: true, explanation: "Vans can hide attackers. Avoiding the obstructed side reduces vulnerability." },
      { text: "Wait for the van owner to return", correct: false },
      { text: "Call someone while you get in", correct: false }
    ],
    difficulty: "medium",
    tags: ["parking", "awareness"]
  },
  {
    id: "q57",
    category: "street",
    question: "You're jogging and a car slows down beside you. The driver asks for directions. You should:",
    answers: [
      { text: "Stop and walk toward the car to hear better", correct: false },
      { text: "Keep jogging and shout directions without stopping or approaching", correct: true, explanation: "Maintain distance and momentum. A genuine lost driver can understand shouted directions." },
      { text: "Pull out your phone to look up the address", correct: false },
      { text: "Run away as fast as you can", correct: false }
    ],
    difficulty: "easy",
    tags: ["jogging", "strangers", "awareness"]
  },
  {
    id: "q58",
    category: "street",
    question: "You witness someone being followed aggressively. Safest way to help:",
    answers: [
      { text: "Confront the follower directly", correct: false },
      { text: "Create a distraction or approach the person as if you know them", correct: true, explanation: "Interrupting the follower's plan without direct confrontation can break the situation safely." },
      { text: "Film it for evidence", correct: false },
      { text: "Ignore it — it's not your business", correct: false }
    ],
    difficulty: "medium",
    tags: ["bystander", "intervention"]
  },
  {
    id: "q59",
    category: "street",
    question: "Your car runs out of gas on a busy highway at night. You should:",
    answers: [
      { text: "Walk to the nearest gas station", correct: false },
      { text: "Stay in the car with hazard lights on and call roadside assistance", correct: true, explanation: "Highways at night are deadly for pedestrians. Wait in your locked vehicle for help." },
      { text: "Flag down other cars for help", correct: false },
      { text: "Push the car to the shoulder yourself", correct: false }
    ],
    difficulty: "easy",
    tags: ["driving", "breakdown", "highway"]
  },
  {
    id: "q60",
    category: "street",
    question: "You're in a crowded subway and someone is pressing against you inappropriately. You should:",
    answers: [
      { text: "Stay quiet to avoid causing a scene", correct: false },
      { text: "Move away loudly saying 'Stop touching me' and alert transit police", correct: true, explanation: "Public confrontation deters offenders and alerts others to help. Silence enables the behavior." },
      { text: "Push them away and run", correct: false },
      { text: "Take a photo of them for evidence", correct: false }
    ],
    difficulty: "medium",
    tags: ["harassment", "public-transport"]
},

  // ====================== HOME SAFETY (10 questions) ======================
  {
    id: "q61",
    category: "home",
    question: "You're moving into a new apartment. First security step:",
    answers: [
      { text: "Decorate and make it feel like home", correct: false },
      { text: "Rekey or change all locks immediately", correct: true, explanation: "Previous tenants, landlords, or their friends may still have keys. Always change locks first." },
      { text: "Introduce yourself to all neighbors", correct: false },
      { text: "Install a security camera", correct: false }
    ],
    difficulty: "easy",
    tags: ["moving", "locks", "security"]
  },
  {
    id: "q62",
    category: "home",
    question: "You accidentally locked yourself out of your apartment. You should:",
    answers: [
      { text: "Break a window to get back in", correct: false },
      { text: "Call a licensed locksmith or landlord with proof of residence", correct: true, explanation: "Licensed locksmiths verify identity before opening doors. Avoid 'cheap' unverified services." },
      { text: "Ask a neighbor to let you climb through their balcony", correct: false },
      { text: "Wait outside for hours hoping someone lets you in", correct: false }
    ],
    difficulty: "easy",
    tags: ["locks", "emergency"]
  },
  {
    id: "q63",
    category: "home",
    question: "You see a small kitchen fire from cooking oil. You should NOT:",
    answers: [
      { text: "Use a fire extinguisher", correct: false },
      { text: "Pour water on it", correct: true, explanation: "Water on grease fires causes explosive splatter. Smother with a lid or use baking soda." },
      { text: "Cover with a metal lid", correct: false },
      { text: "Use baking soda", correct: false }
    ],
    difficulty: "medium",
    tags: ["fire-safety", "kitchen", "grease-fire"]
  },
  {
    id: "q64",
    category: "home",
    question: "You find your front door slightly open when you return home. You're sure you locked it. You should:",
    answers: [
      { text: "Push it open and call out 'Hello?'", correct: false },
      { text: "Do not enter — go to a neighbor and call police", correct: true, explanation: "An unlocked door could mean a burglary in progress. Never enter — let police clear the home." },
      { text: "Quietly investigate room by room", correct: false },
      { text: "Check for missing items from outside", correct: false }
    ],
    difficulty: "medium",
    tags: ["burglary", "response"]
  },
  {
    id: "q65",
    category: "home",
    question: "You're hosting a party at your home. A guest invites a stranger they just met. You should:",
    answers: [
      { text: "Be polite and let them stay", correct: false },
      { text: "Ask your guest to vouch for them and keep them in common areas only", correct: true, explanation: "You're responsible for your home. Unknown guests should be monitored and limited." },
      { text: "Check their ID at the door", correct: false },
      { text: "Kick your friend out for inviting them", correct: false }
    ],
    difficulty: "medium",
    tags: ["parties", "guests", "security"]
  },
  {
    id: "q66",
    category: "home",
    question: "Your carbon monoxide alarm goes off. You feel fine. You should:",
    answers: [
      { text: "Turn it off — it's probably a false alarm", correct: false },
      { text: "Evacuate immediately and call emergency services", correct: true, explanation: "Carbon monoxide is odorless and symptoms appear after damage. Always evacuate when alarms sound." },
      { text: "Open windows to air out the house", correct: false },
      { text: "Check if the battery is low", correct: false }
    ],
    difficulty: "easy",
    tags: ["carbon-monoxide", "emergency"]
  },
  {
    id: "q67",
    category: "home",
    question: "A package arrives that you didn't order. The return address is unfamiliar. You should:",
    answers: [
      { text: "Open it — free stuff is great", correct: false },
      { text: "Do not open it — this could be a brushing scam", correct: true, explanation: "Brushing scams send unsolicited items to create fake reviews. Report to the platform." },
      { text: "Throw it directly in the trash", correct: false },
      { text: "Give it to a neighbor", correct: false }
    ],
    difficulty: "medium",
    tags: ["scams", "packages", "online-shopping"]
  },
  {
    id: "q68",
    category: "home",
    question: "You're selling items online and a buyer wants to pick up from your home. Best practice:",
    answers: [
      { text: "Give them your address — it's easiest", correct: false },
      { text: "Arrange pickup at a police station public exchange zone", correct: true, explanation: "Many police stations offer safe exchange areas. Never invite strangers to your home." },
      { text: "Meet in a parking lot alone", correct: false },
      { text: "Have them come when your family is home", correct: false }
    ],
    difficulty: "easy",
    tags: ["online-marketplace", "strangers", "home-security"]
  },
  {
    id: "q69",
    category: "home",
    question: "Your power goes out during a storm. You should avoid opening the refrigerator:",
    answers: [
      { text: "To save energy for other devices", correct: false },
      { text: "To keep food cold longer (food stays safe for 4 hours if unopened)", correct: true, explanation: "Each opening releases cold air. A full freezer stays frozen for 48 hours if unopened." },
      { text: "Because it's dangerous during storms", correct: false },
      { text: "To prevent tripping in the dark", correct: false }
    ],
    difficulty: "easy",
    tags: ["power-outage", "food-safety", "storms"]
  },
  {
    id: "q70",
    category: "home",
    question: "You hear scratching noises in your attic at night. You should:",
    answers: [
      { text: "Go up to investigate with a flashlight", correct: false },
      { text: "Call pest control and check for entry points during daylight", correct: true, explanation: "Animals or intruders could be present. Daytime investigation with professionals is safest." },
      { text: "Set traps in the attic entrance", correct: false },
      { text: "Ignore it — it will go away", correct: false }
    ],
    difficulty: "medium",
    tags: ["pests", "home-safety"]
}, 

  // ====================== TRAVEL SAFETY (10 questions) ======================
  {
    id: "q71",
    category: "travel",
    question: "You're checking into a hotel. The front desk announces your room number loudly. You should:",
    answers: [
      { text: "Thank them and go to your room", correct: false },
      { text: "Ask for a different room and request discretion in the future", correct: true, explanation: "Public room announcements compromise security. Strangers now know where you sleep." },
      { text: "Ignore it — no one is paying attention", correct: false },
      { text: "Write down the number to remember it", correct: false }
    ],
    difficulty: "medium",
    tags: ["hotels", "privacy", "security"]
  },
  {
    id: "q72",
    category: "travel",
    question: "You're traveling abroad and your wallet is stolen. First step:",
    answers: [
      { text: "Cancel all cards and report passport loss to embassy", correct: true, explanation: "Quick action prevents further fraud. Your embassy can help with emergency documents." },
      { text: "File a police report immediately", correct: false },
      { text: "Search the area where it happened", correct: false },
      { text: "Ask your hotel to check security footage", correct: false }
    ],
    difficulty: "medium",
    tags: ["theft", "abroad", "emergency"]
  },
  {
    id: "q73",
    category: "travel",
    question: "You're at a resort and a staff member offers to store your luggage 'safely' in a back room. You should:",
    answers: [
      { text: "Trust them — they work here", correct: false },
      { text: "Use the hotel's official luggage storage with receipts", correct: true, explanation: "Theft can happen anywhere. Use verifiable, receipt-based services for belongings." },
      { text: "Keep your luggage with you always", correct: false },
      { text: "Tip them extra for the favor", correct: false }
    ],
    difficulty: "easy",
    tags: ["hotels", "theft", "luggage"]
  },
  {
    id: "q74",
    category: "travel",
    question: "You're in a country where you don't speak the language. You need medical help. Best action:",
    answers: [
      { text: "Ask random locals for a doctor", correct: false },
      { text: "Go to your embassy's consular services for medical referrals", correct: true, explanation: "Embassies maintain lists of English-speaking, vetted medical providers." },
      { text: "Find the biggest hospital you see", correct: false },
      { text: "Use translation apps to explain symptoms", correct: false }
    ],
    difficulty: "medium",
    tags: ["medical", "abroad", "embassy"]
  },
  {
    id: "q75",
    category: "travel",
    question: "You're on a train and someone falls asleep on your shoulder. You should:",
    answers: [
      { text: "Let them sleep — they're tired", correct: false },
      { text: "Gently wake them and move if uncomfortable", correct: true, explanation: "Personal space matters. The person may be faking sleep to pickpocket or harass." },
      { text: "Push them off aggressively", correct: false },
      { text: "Take a selfie with them for social media", correct: false }
    ],
    difficulty: "easy",
    tags: ["public-transport", "boundaries"]
  },
  {
    id: "q76",
    category: "travel",
    question: "You book an Airbnb and the host asks to meet late at night to hand over keys. You should:",
    answers: [
      { text: "Agree — it's their house", correct: false },
      { text: "Request a daytime key exchange or use a lockbox", correct: true, explanation: "Night meetings with strangers are risky. Legitimate hosts accommodate safe handoffs." },
      { text: "Ask a friend to meet them instead", correct: false },
      { text: "Cancel the booking and dispute the charge", correct: false }
    ],
    difficulty: "easy",
    tags: ["airbnb", "strangers", "night-safety"]
  },
  {
    id: "q77",
    category: "travel",
    question: "You're on a beach and someone asks you to watch their valuables while they swim. You should:",
    answers: [
      { text: "Agree to be helpful", correct: false },
      { text: "Politely decline — you're not responsible for strangers' belongings", correct: true, explanation: "This could be a setup where you're blamed for theft or distracted while your items are taken." },
      { text: "Watch them but keep your distance", correct: false },
      { text: "Charge them a fee for watching", correct: false }
    ],
    difficulty: "easy",
    tags: ["beach", "scams", "strangers"]
  },
  {
    id: "q78",
    category: "travel",
    question: "You're in a foreign country and local police ask for a 'fine' paid in cash on the spot. You should:",
    answers: [
      { text: "Pay it to avoid trouble", correct: false },
      { text: "Ask for a written citation and offer to pay at the police station", correct: true, explanation: "Legitimate fines have paperwork. This is a common bribe scam targeting tourists." },
      { text: "Run away immediately", correct: false },
      { text: "Call your embassy while standing there", correct: false }
    ],
    difficulty: "hard",
    tags: ["police", "scams", "abroad"]
  },
  {
    id: "q79",
    category: "travel",
    question: "You're planning to hike alone in a national park. You should NOT:",
    answers: [
      { text: "Tell someone your route and return time", correct: false },
      { text: "Keep your phone off to save battery", correct: true, explanation: "Emergency communication is critical. Keep phone on and bring a backup battery." },
      { text: "Check weather conditions before leaving", correct: false },
      { text: "Bring extra water and supplies", correct: false }
    ],
    difficulty: "easy",
    tags: ["hiking", "preparedness", "solo-travel"]
  },
  {
    id: "q80",
    category: "travel",
    question: "Your flight is delayed overnight and the airline offers a hotel voucher. Before accepting:",
    answers: [
      { text: "Take it — the airline arranged it", correct: false },
      { text: "Research the hotel's safety and location before accepting", correct: true, explanation: "Airlines may book cheap, unsafe hotels. Verify safety and consider paying for a better option." },
      { text: "Ask for cash instead", correct: false },
      { text: "Sleep in the airport to save money", correct: false }
    ],
    difficulty: "easy",
    tags: ["airports", "hotels", "travel-tips"]
},

  // ====================== GENERAL SAFETY (10 questions) ======================
  {
    id: "q81",
    category: "general",
    question: "You're at a bar and feel unusually dizzy after one drink. You should:",
    answers: [
      { text: "Order coffee to sober up", correct: false },
      { text: "Tell a trusted friend immediately and don't leave with strangers", correct: true, explanation: "This could be a sign of drink spiking. Alert someone you trust and seek medical help." },
      { text: "Go to the bathroom to splash water on your face", correct: false },
      { text: "Finish your drink and go home", correct: false }
    ],
    difficulty: "medium",
    tags: ["drink-spiking", "bars", "emergency"]
  },
  {
    id: "q82",
    category: "general",
    question: "You're home alone and the fire alarm won't stop beeping (low battery). You should:",
    answers: [
      { text: "Remove the battery to stop the noise", correct: false },
      { text: "Replace the battery immediately — never disable alarms", correct: true, explanation: "Disabling alarms removes protection. Keep spare 9V batteries for replacements." },
      { text: "Call the fire department to fix it", correct: false },
      { text: "Cover it with tape until morning", correct: false }
    ],
    difficulty: "easy",
    tags: ["fire-safety", "home"]
  },
  {
    id: "q83",
    category: "general",
    question: "You're giving a presentation and someone asks an aggressive, personal question. Best response:",
    answers: [
      { text: "Answer it to avoid conflict", correct: false },
      { text: "Say 'I'm not comfortable answering that' and redirect to the topic", correct: true, explanation: "You have the right to set boundaries professionally. Redirecting maintains control." },
      { text: "Get angry and end the presentation", correct: false },
      { text: "Make a joke to deflect", correct: false }
    ],
    difficulty: "easy",
    tags: ["boundaries", "professional", "communication"]
  },
  {
    id: "q84",
    category: "general",
    question: "You find a gun in a public restroom. You should:",
    answers: [
      { text: "Pick it up to secure it", correct: false },
      { text: "Do not touch it — leave and call police immediately", correct: true, explanation: "Never handle found firearms. They could be evidence or accidentally discharge." },
      { text: "Hide it so children don't find it", correct: false },
      { text: "Ask others if it's theirs", correct: false }
    ],
    difficulty: "medium",
    tags: ["firearms", "emergency", "public-safety"]
  },
  {
    id: "q85",
    category: "general",
    question: "You're in a relationship and your partner checks your phone without permission. You should:",
    answers: [
      { text: "Accept it — they love you", correct: false },
      { text: "Set a clear boundary — privacy is healthy in relationships", correct: true, explanation: "Controlling behavior often escalates. Mutual trust includes respecting privacy." },
      { text: "Start checking their phone too", correct: false },
      { text: "Delete everything to avoid issues", correct: false }
    ],
    difficulty: "easy",
    tags: ["relationships", "boundaries", "privacy"]
  },
  {
    id: "q86",
    category: "general",
    question: "You're in a parking lot and see a child alone in a hot car. You should:",
    answers: [
      { text: "Walk away — not your problem", correct: false },
      { text: "Stay with the car and call police immediately", correct: true, explanation: "Heatstroke kills quickly. Stay until help arrives — breaking a window may be legal if life-threatening." },
      { text: "Break the window and take the child", correct: false },
      { text: "Leave a note on the windshield", correct: false }
    ],
    difficulty: "medium",
    tags: ["children", "heat-safety", "emergency"]
  },
  {
    id: "q87",
    category: "general",
    question: "You're at a concert and the crowd starts surging. You should:",
    answers: [
      { text: "Push back against the crowd to stay upright", correct: false },
      { text: "Move diagonally toward the edge, keep arms up to protect chest", correct: true, explanation: "Crowd crush kills by suffocation. Protect your breathing space and exit sideways." },
      { text: "Sit down to avoid being pushed", correct: false },
      { text: "Scream loudly for help", correct: false }
    ],
    difficulty: "hard",
    tags: ["crowds", "concerts", "emergency"]
  },
  {
    id: "q88",
    category: "general",
    question: "You're swimming in the ocean and feel a strong undertow pulling your feet. You should:",
    answers: [
      { text: "Swim directly to shore as hard as possible", correct: false },
      { text: "Tread water, signal for help, and swim parallel to shore", correct: true, explanation: "Undertows are narrow. Swimming parallel escapes the current, then swim to shore." },
      { text: "Dive under to escape the current", correct: false },
      { text: "Float on your back and relax", correct: false }
    ],
    difficulty: "medium",
    tags: ["water-safety", "ocean", "rip-current"]
  },
  {
    id: "q89",
    category: "general",
    question: "Your friend confides they're in an abusive relationship. Best response:",
    answers: [
      { text: "Tell them to leave immediately", correct: false },
      { text: "Listen without judgment and offer resources for safety planning", correct: true, explanation: "Leaving is dangerous and complex. Support their agency while providing information." },
      { text: "Confront their partner yourself", correct: false },
      { text: "Call police on their behalf", correct: false }
    ],
    difficulty: "medium",
    tags: ["relationships", "abuse", "support"]
  },
  {
    id: "q90",
    category: "general",
    question: "You're taking medication that causes drowsiness. Before driving, you should:",
    answers: [
      { text: "Drive anyway — you'll be fine", correct: false },
      { text: "Read warnings and don't drive if drowsiness is a side effect", correct: true, explanation: "Drowsy driving equals drunk driving. Use public transit or rideshares instead." },
      { text: "Drink coffee to stay alert", correct: false },
      { text: "Drive slower than usual", correct: false }
    ],
    difficulty: "easy",
    tags: ["driving", "medication", "safety"]
  },
// ====================== TRAVEL SAFETY ======================
  {
    id: "q91",
    category: "travel",
    question: "A taxi driver says the card machine is broken and asks you to pay cash at an ATM. What should you do?",
    answers: [
      { text: "Go to the ATM with them", correct: false },
      { text: "Refuse and ask to stop in a safe public place", correct: true, explanation: "If a driver pressures you to withdraw cash, get out in a busy, safe area and seek help if needed." },
      { text: "Hand over your bank card so they can do it", correct: false },
      { text: "Ignore it and continue the ride", correct: false }
    ],
    difficulty: "medium",
    tags: ["transport", "scams", "money"]
  },
  {
    id: "q92",
    category: "travel",
    question: "You're traveling alone and a stranger offers to watch your luggage while you go to the bathroom. You should:",
    answers: [
      { text: "Accept because they seem friendly", correct: false },
      { text: "Leave your bag and go quickly", correct: false },
      { text: "Take your valuables and ask official staff for help if needed", correct: true, explanation: "Do not rely on strangers to protect your belongings. Use official assistance when possible." },
      { text: "Give them your passport too for safekeeping", correct: false }
    ],
    difficulty: "easy",
    tags: ["luggage", "strangers", "solo-travel"]
  },
  {
    id: "q93",
    category: "travel",
    question: "You arrive at your hotel and notice your room door does not fully lock. What is the safest action?",
    answers: [
      { text: "Sleep there anyway and put a chair by the door", correct: false },
      { text: "Ask the hotel to repair it or move you to another secure room", correct: true, explanation: "A working lock is essential. If the room cannot be secured, request a different room immediately." },
      { text: "Leave your valuables hidden under the bed", correct: false },
      { text: "Keep the door slightly open so you can hear movement", correct: false }
    ],
    difficulty: "easy",
    tags: ["hotel", "accommodation", "security"]
  },
  {
    id: "q94",
    category: "travel",
    question: "Someone at the airport asks you to carry a package through security because their bag is too full. You should:",
    answers: [
      { text: "Help them if the package looks harmless", correct: false },
      { text: "Only do it if they show you what's inside", correct: false },
      { text: "Refuse and notify airport staff if needed", correct: true, explanation: "Never carry items for strangers through airport security. It could contain prohibited or dangerous items." },
      { text: "Put it in checked luggage instead", correct: false }
    ],
    difficulty: "easy",
    tags: ["airport", "security", "strangers"]
  },
  {
    id: "q95",
    category: "travel",
    question: "Your phone battery is almost dead in an unfamiliar city late at night. What should you prioritize?",
    answers: [
      { text: "Use the last battery to scroll social media", correct: false },
      { text: "Save battery for maps, emergency contact, and transport", correct: true, explanation: "Preserve power for essential safety functions like navigation, calls, and ride booking." },
      { text: "Turn brightness to maximum so you can see better", correct: false },
      { text: "Ignore it — you'll figure it out", correct: false }
    ],
    difficulty: "easy",
    tags: ["phone", "navigation", "night-safety"]
  },
  {
    id: "q96",
    category: "travel",
    question: "A person says your hotel is closed and offers to take you to a 'better' one. What should you do?",
    answers: [
      { text: "Go with them to save time", correct: false },
      { text: "Check directly with your hotel using official contact details", correct: true, explanation: "This can be a scam. Verify independently before changing plans." },
      { text: "Give them your booking confirmation", correct: false },
      { text: "Ask them to hold your luggage while you decide", correct: false }
    ],
    difficulty: "medium",
    tags: ["scams", "hotel", "verification"]
  },
  {
    id: "q97",
    category: "travel",
    question: "You're using public Wi-Fi abroad to access your bank account. What is safest?",
    answers: [
      { text: "Use it normally if the signal is strong", correct: false },
      { text: "Avoid banking on public Wi-Fi unless using secure protection like a trusted VPN", correct: true, explanation: "Public Wi-Fi can expose sensitive information. Avoid financial logins on unsecured networks." },
      { text: "Log in faster before anyone notices", correct: false },
      { text: "Share the hotspot password with others first", correct: false }
    ],
    difficulty: "medium",
    tags: ["wifi", "banking", "cybersecurity"]
  },
  {
    id: "q98",
    category: "travel",
    question: "Your drink tastes strange while you're out traveling. What should you do?",
    answers: [
      { text: "Finish it quickly so it doesn't go to waste", correct: false },
      { text: "Stop drinking it immediately and seek help from trusted staff or friends", correct: true, explanation: "A strange taste could indicate contamination or tampering. Stop immediately and get help." },
      { text: "Offer it to someone else to test it", correct: false },
      { text: "Add more ice to dilute it", correct: false }
    ],
    difficulty: "medium",
    tags: ["drink-safety", "nightlife", "tampering"]
  },
  {
    id: "q99",
    category: "travel",
    question: "You get lost while hiking in an unfamiliar area with limited daylight left. What is the best next step?",
    answers: [
      { text: "Keep moving randomly until you find a road", correct: false },
      { text: "Stay calm, use your map/location tools, and contact emergency help if necessary", correct: true, explanation: "Panic increases risk. Stop, assess your position, and use navigation or emergency services." },
      { text: "Split up from your group to search faster", correct: false },
      { text: "Turn off your phone to save battery and guess the way back", correct: false }
    ],
    difficulty: "medium",
    tags: ["hiking", "outdoors", "emergency"]
  },
  {
    id: "q100",
    category: "travel",
    question: "What's the safest way to store important travel documents?",
    answers: [
      { text: "Keep passport, cash, and cards all in one back pocket", correct: false },
      { text: "Split valuables and keep copies of important documents separately", correct: true, explanation: "Separating documents, money, and backup copies reduces risk if something is lost or stolen." },
      { text: "Leave everything loose in your day bag", correct: false },
      { text: "Hand your passport to new travel friends for safekeeping", correct: false }
    ],
    difficulty: "easy",
    tags: ["passport", "documents", "preparation"]
  },

  // ====================== GENERAL SAFETY ======================
  {
    id: "q101",
    category: "general",
    question: "You hear someone trying to force your front door open at night. What should you do first?",
    answers: [
      { text: "Open the door to see who it is", correct: false },
      { text: "Move to a safe place, lock yourself in if possible, and call emergency services", correct: true, explanation: "Your priority is personal safety, not confrontation. Create distance and call for help immediately." },
      { text: "Shout your bank details to distract them", correct: false },
      { text: "Go outside through the front door and investigate", correct: false }
    ],
    difficulty: "medium",
    tags: ["home-intrusion", "emergency", "night-safety"]
  },
  {
    id: "q102",
    category: "general",
    question: "A fire starts in a pan on the stove. What's the safest response?",
    answers: [
      { text: "Throw water on it", correct: false },
      { text: "Turn off the heat if safe and smother the flames with a lid", correct: true, explanation: "Water can make grease fires worse. Smothering cuts off oxygen." },
      { text: "Carry the burning pan outside", correct: false },
      { text: "Wave a towel at it", correct: false }
    ],
    difficulty: "medium",
    tags: ["fire", "kitchen", "emergency"]
  },
  {
    id: "q103",
    category: "general",
    question: "A child is lost in a crowded place. What is the best immediate action?",
    answers: [
      { text: "Wait quietly in case they come back", correct: false },
      { text: "Alert venue staff/security immediately and stay in one visible location", correct: true, explanation: "Getting trained staff involved quickly improves the chances of a safe reunion." },
      { text: "Post about it online first", correct: false },
      { text: "Leave the area to search alone without telling anyone", correct: false }
    ],
    difficulty: "easy",
    tags: ["children", "crowds", "missing-person"]
  },
  {
    id: "q104",
    category: "general",
    question: "Someone collapses in front of you and is unresponsive. What should you do?",
    answers: [
      { text: "Shake them hard until they wake up", correct: false },
      { text: "Call emergency services and follow dispatcher instructions", correct: true, explanation: "Professional emergency guidance is critical in medical emergencies." },
      { text: "Give them food or water immediately", correct: false },
      { text: "Leave because you might get involved", correct: false }
    ],
    difficulty: "easy",
    tags: ["medical", "emergency", "first-response"]
  },
  {
    id: "q105",
    category: "general",
    question: "You smell gas inside a building. What is safest?",
    answers: [
      { text: "Turn lights on to inspect the area", correct: false },
      { text: "Leave immediately and alert emergency services or the gas provider", correct: true, explanation: "Gas leaks can ignite easily. Avoid switches, flames, and electrical sparks." },
      { text: "Light a candle to find the source", correct: false },
      { text: "Ignore it if the smell fades", correct: false }
    ],
    difficulty: "medium",
    tags: ["gas-leak", "building-safety", "emergency"]
  },
  {
    id: "q106",
    category: "general",
    question: "A stranger is following you on foot and matching your turns. What should you do?",
    answers: [
      { text: "Go straight home so you feel safer", correct: false },
      { text: "Head to a busy public place or business and seek help", correct: true, explanation: "Do not lead a possible follower to your home. Move toward people and safety." },
      { text: "Hide in a dark alley", correct: false },
      { text: "Pretend not to notice and keep walking alone", correct: false }
    ],
    difficulty: "easy",
    tags: ["street-safety", "following", "public-safety"]
  },
  {
    id: "q107",
    category: "general",
    question: "Why is it important to have an emergency contact easily available?",
    answers: [
      { text: "So you can memorize more phone numbers", correct: false },
      { text: "So responders or trusted people can be contacted quickly if something happens", correct: true, explanation: "Emergency contacts help others support you fast in urgent situations." },
      { text: "So strangers can learn more about you", correct: false },
      { text: "Because phones never fail", correct: false }
    ],
    difficulty: "easy",
    tags: ["preparedness", "contacts", "emergency"]
  },
  {
    id: "q108",
    category: "general",
    question: "You see a downed power line on the ground. What should you do?",
    answers: [
      { text: "Step over it carefully", correct: false },
      { text: "Stay far away and report it to emergency services or the utility company", correct: true, explanation: "Downed lines may still be live and can be deadly even without direct contact." },
      { text: "Move it with a stick", correct: false },
      { text: "Touch it only if you're wearing sneakers", correct: false }
    ],
    difficulty: "medium",
    tags: ["electricity", "hazards", "outdoors"]
  },
  {
    id: "q109",
    category: "general",
    question: "What is the safest habit when meeting someone new in person for the first time?",
    answers: [
      { text: "Meet them alone at their home", correct: false },
      { text: "Meet in a public place and let someone know where you'll be", correct: true, explanation: "Public locations and informing a trusted person improve safety during first meetings." },
      { text: "Turn off your phone to avoid distractions", correct: false },
      { text: "Accept a ride from them immediately", correct: false }
    ],
    difficulty: "easy",
    tags: ["meeting-people", "personal-safety", "planning"]
  },
  {
    id: "q110",
    category: "general",
    question: "A website or caller pressures you to act 'right now' or you'll lose access or money. This is often a sign of:",
    answers: [
      { text: "A trustworthy urgent opportunity", correct: false },
      { text: "A scam using pressure tactics", correct: true, explanation: "Scammers often create false urgency to stop people from thinking clearly." },
      { text: "Excellent customer service", correct: false },
      { text: "A legal emergency every time", correct: false }
    ],
    difficulty: "easy",
    tags: ["scams", "pressure", "awareness"]
  },
  {
    id: "q111",
    category: "general",
    question: "If a friend seems dangerously intoxicated and wants to leave with a stranger, what should you do?",
    answers: [
      { text: "Let them go — it's their choice", correct: false },
      { text: "Stay with them, get trusted help, and make sure they get home safely", correct: true, explanation: "An intoxicated person may not be able to make safe decisions. Support and intervention can prevent harm." },
      { text: "Give the stranger their phone too", correct: false },
      { text: "Record it for social media", correct: false }
    ],
    difficulty: "medium",
    tags: ["friends", "alcohol", "intervention"]
  },
  {
    id: "q112",
    category: "general",
    question: "What is the best reason to trust your instincts in an uncomfortable situation?",
    answers: [
      { text: "Because instincts are always dramatic and wrong", correct: false },
      { text: "Because discomfort can be an early warning sign that something is unsafe", correct: true, explanation: "If something feels off, taking precautions is often the safer choice." },
      { text: "Because it means you should confront everyone", correct: false },
      { text: "Because fear should always replace judgment", correct: false }
    ],
    difficulty: "easy",
    tags: ["intuition", "awareness", "decision-making"]
  },
  {
    id: "q113",
    category: "general",
    question: "You receive a call claiming a family member is in trouble and needs money immediately. What should you do?",
    answers: [
      { text: "Send the money before checking", correct: false },
      { text: "Verify the story by contacting the family member or another trusted person directly", correct: true, explanation: "Emergency-family scams rely on panic. Independent verification is essential." },
      { text: "Share your banking details to speed things up", correct: false },
      { text: "Stay on the phone and follow every instruction", correct: false }
    ],
    difficulty: "medium",
    tags: ["phone-scams", "family", "verification"]
  },
  {
    id: "q114",
    category: "general",
    question: "What is the safest way to respond to a suspicious package or bag left unattended in a public place?",
    answers: [
      { text: "Open it to identify the owner", correct: false },
      { text: "Leave it alone and notify staff or emergency services", correct: true, explanation: "Unattended items should be handled by trained personnel, not members of the public." },
      { text: "Move it somewhere less busy", correct: false },
      { text: "Take it home if no one claims it", correct: false }
    ],
    difficulty: "medium",
    tags: ["public-safety", "suspicious-items", "reporting"]
  },
  {
    id: "q115",
    category: "general",
    question: "During an emergency evacuation, what should you usually avoid?",
    answers: [
      { text: "Following official exit routes", correct: false },
      { text: "Using elevators unless specifically directed it is safe", correct: true, explanation: "Elevators can fail or open into danger during emergencies like fires." },
      { text: "Helping others if you can do so safely", correct: false },
      { text: "Listening to emergency instructions", correct: false }
    ],
    difficulty: "easy",
    tags: ["evacuation", "fire-safety", "buildings"]
  },
  // ====================== HOME SAFETY ======================
  {
    id: "q116",
    category: "home",
    question: "Someone comes to your door claiming to be from a utility company, but you were not expecting a visit. What should you do?",
    answers: [
      { text: "Let them in so they can check quickly", correct: false },
      { text: "Ask for ID and verify with the company through an official number before opening the door", correct: true, explanation: "Unexpected visitors can be scammers. Verify identity through official channels before letting anyone in." },
      { text: "Give them your account details through the door", correct: false },
      { text: "Leave the door wide open while you look for paperwork", correct: false }
    ],
    difficulty: "medium",
    tags: ["door-safety", "scams", "home-security"]
  },
  {
    id: "q117",
    category: "home",
    question: "What is the safest place to keep spare house keys?",
    answers: [
      { text: "Under the doormat", correct: false },
      { text: "Inside a fake rock next to the door", correct: false },
      { text: "With a trusted person or in a secure lockbox", correct: true, explanation: "Common hiding spots are easy for burglars to check. A trusted person or secure lockbox is safer." },
      { text: "On top of the door frame", correct: false }
    ],
    difficulty: "easy",
    tags: ["keys", "burglary-prevention", "home-security"]
  },
  {
    id: "q118",
    category: "home",
    question: "You notice your smoke alarm chirping occasionally. What should you do?",
    answers: [
      { text: "Ignore it until it stops", correct: false },
      { text: "Remove the battery and deal with it later", correct: false },
      { text: "Replace the battery or fix the alarm as soon as possible", correct: true, explanation: "A chirping smoke alarm often means low battery or a fault. It should be fixed immediately so it works in an emergency." },
      { text: "Cover it with cloth so you can't hear it", correct: false }
    ],
    difficulty: "easy",
    tags: ["smoke-alarm", "fire-safety", "maintenance"]
  },
  {
    id: "q119",
    category: "home",
    question: "A child finds a bottle of cleaning liquid under the sink. How should hazardous products be stored?",
    answers: [
      { text: "In any easy-to-reach cabinet", correct: false },
      { text: "In locked or high cabinets, out of reach of children", correct: true, explanation: "Cleaning chemicals should always be stored securely to prevent poisoning or injury." },
      { text: "In drink bottles so they take less space", correct: false },
      { text: "Open on the counter for quick use", correct: false }
    ],
    difficulty: "easy",
    tags: ["children", "chemicals", "storage"]
  },
  {
    id: "q120",
    category: "home",
    question: "You hear your carbon monoxide alarm sounding. What should you do?",
    answers: [
      { text: "Open a window and go back to sleep", correct: false },
      { text: "Leave the building immediately and call emergency help or the gas provider", correct: true, explanation: "Carbon monoxide is dangerous and can be fatal. Get outside immediately and seek professional help." },
      { text: "Turn the alarm off because it's probably faulty", correct: false },
      { text: "Look for the smell of smoke first", correct: false }
    ],
    difficulty: "medium",
    tags: ["carbon-monoxide", "emergency", "home-safety"]
  },

  // ====================== STREET SAFETY ======================
  {
    id: "q121",
    category: "street",
    question: "Someone on the street asks to borrow your phone to make an urgent call. What is the safer option?",
    answers: [
      { text: "Hand over your unlocked phone", correct: false },
      { text: "Offer to make the call for them or direct them to official help", correct: true, explanation: "Giving a stranger your phone can lead to theft or misuse. If you choose to help, keep control of the phone." },
      { text: "Give them your phone and wallet together", correct: false },
      { text: "Follow them to a quieter place to help", correct: false }
    ],
    difficulty: "medium",
    tags: ["phone-safety", "strangers", "theft"]
  },
  {
    id: "q122",
    category: "street",
    question: "What is the safest way to use headphones while walking alone at night?",
    answers: [
      { text: "Use noise-canceling mode at full volume", correct: false },
      { text: "Keep awareness of your surroundings by lowering volume or using only one earbud", correct: true, explanation: "Being able to hear what is happening around you improves awareness and reaction time." },
      { text: "Close your eyes and follow the music", correct: false },
      { text: "Hold your phone out so you can change songs faster", correct: false }
    ],
    difficulty: "easy",
    tags: ["awareness", "night-safety", "headphones"]
  },
  {
    id: "q123",
    category: "street",
    question: "A stranger starts an argument and tries to provoke you in public. What is usually the safest response?",
    answers: [
      { text: "Escalate so they back down", correct: false },
      { text: "Create distance and move toward a safer, more public area", correct: true, explanation: "Avoiding escalation and moving toward safety reduces risk of violence." },
      { text: "Follow them if they walk away", correct: false },
      { text: "Show them your valuables to prove confidence", correct: false }
    ],
    difficulty: "easy",
    tags: ["conflict", "de-escalation", "public-safety"]
  },
  {
    id: "q124",
    category: "street",
    question: "You think someone may have pickpocketed you in a crowded area. What should you do first?",
    answers: [
      { text: "Panic and run in random directions", correct: false },
      { text: "Move to a safe spot and check your valuables immediately", correct: true, explanation: "Go somewhere safer, confirm what is missing, and then take action like freezing cards or reporting theft." },
      { text: "Accuse the nearest person without evidence", correct: false },
      { text: "Ignore it until later", correct: false }
    ],
    difficulty: "easy",
    tags: ["pickpocketing", "crowds", "theft"]
  },
  {
    id: "q125",
    category: "street",
    question: "If you need directions in an unfamiliar area, who is usually the safest person to approach?",
    answers: [
      { text: "Someone sitting alone in a parked car", correct: false },
      { text: "A shop employee, transit worker, or police officer", correct: true, explanation: "Approaching identifiable staff or officials is generally safer than relying on random strangers." },
      { text: "The person following you", correct: false },
      { text: "Anyone asking you personal questions", correct: false }
    ],
    difficulty: "easy",
    tags: ["directions", "public-places", "strangers"]
  },

  // ====================== ONLINE SAFETY ======================
  {
    id: "q126",
    category: "online",
    question: "A website asks you to download software to 'fix' a virus it says it found on your device. What should you do?",
    answers: [
      { text: "Download it immediately to protect your device", correct: false },
      { text: "Close the page and use trusted security tools or official support instead", correct: true, explanation: "Fake virus alerts often try to trick people into installing malware or giving remote access." },
      { text: "Pay the fee first so the virus doesn't spread", correct: false },
      { text: "Share the warning on social media before checking", correct: false }
    ],
    difficulty: "medium",
    tags: ["malware", "popups", "cybersecurity"]
  },
  {
    id: "q127",
    category: "online",
    question: "Someone sends you a link saying, 'Is this you in this video?' What is the safest response?",
    answers: [
      { text: "Click immediately because it sounds urgent", correct: false },
      { text: "Do not click the link unless you verify it is legitimate", correct: true, explanation: "Scammers use curiosity and panic to get people to click malicious links." },
      { text: "Forward it to friends first", correct: false },
      { text: "Reply with your password to confirm your identity", correct: false }
    ],
    difficulty: "easy",
    tags: ["links", "phishing", "social-engineering"]
  },
  {
    id: "q128",
    category: "online",
    question: "What is a strong sign that an online shop might be fraudulent?",
    answers: [
      { text: "It has secure payment methods and clear contact info", correct: false },
      { text: "Prices are unbelievably low and the site has little trustworthy information", correct: true, explanation: "Scam stores often use huge discounts to lure people while hiding real business details." },
      { text: "It shows realistic delivery times", correct: false },
      { text: "It has a clear returns policy from a known company", correct: false }
    ],
    difficulty: "medium",
    tags: ["shopping", "fraud", "websites"]
  },
  {
    id: "q129",
    category: "online",
    question: "Why should you use different passwords for important accounts?",
    answers: [
      { text: "Because it makes logging in more confusing", correct: false },
      { text: "Because if one password is stolen, attackers cannot automatically access all your accounts", correct: true, explanation: "Using unique passwords limits damage from a single data breach." },
      { text: "Because websites dislike repeated passwords for no reason", correct: false },
      { text: "Because passwords only matter for email", correct: false }
    ],
    difficulty: "easy",
    tags: ["passwords", "accounts", "cybersecurity"]
  },
  {
    id: "q130",
    category: "online",
    question: "A person you met online asks you to move the conversation to a more private app right away. What should you keep in mind?",
    answers: [
      { text: "It always means they are trustworthy", correct: false },
      { text: "It can be a tactic to avoid moderation and make manipulation easier", correct: true, explanation: "Scammers and abusers may try to move chats off-platform to avoid detection and reports." },
      { text: "You should send personal photos first", correct: false },
      { text: "You should give them your full address to build trust", correct: false }
    ],
    difficulty: "medium",
    tags: ["dating-apps", "privacy", "manipulation"]
  },

  // ====================== TRAVEL SAFETY ======================
  {
    id: "q131",
    category: "travel",
    question: "Before traveling internationally, what is a smart safety step regarding your documents?",
    answers: [
      { text: "Carry only the originals and no backups", correct: false },
      { text: "Make secure copies of important documents and store them separately", correct: true, explanation: "Backup copies can help if your passport or other important documents are lost or stolen." },
      { text: "Post photos of them publicly online", correct: false },
      { text: "Give the originals to strangers for safekeeping", correct: false }
    ],
    difficulty: "easy",
    tags: ["documents", "preparation", "passport"]
  },
  {
    id: "q132",
    category: "travel",
    question: "You are checking into a hotel alone. What room-sharing detail should you avoid saying loudly in public?",
    answers: [
      { text: "Your room number", correct: true, explanation: "Saying your room number aloud can allow others nearby to target or track you." },
      { text: "The city you flew from", correct: false },
      { text: "Whether you prefer stairs or elevators", correct: false },
      { text: "Whether you'd like extra towels", correct: false }
    ],
    difficulty: "easy",
    tags: ["hotel", "privacy", "solo-travel"]
  },
  {
    id: "q133",
    category: "travel",
    question: "A ride-share car arrives, but the license plate does not match the app. What should you do?",
    answers: [
      { text: "Get in quickly so the driver doesn't leave", correct: false },
      { text: "Do not enter the car and report the mismatch through the app", correct: true, explanation: "Always confirm the plate, driver, and ride details before getting in. A mismatch is a serious warning sign." },
      { text: "Ask the driver if it's close enough", correct: false },
      { text: "Sit in the front seat to be polite", correct: false }
    ],
    difficulty: "easy",
    tags: ["ride-share", "transport", "verification"]
  },
  {
    id: "q134",
    category: "travel",
    question: "What is the safest approach if a local stranger insists on guiding you somewhere you did not ask to go?",
    answers: [
      { text: "Follow them to avoid seeming rude", correct: false },
      { text: "Politely decline and continue using your own verified directions", correct: true, explanation: "Unwanted guidance can sometimes be linked to scams, pressure, or theft. Keep control of your route." },
      { text: "Give them your phone to lead the way", correct: false },
      { text: "Hand over your bag while you walk", correct: false }
    ],
    difficulty: "medium",
    tags: ["scams", "navigation", "strangers"]
  },
  {
    id: "q135",
    category: "travel",
    question: "Why is it smart to share your travel itinerary with someone you trust?",
    answers: [
      { text: "So they can post it online for you", correct: false },
      { text: "So someone knows where you are expected to be in case of emergency", correct: true, explanation: "A trusted person can help faster if they know your plans, location, and timing." },
      { text: "So they can make changes without telling you", correct: false },
      { text: "So strangers can find you more easily", correct: false }
    ],
    difficulty: "easy",
    tags: ["planning", "emergency-contact", "solo-travel"]
  },

  // ====================== GENERAL SAFETY ======================
  {
    id: "q136",
    category: "general",
    question: "You slip and hit your head but feel mostly okay afterward. What is the safest response?",
    answers: [
      { text: "Ignore it completely because you're still awake", correct: false },
      { text: "Tell someone, monitor symptoms, and seek medical advice if symptoms appear or worsen", correct: true, explanation: "Head injuries can become serious even if symptoms seem mild at first." },
      { text: "Drive immediately to prove you're fine", correct: false },
      { text: "Take random medicine without guidance", correct: false }
    ],
    difficulty: "medium",
    tags: ["injury", "medical", "head-injury"]
  },
  {
    id: "q137",
    category: "general",
    question: "What is one of the best reasons to keep your phone locked with a passcode or biometric security?",
    answers: [
      { text: "So friends cannot borrow it", correct: false },
      { text: "To protect personal information if the phone is lost or stolen", correct: true, explanation: "A locked phone makes it harder for others to access your accounts, contacts, and personal data." },
      { text: "To make charging faster", correct: false },
      { text: "To stop all spam calls automatically", correct: false }
    ],
    difficulty: "easy",
    tags: ["phone-security", "privacy", "personal-data"]
  },
  {
    id: "q138",
    category: "general",
    question: "During severe weather, which source is usually safest to rely on for updates?",
    answers: [
      { text: "Random social media rumors", correct: false },
      { text: "Official weather alerts and emergency authorities", correct: true, explanation: "Official sources provide the most reliable and current safety guidance during dangerous weather." },
      { text: "A stranger's guess in a comment section", correct: false },
      { text: "Old forecasts from several days ago", correct: false }
    ],
    difficulty: "easy",
    tags: ["weather", "emergency", "information"]
  },
  {
    id: "q139",
    category: "general",
    question: "If you are in a building during an earthquake, what is a common safety recommendation?",
    answers: [
      { text: "Run to the elevator immediately", correct: false },
      { text: "Drop, cover, and hold on until the shaking stops", correct: true, explanation: "This helps reduce injury from falling objects and loss of balance during shaking." },
      { text: "Stand next to heavy shelves", correct: false },
      { text: "Rush down the stairs while the floor is moving", correct: false }
    ],
    difficulty: "medium",
    tags: ["earthquake", "emergency", "disaster-safety"]
  },
  {
    id: "q140",
    category: "general",
    question: "What is the safest general rule if a situation feels wrong or unsafe?",
    answers: [
      { text: "Stay quiet and ignore your instincts", correct: false },
      { text: "Take the warning seriously and move toward safety or get help", correct: true, explanation: "If something feels unsafe, creating distance and seeking help is often the safest choice." },
      { text: "Wait for someone else to decide for you", correct: false },
      { text: "Take a bigger risk to prove confidence", correct: false }
    ],
    difficulty: "easy",
    tags: ["intuition", "decision-making", "personal-safety"]
  },
  // ====================== ONLINE SAFETY ======================
  {
    id: "q141",
    category: "online",
    question: "Someone you know sends you a message asking for a verification code that was just texted to your phone. What should you do?",
    answers: [
      { text: "Send it if you trust them", correct: false },
      { text: "Never share verification codes with anyone", correct: true, explanation: "Verification codes are meant only for you. Sharing them can let someone access your account." },
      { text: "Post it in the chat so others can confirm", correct: false },
      { text: "Send half the code first", correct: false }
    ],
    difficulty: "easy",
    tags: ["verification-codes", "account-security", "scams"]
  },
  {
    id: "q142",
    category: "online",
    question: "A social media account with very few followers and no real photos starts asking personal questions. What is the safest response?",
    answers: [
      { text: "Answer honestly to be polite", correct: false },
      { text: "Avoid sharing personal details and consider blocking the account", correct: true, explanation: "Fake or suspicious accounts may be trying to gather information for scams or manipulation." },
      { text: "Send them your address to prove you're real", correct: false },
      { text: "Ask them for money first", correct: false }
    ],
    difficulty: "easy",
    tags: ["social-media", "privacy", "fake-accounts"]
  },
  {
    id: "q143",
    category: "online",
    question: "Why is two-factor authentication useful on important accounts?",
    answers: [
      { text: "It makes your password shorter", correct: false },
      { text: "It adds an extra layer of security if your password is stolen", correct: true, explanation: "Two-factor authentication helps protect your account even if someone learns your password." },
      { text: "It removes the need for passwords forever", correct: false },
      { text: "It makes scam emails easier to trust", correct: false }
    ],
    difficulty: "easy",
    tags: ["2fa", "account-security", "cybersecurity"]
  },
  {
    id: "q144",
    category: "online",
    question: "You receive a friend request from someone with the same name and photos as a person you already know. What should you do?",
    answers: [
      { text: "Accept immediately because you recognize them", correct: false },
      { text: "Verify with your real contact through another trusted method first", correct: true, explanation: "Scammers often clone real profiles to trick people into sharing money or personal information." },
      { text: "Send them your phone number to confirm", correct: false },
      { text: "Ignore your doubts because it is probably fine", correct: false }
    ],
    difficulty: "medium",
    tags: ["impersonation", "social-media", "verification"]
  },
  {
    id: "q145",
    category: "online",
    question: "A file attachment arrives unexpectedly from someone you know. What is the safest first step?",
    answers: [
      { text: "Open it right away since you know them", correct: false },
      { text: "Confirm they really sent it before opening", correct: true, explanation: "Accounts can be hacked. Verifying first helps avoid malware or phishing attacks." },
      { text: "Download it to every device you own", correct: false },
      { text: "Forward it to others to test it", correct: false }
    ],
    difficulty: "medium",
    tags: ["attachments", "malware", "email-safety"]
  },

  // ====================== STREET SAFETY ======================
  {
    id: "q146",
    category: "street",
    question: "You notice someone trying to distract you while another person moves close to your bag. What should you do?",
    answers: [
      { text: "Focus only on the conversation", correct: false },
      { text: "Secure your belongings and move away from both people", correct: true, explanation: "Distraction is a common theft tactic. Protect your items and create distance." },
      { text: "Hand them your bag so they stop", correct: false },
      { text: "Set your phone down to free your hands", correct: false }
    ],
    difficulty: "medium",
    tags: ["theft", "distraction", "pickpocketing"]
  },
  {
    id: "q147",
    category: "street",
    question: "What is generally the safest way to carry a bag in a crowded public place?",
    answers: [
      { text: "Leave it open for easy access", correct: false },
      { text: "Keep it zipped and close to your body", correct: true, explanation: "A closed bag kept close is harder for thieves to access without you noticing." },
      { text: "Swing it behind you", correct: false },
      { text: "Set it down whenever you stop walking", correct: false }
    ],
    difficulty: "easy",
    tags: ["bags", "crowds", "theft-prevention"]
  },
  {
    id: "q148",
    category: "street",
    question: "A driver pulls over and insists on giving you a ride even after you said no. What should you do?",
    answers: [
      { text: "Get in because they insist", correct: false },
      { text: "Keep distance, say no clearly, and head toward other people or a business", correct: true, explanation: "Persistent unwanted offers can be dangerous. Move toward safety and visibility." },
      { text: "Stand closer to hear them better", correct: false },
      { text: "Give them your home address instead", correct: false }
    ],
    difficulty: "medium",
    tags: ["strangers", "transport", "boundaries"]
  },
  {
    id: "q149",
    category: "street",
    question: "If you must walk alone at night, which route is usually safer?",
    answers: [
      { text: "The darkest shortcut with no people around", correct: false },
      { text: "A well-lit route with more people and open businesses", correct: true, explanation: "Visibility and access to help make well-lit, populated routes generally safer." },
      { text: "A route through alleys to save time", correct: false },
      { text: "Any route as long as you walk fast", correct: false }
    ],
    difficulty: "easy",
    tags: ["night-safety", "routes", "awareness"]
  },
  {
    id: "q150",
    category: "street",
    question: "Someone bumps into you hard and apologizes while another person gets very close. Why should you be cautious?",
    answers: [
      { text: "Because crowded spaces are always friendly", correct: false },
      { text: "Because it may be a distraction technique for theft", correct: true, explanation: "Some thieves work in pairs, using accidental contact to distract targets." },
      { text: "Because you should automatically accuse everyone nearby", correct: false },
      { text: "Because it means you should hand over your wallet", correct: false }
    ],
    difficulty: "medium",
    tags: ["pickpocketing", "crowds", "awareness"]
  },

  // ====================== HOME SAFETY ======================
  {
    id: "q151",
    category: "home",
    question: "What should you do before using a ladder at home?",
    answers: [
      { text: "Place it on an uneven surface to reach farther", correct: false },
      { text: "Make sure it is stable and used according to safety instructions", correct: true, explanation: "Falls from ladders are common. Stability and proper use are essential." },
      { text: "Lean sideways as far as possible", correct: false },
      { text: "Climb with both hands full", correct: false }
    ],
    difficulty: "easy",
    tags: ["ladder", "falls", "home-maintenance"]
  },
  {
    id: "q152",
    category: "home",
    question: "A pan handle sticks out over the edge of the stove while cooking. Why is that unsafe?",
    answers: [
      { text: "It cools the food too fast", correct: false },
      { text: "Someone could bump it and spill hot contents", correct: true, explanation: "Turning handles inward helps prevent burns and kitchen accidents." },
      { text: "It makes the stove louder", correct: false },
      { text: "It saves too much space", correct: false }
    ],
    difficulty: "easy",
    tags: ["kitchen", "burns", "cooking-safety"]
  },
  {
    id: "q153",
    category: "home",
    question: "You are using a space heater in winter. What is an important safety rule?",
    answers: [
      { text: "Place it right next to curtains or bedding", correct: false },
      { text: "Keep it away from flammable materials and never leave it unattended", correct: true, explanation: "Space heaters can start fires if placed too close to fabric or left running unattended." },
      { text: "Cover it to keep the heat in", correct: false },
      { text: "Plug it into any overloaded power strip", correct: false }
    ],
    difficulty: "medium",
    tags: ["heater", "fire-safety", "winter"]
  },
  {
    id: "q154",
    category: "home",
    question: "Why is it unsafe to overload electrical outlets?",
    answers: [
      { text: "It makes the room look messy", correct: false },
      { text: "It can cause overheating and fire risk", correct: true, explanation: "Too many devices on one outlet can overheat wiring and increase fire danger." },
      { text: "It makes Wi-Fi slower", correct: false },
      { text: "It weakens phone batteries only", correct: false }
    ],
    difficulty: "easy",
    tags: ["electricity", "fire-safety", "outlets"]
  },
  {
    id: "q155",
    category: "home",
    question: "You leave home for several days. What is a safer practice?",
    answers: [
      { text: "Post publicly that your house will be empty", correct: false },
      { text: "Keep doors and windows secured and avoid advertising your absence", correct: true, explanation: "Publicly sharing that no one is home can increase burglary risk." },
      { text: "Leave a spare key outside as usual", correct: false },
      { text: "Leave packages piling up at the door on purpose", correct: false }
    ],
    difficulty: "easy",
    tags: ["burglary-prevention", "travel", "home-security"]
  },

  // ====================== TRAVEL SAFETY ======================
  {
    id: "q156",
    category: "travel",
    question: "When using an ATM in an unfamiliar place, what is the safest habit?",
    answers: [
      { text: "Use the first isolated machine you find at night", correct: false },
      { text: "Choose a well-lit ATM in a secure, visible location and shield your PIN", correct: true, explanation: "Safer ATM use includes visibility, awareness, and protecting your PIN from others." },
      { text: "Let strangers help you enter your code", correct: false },
      { text: "Count your cash while walking away", correct: false }
    ],
    difficulty: "medium",
    tags: ["atm", "money", "travel-security"]
  },
  {
    id: "q157",
    category: "travel",
    question: "Your passport goes missing while abroad. What should you do first?",
    answers: [
      { text: "Do nothing and hope it turns up later", correct: false },
      { text: "Report it and contact your embassy or consulate for guidance", correct: true, explanation: "Lost passports should be reported quickly so you can get official help and reduce misuse risk." },
      { text: "Post the passport number publicly online", correct: false },
      { text: "Borrow someone else's passport", correct: false }
    ],
    difficulty: "medium",
    tags: ["passport", "embassy", "emergency"]
  },
  {
    id: "q158",
    category: "travel",
    question: "What is the safest choice if you arrive in a new city late at night and feel unsure of the area?",
    answers: [
      { text: "Walk around randomly until you understand the neighborhood", correct: false },
      { text: "Use a verified transport option and go directly to your accommodation", correct: true, explanation: "Reducing unnecessary exposure in unfamiliar places late at night is safer." },
      { text: "Follow any stranger who offers help", correct: false },
      { text: "Leave your luggage somewhere and explore first", correct: false }
    ],
    difficulty: "easy",
    tags: ["arrival", "night-safety", "transport"]
  },
  {
    id: "q159",
    category: "travel",
    question: "Why is it safer to avoid displaying large amounts of cash while traveling?",
    answers: [
      { text: "Because cash expires outdoors", correct: false },
      { text: "Because it can make you a target for theft", correct: true, explanation: "Visible money can attract pickpockets or scammers." },
      { text: "Because shops dislike cash", correct: false },
      { text: "Because it makes passports heavier", correct: false }
    ],
    difficulty: "easy",
    tags: ["cash", "theft", "awareness"]
  },
  {
    id: "q160",
    category: "travel",
    question: "A stranger at a station offers to 'upgrade' your ticket for cash. What should you do?",
    answers: [
      { text: "Accept because it sounds cheaper", correct: false },
      { text: "Use only official counters, machines, or app services", correct: true, explanation: "Unofficial ticket offers are often scams and may leave you with invalid travel documents." },
      { text: "Give them your passport to hold while they arrange it", correct: false },
      { text: "Pay first and ask questions later", correct: false }
    ],
    difficulty: "medium",
    tags: ["tickets", "scams", "transport"]
  },

  // ====================== GENERAL SAFETY ======================
  {
    id: "q161",
    category: "general",
    question: "If an emergency happens, why is it helpful to know your location or address?",
    answers: [
      { text: "So you can impress people nearby", correct: false },
      { text: "So you can tell emergency responders where help is needed", correct: true, explanation: "Clear location information helps emergency services reach you faster." },
      { text: "So you can avoid all questions", correct: false },
      { text: "Because phones never lose signal", correct: false }
    ],
    difficulty: "easy",
    tags: ["emergency", "location", "preparedness"]
  },
  {
    id: "q162",
    category: "general",
    question: "What is the safest general approach when using unfamiliar equipment or machinery?",
    answers: [
      { text: "Guess how it works and start quickly", correct: false },
      { text: "Read instructions and use proper safety precautions first", correct: true, explanation: "Understanding how equipment works helps prevent injuries and damage." },
      { text: "Let children experiment with it", correct: false },
      { text: "Use it faster than recommended", correct: false }
    ],
    difficulty: "easy",
    tags: ["equipment", "instructions", "injury-prevention"]
  },
  {
    id: "q163",
    category: "general",
    question: "Why is it important to keep basic first aid supplies available?",
    answers: [
      { text: "Only to decorate a shelf", correct: false },
      { text: "So you can respond more quickly to minor injuries", correct: true, explanation: "Having supplies ready can help manage cuts, burns, or other minor issues until more help is available if needed." },
      { text: "Because it prevents all accidents", correct: false },
      { text: "So you never need professional help", correct: false }
    ],
    difficulty: "easy",
    tags: ["first-aid", "preparedness", "medical"]
  },
  {
    id: "q164",
    category: "general",
    question: "If you witness a serious emergency, what information is most useful to give responders?",
    answers: [
      { text: "Random guesses and rumors", correct: false },
      { text: "Clear facts like location, what happened, and whether anyone is injured", correct: true, explanation: "Accurate, simple details help responders act quickly and appropriately." },
      { text: "Your entire life story", correct: false },
      { text: "Only your opinion about whose fault it was", correct: false }
    ],
    difficulty: "medium",
    tags: ["emergency-response", "communication", "preparedness"]
  },
  {
    id: "q165",
    category: "general",
    question: "What is a smart safety habit before going somewhere new alone?",
    answers: [
      { text: "Tell no one and keep your phone dead", correct: false },
      { text: "Charge your phone, plan your route, and let someone you trust know your plans", correct: true, explanation: "Basic preparation improves communication, navigation, and emergency support." },
      { text: "Carry all your cash in one hand", correct: false },
      { text: "Rely only on luck", correct: false }
    ],
    difficulty: "easy",
    tags: ["planning", "solo-safety", "preparedness"]
  },

  // ====================== ONLINE SAFETY ======================
  {
    id: "q166",
    category: "online",
    question: "A website asks you to scan a QR code to 'secure your account' instead of logging in normally. What should you do?",
    answers: [
      { text: "Scan it immediately because QR codes are always safe", correct: false },
      { text: "Only use it if you independently verify it is from the official service", correct: true, explanation: "QR codes can hide malicious links. Treat them like any other link and verify the source first." },
      { text: "Share it with friends to see what happens", correct: false },
      { text: "Scan it on every device to compare results", correct: false }
    ],
    difficulty: "medium",
    tags: ["qr-codes", "phishing", "account-security"]
  },
  {
    id: "q167",
    category: "online",
    question: "You see a job post promising huge pay for very easy work, but it asks for your banking details before an interview. What is the safest response?",
    answers: [
      { text: "Send the details quickly so you don't miss out", correct: false },
      { text: "Treat it as suspicious and verify the employer before sharing anything", correct: true, explanation: "Scam job offers often request sensitive details early to steal money or identity." },
      { text: "Give only part of your banking details", correct: false },
      { text: "Pay them a fee to prove you're serious", correct: false }
    ],
    difficulty: "medium",
    tags: ["job-scams", "identity-theft", "fraud"]
  },
  {
    id: "q168",
    category: "online",
    question: "A fun social media quiz asks for your first pet's name, school, and birthday. Why should you be careful?",
    answers: [
      { text: "Because quizzes are always boring", correct: false },
      { text: "Because those answers may match security questions or reveal personal data", correct: true, explanation: "Seemingly harmless questions can help attackers guess passwords or recovery answers." },
      { text: "Because your phone might overheat", correct: false },
      { text: "Because birthdays are private only offline", correct: false }
    ],
    difficulty: "easy",
    tags: ["privacy", "security-questions", "social-media"]
  },
  {
    id: "q169",
    category: "online",
    question: "What is the main benefit of using a reputable password manager?",
    answers: [
      { text: "It lets you reuse one simple password everywhere", correct: false },
      { text: "It helps you store strong, unique passwords more securely", correct: true, explanation: "Password managers make it easier to use different strong passwords for different accounts." },
      { text: "It automatically stops all hackers forever", correct: false },
      { text: "It removes the need for account recovery", correct: false }
    ],
    difficulty: "easy",
    tags: ["passwords", "password-manager", "account-security"]
  },
  {
    id: "q170",
    category: "online",
    question: "Someone claiming to be tech support calls and asks you to install remote access software. What should you do?",
    answers: [
      { text: "Install it so they can help faster", correct: false },
      { text: "Refuse and contact the company through official support channels yourself", correct: true, explanation: "Unsolicited tech support calls are a common scam used to steal money or access your device." },
      { text: "Give them your card details too", correct: false },
      { text: "Let them connect only for a minute", correct: false }
    ],
    difficulty: "medium",
    tags: ["tech-support-scam", "remote-access", "fraud"]
  },
  {
    id: "q171",
    category: "online",
    question: "Why is posting your live location publicly during travel sometimes risky?",
    answers: [
      { text: "Because maps stop working afterward", correct: false },
      { text: "Because it can reveal where you are in real time to strangers", correct: true, explanation: "Real-time location posts can increase stalking, theft, or other safety risks." },
      { text: "Because it drains your battery instantly", correct: false },
      { text: "Because friends dislike updates", correct: false }
    ],
    difficulty: "easy",
    tags: ["location-sharing", "privacy", "travel"]
  },
  {
    id: "q172",
    category: "online",
    question: "What is a safer way to choose answers to account recovery questions?",
    answers: [
      { text: "Use answers anyone can find on your profile", correct: false },
      { text: "Use answers that are hard for others to guess and keep them secure", correct: true, explanation: "Recovery questions should not be easily discovered through social media or public records." },
      { text: "Use your real details and post them publicly", correct: false },
      { text: "Use the same answer for every question and tell friends", correct: false }
    ],
    difficulty: "medium",
    tags: ["recovery-questions", "account-security", "privacy"]
  },

  // ====================== STREET SAFETY ======================
  {
    id: "q173",
    category: "street",
    question: "Someone at an ATM offers to help because the machine 'looks confusing.' What should you do?",
    answers: [
      { text: "Accept and let them stand close while you use it", correct: false },
      { text: "Decline, protect your PIN, and use the ATM only if you feel safe", correct: true, explanation: "Strangers offering ATM help may be trying to see your PIN or distract you." },
      { text: "Hand them your card so they can show you", correct: false },
      { text: "Read your PIN out loud so they can confirm it", correct: false }
    ],
    difficulty: "medium",
    tags: ["atm", "money", "street-scams"]
  },
  {
    id: "q174",
    category: "street",
    question: "Why is it safer not to count large amounts of cash openly in public?",
    answers: [
      { text: "Because cash loses value in sunlight", correct: false },
      { text: "Because it can attract thieves or unwanted attention", correct: true, explanation: "Displaying valuables in public can make you a target." },
      { text: "Because shops dislike visible money", correct: false },
      { text: "Because cash is hard to count outdoors", correct: false }
    ],
    difficulty: "easy",
    tags: ["cash", "theft-prevention", "awareness"]
  },
  {
    id: "q175",
    category: "street",
    question: "You unexpectedly walk into a tense crowd situation or protest and feel unsafe. What is usually the safest response?",
    answers: [
      { text: "Move closer to film from the middle", correct: false },
      { text: "Leave the area calmly and avoid getting trapped in the crowd", correct: true, explanation: "Crowd situations can escalate quickly. Distance and clear exits improve safety." },
      { text: "Start arguing with people nearby", correct: false },
      { text: "Stand between opposing groups", correct: false }
    ],
    difficulty: "medium",
    tags: ["crowds", "public-safety", "situational-awareness"]
  },
  {
    id: "q176",
    category: "street",
    question: "Someone approaches you in a parking lot while you're loading your car and asks you to help find a lost item. What should you do?",
    answers: [
      { text: "Follow them between parked cars right away", correct: false },
      { text: "Keep distance, stay aware, and do not go to isolated spots with strangers", correct: true, explanation: "Parking lots can be risky because they often have limited visibility and fewer people nearby." },
      { text: "Leave your car open while you search", correct: false },
      { text: "Hand them your keys first", correct: false }
    ],
    difficulty: "medium",
    tags: ["parking-lot", "strangers", "awareness"]
  },
  {
    id: "q177",
    category: "street",
    question: "A stranger asks to 'just see' your phone screen to check something quickly. What is the safer choice?",
    answers: [
      { text: "Hand them the unlocked phone", correct: false },
      { text: "Keep control of your phone and do not hand it over", correct: true, explanation: "Even a brief handoff can lead to theft, unauthorized transfers, or exposure of personal information." },
      { text: "Give it to them if they smile", correct: false },
      { text: "Let them walk away with it for privacy", correct: false }
    ],
    difficulty: "easy",
    tags: ["phone-safety", "theft", "boundaries"]
  },
  {
    id: "q178",
    category: "street",
    question: "A person asks you to sign a petition while another stands very close beside you. Why should you be alert?",
    answers: [
      { text: "Because petitions are illegal", correct: false },
      { text: "Because one person may distract you while another targets your belongings", correct: true, explanation: "Some thefts use clipboards, maps, or petitions as distractions." },
      { text: "Because clipboards block phone signals", correct: false },
      { text: "Because all public charities are fake", correct: false }
    ],
    difficulty: "medium",
    tags: ["distraction", "theft", "crowds"]
  },
  {
    id: "q179",
    category: "street",
    question: "What is a safer habit when riding public transport alone late at night?",
    answers: [
      { text: "Sit in an empty carriage far from everyone", correct: false },
      { text: "Stay near the driver, staff area, or other passengers when possible", correct: true, explanation: "Being closer to people or staff can improve safety and make help easier to access." },
      { text: "Fall asleep with your bag open", correct: false },
      { text: "Turn your phone off to save power", correct: false }
    ],
    difficulty: "easy",
    tags: ["public-transport", "night-safety", "awareness"]
  },

  // ====================== HOME SAFETY ======================
  {
    id: "q180",
    category: "home",
    question: "What is the safest way to store prescription medicines at home?",
    answers: [
      { text: "Loose on the kitchen table", correct: false },
      { text: "In a secure place, away from children and anyone not prescribed them", correct: true, explanation: "Medicines should be stored safely to prevent misuse, poisoning, or accidental ingestion." },
      { text: "Mixed together in an unlabeled jar", correct: false },
      { text: "In drink bottles for convenience", correct: false }
    ],
    difficulty: "easy",
    tags: ["medication", "children", "storage"]
  },
  {
    id: "q181",
    category: "home",
    question: "Why is it unsafe to leave candles burning unattended?",
    answers: [
      { text: "They use too much oxygen for plants", correct: false },
      { text: "They can start a fire if knocked over or left too close to materials", correct: true, explanation: "Open flames should never be left unattended because they can quickly cause house fires." },
      { text: "They make clocks run slowly", correct: false },
      { text: "They damage Wi-Fi signals", correct: false }
    ],
    difficulty: "easy",
    tags: ["candles", "fire-safety", "home"]
  },
  {
    id: "q182",
    category: "home",
    question: "A window above ground level is open in a room where a young child is playing. What is the safest action?",
    answers: [
      { text: "Assume the child knows not to go near it", correct: false },
      { text: "Secure the window and supervise the child closely", correct: true, explanation: "Open windows can create serious fall risks for children." },
      { text: "Place furniture under the window so the child can look out", correct: false },
      { text: "Leave the room for a few minutes", correct: false }
    ],
    difficulty: "medium",
    tags: ["children", "falls", "windows"]
  },
  {
    id: "q183",
    category: "home",
    question: "Why is it a good habit to keep doors locked even during the day?",
    answers: [
      { text: "Because sunlight unlocks them", correct: false },
      { text: "Because daytime burglaries and unwanted entries can still happen", correct: true, explanation: "Basic security habits reduce opportunities for theft or intrusion." },
      { text: "Because deliveries never come during the day", correct: false },
      { text: "Because neighbors should not visit", correct: false }
    ],
    difficulty: "easy",
    tags: ["locks", "home-security", "prevention"]
  },
  {
    id: "q184",
    category: "home",
    question: "Before cleaning or repairing a powered appliance, what should you do first?",
    answers: [
      { text: "Turn it on to test it", correct: false },
      { text: "Switch it off and unplug it if safe to do so", correct: true, explanation: "Disconnecting power reduces the risk of electric shock or accidental startup." },
      { text: "Spray water on it to cool it down", correct: false },
      { text: "Ask a child to hold it steady", correct: false }
    ],
    difficulty: "easy",
    tags: ["appliances", "electricity", "maintenance"]
  },
  {
    id: "q185",
    category: "home",
    question: "You spill water near plugged-in electronics. What is the safest response?",
    answers: [
      { text: "Touch everything immediately to move it", correct: false },
      { text: "Avoid contact until power is safely disconnected", correct: true, explanation: "Water and electricity are a dangerous combination. Reduce shock risk before handling anything." },
      { text: "Plug in more devices to test the outlet", correct: false },
      { text: "Ignore it if the floor looks dry", correct: false }
    ],
    difficulty: "medium",
    tags: ["electricity", "water", "shock-risk"]
  },
  {
    id: "q186",
    category: "home",
    question: "Why should hallways and exits in a home be kept clear of clutter?",
    answers: [
      { text: "So pets have more room to play", correct: false },
      { text: "So people can leave quickly and safely in an emergency", correct: true, explanation: "Blocked exits can slow escape and increase injury risk during fires or other emergencies." },
      { text: "So vacuuming is less noisy", correct: false },
      { text: "So mail is easier to spot", correct: false }
    ],
    difficulty: "easy",
    tags: ["exits", "evacuation", "fire-safety"]
  },

  // ====================== TRAVEL SAFETY ======================
  {
    id: "q187",
    category: "travel",
    question: "A stranger offers to exchange money for a better rate than the official booth. What should you do?",
    answers: [
      { text: "Accept because street rates are always better", correct: false },
      { text: "Use official exchange services or ATMs you trust", correct: true, explanation: "Unofficial exchanges can involve counterfeit notes, theft, or scams." },
      { text: "Hand over your passport and cash together", correct: false },
      { text: "Follow them to a quiet side street", correct: false }
    ],
    difficulty: "medium",
    tags: ["money", "currency-exchange", "scams"]
  },
  {
    id: "q188",
    category: "travel",
    question: "Why is it helpful to know the local emergency number when traveling?",
    answers: [
      { text: "So you can order food faster", correct: false },
      { text: "So you can get help quickly if an emergency happens", correct: true, explanation: "Emergency numbers differ by country, so knowing the right one can save time in urgent situations." },
      { text: "So you can avoid using maps", correct: false },
      { text: "So hotels trust you more", correct: false }
    ],
    difficulty: "easy",
    tags: ["emergency", "planning", "international-travel"]
  },
  {
    id: "q189",
    category: "travel",
    question: "What should you do with boarding passes, baggage tags, or travel documents after use?",
    answers: [
      { text: "Leave them in public bins if they show personal details", correct: false },
      { text: "Dispose of them securely because they may contain personal information", correct: true, explanation: "Travel documents can expose names, booking details, and other useful information to strangers." },
      { text: "Post photos of them online", correct: false },
      { text: "Give them to other travelers as souvenirs", correct: false }
    ],
    difficulty: "medium",
    tags: ["privacy", "documents", "airports"]
  },
  {
    id: "q190",
    category: "travel",
    question: "You leave your drink unattended while traveling and come back later. What is the safest choice?",
    answers: [
      { text: "Drink it anyway if it looks normal", correct: false },
      { text: "Do not drink it and get a new one", correct: true, explanation: "An unattended drink may have been tampered with, even if nothing looks different." },
      { text: "Ask a stranger to taste it first", correct: false },
      { text: "Add water and continue", correct: false }
    ],
    difficulty: "easy",
    tags: ["drink-safety", "nightlife", "tampering"]
  },
  {
    id: "q191",
    category: "travel",
    question: "When using a rental car, what is a safer practice regarding valuables?",
    answers: [
      { text: "Leave your bags visible on the seats", correct: false },
      { text: "Keep valuables out of sight and lock the vehicle", correct: true, explanation: "Visible belongings can attract break-ins, especially in tourist areas." },
      { text: "Leave the engine running while you unload", correct: false },
      { text: "Hide money under the windshield", correct: false }
    ],
    difficulty: "easy",
    tags: ["rental-car", "theft-prevention", "valuables"]
  },
  {
    id: "q192",
    category: "travel",
    question: "You are visiting a natural area known for wildlife. What is the safest rule?",
    answers: [
      { text: "Approach animals slowly for a better photo", correct: false },
      { text: "Keep a safe distance and follow local safety guidance", correct: true, explanation: "Wild animals can be unpredictable. Distance protects both you and the animal." },
      { text: "Feed them so they stay calm", correct: false },
      { text: "Turn your back if they come near", correct: false }
    ],
    difficulty: "easy",
    tags: ["wildlife", "outdoors", "nature-safety"]
  },
  {
    id: "q193",
    category: "travel",
    question: "A person in plain clothes claims to be a ticket inspector and demands cash immediately. What should you do?",
    answers: [
      { text: "Pay right away to avoid trouble", correct: false },
      { text: "Ask for official identification and resolve the issue through official channels", correct: true, explanation: "Fraudsters may pretend to be transport staff to pressure travelers into paying fake fines." },
      { text: "Hand over your wallet so they can choose the amount", correct: false },
      { text: "Follow them to an isolated place", correct: false }
    ],
    difficulty: "medium",
    tags: ["transport", "scams", "verification"]
  },

  // ====================== GENERAL SAFETY ======================
  {
    id: "q194",
    category: "general",
    question: "What is a good reason to keep a small emergency kit at home or in your car?",
    answers: [
      { text: "So it can stay unopened forever as decoration", correct: false },
      { text: "So basic supplies are available quickly when needed", correct: true, explanation: "Emergency kits can help with short-term needs until full assistance is available." },
      { text: "So you never need planning again", correct: false },
      { text: "So everyone borrows it for everyday items", correct: false }
    ],
    difficulty: "easy",
    tags: ["emergency-kit", "preparedness", "supplies"]
  },
  {
    id: "q195",
    category: "general",
    question: "If someone threatens you and you have a safe chance to leave, what is usually the best option?",
    answers: [
      { text: "Stay and argue to prove a point", correct: false },
      { text: "Create distance and get to safety as soon as possible", correct: true, explanation: "Escaping a dangerous situation is usually safer than escalating it." },
      { text: "Move closer so they can hear you better", correct: false },
      { text: "Give them more personal information", correct: false }
    ],
    difficulty: "easy",
    tags: ["threats", "de-escalation", "personal-safety"]
  },
  {
    id: "q196",
    category: "general",
    question: "Why is it important to label containers clearly, especially for chemicals or medicines?",
    answers: [
      { text: "Because labels make shelves prettier", correct: false },
      { text: "Because unclear containers can lead to dangerous mistakes", correct: true, explanation: "Clear labeling helps prevent accidental drinking, misuse, or mixing of hazardous substances." },
      { text: "Because unlabeled items work faster", correct: false },
      { text: "Because labels stop leaks", correct: false }
    ],
    difficulty: "easy",
    tags: ["labels", "chemicals", "medication"]
  },
  {
    id: "q197",
    category: "general",
    question: "What is the safest way to respond if a battery or device starts overheating or smoking?",
    answers: [
      { text: "Put it in your pocket and keep moving", correct: false },
      { text: "Move away if needed and follow device or fire safety guidance without taking unnecessary risks", correct: true, explanation: "Overheating batteries can ignite or release dangerous fumes. Prioritize distance and safety." },
      { text: "Hold it tightly so it does not fall", correct: false },
      { text: "Charge it more to stabilize it", correct: false }
    ],
    difficulty: "medium",
    tags: ["battery-safety", "fire-risk", "devices"]
  },
  {
    id: "q198",
    category: "general",
    question: "During a confusing situation or crisis, why is it risky to rely on rumors?",
    answers: [
      { text: "Because rumors are usually more exciting", correct: false },
      { text: "Because false information can lead to unsafe decisions", correct: true, explanation: "Reliable, official information is important when quick safety decisions are needed." },
      { text: "Because rumors are always illegal", correct: false },
      { text: "Because facts do not matter in emergencies", correct: false }
    ],
    difficulty: "easy",
    tags: ["information", "emergency", "critical-thinking"]
  },
  {
    id: "q199",
    category: "general",
    question: "What is one benefit of using a buddy system at large events or unfamiliar places?",
    answers: [
      { text: "It guarantees nothing can go wrong", correct: false },
      { text: "It helps people keep track of each other and respond faster if something goes wrong", correct: true, explanation: "Staying connected with another person can improve awareness and support." },
      { text: "It means neither person needs a phone", correct: false },
      { text: "It lets you separate without a plan", correct: false }
    ],
    difficulty: "easy",
    tags: ["buddy-system", "events", "preparedness"]
  },
  {
    id: "q200",
    category: "general",
    question: "What is the safest final check before you leave for a trip or a long day out?",
    answers: [
      { text: "Assume everything is fine without checking", correct: false },
      { text: "Make sure you have essentials like phone, charge, keys, ID, and a basic plan", correct: true, explanation: "A quick check of essentials can prevent avoidable problems and improve safety." },
      { text: "Leave in a rush so you are not late", correct: false },
      { text: "Carry everything loose in your hands", correct: false }
    ],
    difficulty: "easy",
    tags: ["planning", "preparedness", "essentials"]
  },

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
