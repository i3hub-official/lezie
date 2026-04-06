// src/lib/data/safetyQuestions.ts

export interface Answer {
  text: string;
  correct: boolean;
  explanation?: string;
}

export interface SafetyQuestion {
  id: string;
  category: 'online' | 'street' | 'home' | 'travel' | 'general' | 'food-safety' | 'water-safety' | 'fire-safety' | 'health-wellness' | 'cyberbullying' | 'road-safety' | 'mental-health' | 'emergency-preparedness' | 'environmental-safety' | 'public-health' | 'online' | 'street' | 'home' | 'travel' | 'general' | 'workplace' | 'first-aid' | 'natural-disasters' | 'children-safety' | 'pet-safety' | 'recreational-safety' | 'home-safety' | 'online-safety' | 'street-safety' | 'general-safety' | 'travel-safety' ;
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
// ====================== ONLINE SAFETY ======================
{
  "id": "q201",
  "category": "online",
  "question": "You receive an email claiming to be from your bank, asking you to click a link to 'verify your account' or risk closure. What should you do?",
  "answers": [
    { "text": "Click the link immediately to avoid account suspension", "correct": false },
    { "text": "Log in to your bank's official website or app directly to check for any alerts", "correct": true, "explanation": "Phishing emails often mimic legitimate sources. Always verify through official channels." },
    { "text": "Forward the email to friends for their opinion", "correct": false },
    { "text": "Reply with your account details to confirm your identity", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["phishing", "email-scams", "banking"]
},
{
  "id": "q202",
  "category": "online",
  "question": "A social media friend you don’t know well asks for your home address to 'send you a surprise gift.' What should you do?",
  "answers": [
    { "text": "Share your address and thank them", "correct": false },
    { "text": "Politely decline and avoid sharing personal details with strangers online", "correct": true, "explanation": "Sharing your address with unknown individuals can compromise your safety and privacy." },
    { "text": "Ask for their address first to exchange gifts", "correct": false },
    { "text": "Post your address publicly so everyone can send gifts", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["privacy", "social-media", "strangers"]
},
{
  "id": "q203",
  "category": "online",
  "question": "You notice an unfamiliar device connected to your home Wi-Fi network. What should you do?",
  "answers": [
    { "text": "Ignore it, as it might belong to a neighbor", "correct": false },
    { "text": "Change your Wi-Fi password immediately and investigate further", "correct": true, "explanation": "Unauthorized devices on your network can indicate a security breach or unauthorized access." },
    { "text": "Unplug your router to disconnect all devices", "correct": false },
    { "text": "Share your Wi-Fi password with more people to confuse intruders", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["wi-fi-security", "networks", "intrusion"]
},
{
  "id": "q204",
  "category": "online",
  "question": "A pop-up appears on your screen claiming your device is infected and you must call a number for help. What should you do?",
  "answers": [
    { "text": "Call the number immediately to fix the issue", "correct": false },
    { "text": "Close the pop-up and run a scan using trusted antivirus software", "correct": true, "explanation": "Fake virus alerts are often scams to trick you into paying for unnecessary services or installing malware." },
    { "text": "Click the pop-up to learn more about the infection", "correct": false },
    { "text": "Restart your device and hope the issue resolves itself", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["scams", "malware", "pop-ups"]
},
{
  "id": "q205",
  "category": "online",
  "question": "You are asked to share your location continuously with a new online friend. What should you do?",
  "answers": [
    { "text": "Enable continuous location sharing to build trust", "correct": false },
    { "text": "Decline and only share your location with trusted individuals", "correct": true, "explanation": "Continuous location sharing can expose you to stalking or other risks." },
    { "text": "Share your location but turn it off after a few hours", "correct": false },
    { "text": "Post your location publicly so everyone knows where you are", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["location-sharing", "privacy", "online-friends"]
},

// ====================== STREET SAFETY ======================
{
  "id": "q206",
  "category": "street",
  "question": "You are walking alone at night and notice someone following you. What should you do?",
  "answers": [
    { "text": "Stop and confront the person to ask why they are following you", "correct": false },
    { "text": "Move to a well-lit, populated area and call for help if necessary", "correct": true, "explanation": "Avoiding isolation and seeking help can deter potential threats." },
    { "text": "Ignore the person and continue walking normally", "correct": false },
    { "text": "Take a shortcut through a dark alley to lose them", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["night-safety", "awareness", "followers"]
},
{
  "id": "q207",
  "category": "street",
  "question": "A stranger offers you a ride home late at night. What should you do?",
  "answers": [
    { "text": "Accept the ride to save time and money", "correct": false },
    { "text": "Politely decline and use a trusted transportation method", "correct": true, "explanation": "Accepting rides from strangers can put you at risk of theft, assault, or other dangers." },
    { "text": "Ask the stranger for identification before accepting", "correct": false },
    { "text": "Get in the car but keep your phone ready", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["rides", "strangers", "night-safety"]
},
{
  "id": "q208",
  "category": "street",
  "question": "You witness a fight breaking out in a public place. What should you do?",
  "answers": [
    { "text": "Join the fight to support the person you think is right", "correct": false },
    { "text": "Stay at a safe distance and call emergency services if needed", "correct": true, "explanation": "Intervening in a fight can escalate the situation and put you at risk." },
    { "text": "Record the fight and post it online immediately", "correct": false },
    { "text": "Walk away and pretend you didn’t see anything", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["public-safety", "conflict", "emergency"]
},
{
  "id": "q209",
  "category": "street",
  "question": "You are approached by a group of people demanding money. What should you do?",
  "answers": [
    { "text": "Hand over your wallet immediately to avoid confrontation", "correct": false },
    { "text": "Stay calm, assess the situation, and prioritize your safety", "correct": true, "explanation": "Your safety is the priority. Avoid escalating the situation if possible." },
    { "text": "Start shouting and resist physically", "correct": false },
    { "text": "Run away without looking back", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["robbery", "confrontation", "safety"]
},
{
  "id": "q210",
  "category": "street",
  "question": "You are in a crowded area and suddenly feel someone bump into you. What should you check immediately?",
  "answers": [
    { "text": "Your phone and wallet to ensure nothing was stolen", "correct": true, "explanation": "Crowded areas are common places for pickpocketing and theft." },
    { "text": "The person’s face to confront them", "correct": false },
    { "text": "Your shoes to make sure they are still tied", "correct": false },
    { "text": "The time to see if you are running late", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["pickpocketing", "crowds", "theft"]
},

// ====================== HOME SAFETY ======================
{
  "id": "q211",
  "category": "home",
  "question": "You smell gas in your home. What should you do first?",
  "answers": [
    { "text": "Turn on the lights to see better", "correct": false },
    { "text": "Open windows to ventilate the area and avoid creating sparks", "correct": true, "explanation": "Gas leaks can cause explosions. Ventilate the area and avoid any potential ignition sources." },
    { "text": "Light a match to check where the smell is coming from", "correct": false },
    { "text": "Ignore it if the smell is faint", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["gas-leak", "fire-safety", "emergency"]
},
{
  "id": "q212",
  "category": "home",
  "question": "A stranger knocks on your door claiming to be from a utility company and asks to enter your home. What should you do?",
  "answers": [
    { "text": "Let them in immediately to avoid causing a scene", "correct": false },
    { "text": "Ask for official identification and verify their credentials before allowing entry", "correct": true, "explanation": "Impersonating utility workers is a common tactic for burglary or scams." },
    { "text": "Close the door and pretend no one is home", "correct": false },
    { "text": "Invite them in but watch them closely", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["home-security", "scams", "verification"]
},
{
  "id": "q213",
  "category": "home",
  "question": "You notice a small fire in your kitchen. What should you do first?",
  "answers": [
    { "text": "Pour water on it to put it out quickly", "correct": false },
    { "text": "Use a fire extinguisher or smother the flames with a lid if it is safe to do so", "correct": true, "explanation": "Water can spread grease fires. Use appropriate methods to extinguish small fires safely." },
    { "text": "Open all the windows to let the smoke out", "correct": false },
    { "text": "Leave the house immediately without attempting to put it out", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["fire-safety", "kitchen", "emergency"]
},
{
  "id": "q214",
  "category": "home",
  "question": "You receive a package at your doorstep that you weren’t expecting. What should you do?",
  "answers": [
    { "text": "Open it immediately to see what’s inside", "correct": false },
    { "text": "Inspect the package for suspicious signs and verify the sender before opening", "correct": true, "explanation": "Unexpected packages can sometimes contain dangerous or illegal items." },
    { "text": "Leave it outside for someone else to take", "correct": false },
    { "text": "Throw it away without checking", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["packages", "home-security", "suspicious-items"]
},
{
  "id": "q215",
  "category": "home",
  "question": "You hear an unusual noise outside your home at night. What should you do?",
  "answers": [
    { "text": "Go outside immediately to investigate", "correct": false },
    { "text": "Stay inside, lock your doors, and call for help if you feel threatened", "correct": true, "explanation": "Investigating unusual noises alone can put you at risk. Prioritize your safety." },
    { "text": "Turn on all the lights to scare away intruders", "correct": false },
    { "text": "Ignore the noise and go back to sleep", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["home-security", "night-safety", "noise"]
},

// ====================== TRAVEL SAFETY ======================
{
  "id": "q216",
  "category": "travel",
  "question": "You arrive at your hotel room and notice the door is slightly ajar. What should you do?",
  "answers": [
    { "text": "Enter the room to check if anything is missing", "correct": false },
    { "text": "Do not enter and notify hotel staff immediately", "correct": true, "explanation": "An ajar door could indicate a security breach or unauthorized access." },
    { "text": "Close the door and pretend nothing happened", "correct": false },
    { "text": "Leave your luggage outside and come back later", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["hotel-safety", "security", "travel"]
},
{
  "id": "q217",
  "category": "travel",
  "question": "You are in a foreign country and need to use public Wi-Fi. What should you avoid doing?",
  "answers": [
    { "text": "Accessing sensitive accounts like banking or email", "correct": true, "explanation": "Public Wi-Fi networks are often unsecured and can expose your data to hackers." },
    { "text": "Browsing social media", "correct": false },
    { "text": "Checking the weather forecast", "correct": false },
    { "text": "Downloading large files to save mobile data", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["wi-fi-security", "travel", "privacy"]
},
{
  "id": "q218",
  "category": "travel",
  "question": "You are offered a local delicacy by a street vendor, but it looks undercooked. What should you do?",
  "answers": [
    { "text": "Eat it to avoid offending the vendor", "correct": false },
    { "text": "Politely decline if you have concerns about food safety", "correct": true, "explanation": "Undercooked food can cause food poisoning or other health issues." },
    { "text": "Ask the vendor to cook it more and wait", "correct": false },
    { "text": "Buy it but throw it away later", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["food-safety", "travel", "health"]
},
{
  "id": "q219",
  "category": "travel",
  "question": "You are traveling and realize you’ve lost your passport. What should you do first?",
  "answers": [
    { "text": "Panicking and searching everywhere frantically", "correct": false },
    { "text": "Contact your country’s embassy or consulate for assistance", "correct": true, "explanation": "Embassies can provide guidance and help you replace your passport." },
    { "text": "Borrow a friend’s passport to continue your trip", "correct": false },
    { "text": "Ignore it and hope it turns up later", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["passport", "travel", "emergency"]
},
{
  "id": "q220",
  "category": "travel",
  "question": "You are in a taxi and suspect the driver is taking a longer route than necessary. What should you do?",
  "answers": [
    { "text": "Confront the driver aggressively", "correct": false },
    { "text": "Politely ask the driver to follow the agreed route or use a map to confirm", "correct": true, "explanation": "Clear communication can resolve misunderstandings and prevent overcharging." },
    { "text": "Jump out of the taxi immediately", "correct": false },
    { "text": "Pay extra to avoid conflict", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["taxi-safety", "navigation", "travel"]
},

// ====================== GENERAL SAFETY ======================
{
  "id": "q221",
  "category": "general",
  "question": "You are in a building when a fire alarm goes off. What should you do?",
  "answers": [
    { "text": "Ignore it if you don’t see smoke or flames", "correct": false },
    { "text": "Evacuate the building immediately using the nearest safe exit", "correct": true, "explanation": "Fire alarms are designed to alert you early. Always evacuate and follow safety procedures." },
    { "text": "Wait for someone to confirm it’s a real fire", "correct": false },
    { "text": "Go back to your room to gather belongings", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["fire-safety", "evacuation", "emergency"]
},
{
  "id": "q222",
  "category": "general",
  "question": "You see someone collapse in a public place. What should you do first?",
  "answers": [
    { "text": "Walk away to avoid getting involved", "correct": false },
    { "text": "Call emergency services and check if the person is responsive", "correct": true, "explanation": "Quick action can save lives. Always call for help and assess the situation." },
    { "text": "Start performing CPR immediately without checking", "correct": false },
    { "text": "Take a photo to post on social media", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["first-aid", "emergency", "public-safety"]
},
{
  "id": "q223",
  "category": "general",
  "question": "You are hiking and encounter a wild animal blocking the trail. What should you do?",
  "answers": [
    { "text": "Approach the animal slowly to scare it away", "correct": false },
    { "text": "Stay calm, give the animal space, and back away slowly", "correct": true, "explanation": "Wild animals can be unpredictable. Maintain distance to avoid provoking them." },
    { "text": "Run as fast as you can", "correct": false },
    { "text": "Throw rocks at the animal to make it leave", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["wildlife", "outdoors", "safety"]
},
{
  "id": "q224",
  "category": "general",
  "question": "You are in a crowded event and hear a loud noise that sounds like gunfire. What should you do?",
  "answers": [
    { "text": "Stay where you are to see what happens", "correct": false },
    { "text": "Drop to the ground, seek cover, and follow instructions from authorities", "correct": true, "explanation": "In potential active shooter situations, seek cover and follow safety protocols." },
    { "text": "Run toward the noise to help", "correct": false },
    { "text": "Start recording the event on your phone", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["emergency", "public-safety", "active-shooter"]
},
{
  "id": "q225",
  "category": "general",
  "question": "You are driving and your car starts to overheat. What should you do?",
  "answers": [
    { "text": "Keep driving to reach your destination faster", "correct": false },
    { "text": "Pull over safely, turn off the engine, and let it cool before checking", "correct": true, "explanation": "Continuing to drive an overheating car can cause severe damage or even a fire." },
    { "text": "Pour water on the engine immediately", "correct": false },
    { "text": "Speed up to cool the engine with airflow", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["car-safety", "maintenance", "emergency"]
},
{
  "id": "q226",
  "category": "workplace",
  "question": "You discover a colleague is engaging in unethical behavior that could harm the company. What should you do?",
  "answers": [
    { "text": "Ignore it, it's not your problem", "correct": false },
    { "text": "Confront the colleague directly in front of others", "correct": false },
    { "text": "Report the behavior to HR or a supervisor through proper channels", "correct": true, "explanation": "Reporting unethical behavior through official channels protects both you and the company from potential harm." },
    { "text": "Spread rumors about the colleague to others", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["ethics", "workplace-safety", "reporting"]
},
{
  "id": "q227",
  "category": "workplace",
  "question": "You witness a co-worker struggling to lift a heavy object alone. What should you do?",
  "answers": [
    { "text": "Watch and see if they can manage it", "correct": false },
    { "text": "Offer assistance or suggest finding appropriate lifting equipment", "correct": true, "explanation": "Preventing workplace injuries is a shared responsibility. Offer help or suggest safer methods." },
    { "text": "Tell them to be careful and walk away", "correct": false },
    { "text": "Film them for a safety training video", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["physical-safety", "workplace", "assistance"]
},
{
  "id": "q228",
  "category": "workplace",
  "question": "Your company's computer system shows signs of a cyber attack (e.g., unusual activity, locked files). What should you do?",
  "answers": [
    { "text": "Try to fix it yourself using online tutorials", "correct": false },
    { "text": "Immediately disconnect your computer from the network and report it to IT security", "correct": true, "explanation": "Isolating the affected system can prevent the attack from spreading, and IT security needs to be informed immediately." },
    { "text": "Shut down all computers in the office", "correct": false },
    { "text": "Wait to see if the issue resolves itself", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["cybersecurity", "workplace", "incident-response"]
},
{
  "id": "q229",
  "category": "workplace",
  "question": "During an emergency evacuation drill at work, you notice a clear exit path is blocked by boxes. What should you do?",
  "answers": [
    { "text": "Continue evacuating and ignore the obstruction for now", "correct": false },
    { "text": "Immediately report the blocked exit to the drill supervisor or safety officer", "correct": true, "explanation": "Blocked emergency exits are a serious safety hazard and must be reported and addressed promptly." },
    { "text": "Move the boxes yourself, even if they are heavy", "correct": false },
    { "text": "Take a photo of the blocked exit and post it on social media", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["fire-safety", "evacuation", "workplace"]
},
{
  "id": "q230",
  "category": "workplace",
  "question": "A new piece of equipment in your workplace seems to be malfunctioning and making strange noises. What should you do?",
  "answers": [
    { "text": "Try to operate it carefully to see if it fixes itself", "correct": false },
    { "text": "Immediately stop using the equipment, tag it out, and report the malfunction", "correct": true, "explanation": "Using malfunctioning equipment can lead to accidents or further damage. It should be taken out of service and reported." },
    { "text": "Ask a colleague if they know how to fix it", "correct": false },
    { "text": "Ignore the noises as long as it's still working", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["equipment-safety", "workplace", "maintenance"]
},
{
  "id": "q231",
  "category": "first-aid",
  "question": "Someone is bleeding heavily from a wound. What is the first thing you should do?",
  "answers": [
    { "text": "Apply a tourniquet immediately", "correct": false },
    { "text": "Apply direct pressure to the wound with a clean cloth", "correct": true, "explanation": "Direct pressure is the most effective initial step to control severe bleeding." },
    { "text": "Elevate the injured limb above the heart", "correct": false },
    { "text": "Wash the wound thoroughly with water", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["first-aid", "bleeding", "emergency"]
},
{
  "id": "q232",
  "category": "first-aid",
  "question": "You suspect someone has broken a bone. What is the best course of action?",
  "answers": [
    { "text": "Try to reset the bone yourself", "correct": false },
    { "text": "Immobilize the injured area and seek professional medical help", "correct": true, "explanation": "Immobilizing the injury prevents further damage, and a medical professional is needed for diagnosis and treatment." },
    { "text": "Apply heat to reduce swelling", "correct": false },
    { "text": "Encourage the person to try and move the limb to check the extent of the injury", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["first-aid", "fracture", "injury"]
},
{
  "id": "q233",
  "category": "first-aid",
  "question": "Someone is experiencing symptoms of a severe allergic reaction (anaphylaxis). What should you do?",
  "answers": [
    { "text": "Give them a glass of water", "correct": false },
    { "text": "Administer an epinephrine auto-injector (if available and trained) and call emergency services", "correct": true, "explanation": "Epinephrine is the primary treatment for anaphylaxis, and immediate medical attention is crucial." },
    { "text": "Make them lie down and rest", "correct": false },
    { "text": "Give them an antihistamine pill", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["first-aid", "allergies", "anaphylaxis", "emergency"]
},
{
  "id": "q234",
  "category": "first-aid",
  "question": "What is the correct compression-to-breath ratio for adult CPR?",
  "answers": [
    { "text": "15 compressions to 2 breaths", "correct": false },
    { "text": "30 compressions to 2 breaths", "correct": true, "explanation": "The standard ratio for adult CPR is 30 chest compressions followed by 2 rescue breaths." },
    { "text": "5 compressions to 1 breath", "correct": false },
    { "text": "Continuous compressions without breaths", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["first-aid", "CPR", "resuscitation"]
},
{
  "id": "q235",
  "category": "first-aid",
  "question": "Someone has a minor burn (redness, pain, no blisters). What is the best initial treatment?",
  "answers": [
    { "text": "Apply ice directly to the burn", "correct": false },
    { "text": "Apply cool, running water to the burn for several minutes", "correct": true, "explanation": "Cool water helps to relieve pain and reduce swelling. Avoid ice as it can cause further tissue damage." },
    { "text": "Cover it tightly with a bandage", "correct": false },
    { "text": "Apply butter or oil to the burn", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["first-aid", "burns", "injury"]
},

{
  "id": "q236",
  "category": "natural-disasters",
  "question": "During an earthquake, if you are indoors, what is the safest action to take?",
  "answers": [
    { "text": "Run outside as quickly as possible", "correct": false },
    { "text": "Stand in a doorway", "correct": false },
    { "text": "Drop, Cover, and Hold On under sturdy furniture away from windows", "correct": true, "explanation": "This technique minimizes your risk from falling objects and debris during an earthquake." },
    { "text": "Go to the highest floor of the building", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["earthquake", "natural-disaster", "safety-protocol"]
},
{
  "id": "q237",
  "category": "natural-disasters",
  "question": "You hear a tornado warning for your area. Where is the safest place to take shelter?",
  "answers": [
    { "text": "Near a large window to observe the tornado", "correct": false },
    { "text": "In a car on the highway", "correct": false },
    { "text": "In a basement, storm cellar, or an interior room on the lowest floor", "correct": true, "explanation": "These locations offer the most protection from high winds and flying debris during a tornado." },
    { "text": "Under a bridge or overpass", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["tornado", "natural-disaster", "shelter"]
},
{
  "id": "q238",
  "category": "natural-disasters",
  "question": "What is the most important item to have in a natural disaster emergency kit?",
  "answers": [
    { "text": "A full set of board games", "correct": false },
    { "text": "Extra clothing for fashion", "correct": false },
    { "text": "A supply of fresh water and non-perishable food for at least 3 days", "correct": true, "explanation": "Water and food are essential for survival when utilities may be disrupted." },
    { "text": "A large collection of books", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["emergency-kit", "natural-disaster", "preparedness"]
},
{
  "id": "q239",
  "category": "natural-disasters",
  "question": "If you are caught outdoors during a lightning storm, what should you do?",
  "answers": [
    { "text": "Stand under a tall, isolated tree for shelter", "correct": false },
    { "text": "Lie flat on the ground", "correct": false },
    { "text": "Seek low-lying open spaces or crouch down away from tall objects", "correct": true, "explanation": "Tall objects attract lightning. Crouching low reduces your height and contact with the ground." },
    { "text": "Stay in a swimming pool", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["lightning", "natural-disaster", "outdoors"]
},
{
  "id": "q240",
  "category": "natural-disasters",
  "question": "When evacuating due to a hurricane, what is crucial to do before leaving your home?",
  "answers": [
    { "text": "Leave all windows open to equalize pressure", "correct": false },
    { "text": "Turn off the main water valve and gas line if instructed", "correct": true, "explanation": "Turning off utilities can prevent further damage like flooding or gas leaks after the storm." },
    { "text": "Secure outdoor furniture with tape", "correct": false },
    { "text": "Hide your valuables in secret spots", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["hurricane", "evacuation", "natural-disaster"]
},

{
  "id": "q241",
  "category": "children-safety",
  "question": "What is the safest way to put an infant to sleep to reduce the risk of SIDS?",
  "answers": [
    { "text": "On their stomach with soft bedding", "correct": false },
    { "text": "On their side with a pillow", "correct": false },
    { "text": "On their back in a crib with a firm mattress, free of loose bedding or toys", "correct": true, "explanation": "This position and environment significantly reduce the risk of Sudden Infant Death Syndrome." },
    { "text": "In an adult bed with parents", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["child-safety", "infant", "SIDS"]
},
{
  "id": "q242",
  "category": "children-safety",
  "question": "You see a young child unattended near a swimming pool. What should you do?",
  "answers": [
    { "text": "Assume a parent is nearby and continue walking", "correct": false },
    { "text": "Immediately secure the child or call for help/supervision", "correct": true, "explanation": "Drowning can happen quickly and silently. Immediate action is crucial to prevent tragedy." },
    { "text": "Shout loudly to get their attention", "correct": false },
    { "text": "Wait to see if they get in trouble before acting", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["child-safety", "drowning-prevention", "supervision"]
},
{
  "id": "q243",
  "category": "children-safety",
  "question": "What is a common choking hazard for young children that should be kept out of reach?",
  "answers": [
    { "text": "Large soft toys", "correct": false },
    { "text": "Pieces of fruit cut into small chunks", "correct": false },
    { "text": "Small objects like coins, marbles, or small toy parts", "correct": true, "explanation": "Young children can easily choke on small, round objects that can block their airway." },
    { "text": "Books with large pages", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["child-safety", "choking-hazards", "toddler"]
},
{
  "id": "q244",
  "category": "children-safety",
  "question": "Your child swallows a household cleaning product. What should you do immediately?",
  "answers": [
    { "text": "Try to make them vomit", "correct": false },
    { "text": "Give them milk to neutralize the product", "correct": false },
    { "text": "Call emergency services or a poison control center immediately", "correct": true, "explanation": "Professional guidance is crucial as inducing vomiting or giving liquids can sometimes worsen the situation depending on the substance." },
    { "text": "Wait to see if they develop symptoms", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["child-safety", "poisoning", "emergency"]
},
{
  "id": "q245",
  "category": "children-safety",
  "question": "When teaching children about 'good touch' and 'bad touch,' what is the most important concept to emphasize?",
  "answers": [
    { "text": "Only report bad touch to a parent", "correct": false },
    { "text": "That all secrets should be kept, even if they feel bad", "correct": false },
    { "text": "Their body belongs to them, and they have the right to say 'no' to any touch that makes them feel uncomfortable", "correct": true, "explanation": "Empowering children with bodily autonomy and the right to refuse uncomfortable touch is vital for their safety." },
    { "text": "To always hug family members, even if they don't want to", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["child-safety", "abuse-prevention", "bodily-autonomy"]
},

{
  "id": "q246",
  "category": "pet-safety",
  "question": "Your dog suddenly starts limping after a walk. What is the first thing you should do?",
  "answers": [
    { "text": "Force them to walk to see if it improves", "correct": false },
    { "text": "Give them human pain medication", "correct": false },
    { "text": "Rest the limb and gently check for visible injuries, then contact a vet if pain persists or worsens", "correct": true, "explanation": "Rest prevents further injury, and a vet can diagnose and treat the cause of the limping." },
    { "text": "Ignore it, as most limps go away on their own", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["pet-safety", "dog-injury", "veterinary-care"]
},
{
  "id": "q247",
  "category": "pet-safety",
  "question": "What common household item is highly toxic to dogs and should be kept out of reach?",
  "answers": [
    { "text": "Uncooked rice", "correct": false },
    { "text": "Carrots", "correct": false },
    { "text": "Chocolate", "correct": true, "explanation": "Chocolate contains theobromine, which is toxic to dogs and can cause serious health problems." },
    { "text": "Cooked chicken", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["pet-safety", "dog-poisoning", "toxic-foods"]
},
{
  "id": "q248",
  "category": "pet-safety",
  "question": "You find a lost pet with no collar or identification. What is the most appropriate first step?",
  "answers": [
    { "text": "Keep it and assume it's a stray", "correct": false },
    { "text": "Post a picture on social media immediately without checking anything else", "correct": false },
    { "text": "Take it to a local vet clinic or animal shelter to be scanned for a microchip", "correct": true, "explanation": "A microchip is the fastest way to identify an owner. Shelters and vets are equipped to scan for them." },
    { "text": "Feed it a large meal to make it comfortable", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["pet-safety", "lost-pet", "animal-welfare"]
},
{
  "id": "q249",
  "category": "pet-safety",
  "question": "What is a common danger for pets left in a car, even on a seemingly mild day?",
  "answers": [
    { "text": "They might get bored and chew the seats", "correct": false },
    { "text": "They could accidentally put the car in gear", "correct": false },
    { "text": "Rapid heatstroke due to quickly rising internal temperatures", "correct": true, "explanation": "Car interiors can heat up very quickly, leading to fatal heatstroke for pets, even with windows cracked." },
    { "text": "They might eat your lunch from the dashboard", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["pet-safety", "heatstroke", "car-safety"]
},
{
  "id": "q250",
  "category": "pet-safety",
  "question": "Your cat is showing signs of distress (hiding, hissing, dilated pupils). What should you avoid doing?",
  "answers": [
    { "text": "Giving them space and a quiet environment", "correct": false },
    { "text": "Attempting to comfort or restrain them forcefully", "correct": true, "explanation": "A distressed cat can lash out and injure you. Give them space and identify the cause of distress safely." },
    { "text": "Checking for any obvious injuries or changes in their environment", "correct": false },
    { "text": "Calling a vet for advice", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["pet-safety", "cat-behavior", "animal-handling"]
},

{
  "id": "q251",
  "category": "recreational-safety",
  "question": "Before going swimming, what is the most important safety rule to follow?",
  "answers": [
    { "text": "Eat a large meal to have energy", "correct": false },
    { "text": "Always swim alone to enjoy the peace", "correct": false },
    { "text": "Never swim alone; always swim with a buddy or in supervised areas", "correct": true, "explanation": "Swimming with a buddy ensures someone is there to help in case of an emergency." },
    { "text": "Swim immediately after eating", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["swimming", "recreation", "buddy-system"]
},
{
  "id": "q252",
  "category": "recreational-safety",
  "question": "When cycling, what is the most crucial piece of safety equipment?",
  "answers": [
    { "text": "Expensive cycling shoes", "correct": false },
    { "text": "A loud bell", "correct": false },
    { "text": "A properly fitted helmet", "correct": true, "explanation": "A helmet protects your head from serious injury in case of a fall or collision." },
    { "text": "Stylish sunglasses", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["cycling", "recreation", "helmet"]
},
{
  "id": "q253",
  "category": "recreational-safety",
  "question": "You are hiking in a remote area and get lost. What is your best immediate action?",
  "answers": [
    { "text": "Wander aimlessly to find a path", "correct": false },
    { "text": "Start running to cover more ground quickly", "correct": false },
    { "text": "Stay calm, stay put, and try to signal for help", "correct": true, "explanation": "Staying in one place makes it easier for search and rescue teams to find you. Moving increases the risk of further injury or getting more lost." },
    { "text": "Eat all your food at once to boost energy", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["hiking", "lost", "wilderness-safety"]
},
{
  "id": "q254",
  "category": "recreational-safety",
  "question": "What is essential to remember when engaging in winter sports like skiing or snowboarding?",
  "answers": [
    { "text": "It's okay to go off-piste in unfamiliar terrain", "correct": false },
    { "text": "Wearing cotton clothing layers for warmth", "correct": false },
    { "text": "Wear appropriate safety gear (helmet, goggles) and be aware of your skill level and conditions", "correct": true, "explanation": "Proper gear protects you, and knowing your limits prevents accidents. Cotton gets wet and loses insulating properties." },
    { "text": "Always try the hardest slopes first", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["winter-sports", "skiing", "snowboarding", "safety-gear"]
},
{
  "id": "q255",
  "category": "recreational-safety",
  "question": "Before using any power tools for a DIY project, what is a critical safety step?",
  "answers": [
    { "text": "Start using it immediately to get the job done", "correct": false },
    { "text": "Remove all safety guards to improve visibility", "correct": false },
    { "text": "Read the instruction manual, wear appropriate PPE (Personal Protective Equipment), and ensure the work area is clear", "correct": true, "explanation": "Understanding the tool, protecting yourself, and having a safe workspace are fundamental to preventing accidents." },
    { "text": "Ask a friend who used it once for advice", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["power-tools", "DIY", "PPE", "safety-protocol"]
},

{
  "id": "q256",
  "category": "online",
  "question": "You receive a message from a lottery company congratulating you on winning a large sum of money, but you never entered. What should you do?",
  "answers": [
    { "text": "Provide your bank details to claim the prize", "correct": false },
    { "text": "Reply asking for more details about how to claim", "correct": false },
    { "text": "Delete the message and block the sender, recognizing it as a scam", "correct": true, "explanation": "Unsolicited lottery winnings are almost always scams designed to get your personal information or money." },
    { "text": "Share the good news on social media", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["scams", "phishing", "online-fraud"]
},
{
  "id": "q257",
  "category": "online",
  "question": "What is the primary purpose of using a strong, unique password for each online account?",
  "answers": [
    { "text": "To make it harder for you to remember your passwords", "correct": false },
    { "text": "To show off your creativity in password design", "correct": false },
    { "text": "To prevent a breach of one account from compromising your other accounts", "correct": true, "explanation": "If hackers get one password, unique passwords prevent them from accessing all your other accounts." },
    { "text": "To make online banking more secure for the bank", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["password-security", "cybersecurity", "account-protection"]
},
{
  "id": "q258",
  "category": "online",
  "question": "You are creating an online profile and are asked for highly personal information (e.g., mother's maiden name, pet's name). What should you consider?",
  "answers": [
    { "text": "Provide accurate information to complete the profile faster", "correct": false },
    { "text": "Use random or false information for security questions if possible, or avoid providing it unless absolutely necessary", "correct": true, "explanation": "This information is often used for security questions and can be easily found by identity thieves if shared publicly." },
    { "text": "It's fine, everyone shares this information online", "correct": false },
    { "text": "Only provide it if the site looks very official", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["privacy", "identity-theft", "online-security"]
},
{
  "id": "q259",
  "category": "online",
  "question": "What is two-factor authentication (2FA) and why is it recommended?",
  "answers": [
    { "text": "Logging in twice with the same password", "correct": false },
    { "text": "Using two different devices to log into one account", "correct": false },
    { "text": "An extra layer of security requiring a second verification method (e.g., code from phone) in addition to your password, making accounts much harder to hack", "correct": true, "explanation": "2FA significantly increases account security by requiring something you know (password) and something you have (phone/token)." },
    { "text": "A way to share your login with two friends", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["cybersecurity", "2FA", "account-security"]
},
{
  "id": "q260",
  "category": "online",
  "question": "You see an advertisement online for a product at an unbelievably low price from an unknown website. What is a red flag?",
  "answers": [
    { "text": "The website has a professional design", "correct": false },
    { "text": "The price is significantly lower than retail value, and the site lacks clear contact information or reviews", "correct": true, "explanation": "Scammers often lure victims with unrealistic deals. Lack of transparency and extreme discounts are major warning signs." },
    { "text": "It accepts all major credit cards", "correct": false },
    { "text": "It offers free shipping", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["online-shopping", "scams", "fraud"]
},

{
  "id": "q261",
  "category": "street",
  "question": "You are using an ATM in a public place. What should you do to protect your pin?",
  "answers": [
    { "text": "Say your PIN out loud as you enter it", "correct": false },
    { "text": "Let someone standing nearby watch you enter it", "correct": false },
    { "text": "Cover the keypad with your other hand while entering your PIN", "correct": true, "explanation": "Shielding the keypad prevents shoulder surfing and hidden cameras from capturing your PIN." },
    { "text": "Enter your PIN slowly and deliberately", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["street-safety", "ATM", "pin-security"]
},
{
  "id": "q262",
  "category": "street",
  "question": "You see an unattended bag in a public area like an airport or train station. What should you do?",
  "answers": [
    { "text": "Open it to check for identification", "correct": false },
    { "text": "Leave it alone and report it to security personnel immediately", "correct": true, "explanation": "Unattended bags can be a security risk. It's best to let trained personnel handle them." },
    { "text": "Move it out of the way so it doesn't block traffic", "correct": false },
    { "text": "Assume it's trash and kick it aside", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["public-safety", "security-threat", "unattended-items"]
},
{
  "id": "q263",
  "category": "street",
  "question": "What is a good strategy to avoid becoming a target for petty crime while out in public?",
  "answers": [
    { "text": "Flash expensive jewelry and electronics to show confidence", "correct": false },
    { "text": "Walk with your headphones on, ignoring your surroundings", "correct": false },
    { "text": "Be aware of your surroundings, avoid displaying valuables, and walk with purpose", "correct": true, "explanation": "Looking alert and not making yourself an obvious target can deter opportunistic criminals." },
    { "text": "Carry all your cash in your back pocket", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["street-safety", "crime-prevention", "awareness"]
},
{
  "id": "q264",
  "category": "street",
  "question": "You are at a busy crosswalk and the pedestrian signal is green, but a car is clearly running the red light. What should you do?",
  "answers": [
    { "text": "Walk quickly to beat the car", "correct": false },
    { "text": "Step into the crosswalk anyway, you have the right of way", "correct": false },
    { "text": "Wait for the car to pass before entering the crosswalk, prioritizing your safety over the right of way", "correct": true, "explanation": "Always ensure the path is clear, even if you have the right of way, as a driver might not see you or be able to stop." },
    { "text": "Shout at the driver for breaking the law", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["pedestrian-safety", "traffic", "awareness"]
},
{
  "id": "q265",
  "category": "street",
  "question": "If you are using public transportation and feel uncomfortable due to another passenger's behavior, what should you do?",
  "answers": [
    { "text": "Engage them in a verbal confrontation", "correct": false },
    { "text": "Ignore them and hope they stop", "correct": false },
    { "text": "Move to another part of the vehicle, notify the driver or staff, or exit at the next safe stop", "correct": true, "explanation": "Prioritize your comfort and safety. Removing yourself from the situation and informing authorities are key steps." },
    { "text": "Take a photo of them for evidence", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["public-transport", "personal-safety", "harassment"]
},

{
  "id": "q266",
  "category": "home",
  "question": "What is the most effective way to prevent carbon monoxide poisoning in your home?",
  "answers": [
    { "text": "Open windows slightly during winter", "correct": false },
    { "text": "Install a carbon monoxide detector on every level of your home and outside sleeping areas", "correct": true, "explanation": "Carbon monoxide is odorless and colorless. Detectors are the only reliable way to detect its presence and prevent poisoning." },
    { "text": "Only use gas appliances when someone is awake", "correct": false },
    { "text": "Burn candles frequently to purify the air", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["home-safety", "carbon-monoxide", "detection"]
},
{
  "id": "q267",
  "category": "home",
  "question": "You find an elderly family member has fallen and cannot get up. What should you do?",
  "answers": [
    { "text": "Try to lift them up quickly by yourself", "correct": false },
    { "text": "Leave them to rest and check on them later", "correct": false },
    { "text": "Assess for injuries, reassure them, and call for appropriate medical help if needed", "correct": true, "explanation": "Attempting to lift them improperly can cause further injury. Medical assessment is crucial, especially for the elderly." },
    { "text": "Give them food and water while they are on the floor", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["home-safety", "elderly-care", "falls", "first-aid"]
},
{
  "id": "q268",
  "category": "home",
  "question": "What is the safest practice for storing firearms in a home with children?",
  "answers": [
    { "text": "Loaded and easily accessible for self-defense", "correct": false },
    { "text": "In a locked cabinet, unloaded, with ammunition stored separately and locked away", "correct": true, "explanation": "This practice prevents accidental shootings and unauthorized access by children or others." },
    { "text": "Hidden under a mattress for quick access", "correct": false },
    { "text": "Displayed openly to teach children about responsibility", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["home-safety", "firearms", "child-safety"]
},
{
  "id": "q269",
  "category": "home",
  "question": "You notice an electrical cord in your home is frayed and exposed. What should you do?",
  "answers": [
    { "text": "Cover it with electrical tape and continue using it", "correct": false },
    { "text": "Ignore it if it's still working", "correct": false },
    { "text": "Unplug the cord and replace it immediately to prevent fire or shock hazards", "correct": true, "explanation": "Frayed cords are a serious fire and electrocution risk and must be replaced." },
    { "text": "Tuck it behind furniture where it won't be seen", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["home-safety", "electrical-hazard", "fire-prevention"]
},
{
  "id": "q270",
  "category": "home",
  "question": "How often should smoke detectors in a home be tested and batteries replaced?",
  "answers": [
    { "text": "Annually for testing, every 5 years for batteries", "correct": false },
    { "text": "Monthly for testing, and batteries replaced at least once a year", "correct": true, "explanation": "Regular testing ensures they are working, and annual battery replacement ensures they function during power outages." },
    { "text": "Only when they start beeping continuously", "correct": false },
    { "text": "Never, they last forever", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["home-safety", "smoke-detector", "fire-safety"]
},

{
  "id": "q271",
  "category": "travel",
  "question": "Before traveling internationally, what is a key safety precaution regarding your medications?",
  "answers": [
    { "text": "Pack all medications in your checked luggage", "correct": false },
    { "text": "Assume your medications are legal everywhere", "correct": false },
    { "text": "Carry necessary medications in their original prescription bottles in your carry-on, with a doctor's note for controlled substances", "correct": true, "explanation": "This avoids issues at customs, ensures you have medication if luggage is lost, and provides proof of necessity." },
    { "text": "Buy new medications at your destination to try local brands", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["travel", "medication", "international-travel"]
},
{
  "id": "q272",
  "category": "travel",
  "question": "When exploring a new city, what is a smart way to keep your valuables safe?",
  "answers": [
    { "text": "Carry all your money and cards in one easily accessible wallet", "correct": false },
    { "text": "Wear a fanny pack openly on your front", "correct": false },
    { "text": "Distribute cash and cards in different secure locations, use a money belt or secure inner pockets, and avoid carrying all important documents", "correct": true, "explanation": "Diversifying where you keep valuables minimizes loss if one item is stolen. Avoid being an obvious target." },
    { "text": "Leave your passport visible in an open bag", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["travel", "theft-prevention", "valuables"]
},
{
  "id": "q273",
  "category": "travel",
  "question": "You are approached by someone offering to carry your luggage for a 'small fee' at an unofficial area of a bus station. What should you do?",
  "answers": [
    { "text": "Accept their offer to be polite", "correct": false },
    { "text": "Let them carry it, but keep an eye on them", "correct": false },
    { "text": "Politely decline and only use official, uniformed porters or manage your own luggage", "correct": true, "explanation": "Unofficial porters can be scammers or thieves. Stick to official services or handle your own belongings." },
    { "text": "Offer them an even smaller fee as a negotiation tactic", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["travel", "scams", "luggage-safety"]
},
{
  "id": "q274",
  "category": "travel",
  "question": "What should you do if you become separated from your travel group in a crowded foreign place?",
  "answers": [
    { "text": "Immediately try to call each person individually", "correct": false },
    { "text": "Wait exactly where you are until they find you", "correct": false },
    { "text": "Have a pre-arranged meeting point and time, and if not possible, go to a pre-designated safe spot (e.g., hotel, embassy)", "correct": true, "explanation": "Pre-planning a meeting strategy is key. Going to a known safe location prevents further disorientation." },
    { "text": "Ask strangers for directions to your hotel", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["travel", "lost", "group-travel"]
},
{
  "id": "q275",
  "category": "travel",
  "question": "Before renting a car in a foreign country, what safety check should you prioritize?",
  "answers": [
    { "text": "Checking if it's the most expensive model available", "correct": false },
    { "text": "Ensuring it has a good sound system", "correct": false },
    { "text": "Inspect the car for existing damage, ensure all lights and safety features (seatbelts, brakes) are working, and understand local traffic laws", "correct": true, "explanation": "Ensuring the car is roadworthy and knowing local laws are vital for your safety and to avoid legal issues." },
    { "text": "Making sure it has enough cup holders", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["travel", "car-rental", "road-safety"]
},

{
  "id": "q276",
  "category": "general",
  "question": "What is the 'Stop, Drop, and Roll' technique used for?",
  "answers": [
    { "text": "Extinguishing a small kitchen fire", "correct": false },
    { "text": "Putting out a campfire safely", "correct": false },
    { "text": "Extinguishing clothes that are on fire", "correct": true, "explanation": "This technique smothers the flames and prevents further burns if your clothing catches fire." },
    { "text": "Cooling down after strenuous exercise", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["fire-safety", "personal-safety", "emergency"]
},
{
  "id": "q277",
  "category": "general",
  "question": "What is the universal emergency telephone number in many countries (e.g., North America, Europe)?",
  "answers": [
    { "text": "411", "correct": false },
    { "text": "911 or 112", "correct": true, "explanation": "911 in North America and 112 in Europe are widely recognized as emergency numbers for police, fire, and ambulance." },
    { "text": "000", "correct": false },
    { "text": "Any 7-digit number", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["emergency-services", "universal-number", "calling-for-help"]
},
{
  "id": "q278",
  "category": "general",
  "question": "If you are caught in a rip current while swimming, what should you do?",
  "answers": [
    { "text": "Swim directly against the current towards shore", "correct": false },
    { "text": "Panic and shout loudly", "correct": false },
    { "text": "Stay calm, conserve energy, and swim parallel to the shore until you are out of the current, then swim to shore", "correct": true, "explanation": "Fighting a rip current directly will exhaust you. Swimming parallel allows you to escape its pull." },
    { "text": "Float on your back and let the current take you further out to sea", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["water-safety", "rip-current", "swimming"]
},
{
  "id": "q279",
  "category": "general",
  "question": "What is the best defense against a dog attack if you encounter an aggressive dog?",
  "answers": [
    { "text": "Run away screaming", "correct": false },
    { "text": "Make eye contact and shout at it", "correct": false },
    { "text": "Remain calm, avoid eye contact, stand sideways, and slowly back away without turning your back", "correct": true, "explanation": "Appearing non-threatening and slowly disengaging reduces the likelihood of an attack. Running can trigger a chase response." },
    { "text": "Try to pet it to calm it down", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["animal-safety", "dog-attack", "self-defense"]
},
{
  "id": "q280",
  "category": "general",
  "question": "You witness a minor car accident where no one appears seriously injured. What is a crucial first step?",
  "answers": [
    { "text": "Leave the scene if it's not your car", "correct": false },
    { "text": "Immediately start taking photos of the damage", "correct": false },
    { "text": "Ensure the scene is safe, move vehicles if necessary and safe to do so, and exchange information with the other driver(s)", "correct": true, "explanation": "Safety first, then information exchange for insurance purposes. Call emergency services if there are injuries or significant damage." },
    { "text": "Call your insurance company before checking on anyone", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["car-accident", "road-safety", "emergency"]
},

{
  "id": "q281",
  "category": "online",
  "question": "A friend shares a post on social media that contains clearly false information. What should you do?",
  "answers": [
    { "text": "Share it quickly before it gets taken down", "correct": false },
    { "text": "Ignore it, it's just social media", "correct": false },
    { "text": "Politely comment or message your friend with factual corrections, or report the post to the platform if it violates guidelines", "correct": true, "explanation": "Combating misinformation helps maintain a healthy online environment and informs your friends." },
    { "text": "Publicly ridicule your friend for sharing false information", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["online-safety", "misinformation", "social-media"]
},
{
  "id": "q282",
  "category": "online",
  "question": "What is the purpose of a Virtual Private Network (VPN) for online safety?",
  "answers": [
    { "text": "To make your internet faster", "correct": false },
    { "text": "To hide your activity from your internet service provider and encrypt your online traffic, enhancing privacy and security", "correct": true, "explanation": "A VPN creates a secure, encrypted connection over a less secure network, protecting your data." },
    { "text": "To get free access to paid websites", "correct": false },
    { "text": "To bypass firewalls to download illegal content", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["cybersecurity", "VPN", "privacy"]
},
{
  "id": "q283",
  "category": "online",
  "question": "You accidentally click on a suspicious link and your browser starts acting strangely. What is a recommended immediate action?",
  "answers": [
    { "text": "Continue browsing to see what happens", "correct": false },
    { "text": "Restart your computer immediately without checking anything", "correct": false },
    { "text": "Disconnect from the internet, close the browser, and run a full antivirus/malware scan", "correct": true, "explanation": "Disconnecting limits potential damage, and scanning helps remove any malicious software that may have been downloaded." },
    { "text": "Click on more links to see if the problem gets worse", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["malware", "cybersecurity", "suspicious-links"]
},
{
  "id": "q284",
  "category": "online",
  "question": "What information is generally safe to share publicly on social media?",
  "answers": [
    { "text": "Your home address and phone number", "correct": false },
    { "text": "Your current location in real-time", "correct": false },
    { "text": "General interests, hobbies, and carefully selected photos that do not reveal sensitive personal information", "correct": true, "explanation": "Avoid sharing anything that can be used for identity theft or to track your movements." },
    { "text": "Your full birth date, including the year", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["social-media", "privacy", "online-sharing"]
},
{
  "id": "q285",
  "category": "online",
  "question": "What is 'phishing' in the context of online safety?",
  "answers": [
    { "text": "A type of online fishing game", "correct": false },
    { "text": "Sending emails or messages pretending to be a trustworthy entity to trick individuals into revealing sensitive information", "correct": true, "explanation": "Phishing attacks aim to steal passwords, credit card numbers, and other personal data." },
    { "text": "A new method for secure online shopping", "correct": false },
    { "text": "Searching for lost items online", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["phishing", "scams", "cybersecurity"]
},

{
  "id": "q286",
  "category": "first-aid",
  "question": "What does R.I.C.E. stand for in the context of treating sprains and strains?",
  "answers": [
    { "text": "Run, Inject, Compress, Elevate", "correct": false },
    { "text": "Rest, Ice, Compression, Elevation", "correct": true, "explanation": "R.I.C.E. is a mnemonic for the basic first-aid treatment for soft tissue injuries." },
    { "text": "Relax, Immobilize, Comfort, Examine", "correct": false },
    { "text": "Remove, Inspect, Call, Escort", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["first-aid", "sprains", "strains", "RICE"]
},
{
  "id": "q287",
  "category": "first-aid",
  "question": "If someone is experiencing symptoms of a stroke, what should you note and report to emergency services?",
  "answers": [
    { "text": "Their favorite color and food", "correct": false },
    { "text": "The time symptoms started, using the F.A.S.T. acronym (Face drooping, Arm weakness, Speech difficulty, Time to call 911/112)", "correct": true, "explanation": "Time is critical for stroke treatment, and F.A.S.T. helps identify key symptoms quickly." },
    { "text": "Their medical history from childhood", "correct": false },
    { "text": "Only if they seem to be in pain", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["first-aid", "stroke", "emergency", "FAST"]
},
{
  "id": "q288",
  "category": "first-aid",
  "question": "What should you do if a person is unconscious but breathing normally?",
  "answers": [
    { "text": "Try to wake them by shaking vigorously", "correct": false },
    { "text": "Place them in the recovery position and call for emergency medical help", "correct": true, "explanation": "The recovery position keeps the airway open and prevents choking on vomit, while awaiting professional help." },
    { "text": "Give them water to drink", "correct": false },
    { "text": "Leave them lying on their back", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["first-aid", "unconscious", "recovery-position"]
},
{
  "id": "q289",
  "category": "first-aid",
  "question": "How do you treat a nosebleed?",
  "answers": [
    { "text": "Tilt the head back and lie down", "correct": false },
    { "text": "Stuff tissues up the nostrils", "correct": false },
    { "text": "Lean slightly forward, pinch the soft part of the nose just above the nostrils, and breathe through the mouth", "correct": true, "explanation": "This helps stop the bleeding and prevents blood from flowing down the throat." },
    { "text": "Apply a hot compress to the nose", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["first-aid", "nosebleed"]
},
{
  "id": "q290",
  "category": "first-aid",
  "question": "You see someone having a seizure. What is your primary concern and action?",
  "answers": [
    { "text": "Restrain their movements to prevent injury", "correct": false },
    { "text": "Put something in their mouth to prevent them from biting their tongue", "correct": false },
    { "text": "Protect them from injury by clearing the area, cushioning their head, and timing the seizure, then call emergency services if it's their first or lasts longer than 5 minutes", "correct": true, "explanation": "The goal is to prevent self-injury and ensure their airway is clear. Do not restrain or put anything in their mouth." },
    { "text": "Forcefully wake them up", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["first-aid", "seizure", "emergency"]
},

{
  "id": "q291",
  "category": "natural-disasters",
  "question": "What is a 'tsunami' and what should you do if you are near a coast and feel a strong earthquake?",
  "answers": [
    { "text": "A type of strong wind; seek shelter indoors", "correct": false },
    { "text": "A sudden large ocean wave caused by undersea earthquakes or volcanic eruptions; immediately move to higher ground", "correct": true, "explanation": "A strong earthquake felt near the coast is a natural warning sign of a potential tsunami. Evacuate to high ground without waiting for official warnings." },
    { "text": "A prolonged period of drought; conserve water", "correct": false },
    { "text": "A large-scale forest fire; evacuate immediately", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["tsunami", "natural-disaster", "earthquake", "coastal-safety"]
},
{
  "id": "q292",
  "category": "natural-disasters",
  "question": "During a flood, what is the most important safety rule regarding walking or driving through water?",
  "answers": [
    { "text": "If it looks shallow, it's safe to walk or drive through", "correct": false },
    { "text": "Always drive through floodwaters to get to safety faster", "correct": false },
    { "text": "Turn around, don't drown – never walk or drive through floodwaters, as hidden hazards or strong currents can be present", "correct": true, "explanation": "Even shallow water can hide dangers or sweep vehicles away. It's safer to avoid floodwaters entirely." },
    { "text": "Only walk through if you can see the bottom", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["flood", "natural-disaster", "water-safety"]
},
{
  "id": "q293",
  "category": "natural-disasters",
  "question": "If a wildfire is approaching your area, what should you do to prepare for potential evacuation?",
  "answers": [
    { "text": "Go to the highest point in your house to watch it", "correct": false },
    { "text": "Stay home and try to put out small fires yourself", "correct": false },
    { "text": "Gather essential documents, medications, and a 'go bag,' and follow official evacuation orders promptly", "correct": true, "explanation": "Preparing an emergency kit and evacuating when advised are crucial for safety during wildfires." },
    { "text": "Water your garden to protect your house from embers", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["wildfire", "natural-disaster", "evacuation"]
},
{
  "id": "q294",
  "category": "natural-disasters",
  "question": "What is the primary danger posed by a blizzard, beyond just heavy snowfall?",
  "answers": [
    { "text": "Too much snow for skiing", "correct": false },
    { "text": "Difficulty finding your car", "correct": false },
    { "text": "Extreme cold, whiteout conditions, and potential power outages, leading to hypothermia and isolation", "correct": true, "explanation": "Blizzards combine severe cold with limited visibility and can cut off essential services, making survival difficult." },
    { "text": "The inability to make a snowman", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["blizzard", "natural-disaster", "cold-weather-safety"]
},
{
  "id": "q295",
  "category": "natural-disasters",
  "question": "During a volcanic eruption, if you are in the path of ashfall, what protective measure should you take?",
  "answers": [
    { "text": "Go outside to get a better view", "correct": false },
    { "text": "Cover your mouth and nose with a damp cloth or mask, and stay indoors to avoid inhaling ash", "correct": true, "explanation": "Volcanic ash can cause respiratory problems. Protecting your airways and staying sheltered are critical." },
    { "text": "Run as fast as you can through the ash", "correct": false },
    { "text": "Open windows to let the ash out", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["volcanic-eruption", "natural-disaster", "ashfall"]
},

{
  "id": "q296",
  "category": "workplace",
  "question": "You witness a co-worker being harassed by a superior. What is the most appropriate action?",
  "answers": [
    { "text": "Join in the harassment to fit in", "correct": false },
    { "text": "Ignore it, as it's not your business", "correct": false },
    { "text": "Document what you observed and report it to HR or a trusted supervisor, or intervene if it is safe to do so", "correct": true, "explanation": "Harassment is illegal and creates a hostile work environment. Reporting it through official channels is crucial, and safe intervention can also be considered." },
    { "text": "Confront the superior directly and aggressively", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["workplace", "harassment", "reporting", "ethics"]
},
{
  "id": "q297",
  "category": "workplace",
  "question": "Your workplace has a fire escape plan. How often should you review and practice it?",
  "answers": [
    { "text": "Only when a fire drill is announced unexpectedly", "correct": false },
    { "text": "Never, the plan is always the same", "correct": false },
    { "text": "Regularly, as per company policy, to ensure familiarity with escape routes and meeting points", "correct": true, "explanation": "Regular practice ensures everyone knows what to do in a real emergency, reducing panic and improving safety." },
    { "text": "Only if you are new to the company", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["workplace-safety", "fire-safety", "evacuation-plan"]
},
{
  "id": "q298",
  "category": "workplace",
  "question": "What is the purpose of Lockout/Tagout (LOTO) procedures in industrial settings?",
  "answers": [
    { "text": "To lock equipment away from unauthorized users", "correct": false },
    { "text": "To ensure dangerous machinery is properly shut down, de-energized, and cannot be restarted unexpectedly during maintenance or repair", "correct": true, "explanation": "LOTO prevents serious injuries or fatalities by controlling hazardous energy during servicing of machinery." },
    { "text": "To tag equipment for inventory purposes", "correct": false },
    { "text": "To mark broken equipment for disposal", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["workplace-safety", "industrial-safety", "LOTO"]
},
{
  "id": "q299",
  "category": "workplace",
  "question": "You notice a wet spill on a high-traffic floor area in your workplace. What should you do?",
  "answers": [
    { "text": "Walk around it and hope someone else cleans it", "correct": false },
    { "text": "Cover it with a piece of paper to absorb the liquid", "correct": false },
    { "text": "Immediately place a 'wet floor' sign, clean it up if safe, or report it to appropriate personnel", "correct": true, "explanation": "Wet spills are a slip hazard and need to be addressed promptly to prevent accidents." },
    { "text": "Spread sand over it to dry it out", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["workplace-safety", "slip-hazard", "housekeeping"]
},
{
  "id": "q300",
  "category": "workplace",
  "question": "What is the primary benefit of wearing Personal Protective Equipment (PPE) in hazardous work environments?",
  "answers": [
    { "text": "To make you look professional", "correct": false },
    { "text": "To replace safe work practices entirely", "correct": false },
    { "text": "To minimize exposure to hazards that could cause serious workplace injuries and illnesses", "correct": true, "explanation": "PPE is a critical control measure to protect workers from residual hazards that cannot be eliminated or controlled by other means." },
    { "text": "To keep you warm or cool", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["workplace-safety", "PPE", "hazard-control"]
},
{
  "id": "q301",
  "category": "food-safety",
  "question": "What is the 'danger zone' temperature range for food, where bacteria multiply most rapidly?",
  "answers": [
    { "text": "Below 0°C (32°F)", "correct": false },
    { "text": "Between 5°C (41°F) and 60°C (140°F)", "correct": true, "explanation": "Foods should not be left in this temperature range for more than two hours to prevent rapid bacterial growth." },
    { "text": "Above 100°C (212°F)", "correct": false },
    { "text": "Any temperature where food is visible steaming", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["food-safety", "bacteria", "temperature"]
},
{
  "id": "q302",
  "category": "food-safety",
  "question": "How long can perishable foods safely be left out at room temperature?",
  "answers": [
    { "text": "Up to 4 hours", "correct": false },
    { "text": "Up to 8 hours", "correct": false },
    { "text": "No more than 2 hours", "correct": true, "explanation": "Beyond two hours, perishable foods enter the 'danger zone' where bacteria can multiply to unsafe levels." },
    { "text": "Indefinitely if covered", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["food-safety", "perishable", "bacteria"]
},
{
  "id": "q303",
  "category": "food-safety",
  "question": "What is cross-contamination and how can you prevent it when preparing food?",
  "answers": [
    { "text": "Mixing different types of food together for flavor; by using fresh ingredients", "correct": false },
    { "text": "Bacteria spreading from one food or surface to another; by using separate cutting boards and utensils for raw meats and produce", "correct": true, "explanation": "Preventing cross-contamination is crucial to avoid foodborne illnesses. Separate equipment is key." },
    { "text": "Food touching your clothes; by wearing an apron", "correct": false },
    { "text": "Cooking different foods in the same pot; by cooking at high temperatures", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["food-safety", "cross-contamination", "hygiene"]
},
{
  "id": "q304",
  "category": "food-safety",
  "question": "What is the safest way to thaw frozen meat?",
  "answers": [
    { "text": "On the kitchen counter at room temperature", "correct": false },
    { "text": "Under hot running water", "correct": false },
    { "text": "In the refrigerator, in cold water (changed every 30 mins), or in the microwave (if cooking immediately)", "correct": true, "explanation": "Thawing methods that keep meat out of the danger zone are safest to prevent bacterial growth." },
    { "text": "In the dishwasher", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["food-safety", "thawing", "meat"]
},
{
  "id": "q305",
  "category": "food-safety",
  "question": "What is the recommended internal temperature for safely cooking poultry (chicken, turkey)?",
  "answers": [
    { "text": "60°C (140°F)", "correct": false },
    { "text": "70°C (158°F)", "correct": false },
    { "text": "74°C (165°F)", "correct": true, "explanation": "Cooking poultry to this temperature ensures harmful bacteria like Salmonella are destroyed." },
    { "text": "85°C (185°F)", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["food-safety", "cooking", "poultry"]
},

{
  "id": "q306",
  "category": "water-safety",
  "question": "What should you always check before jumping into any body of water, especially unfamiliar ones?",
  "answers": [
    { "text": "If anyone else is already in it", "correct": false },
    { "text": "The water temperature", "correct": false },
    { "text": "The depth, presence of submerged objects, and clarity of the water", "correct": true, "explanation": "Shallow water or hidden objects can cause severe head and spinal injuries. Clarity indicates potential hazards." },
    { "text": "If there are any fish visible", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["water-safety", "swimming", "diving"]
},
{
  "id": "q307",
  "category": "water-safety",
  "question": "If you fall into cold water, what is the best immediate response to increase your survival time?",
  "answers": [
    { "text": "Start swimming vigorously to get warm", "correct": false },
    { "text": "Remove your clothes to lighten your load", "correct": false },
    { "text": "Stay calm, float on your back, and if possible, adopt the H.E.L.P. (Heat Escape Lessening Posture) or huddle with others", "correct": true, "explanation": "Sudden immersion in cold water causes 'cold shock.' Staying calm and conserving heat are vital." },
    { "text": "Shout for help non-stop", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["water-safety", "cold-water", "hypothermia"]
},
{
  "id": "q308",
  "category": "water-safety",
  "question": "When boating, who should always wear a properly fitted life jacket?",
  "answers": [
    { "text": "Only non-swimmers", "correct": false },
    { "text": "Only children", "correct": false },
    { "text": "Everyone on board, regardless of swimming ability, especially during rough water or high-risk activities", "correct": true, "explanation": "Life jackets save lives. Even strong swimmers can be incapacitated in unexpected boating incidents." },
    { "text": "Only the person driving the boat", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["water-safety", "boating", "life-jacket"]
},
{
  "id": "q309",
  "category": "water-safety",
  "question": "What does a double red flag at a beach typically signify?",
  "answers": [
    { "text": "Excellent swimming conditions", "correct": false },
    { "text": "Presence of jellyfish", "correct": false },
    { "text": "Water is closed to the public; dangerous conditions are present (e.g., strong currents, pollution)", "correct": true, "explanation": "Double red flags indicate severe hazards and that swimming is strictly prohibited." },
    { "text": "Strong currents, but swimming is allowed with caution", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["water-safety", "beach", "flags"]
},
{
  "id": "q310",
  "category": "water-safety",
  "question": "If you see someone struggling in the water and are not a trained lifeguard, what is the safest way to help?",
  "answers": [
    { "text": "Jump in immediately to save them", "correct": false },
    { "text": "Throw them a floating object or extend a reaching aid, and call for professional help", "correct": true, "explanation": "Untrained rescues can put both lives at risk. 'Reach or Throw, Don't Go' is a critical water safety principle." },
    { "text": "Shout advice from the shore", "correct": false },
    { "text": "Go find a stick and try to pull them out", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["water-safety", "rescue", "drowning"]
},

{
  "id": "q311",
  "category": "fire-safety",
  "question": "What are the three components of the 'fire triangle' that are necessary for a fire to start and continue?",
  "answers": [
    { "text": "Wood, paper, and oxygen", "correct": false },
    { "text": "Spark, fuel, and air", "correct": false },
    { "text": "Heat, Fuel, and Oxygen", "correct": true, "explanation": "Remove any one of these elements, and the fire will extinguish." },
    { "text": "Water, heat, and smoke", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["fire-safety", "fire-triangle", "chemistry"]
},
{
  "id": "q312",
  "category": "fire-safety",
  "question": "What type of fire extinguisher should be used on an electrical fire (Class C)?",
  "answers": [
    { "text": "Water (Class A)", "correct": false },
    { "text": "Foam (Class B)", "correct": false },
    { "text": "Dry chemical (Class ABC) or Carbon Dioxide (Class BC)", "correct": true, "explanation": "Water conducts electricity and foam can cause further electrical hazards. Dry chemical or CO2 extinguishers are non-conductive." },
    { "text": "A blanket (Class K)", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["fire-safety", "fire-extinguisher", "electrical"]
},
{
  "id": "q313",
  "category": "fire-safety",
  "question": "If your clothes catch fire, what should you do?",
  "answers": [
    { "text": "Run around to find water", "correct": false },
    { "text": "Fan the flames to put them out", "correct": false },
    { "text": "Stop, Drop, and Roll to smother the flames", "correct": true, "explanation": "This action cuts off the oxygen supply to the fire." },
    { "text": "Try to remove the burning clothing", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["fire-safety", "clothes-on-fire", "personal-safety"]
},
{
  "id": "q314",
  "category": "fire-safety",
  "question": "What is the main danger of using a faulty or overloaded extension cord?",
  "answers": [
    { "text": "It can shorten the lifespan of your devices", "correct": false },
    { "text": "It can cause a minor electrical shock", "correct": false },
    { "text": "It can overheat, leading to electrical fires", "correct": true, "explanation": "Overloaded or damaged cords generate excessive heat, which is a common cause of residential fires." },
    { "text": "It can slow down your internet connection", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["fire-safety", "electrical", "home-safety"]
},
{
  "id": "q315",
  "category": "fire-safety",
  "question": "When exiting a burning building, why should you stay low to the ground?",
  "answers": [
    { "text": "To avoid tripping over debris", "correct": false },
    { "text": "To stay hidden from the fire", "correct": false },
    { "text": "Smoke and toxic gases rise, so the air quality is better closer to the floor", "correct": true, "explanation": "Smoke inhalation is a major cause of death in fires. Staying low provides cleaner air and better visibility." },
    { "text": "It makes it easier for firefighters to see you", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["fire-safety", "evacuation", "smoke-inhalation"]
},

{
  "id": "q316",
  "category": "health-wellness",
  "question": "What is the recommended amount of sleep for an average adult to maintain good health?",
  "answers": [
    { "text": "4-5 hours", "correct": false },
    { "text": "6-7 hours", "correct": false },
    { "text": "7-9 hours", "correct": true, "explanation": "Adequate sleep is crucial for physical and mental health, including cognitive function, mood, and immune system strength." },
    { "text": "10+ hours", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["health", "sleep", "well-being"]
},
{
  "id": "q317",
  "category": "health-wellness",
  "question": "What is a common sign of dehydration?",
  "answers": [
    { "text": "Increased energy levels", "correct": false },
    { "text": "Clear urine", "correct": false },
    { "text": "Dark-colored urine, thirst, dry mouth, and fatigue", "correct": true, "explanation": "These symptoms indicate that your body needs more fluids to function properly." },
    { "text": "Feeling overly full", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["health", "hydration", "dehydration"]
},
{
  "id": "q318",
  "category": "health-wellness",
  "question": "What is the primary benefit of regular physical activity for long-term health?",
  "answers": [
    { "text": "It allows you to eat whatever you want without consequences", "correct": false },
    { "text": "It makes you look muscular instantly", "correct": false },
    { "text": "Reduces risk of chronic diseases (heart disease, diabetes), improves mental health, strengthens bones and muscles, and helps with weight management", "correct": true, "explanation": "Regular exercise is a cornerstone of preventative health." },
    { "text": "It guarantees you will never get sick", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["health", "exercise", "physical-activity"]
},
{
  "id": "q319",
  "category": "health-wellness",
  "question": "Why is it important to get vaccinated against preventable diseases?",
  "answers": [
    { "text": "Vaccines guarantee you'll never catch a disease", "correct": false },
    { "text": "To avoid having to take medication", "correct": false },
    { "text": "To protect yourself and contribute to 'herd immunity,' preventing the spread of diseases to vulnerable populations", "correct": true, "explanation": "Vaccines reduce individual risk and protect communities, especially those who cannot be vaccinated." },
    { "text": "They boost your immune system against all illnesses", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["health", "vaccination", "public-health"]
},
{
  "id": "q320",
  "category": "health-wellness",
  "question": "What is the significance of the 'ABCDE' rule for checking moles and skin spots?",
  "answers": [
    { "text": "It's a mnemonic for remembering sunscreen application", "correct": false },
    { "text": "It helps determine if a mole is growing hair", "correct": false },
    { "text": "It's a guide to identify potential signs of melanoma (Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolving)", "correct": true, "explanation": "Early detection of melanoma significantly improves treatment outcomes." },
    { "text": "It's for assessing the depth of a cut", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["health", "skin-cancer", "melanoma", "self-check"]
},

{
  "id": "q321",
  "category": "cyberbullying",
  "question": "What is cyberbullying?",
  "answers": [
    { "text": "Sending a lot of friendly messages online", "correct": false },
    { "text": "Using digital technologies to repeatedly harass, threaten, or embarrass someone", "correct": true, "explanation": "Cyberbullying involves harmful intent and repetition, causing distress to the victim." },
    { "text": "Playing online video games with strangers", "correct": false },
    { "text": "Debating different opinions in online forums", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["cyberbullying", "online-safety", "harassment"]
},
{
  "id": "q322",
  "category": "cyberbullying",
  "question": "If you or someone you know is being cyberbullied, what is the most important first step?",
  "answers": [
    { "text": "Retaliate immediately to scare the bully away", "correct": false },
    { "text": "Delete all evidence so no one can see it", "correct": false },
    { "text": "Do not respond to the bully, block them, save the evidence, and tell a trusted adult or authority figure", "correct": true, "explanation": "Responding often escalates the situation. Saving evidence is crucial for reporting, and seeking help is vital." },
    { "text": "Post publicly about the bully to shame them", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["cyberbullying", "reporting", "evidence"]
},
{
  "id": "q323",
  "category": "cyberbullying",
  "question": "Why is it important to think before you post anything online?",
  "answers": [
    { "text": "Because everything online disappears quickly anyway", "correct": false },
    { "text": "To make sure it gets the most likes", "correct": false },
    { "text": "Once something is posted, it can be permanent and accessible to a wide audience, potentially impacting your future", "correct": true, "explanation": "The 'digital footprint' lasts. Future employers, colleges, or even friends might see old posts." },
    { "text": "To avoid running out of things to say later", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["cyberbullying", "digital-footprint", "online-reputation"]
},
{
  "id": "q324",
  "category": "cyberbullying",
  "question": "What is a 'troll' in an online context?",
  "answers": [
    { "text": "Someone who offers helpful advice and support", "correct": false },
    { "text": "A mythological creature that lives under bridges", "correct": false },
    { "text": "Someone who intentionally posts inflammatory, extraneous, or off-topic messages to provoke readers and disrupt online discussions", "correct": true, "explanation": "Trolls seek to upset and create chaos, often through personal attacks or deceptive posts." },
    { "text": "A person who shares interesting facts", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["cyberbullying", "trolling", "online-behavior"]
},
{
  "id": "q325",
  "category": "cyberbullying",
  "question": "If an online game or platform has a reporting feature for inappropriate behavior, when should you use it?",
  "answers": [
    { "text": "Only if someone uses extremely offensive language", "correct": false },
    { "text": "Never, it's just part of the game", "correct": false },
    { "text": "Whenever someone violates the platform's terms of service or engages in harassment/abuse, to help maintain a safe environment", "correct": true, "explanation": "Reporting inappropriate behavior helps platform moderators address issues and protect users." },
    { "text": "Only if you are personally targeted", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["cyberbullying", "online-gaming", "reporting-features"]
},

{
  "id": "q326",
  "category": "road-safety",
  "question": "When driving, what is the 'two-second rule' for following distance?",
  "answers": [
    { "text": "It means you should always drive exactly two car lengths behind the car in front", "correct": false },
    { "text": "It means you should be able to count to two from when the car in front passes a fixed object until your car passes the same object", "correct": true, "explanation": "This rule provides a safe following distance, allowing enough time to react and stop if the vehicle ahead suddenly brakes." },
    { "text": "It's the time it takes to change lanes safely", "correct": false },
    { "text": "It's the maximum time you should look away from the road", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["road-safety", "driving", "following-distance"]
},
{
  "id": "q327",
  "category": "road-safety",
  "question": "What is the most common cause of traffic accidents?",
  "answers": [
    { "text": "Mechanical failure of vehicles", "correct": false },
    { "text": "Poor road conditions", "correct": false },
    { "text": "Driver error, including distracted driving, speeding, and impaired driving", "correct": true, "explanation": "Human factors are overwhelmingly the leading cause of collisions." },
    { "text": "Bad weather", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["road-safety", "accidents", "driver-error"]
},
{
  "id": "q328",
  "category": "road-safety",
  "question": "If you are involved in a minor fender-bender with no injuries, what is the first thing you should do after ensuring everyone's safety?",
  "answers": [
    { "text": "Drive away if the damage is minimal", "correct": false },
    { "text": "Immediately argue with the other driver about who is at fault", "correct": false },
    { "text": "Move your vehicles to a safe location if possible, and exchange insurance and contact information", "correct": true, "explanation": "Clear the road to prevent further accidents and ensure you have necessary information for insurance claims." },
    { "text": "Call your lawyer before talking to anyone", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["road-safety", "car-accident", "post-accident"]
},
{
  "id": "q329",
  "category": "road-safety",
  "question": "Why is it dangerous to use a cell phone (texting or talking) while driving?",
  "answers": [
    { "text": "It can distract you from enjoying the scenery", "correct": false },
    { "text": "It uses up your phone's battery faster", "correct": false },
    { "text": "It causes cognitive, visual, and manual distraction, significantly increasing the risk of an accident", "correct": true, "explanation": "Distracted driving impairs your ability to react to hazards, making accidents far more likely." },
    { "text": "It's only dangerous if you are speeding", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["road-safety", "distracted-driving", "cell-phone"]
},
{
  "id": "q330",
  "category": "road-safety",
  "question": "What is the purpose of reflective materials on clothing or vehicles when driving at night?",
  "answers": [
    { "text": "To make you look stylish", "correct": false },
    { "text": "To absorb light and keep you warm", "correct": false },
    { "text": "To increase visibility to other drivers, especially pedestrians and cyclists, in low-light conditions", "correct": true, "explanation": "Reflective materials bounce light back to the source, making objects easier to see and preventing accidents." },
    { "text": "To act as a secondary light source", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["road-safety", "night-driving", "visibility", "pedestrian-safety"]
},

{
  "id": "q331",
  "category": "mental-health",
  "question": "What is a common myth about mental health?",
  "answers": [
    { "text": "Mental health issues are often treatable", "correct": false },
    { "text": "Everyone has mental health, just like everyone has physical health", "correct": false },
    { "text": "Mental health problems are a sign of weakness or something to be ashamed of", "correct": true, "explanation": "Mental health conditions are illnesses, not character flaws, and are not a choice. Stigma prevents many from seeking help." },
    { "text": "Support for mental health is available", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["mental-health", "stigma", "myth"]
},
{
  "id": "q332",
  "category": "mental-health",
  "question": "If a friend confides in you that they are struggling with their mental health, what is the best initial response?",
  "answers": [
    { "text": "Tell them to just 'snap out of it'", "correct": false },
    { "text": "Give them unsolicited advice about what they should do", "correct": false },
    { "text": "Listen empathetically, offer support, and encourage them to seek professional help", "correct": true, "explanation": "Active listening and suggesting professional support are crucial first steps. Avoid minimizing their feelings." },
    { "text": "Ignore their concerns and change the subject", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["mental-health", "support", "empathy"]
},
{
  "id": "q333",
  "category": "mental-health",
  "question": "What are some healthy coping mechanisms for stress?",
  "answers": [
    { "text": "Excessive drinking or drug use", "correct": false },
    { "text": "Ignoring the stress and hoping it goes away", "correct": false },
    { "text": "Exercise, mindfulness, talking to a trusted person, engaging in hobbies, and getting enough sleep", "correct": true, "explanation": "Healthy coping strategies help manage stress effectively without causing further harm." },
    { "text": "Spending all your money on impulsive purchases", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["mental-health", "stress", "coping-mechanisms"]
},
{
  "id": "q334",
  "category": "mental-health",
  "question": "What is the importance of setting boundaries in relationships (personal or professional) for mental well-being?",
  "answers": [
    { "text": "Boundaries push people away and lead to loneliness", "correct": false },
    { "text": "Boundaries are only for people who are easily offended", "correct": false },
    { "text": "Boundaries protect your energy, time, and emotional space, preventing burnout and fostering healthier connections", "correct": true, "explanation": "Clear boundaries communicate your needs and limits, which are vital for self-respect and healthy interactions." },
    { "text": "Boundaries are a sign of distrust", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["mental-health", "boundaries", "relationships"]
},
{
  "id": "q335",
  "category": "mental-health",
  "question": "What is the difference between feeling sad and experiencing depression?",
  "answers": [
    { "text": "There is no difference; they are the same thing", "correct": false },
    { "text": "Sadness is a temporary emotion, while depression is a persistent mood disorder characterized by prolonged sadness, loss of interest, and other symptoms impacting daily life", "correct": true, "explanation": "Clinical depression is a serious medical condition requiring professional diagnosis and treatment, distinct from transient sadness." },
    { "text": "Depression only happens to weak people", "correct": false },
    { "text": "Sadness is always caused by a specific event, depression is not", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["mental-health", "depression", "sadness"]
},

{
  "id": "q336",
  "category": "emergency-preparedness",
  "question": "What is the purpose of a 'go bag' or emergency kit?",
  "answers": [
    { "text": "To have extra clothes for a quick trip", "correct": false },
    { "text": "To store sentimental items", "correct": false },
    { "text": "To provide essential supplies for survival for at least 72 hours in case of evacuation or disaster", "correct": true, "explanation": "An emergency kit ensures you have immediate access to necessities like food, water, first aid, and important documents." },
    { "text": "To carry your daily essentials", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["emergency-preparedness", "go-bag", "survival"]
},
{
  "id": "q337",
  "category": "emergency-preparedness",
  "question": "Why is it important to have an emergency meeting place established with family members?",
  "answers": [
    { "text": "To make sure everyone gets home on time for dinner", "correct": false },
    { "text": "To have a fun place to hang out after an emergency", "correct": false },
    { "text": "To ensure everyone knows where to go and can reconnect safely if separated during an emergency or evacuation", "correct": true, "explanation": "A pre-determined meeting point reduces confusion and anxiety when communication might be difficult." },
    { "text": "To avoid each other after a disaster", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["emergency-preparedness", "family-plan", "communication"]
},
{
  "id": "q338",
  "category": "emergency-preparedness",
  "question": "What type of important documents should be included in an emergency kit?",
  "answers": [
    { "text": "Only your passport", "correct": false },
    { "text": "Old shopping lists and receipts", "correct": false },
    { "text": "Copies of identification (passports, driver's licenses), insurance policies, birth certificates, and medical records", "correct": true, "explanation": "These documents are crucial for proving identity, accessing aid, and reconstructing your life after a disaster." },
    { "text": "Recent utility bills", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["emergency-preparedness", "documents", "identity"]
},
{
  "id": "q339",
  "category": "emergency-preparedness",
  "question": "How often should you check and refresh the items in your emergency kit?",
  "answers": [
    { "text": "Only after a major disaster has occurred", "correct": false },
    { "text": "Once every five years", "correct": false },
    { "text": "At least once a year, checking expiration dates on food and water, and updating medications and documents", "correct": true, "explanation": "Food and water expire, medications need to be current, and family needs may change. Regular checks ensure your kit is always ready." },
    { "text": "Never, items last indefinitely", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["emergency-preparedness", "maintenance", "go-bag"]
},
{
  "id": "q340",
  "category": "emergency-preparedness",
  "question": "Why is it advisable to keep your vehicle's fuel tank at least half full?",
  "answers": [
    { "text": "To get better gas mileage", "correct": false },
    { "text": "To make fewer stops at gas stations", "correct": false },
    { "text": "In case of an emergency evacuation, you have enough fuel to get to safety without worrying about gas stations being closed or inaccessible", "correct": true, "explanation": "During large-scale emergencies, fuel supplies can be disrupted or roads can become gridlocked, making a full tank critical." },
    { "text": "It keeps the engine cooler", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["emergency-preparedness", "vehicle-safety", "evacuation"]
},

{
  "id": "q341",
  "category": "environmental-safety",
  "question": "What is the primary concern with prolonged exposure to loud noise?",
  "answers": [
    { "text": "It can give you a headache", "correct": false },
    { "text": "It can be annoying", "correct": false },
    { "text": "It can lead to permanent hearing damage or loss", "correct": true, "explanation": "Loud noise can damage the delicate structures of the inner ear, leading to irreversible hearing loss." },
    { "text": "It makes it harder to concentrate", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["environmental-safety", "noise-pollution", "hearing-loss"]
},
{
  "id": "q342",
  "category": "environmental-safety",
  "question": "What does the UV Index measure, and why is it important for outdoor safety?",
  "answers": [
    { "text": "The wind speed, for kite flying", "correct": false },
    { "text": "The temperature, for dressing appropriately", "correct": false },
    { "text": "The strength of sun-burning ultraviolet (UV) radiation, helping you decide on sun protection measures", "correct": true, "explanation": "High UV levels increase the risk of sunburn, skin cancer, and eye damage. The index guides sun safety." },
    { "text": "The humidity level, for comfort", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["environmental-safety", "UV-index", "sun-safety"]
},
{
  "id": "q343",
  "category": "environmental-safety",
  "question": "What is the most effective way to protect yourself from mosquito-borne illnesses like West Nile or Zika?",
  "answers": [
    { "text": "Avoid going outside at all", "correct": false },
    { "text": "Eat garlic regularly", "correct": false },
    { "text": "Use EPA-registered insect repellent, wear long sleeves and pants, and eliminate standing water where mosquitoes breed", "correct": true, "explanation": "Reducing exposure and mosquito populations are key to preventing these diseases." },
    { "text": "Take antibiotics as a preventative measure", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["environmental-safety", "mosquito-borne-diseases", "insect-repellent"]
},
{
  "id": "q344",
  "category": "environmental-safety",
  "question": "Why is it dangerous to ignore air quality alerts (e.g., for smog or ozone)?",
  "answers": [
    { "text": "It means the weather will be unpleasant", "correct": false },
    { "text": "It can spoil your outdoor activities", "correct": false },
    { "text": "High levels of pollutants can cause respiratory problems, especially for sensitive groups, and exacerbate existing health conditions", "correct": true, "explanation": "Poor air quality directly impacts lung and cardiovascular health. Limiting exposure during alerts is crucial." },
    { "text": "It's just a government warning that doesn't affect individuals", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["environmental-safety", "air-quality", "respiratory-health"]
},
{
  "id": "q345",
  "category": "environmental-safety",
  "question": "What is the best practice for disposing of hazardous household waste (e.g., old batteries, paints, chemicals)?",
  "answers": [
    { "text": "Throw them in the regular trash", "correct": false },
    { "text": "Pour them down the drain or toilet", "correct": false },
    { "text": "Take them to designated hazardous waste collection sites or events", "correct": true, "explanation": "Improper disposal can contaminate soil and water, harming the environment and public health." },
    { "text": "Bury them in your backyard", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["environmental-safety", "hazardous-waste", "disposal"]
},

{
  "id": "q346",
  "category": "public-health",
  "question": "What is the role of handwashing in preventing the spread of infectious diseases?",
  "answers": [
    { "text": "It makes your hands smell good", "correct": false },
    { "text": "It only removes visible dirt", "correct": false },
    { "text": "It physically removes germs and viruses from your hands, breaking the chain of infection", "correct": true, "explanation": "Proper handwashing is one of the most effective ways to prevent the transmission of many common illnesses." },
    { "text": "It's only necessary before eating", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["public-health", "handwashing", "infectious-diseases"]
},
{
  "id": "q347",
  "category": "public-health",
  "question": "What is 'herd immunity' and why is it important for public health?",
  "answers": [
    { "text": "When animals become immune to human diseases", "correct": false },
    { "text": "When everyone takes the same medication", "correct": false },
    { "text": "Indirect protection from an infectious disease that happens when a population is immune to infection, thereby protecting unvaccinated individuals", "correct": true, "explanation": "Herd immunity protects vulnerable individuals who cannot be vaccinated, preventing widespread outbreaks." },
    { "text": "Immunity gained by eating a specific type of food", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["public-health", "herd-immunity", "vaccination"]
},
{
  "id": "q348",
  "category": "public-health",
  "question": "What is the best way to prevent the spread of colds and flu?",
  "answers": [
    { "text": "Shake hands with everyone to build immunity", "correct": false },
    { "text": "Avoid leaving your house during flu season", "correct": false },
    { "text": "Frequent handwashing, covering coughs/sneezes, avoiding touching your face, and getting vaccinated annually", "correct": true, "explanation": "These practices reduce the chances of contracting and transmitting respiratory viruses." },
    { "text": "Take large doses of vitamin C every day", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["public-health", "cold-flu", "prevention"]
},
{
  "id": "q349",
  "category": "public-health",
  "question": "What is the purpose of public health advisories and warnings during outbreaks?",
  "answers": [
    { "text": "To create panic among the population", "correct": false },
    { "text": "To entertain the public with health facts", "correct": false },
    { "text": "To inform the public about health risks, provide guidance on protective measures, and encourage collective action to control disease spread", "correct": true, "explanation": "Public health communications are vital for effective disease management and community protection." },
    { "text": "To restrict people's freedoms unnecessarily", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["public-health", "outbreak", "communication"]
},
{
  "id": "q350",
  "category": "public-health",
  "question": "What is the primary health risk associated with excessive sugar consumption?",
  "answers": [
    { "text": "It can make your teeth whiter", "correct": false },
    { "text": "It gives you immediate energy for a long time", "correct": false },
    { "text": "Increased risk of obesity, type 2 diabetes, heart disease, and dental decay", "correct": true, "explanation": "High sugar intake contributes to a range of chronic health problems beyond just weight gain." },
    { "text": "It improves your memory", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["public-health", "nutrition", "sugar", "chronic-disease"]
},

{
  "id": "q351",
  "category": "online",
  "question": "What is 'doxing' and why is it a privacy concern?",
  "answers": [
    { "text": "Sending anonymous gifts to someone online", "correct": false },
    { "text": "The process of searching for and publishing private or identifying information about an individual on the internet, typically with malicious intent", "correct": true, "explanation": "Doxing can lead to harassment, identity theft, and real-world harm by exposing sensitive personal data." },
    { "text": "Creating a public profile for a pet", "correct": false },
    { "text": "Sharing your professional accomplishments online", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["online-safety", "privacy", "doxing", "cybersecurity"]
},
{
  "id": "q352",
  "category": "online",
  "question": "You receive a message from a supposed technical support agent asking for remote access to your computer to fix an issue you didn't report. What should you do?",
  "answers": [
    { "text": "Grant them access immediately to get the issue fixed", "correct": false },
    { "text": "Try to fix it yourself by giving them your password", "correct": false },
    { "text": "Decline the request, hang up/block the sender, and report the scam attempt to relevant authorities", "correct": true, "explanation": "This is a common tech support scam aimed at gaining control of your computer or stealing personal information." },
    { "text": "Engage them in conversation to learn more about the 'issue'", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["online-safety", "tech-support-scam", "phishing"]
},
{
  "id": "q353",
  "category": "online",
  "question": "What is the primary risk of connecting to public, unsecured Wi-Fi networks?",
  "answers": [
    { "text": "Slow internet speeds", "correct": false },
    { "text": "Running out of battery on your device", "correct": false },
    { "text": "Your data (passwords, banking info) can be easily intercepted by malicious actors on the same network", "correct": true, "explanation": "Unsecured public Wi-Fi offers no encryption, making your online activities vulnerable to eavesdropping." },
    { "text": "You might accidentally download viruses", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["online-safety", "wi-fi-security", "data-privacy"]
},
{
  "id": "q354",
  "category": "online",
  "question": "What does a 'HTTPS' prefix in a website's URL indicate?",
  "answers": [
    { "text": "It's a very old website", "correct": false },
    { "text": "It's a website for shopping only", "correct": false },
    { "text": "That the connection to the website is encrypted and secure, protecting your data during transmission", "correct": true, "explanation": "HTTPS (Hypertext Transfer Protocol Secure) is crucial for protecting sensitive information exchanged online." },
    { "text": "It's a website that is currently under construction", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["online-safety", "HTTPS", "encryption", "web-security"]
},
{
  "id": "q355",
  "category": "online",
  "question": "What is 'ransomware'?",
  "answers": [
    { "text": "Software that helps you organize your files", "correct": false },
    { "text": "A type of online game where you collect items", "correct": false },
    { "text": "Malware that encrypts your files and demands a payment (ransom) to restore access", "correct": true, "explanation": "Ransomware is a major cybersecurity threat that can cripple individuals and organizations by locking up their data." },
    { "text": "A program that automatically backs up your data", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["online-safety", "ransomware", "malware", "cybersecurity"]
},

{
  "id": "q356",
  "category": "street",
  "question": "When walking at night, what color clothing offers the best visibility to drivers?",
  "answers": [
    { "text": "Dark blue or black", "correct": false },
    { "text": "White or light-colored clothing, especially with reflective elements", "correct": true, "explanation": "Light colors contrast better with the darkness, and reflective materials bounce headlight beams back to the driver." },
    { "text": "Green or brown to blend with nature", "correct": false },
    { "text": "Any color, as long as it's fashionable", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["street-safety", "night-safety", "visibility", "pedestrian-safety"]
},
{
  "id": "q357",
  "category": "street",
  "question": "If you are using an e-scooter or bicycle on a sidewalk (where permitted), what is a key safety practice?",
  "answers": [
    { "text": "Speed up to get off the sidewalk quickly", "correct": false },
    { "text": "Weave in and out of pedestrians", "correct": false },
    { "text": "Slow down, yield to pedestrians, and make your presence known respectfully", "correct": true, "explanation": "Pedestrians have the right of way on sidewalks. Operators must be cautious to avoid collisions." },
    { "text": "Assume pedestrians will hear you coming", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["street-safety", "e-scooter", "bicycle", "pedestrian-safety"]
},
{
  "id": "q358",
  "category": "street",
  "question": "What does the phrase 'Situational Awareness' mean in the context of street safety?",
  "answers": [
    { "text": "Only paying attention to your phone while walking", "correct": false },
    { "text": "Being aware of your immediate surroundings, potential threats, and escape routes", "correct": true, "explanation": "Good situational awareness allows you to identify and avoid dangerous situations before they escalate." },
    { "text": "Knowing where all the shops are located", "correct": false },
    { "text": "Only noticing things that directly affect you", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["street-safety", "situational-awareness", "prevention"]
},
{
  "id": "q359",
  "category": "street",
  "question": "If someone tries to snatch your bag or phone, what is generally recommended?",
  "answers": [
    { "text": "Fight back aggressively to keep your belongings", "correct": false },
    { "text": "Scream for help, but hold on tight to your items", "correct": false },
    { "text": "Let go of the item to avoid injury, and prioritize your personal safety over material possessions", "correct": true, "explanation": "Resisting can escalate the situation and lead to serious physical harm. Items can be replaced, you cannot." },
    { "text": "Run after them to get it back", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["street-safety", "robbery", "personal-safety"]
},
{
  "id": "q360",
  "category": "street",
  "question": "When meeting someone for the first time from an online dating app, what is a crucial safety measure?",
  "answers": [
    { "text": "Meet them at their home to build trust", "correct": false },
    { "text": "Go to a secluded location for privacy", "correct": false },
    { "text": "Meet in a public place, inform a friend or family member of your plans, and arrange your own transportation", "correct": true, "explanation": "Public meetings and a safety net reduce risks associated with meeting strangers." },
    { "text": "Don't tell anyone where you are going", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["street-safety", "online-dating", "personal-safety"]
},

{
  "id": "q361",
  "category": "home",
  "question": "What is the recommended maximum water heater temperature setting to prevent scalding?",
  "answers": [
    { "text": "60°C (140°F)", "correct": false },
    { "text": "70°C (158°F)", "correct": false },
    { "text": "49°C (120°F)", "correct": true, "explanation": "Water hotter than 120°F can cause serious burns in a very short time, especially for children and the elderly." },
    { "text": "90°C (194°F)", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["home-safety", "scalding", "water-heater"]
},
{
  "id": "q362",
  "category": "home",
  "question": "When storing cleaning products and chemicals, where is the safest place?",
  "answers": [
    { "text": "Under the kitchen sink for easy access", "correct": false },
    { "text": "On an open shelf where they are visible", "correct": false },
    { "text": "In their original containers, in a locked cabinet, out of reach of children and pets", "correct": true, "explanation": "Locked storage prevents accidental ingestion or exposure, especially by curious children or animals." },
    { "text": "Mixed together in a large bottle to save space", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["home-safety", "chemicals", "child-safety", "pet-safety"]
},
{
  "id": "q363",
  "category": "home",
  "question": "What is the purpose of ground fault circuit interrupters (GFCIs) in electrical outlets, especially in bathrooms and kitchens?",
  "answers": [
    { "text": "To prevent power surges", "correct": false },
    { "text": "To make outlets look modern", "correct": false },
    { "text": "To immediately shut off power if there's a ground fault, preventing severe electrical shock", "correct": true, "explanation": "GFCIs are designed to protect people from electrocution by detecting imbalances in electrical current." },
    { "text": "To charge devices faster", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["home-safety", "electrical", "GFCI"]
},
{
  "id": "q364",
  "category": "home",
  "question": "What is a safe alternative to candles for ambient lighting or power outages?",
  "answers": [
    { "text": "Open flame oil lamps", "correct": false },
    { "text": "Using a gas stove burner", "correct": false },
    { "text": "Battery-operated lanterns, flashlights, or LED candles", "correct": true, "explanation": "These alternatives eliminate the fire hazard associated with open flames." },
    { "text": "Leaving the oven door open for light and heat", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["home-safety", "fire-prevention", "lighting"]
},
{
  "id": "q365",
  "category": "home",
  "question": "If you are home alone and hear suspicious noises downstairs, what is your safest course of action?",
  "answers": [
    { "text": "Go downstairs quietly to investigate", "correct": false },
    { "text": "Shout loudly to scare them away", "correct": false },
    { "text": "Barricade yourself in a safe room, call emergency services (e.g., 911/112), and remain quiet until help arrives", "correct": true, "explanation": "Confronting an intruder can be extremely dangerous. Prioritizing your safety and calling for help is paramount." },
    { "text": "Turn on all the lights to see what's happening", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["home-safety", "intruder", "personal-safety"]
},

{
  "id": "q366",
  "category": "travel",
  "question": "When booking accommodations in an unfamiliar area, what is a good safety tip?",
  "answers": [
    { "text": "Choose the cheapest option regardless of reviews or location", "correct": false },
    { "text": "Book a place with no reviews to experience something new", "correct": false },
    { "text": "Read recent reviews focusing on safety and location, and check for 24-hour reception or good security measures", "correct": true, "explanation": "Researching accommodations helps ensure you choose a safe environment." },
    { "text": "Only book places recommended by strangers online", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["travel", "accommodation", "security"]
},
{
  "id": "q367",
  "category": "travel",
  "question": "What is a general rule for drinking water in developing countries or areas with uncertain water quality?",
  "answers": [
    { "text": "Drink tap water if it looks clear", "correct": false },
    { "text": "Only drink water from restaurants", "correct": false },
    { "text": "Only drink bottled water with an unbroken seal, or purify local water (boil, filter, chemical treatment)", "correct": true, "explanation": "Contaminated water can cause severe gastrointestinal illnesses. Always prioritize safe drinking water sources." },
    { "text": "Drink from public fountains if they are accessible", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["travel", "water-safety", "health", "developing-countries"]
},
{
  "id": "q368",
  "category": "travel",
  "question": "When flying, what valuable items should always be kept in your carry-on bag?",
  "answers": [
    { "text": "All your clothing", "correct": false },
    { "text": "Only heavy books", "correct": false },
    { "text": "Important documents, medications, electronics, and valuables", "correct": true, "explanation": "Checked luggage can be lost, delayed, or stolen. Keeping essentials and valuables with you ensures access and security." },
    { "text": "Souvenirs you bought at the airport", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["travel", "flying", "luggage", "valuables"]
},
{
  "id": "q369",
  "category": "travel",
  "question": "What is the purpose of purchasing travel insurance?",
  "answers": [
    { "text": "To guarantee sunny weather on your trip", "correct": false },
    { "text": "To get discounts on flights and hotels", "correct": false },
    { "text": "To cover unexpected expenses and losses such as medical emergencies, trip cancellations, lost luggage, or travel delays", "correct": true, "explanation": "Travel insurance provides financial protection against unforeseen events that can disrupt your trip." },
    { "text": "To impress your travel companions", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["travel", "travel-insurance", "emergencies"]
},
{
  "id": "q370",
  "category": "travel",
  "question": "If you are confronted by a local scammer trying to sell you an overpriced item or experience, what should you do?",
  "answers": [
    { "text": "Engage in a long negotiation to get the best price", "correct": false },
    { "text": "Buy the item to avoid confrontation", "correct": false },
    { "text": "Politely but firmly decline, walk away, and avoid direct eye contact to discourage further interaction", "correct": true, "explanation": "Engaging can encourage persistence. Disengaging quickly is usually the safest approach." },
    { "text": "Threaten to call the police", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["travel", "scams", "hawkers"]
},

{
  "id": "q371",
  "category": "general",
  "question": "What should you do if you encounter a suspicious package in a public place?",
  "answers": [
    { "text": "Open it to see what's inside", "correct": false },
    { "text": "Move it to a less conspicuous spot", "correct": false },
    { "text": "Do not touch it, move away from it, and report it to the authorities (e.g., police or security personnel) immediately", "correct": true, "explanation": "Treat suspicious packages as potential threats. The priority is to evacuate yourself and others, and notify experts." },
    { "text": "Take a photo and post it online asking what it is", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["general-safety", "suspicious-package", "public-safety"]
},
{
  "id": "q372",
  "category": "general",
  "question": "What does the phrase 'Run, Hide, Fight' refer to?",
  "answers": [
    { "text": "A new fitness routine", "correct": false },
    { "text": "A strategy for dealing with wild animal encounters", "correct": false },
    { "text": "A widely adopted protocol for responding to an active shooter or violent intruder situation", "correct": true, "explanation": "These actions provide options for increasing survival chances in such critical incidents." },
    { "text": "A game for children to play outdoors", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["general-safety", "active-shooter", "emergency-response"]
},
{
  "id": "q373",
  "category": "general",
  "question": "Why is it important to learn basic self-defense techniques?",
  "answers": [
    { "text": "To provoke fights with others", "correct": false },
    { "text": "To become a professional fighter", "correct": false },
    { "text": "To increase confidence, be better prepared to protect yourself in dangerous situations, and potentially deter attackers", "correct": true, "explanation": "Self-defense provides skills and awareness that can be crucial for personal safety, not for aggression." },
    { "text": "To only be able to defend yourself against trained martial artists", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["general-safety", "self-defense", "personal-safety"]
},
{
  "id": "q374",
  "category": "general",
  "question": "When driving in foggy conditions, what lights should you use?",
  "answers": [
    { "text": "High beams to see further", "correct": false },
    { "text": "Daytime running lights only", "correct": false },
    { "text": "Low beams or fog lights to improve visibility without blinding oncoming drivers", "correct": true, "explanation": "High beams reflect off the fog, reducing visibility. Low beams or fog lights project light lower, improving vision." },
    { "text": "No lights, as they can cause reflections", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["general-safety", "driving", "foggy-conditions"]
},
{
  "id": "q375",
  "category": "general",
  "question": "What is the primary danger of swimming in unsupervised quarries or construction sites?",
  "answers": [
    { "text": "The water might be too cold", "correct": false },
    { "text": "The lack of changing facilities", "correct": false },
    { "text": "Unstable edges, deep and cold water, hidden machinery, and no lifeguards, leading to high risk of drowning or injury", "correct": true, "explanation": "These sites are not designed for recreation and pose numerous hidden hazards." },
    { "text": "The water might be too murky to see your feet", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["general-safety", "swimming-hazards", "quarry"]
},

{
  "id": "q376",
  "category": "workplace",
  "question": "What does a yellow caution sign in a workplace typically indicate?",
  "answers": [
    { "text": "An immediate danger that will cause death or serious injury", "correct": false },
    { "text": "A temporary closure of the area", "correct": false },
    { "text": "A potential hazard or unsafe practice that could result in minor or moderate injury", "correct": true, "explanation": "Yellow signs warn of conditions that require careful attention to avoid accidents." },
    { "text": "An area where food is served", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["workplace-safety", "safety-signs", "hazard-warning"]
},
{
  "id": "q377",
  "category": "workplace",
  "question": "What is the 'Hierarchy of Controls' in workplace safety?",
  "answers": [
    { "text": "A list of managers responsible for safety", "correct": false },
    { "text": "A system for ranking employee safety suggestions", "correct": false },
    { "text": "A system for controlling risks, prioritizing elimination, substitution, engineering controls, administrative controls, and PPE", "correct": true, "explanation": "This hierarchy prioritizes the most effective and permanent controls over less effective ones like PPE." },
    { "text": "The order in which safety drills are conducted", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["workplace-safety", "risk-management", "hierarchy-of-controls"]
},
{
  "id": "q378",
  "category": "workplace",
  "question": "If you are unsure how to safely operate a piece of equipment at work, what should you do?",
  "answers": [
    { "text": "Guess based on similar equipment", "correct": false },
    { "text": "Watch a colleague and try to imitate them", "correct": false },
    { "text": "Stop, ask for training, consult the manual, or seek guidance from a supervisor or qualified person", "correct": true, "explanation": "Operating equipment without proper knowledge can lead to serious accidents and injuries." },
    { "text": "Try it and learn from your mistakes", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["workplace-safety", "equipment-operation", "training"]
},
{
  "id": "q379",
  "category": "workplace",
  "question": "What is a 'Near Miss' in a workplace context, and why is it important to report?",
  "answers": [
    { "text": "An almost completed sale; for sales reports", "correct": false },
    { "text": "An instance where an accident almost happened but did not result in injury or damage; because it helps identify hazards and prevent future accidents", "correct": true, "explanation": "Near misses are valuable indicators of potential hazards that need to be addressed to prevent actual incidents." },
    { "text": "A close call with a deadline; for project management", "correct": false },
    { "text": "An employee who nearly missed their shift; for attendance records", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["workplace-safety", "near-miss", "hazard-identification"]
},
{
  "id": "q380",
  "category": "workplace",
  "question": "What is the primary benefit of good ergonomics in the workplace?",
  "answers": [
    { "text": "To make the office look more aesthetic", "correct": false },
    { "text": "To encourage more breaks", "correct": false },
    { "text": "To reduce discomfort, prevent musculoskeletal injuries, and improve productivity by designing workspaces and tasks to fit the worker", "correct": true, "explanation": "Ergonomics focuses on fitting the job to the person, enhancing health and efficiency." },
    { "text": "To speed up internet connection", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["workplace-safety", "ergonomics", "injury-prevention"]
},

{
  "id": "q381",
  "category": "first-aid",
  "question": "When should you NOT move someone who has been injured?",
  "answers": [
    { "text": "If they are in immediate danger (e.g., burning building)", "correct": false },
    { "text": "If they are conscious and can walk", "correct": false },
    { "text": "If you suspect a head, neck, or spinal injury, unless their life is in immediate danger", "correct": true, "explanation": "Moving someone with a suspected spinal injury can cause further, irreversible damage. Immobilization is key." },
    { "text": "If they are bleeding heavily", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["first-aid", "spinal-injury", "movement"]
},
{
  "id": "q382",
  "category": "first-aid",
  "question": "What are the common signs of a heart attack in an adult?",
  "answers": [
    { "text": "Sudden headache and dizziness", "correct": false },
    { "text": "Sharp pain in the leg and arm", "correct": false },
    { "text": "Chest pain or discomfort, shortness of breath, pain radiating to the arm, jaw, or back, and cold sweats", "correct": true, "explanation": "Recognizing these symptoms is critical for seeking immediate medical attention." },
    { "text": "Blurred vision and ringing in the ears", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["first-aid", "heart-attack", "emergency"]
},
{
  "id": "q383",
  "category": "first-aid",
  "question": "What is the recommended treatment for a minor cut or scrape?",
  "answers": [
    { "text": "Cover it immediately with a dirty bandage", "correct": false },
    { "text": "Pour alcohol directly onto it", "correct": false },
    { "text": "Clean the wound with soap and water, apply antiseptic, and cover with a sterile bandage", "correct": true, "explanation": "Proper wound care prevents infection and promotes healing." },
    { "text": "Leave it open to the air to heal faster", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["first-aid", "cuts", "scrapes", "wound-care"]
},
{
  "id": "q384",
  "category": "first-aid",
  "question": "If someone is experiencing symptoms of heatstroke, what is the first priority?",
  "answers": [
    { "text": "Give them a hot drink to warm them up", "correct": false },
    { "text": "Wrap them in blankets to cause sweating", "correct": false },
    { "text": "Move them to a cooler environment, loosen clothing, and apply cool, wet cloths or immerse them in cool water to lower body temperature", "correct": true, "explanation": "Heatstroke is a medical emergency requiring rapid cooling to prevent organ damage or death." },
    { "text": "Ignore them and hope they recover on their own", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["first-aid", "heatstroke", "emergency"]
},
{
  "id": "q385",
  "category": "first-aid",
  "question": "What should you NOT do if someone is choking and able to cough forcefully?",
  "answers": [
    { "text": "Encourage them to keep coughing", "correct": false },
    { "text": "Call for emergency help if the choking becomes severe", "correct": false },
    { "text": "Perform abdominal thrusts (Heimlich maneuver)", "correct": true, "explanation": "If a person can cough, their airway is not fully blocked. Intervening can make the situation worse by dislodging the object further down." },
    { "text": "Stay with them and monitor their condition", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["first-aid", "choking", "heimlich"]
},

{
  "id": "q386",
  "category": "natural-disasters",
  "question": "What is the 'Eye' of a hurricane?",
  "answers": [
    { "text": "The strongest part of the storm with the highest winds", "correct": false },
    { "text": "The outer bands where rain is heaviest", "correct": false },
    { "text": "The calm, clear center of the hurricane, surrounded by the eyewall (most intense part)", "correct": true, "explanation": "The eye is deceptively calm, but the dangerous conditions of the eyewall will return." },
    { "text": "The area where the hurricane first makes landfall", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["natural-disasters", "hurricane", "meteorology"]
},
{
  "id": "q387",
  "category": "natural-disasters",
  "question": "What is the primary danger during a severe winter storm or blizzard if you are stranded in your car?",
  "answers": [
    { "text": "Running out of snacks", "correct": false },
    { "text": "Being bored", "correct": false },
    { "text": "Hypothermia and carbon monoxide poisoning if running the engine without proper ventilation", "correct": true, "explanation": "Exhaust can be blocked by snow, leading to deadly CO buildup inside the vehicle. Hypothermia is a risk due to extreme cold." },
    { "text": "Getting a flat tire", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["natural-disasters", "blizzard", "car-safety", "carbon-monoxide"]
},
{
  "id": "q388",
  "category": "natural-disasters",
  "question": "If you are advised to 'shelter in place' due to a hazardous materials incident, what does that mean?",
  "answers": [
    { "text": "Evacuate the area as quickly as possible", "correct": false },
    { "text": "Go outside to see what is happening", "correct": false },
    { "text": "Go indoors immediately, close and seal all windows and doors, and turn off ventilation systems", "correct": true, "explanation": "This protects you from external airborne contaminants by creating a temporary barrier." },
    { "text": "Gather your family and wait by the front door", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["natural-disasters", "hazmat", "shelter-in-place"]
},
{
  "id": "q389",
  "category": "natural-disasters",
  "question": "What should you do if you are caught outdoors during a severe thunderstorm with lightning?",
  "answers": [
    { "text": "Seek shelter under a tall tree", "correct": false },
    { "text": "Lie flat on the ground in an open field", "correct": false },
    { "text": "Seek immediate shelter in a sturdy building or enclosed metal vehicle; if none are available, crouch low in an open area", "correct": true, "explanation": "Tall objects and open fields increase your risk of being struck by lightning." },
    { "text": "Continue your outdoor activity, hoping it will pass", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["natural-disasters", "thunderstorm", "lightning"]
},
{
  "id": "q390",
  "category": "natural-disasters",
  "question": "During a power outage, what is a safe way to provide light without using candles?",
  "answers": [
    { "text": "Open the refrigerator door for light", "correct": false },
    { "text": "Use a gas stove burner", "correct": false },
    { "text": "Flashlights, battery-powered lanterns, or solar-powered lights", "correct": true, "explanation": "These options provide light without the fire risk associated with candles or other open flames." },
    { "text": "Keep your phone's flashlight on indefinitely", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["natural-disasters", "power-outage", "lighting-safety"]
},

{
  "id": "q391",
  "category": "children-safety",
  "question": "At what age should children typically switch from a forward-facing car seat to a booster seat?",
  "answers": [
    { "text": "When they turn 1 year old", "correct": false },
    { "text": "When they complain about being in a car seat", "correct": false },
    { "text": "When they exceed the height or weight limits of their forward-facing car seat, usually around 4-8 years old", "correct": true, "explanation": "It's based on size and development, not just age, to ensure proper fit of the vehicle's seatbelt." },
    { "text": "When they ask to sit in the front seat", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["children-safety", "car-seat", "booster-seat"]
},
{
  "id": "q392",
  "category": "children-safety",
  "question": "What is the '5-second rule' commonly used for in relation to children and hot surfaces?",
  "answers": [
    { "text": "It's the maximum time food can be on the floor and still be safe to eat", "correct": false },
    { "text": "It's how quickly a child can get into trouble if left unsupervised", "correct": false },
    { "text": "It's a guideline that if you can't hold your hand on a surface for 5 seconds, it's too hot for a child's skin", "correct": true, "explanation": "This rule helps prevent burns from hot pavement, metal slides, or other heated objects." },
    { "text": "It's the time it takes for a child to cool down after exercise", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["children-safety", "burns", "hot-surfaces"]
},
{
  "id": "q393",
  "category": "children-safety",
  "question": "What is the safest place for children under 12 to ride in a vehicle?",
  "answers": [
    { "text": "The front passenger seat", "correct": false },
    { "text": "In the very back row of an SUV or minivan", "correct": false },
    { "text": "In the back seat, preferably in a car seat or booster seat appropriate for their size and age", "correct": true, "explanation": "The back seat is safest to avoid injury from airbags or direct impact in a frontal collision." },
    { "text": "On a parent's lap in the front seat", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["children-safety", "car-safety", "seatbelts"]
},
{
  "id": "q394",
  "category": "children-safety",
  "question": "When babysitting, what information should you always have readily available?",
  "answers": [
    { "text": "The latest gossip from school", "correct": false },
    { "text": "The child's favorite TV shows", "correct": false },
    { "text": "Emergency contact numbers (parents, pediatrician, poison control, emergency services), child's allergies, and relevant medical conditions", "correct": true, "explanation": "Access to critical information allows for quick and appropriate action in an emergency." },
    { "text": "A list of all their toys", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["children-safety", "babysitting", "emergency-contacts"]
},
{
  "id": "q395",
  "category": "children-safety",
  "question": "What is the main danger of leaving small toys or balloons within reach of infants and toddlers?",
  "answers": [
    { "text": "They might break them", "correct": false },
    { "text": "They might get lost", "correct": false },
    { "text": "They pose a choking hazard, as small items can easily block a child's airway", "correct": true, "explanation": "Infants and toddlers explore by putting objects in their mouths. Any item small enough to fit through a toilet paper roll is a choking risk." },
    { "text": "They might make a mess", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["children-safety", "choking-hazards", "toys"]
},

{
  "id": "q396",
  "category": "pet-safety",
  "question": "What is an appropriate response if your dog suddenly becomes aggressive towards a stranger?",
  "answers": [
    { "text": "Punish the dog harshly to show dominance", "correct": false },
    { "text": "Let the dog continue to assert its dominance", "correct": false },
    { "text": "Immediately remove the dog from the situation, manage the environment, and seek professional training or veterinary advice to address the underlying cause", "correct": true, "explanation": "Aggression indicates a problem that needs to be safely managed and addressed to prevent harm and improve behavior." },
    { "text": "Tell the stranger to leave immediately", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["pet-safety", "dog-behavior", "aggression", "training"]
},
{
  "id": "q397",
  "category": "pet-safety",
  "question": "What are common signs of heatstroke in pets?",
  "answers": [
    { "text": "Increased appetite and playfulness", "correct": false },
    { "text": "Excessive panting, lethargy, drooling, vomiting, and loss of coordination", "correct": true, "explanation": "Recognizing these signs early is critical for immediate intervention to cool the animal down and seek veterinary care." },
    { "text": "Shivering and seeking warmth", "correct": false },
    { "text": "Sleeping more than usual", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["pet-safety", "heatstroke", "animal-health"]
},
{
  "id": "q398",
  "category": "pet-safety",
  "question": "Why is it important to keep household plants out of reach of pets?",
  "answers": [
    { "text": "Pets might make a mess with the soil", "correct": false },
    { "text": "Many common household plants are toxic to pets if ingested", "correct": true, "explanation": "Ingesting toxic plants can cause mild to severe health problems, organ damage, or even death in pets." },
    { "text": "Pets might chew on the leaves and ruin the plant's appearance", "correct": false },
    { "text": "Pets might drink the water from the plant's pot", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["pet-safety", "toxic-plants", "poisoning"]
},
{
  "id": "q399",
  "category": "pet-safety",
  "question": "What is the safest way to restrain a cat if it needs to go to the vet and is resistant?",
  "answers": [
    { "text": "Grab it by the scruff of its neck and force it into a carrier", "correct": false },
    { "text": "Try to calm it down by talking loudly", "correct": false },
    { "text": "Use a towel to gently wrap it, then place it into a secure, hard-sided carrier", "correct": true, "explanation": "A towel protects you from scratches and helps calm the cat, and a secure carrier prevents escape during transport." },
    { "text": "Let it roam freely in the car", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["pet-safety", "cat-handling", "vet-visits"]
},
{
  "id": "q400",
  "category": "pet-safety",
  "question": "What is the purpose of regular veterinary check-ups for pets?",
  "answers": [
    { "text": "Only to get vaccinations", "correct": false },
    { "text": "To socialize your pet with other animals", "correct": false },
    { "text": "To maintain preventative health, detect potential health issues early, and ensure vaccinations and parasite prevention are up-to-date", "correct": true, "explanation": "Regular vet visits are essential for a pet's long-term health and well-being." },
    { "text": "To get a new collar every year", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["pet-safety", "veterinary-care", "preventative-health"]
},

{
  "id": "q401",
  "category": "recreational-safety",
  "question": "When engaging in winter sports, why is it crucial to dress in layers?",
  "answers": [
    { "text": "To make you look more fashionable on the slopes", "correct": false },
    { "text": "To make it harder for you to move quickly", "correct": false },
    { "text": "Layers allow you to regulate body temperature by adding or removing clothing as activity levels and external temperatures change", "correct": true, "explanation": "Layering prevents overheating and chilling, both of which can be dangerous in cold environments." },
    { "text": "To protect against falling snow", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["recreational-safety", "winter-sports", "dressing-in-layers"]
},
{
  "id": "q402",
  "category": "recreational-safety",
  "question": "What is the 'buddy system' in outdoor activities (e.g., hiking, camping)?",
  "answers": [
    { "text": "Bringing your pet along for company", "correct": false },
    { "text": "Carrying a small doll or toy with you", "correct": false },
    { "text": "Participating with a companion who can provide assistance or seek help in an emergency", "correct": true, "explanation": "The buddy system ensures someone is aware of your status and can act if something goes wrong." },
    { "text": "Using a smartphone to track your friends", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["recreational-safety", "buddy-system", "outdoor-activities"]
},
{
  "id": "q403",
  "category": "recreational-safety",
  "question": "Before using a campfire, what is the most important safety precaution?",
  "answers": [
    { "text": "Gather as much wood as possible", "correct": false },
    { "text": "Light it quickly before the wind picks up", "correct": false },
    { "text": "Ensure there is a clear area around the fire pit, away from flammable materials, and have water/fire extinguisher nearby", "correct": true, "explanation": "Preventing the spread of fire is paramount to avoiding wildfires." },
    { "text": "Build it as large as possible for warmth", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["recreational-safety", "campfire", "fire-prevention"]
},
{
  "id": "q404",
  "category": "recreational-safety",
  "question": "When boating or kayaking, what should you do before heading out on the water?",
  "answers": [
    { "text": "Assume the weather will remain calm", "correct": false },
    { "text": "Overload the vessel with extra gear", "correct": false },
    { "text": "Check weather forecasts, inspect equipment, inform someone of your route and estimated return time, and wear a life jacket", "correct": true, "explanation": "Preparation is key to safe boating, allowing you to anticipate conditions and get help if needed." },
    { "text": "Go alone to enjoy solitude", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["recreational-safety", "boating", "kayaking", "preparedness"]
},
{
  "id": "q405",
  "category": "recreational-safety",
  "question": "What is 'Leave No Trace' in the context of outdoor ethics?",
  "answers": [
    { "text": "Leaving small markers to find your way back", "correct": false },
    { "text": "Taking only pictures and leaving only footprints, minimizing your impact on natural environments", "correct": true, "explanation": "This principle promotes responsible recreation to preserve the natural beauty and ecological health of outdoor areas." },
    { "text": "Leaving all your trash behind to decompose naturally", "correct": false },
    { "text": "Not telling anyone where you went hiking", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["recreational-safety", "outdoor-ethics", "leave-no-trace"]
},

{
  "id": "q406",
  "category": "first-aid",
  "question": "What does an Automated External Defibrillator (AED) do?",
  "answers": [
    { "text": "Measures blood pressure", "correct": false },
    { "text": "Administers medication for heart conditions", "correct": false },
    { "text": "Delivers an electrical shock to restore a normal heart rhythm in cases of sudden cardiac arrest", "correct": true, "explanation": "AEDs are vital life-saving devices used in conjunction with CPR." },
    { "text": "Massages the heart externally", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["first-aid", "AED", "cardiac-arrest"]
},
{
  "id": "q407",
  "category": "first-aid",
  "question": "What is the best way to stop bleeding from a minor cut on the finger?",
  "answers": [
    { "text": "Let it bleed out to clean the wound", "correct": false },
    { "text": "Apply a cold pack directly to the wound", "correct": false },
    { "text": "Apply direct pressure with a clean cloth, and if possible, elevate the hand above the heart", "correct": true, "explanation": "Direct pressure and elevation are effective for controlling minor bleeding." },
    { "text": "Tie a tourniquet tightly around the finger", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["first-aid", "bleeding", "minor-cuts"]
},
{
  "id": "q408",
  "category": "first-aid",
  "question": "If someone is experiencing symptoms of hypoglycemia (low blood sugar), and is conscious, what should you give them?",
  "answers": [
    { "text": "A diet soda", "correct": false },
    { "text": "A glass of water", "correct": false },
    { "text": "A fast-acting carbohydrate like fruit juice, candy, or glucose tablets", "correct": true, "explanation": "Quickly raising blood sugar levels is critical to prevent a severe hypoglycemic episode." },
    { "text": "A high-fat meal", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["first-aid", "hypoglycemia", "diabetes"]
},
{
  "id": "q409",
  "category": "first-aid",
  "question": "What is the most important step to take after applying a dressing to a wound?",
  "answers": [
    { "text": "Remove the dressing to check if the bleeding has stopped", "correct": false },
    { "text": "Continue to apply firm, direct pressure and monitor for continued bleeding or signs of infection", "correct": true, "explanation": "Continued pressure is crucial for hemostasis, and monitoring for infection ensures proper wound healing." },
    { "text": "Ignore the wound and focus on other injuries", "correct": false },
    { "text": "Apply a second, looser dressing over the first", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["first-aid", "wound-care", "bleeding"]
},
{
  "id": "q410",
  "category": "first-aid",
  "question": "When assessing an unconscious person, what does 'AVPU' stand for?",
  "answers": [
    { "text": "Always Verify Patients' Understanding", "correct": false },
    { "text": "Airway, Ventilation, Pulse, Urine", "correct": false },
    { "text": "Alert, Voice, Pain, Unresponsive – a scale to assess a patient's level of consciousness", "correct": true, "explanation": "The AVPU scale is a quick and simple way to gauge responsiveness in first aid." },
    { "text": "Assist, Vaccinate, Protect, Urge", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["first-aid", "consciousness", "AVPU"]
},

{
  "id": "q411",
  "category": "home-safety",
  "question": "What is a safe maximum amount of weight to store on upper shelves or in high cabinets?",
  "answers": [
    { "text": "As much as you can fit", "correct": false },
    { "text": "Only light items to prevent instability and falling hazards", "correct": true, "explanation": "Heavy items on high shelves can cause shelves to collapse or items to fall, leading to injuries." },
    { "text": "Heavy items, as they are less likely to be bumped", "correct": false },
    { "text": "Only items you rarely use", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["home-safety", "storage", "falling-hazards"]
},
{
  "id": "q412",
  "category": "home-safety",
  "question": "Why is it dangerous to stand on the top step of a stepladder?",
  "answers": [
    { "text": "It can scratch the ceiling", "correct": false },
    { "text": "It makes it harder to reach things", "correct": false },
    { "text": "It significantly increases the risk of losing balance and falling, as it's not designed to be a standing platform", "correct": true, "explanation": "The top step often lacks stability and a proper handhold, making falls common." },
    { "text": "It can damage the ladder", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["home-safety", "ladders", "falls"]
},
{
  "id": "q413",
  "category": "home-safety",
  "question": "What is the purpose of child safety locks on cabinets and drawers?",
  "answers": [
    { "text": "To organize your belongings better", "correct": false },
    { "text": "To keep adults from accessing items easily", "correct": false },
    { "text": "To prevent young children from accessing hazardous items (chemicals, sharp objects) or getting fingers pinched", "correct": true, "explanation": "These locks are crucial for preventing accidents involving curious children." },
    { "text": "To add a decorative touch to furniture", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["home-safety", "child-proofing", "cabinet-locks"]
},
{
  "id": "q414",
  "category": "home-safety",
  "question": "What should you do with expired or unused prescription medications?",
  "answers": [
    { "text": "Flush them down the toilet", "correct": false },
    { "text": "Keep them in the medicine cabinet for future use", "correct": false },
    { "text": "Take them to a designated medication take-back program or follow local guidelines for safe disposal", "correct": true, "explanation": "Improper disposal can lead to environmental contamination or accidental poisoning. Keeping them can lead to misuse." },
    { "text": "Throw them in the regular household trash", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["home-safety", "medication-disposal", "poisoning-prevention"]
},
{
  "id": "q415",
  "category": "home-safety",
  "question": "Why is it important to clean dryer lint traps after every load?",
  "answers": [
    { "text": "To make your clothes dry faster", "correct": false },
    { "text": "To extend the life of your dryer", "correct": false },
    { "text": "To prevent lint buildup, which is a common cause of household fires", "correct": true, "explanation": "Lint is highly flammable, and accumulated lint in the trap or vent can easily ignite." },
    { "text": "To improve the smell of your laundry", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["home-safety", "fire-prevention", "dryer-maintenance"]
},

{
  "id": "q416",
  "category": "food-safety",
  "question": "What is the common term for food poisoning caused by bacteria, viruses, or parasites in contaminated food?",
  "answers": [
    { "text": "Food allergy", "correct": false },
    { "text": "Food intolerance", "correct": false },
    { "text": "Foodborne illness", "correct": true, "explanation": "Foodborne illnesses are caused by consuming food contaminated with harmful microorganisms or toxins." },
    { "text": "Stomach flu", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["food-safety", "foodborne-illness", "food-poisoning"]
},
{
  "id": "q417",
  "category": "food-safety",
  "question": "What does a 'Best By' or 'Use By' date on food packaging indicate?",
  "answers": [
    { "text": "That the food is definitely unsafe after this date", "correct": false },
    { "text": "The date the food was manufactured", "correct": false },
    { "text": "A recommendation for when food is at its best quality (Best By) or when it should be consumed for safety (Use By)", "correct": true, "explanation": "While 'Best By' refers to quality, 'Use By' is a safety indicator, especially for highly perishable foods." },
    { "text": "The date the product will be restocked", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["food-safety", "expiration-dates", "food-quality"]
},
{
  "id": "q418",
  "category": "food-safety",
  "question": "Why should you avoid washing raw chicken before cooking?",
  "answers": [
    { "text": "It removes flavor from the chicken", "correct": false },
    { "text": "It makes the chicken tougher", "correct": false },
    { "text": "It can spread bacteria (like Salmonella) from the chicken to other surfaces in the kitchen via splashing water", "correct": true, "explanation": "Washing raw chicken creates a risk of cross-contamination. Cooking to the correct internal temperature kills bacteria." },
    { "text": "It reduces the nutritional value", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["food-safety", "raw-chicken", "cross-contamination"]
},
{
  "id": "q419",
  "category": "food-safety",
  "question": "What is the safest temperature for refrigerating perishable foods?",
  "answers": [
    { "text": "10°C (50°F)", "correct": false },
    { "text": "Above 5°C (41°F)", "correct": false },
    { "text": "At or below 4°C (40°F)", "correct": true, "explanation": "This temperature slows the growth of most harmful bacteria." },
    { "text": "0°C (32°F)", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["food-safety", "refrigeration", "temperature"]
},
{
  "id": "q420",
  "category": "food-safety",
  "question": "What is the primary risk of eating wild mushrooms without expert identification?",
  "answers": [
    { "text": "They might taste bad", "correct": false },
    { "text": "They might be tough to chew", "correct": false },
    { "text": "Many wild mushrooms are highly poisonous and can cause severe illness, organ damage, or death", "correct": true, "explanation": "Misidentifying edible mushrooms can have fatal consequences. Never eat wild mushrooms unless identified by an expert." },
    { "text": "They might contain too many calories", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["food-safety", "wild-mushrooms", "poisoning"]
},

{
  "id": "q421",
  "category": "online",
  "question": "What is a 'strong password' characterized by?",
  "answers": [
    { "text": "Being short and easy to remember", "correct": false },
    { "text": "Using only lowercase letters", "correct": false },
    { "text": "A combination of upper and lowercase letters, numbers, and symbols, and at least 12-16 characters long", "correct": true, "explanation": "Complexity and length make passwords much harder for hackers to guess or crack." },
    { "text": "Your birthdate or common words", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["online-safety", "password-security", "cybersecurity"]
},
{
  "id": "q422",
  "category": "online",
  "question": "What is the safest way to store multiple passwords?",
  "answers": [
    { "text": "Write them down on sticky notes attached to your monitor", "correct": false },
    { "text": "Use the same password for all accounts", "correct": false },
    { "text": "Use a reputable password manager, which securely encrypts and stores your login credentials", "correct": true, "explanation": "Password managers generate and store complex, unique passwords, protected by a single master password." },
    { "text": "Memorize them all perfectly without writing them down", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["online-safety", "password-manager", "cybersecurity"]
},
{
  "id": "q423",
  "category": "online",
  "question": "Why is it generally unsafe to post your full vacation itinerary on social media before or during your trip?",
  "answers": [
    { "text": "It might make your friends jealous", "correct": false },
    { "text": "It can attract too many unsolicited travel tips", "correct": false },
    { "text": "It advertises that your home will be vacant, making it a target for burglars", "correct": true, "explanation": "Sharing travel plans publicly can alert criminals to opportune times for home invasion." },
    { "text": "It reveals too much about your travel style", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["online-safety", "social-media", "home-security"]
},
{
  "id": "q424",
  "category": "online",
  "question": "What is a common indicator that an email is a phishing attempt?",
  "answers": [
    { "text": "It uses a familiar company logo", "correct": false },
    { "text": "It asks you to confirm personal information, contains suspicious links, and has grammatical errors or an urgent tone", "correct": true, "explanation": "Phishing emails are designed to trick you into revealing sensitive information. Look for these warning signs." },
    { "text": "It comes from a known sender's name", "correct": false },
    { "text": "It has a catchy subject line", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["online-safety", "phishing", "email-scams"]
},
{
  "id": "q425",
  "category": "online",
  "question": "What is the main purpose of privacy settings on social media platforms?",
  "answers": [
    { "text": "To hide your profile from everyone", "correct": false },
    { "text": "To make your profile more exclusive", "correct": false },
    { "text": "To control who can see your posts, photos, and personal information, thus managing your digital footprint and online safety", "correct": true, "explanation": "Adjusting privacy settings allows you to limit exposure and protect your personal data from unintended audiences." },
    { "text": "To simplify the platform's interface", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["online-safety", "privacy-settings", "social-media"]
},

{
  "id": "q426",
  "category": "general-safety",
  "question": "What is the importance of having a designated meeting point outside your home in case of a fire or other emergency?",
  "answers": [
    { "text": "To make sure everyone gets fresh air", "correct": false },
    { "text": "To have a place to discuss what happened", "correct": false },
    { "text": "To ensure everyone has safely evacuated and is accounted for, preventing anyone from re-entering a dangerous situation to search for missing family members", "correct": true, "explanation": "A meeting point is critical for family accountability during an emergency." },
    { "text": "To decide who drives to the hospital", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["general-safety", "fire-safety", "emergency-plan"]
},
{
  "id": "q427",
  "category": "general-safety",
  "question": "When approaching a busy intersection as a pedestrian, what is the safest practice?",
  "answers": [
    { "text": "Assume drivers see you and will stop", "correct": false },
    { "text": "Run across the street as quickly as possible", "correct": false },
    { "text": "Look left, right, then left again, make eye contact with drivers, and wait for a safe gap in traffic before crossing", "correct": true, "explanation": "Even with a green light, always verify that the path is clear before stepping into the street." },
    { "text": "Cross immediately after the light turns green without looking", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["general-safety", "pedestrian-safety", "traffic"]
},
{
  "id": "q428",
  "category": "general-safety",
  "question": "What is the safest way to store sharp objects (knives, razors) in a household with children?",
  "answers": [
    { "text": "In a visible knife block on the counter", "correct": false },
    { "text": "Loose in a drawer with other utensils", "correct": false },
    { "text": "In a locked drawer or cabinet, or in sheaths/holders that keep the sharp edges contained and out of reach", "correct": true, "explanation": "Preventing accidental cuts is crucial for child safety." },
    { "text": "Under the sink, hidden behind other items", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["general-safety", "child-safety", "sharp-objects"]
},
{
  "id": "q429",
  "category": "general-safety",
  "question": "If you are trapped in a car that is sinking in water, what is the most critical action to take first?",
  "answers": [
    { "text": "Call emergency services on your phone", "correct": false },
    { "text": "Try to open the doors immediately", "correct": false },
    { "text": "Unbuckle your seatbelt and open or break a window to escape before the car is fully submerged", "correct": true, "explanation": "As the car fills with water, pressure makes doors impossible to open. Act quickly while windows are still accessible." },
    { "text": "Wait for the car to completely fill with water", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["general-safety", "car-safety", "sinking-car", "emergency"]
},
{
  "id": "q430",
  "category": "general-safety",
  "question": "What is the purpose of an 'escape ladder' for multi-story homes?",
  "answers": [
    { "text": "To help you reach high shelves", "correct": false },
    { "text": "To provide a fun way to exit your house", "correct": false },
    { "text": "To provide an alternative means of egress from upper floors in case of fire or other emergencies where stairs are blocked", "correct": true, "explanation": "Escape ladders offer a vital secondary exit, especially if the primary exit is compromised." },
    { "text": "To decorate the side of your house", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["general-safety", "fire-safety", "escape-ladder"]
},

{
  "id": "q431",
  "category": "health-wellness",
  "question": "What is the recommended daily water intake for most adults?",
  "answers": [
    { "text": "1-2 glasses", "correct": false },
    { "text": "Around 8 glasses (approximately 2 liters or half a gallon)", "correct": true, "explanation": "Adequate hydration supports bodily functions, metabolism, and energy levels." },
    { "text": "Only when you feel thirsty", "correct": false },
    { "text": "4-5 liters", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["health", "hydration", "water-intake"]
},
{
  "id": "q432",
  "category": "health-wellness",
  "question": "What is the main benefit of incorporating fiber into your diet?",
  "answers": [
    { "text": "It adds flavor to food", "correct": false },
    { "text": "It helps you lose weight instantly", "correct": false },
    { "text": "Aids digestion, promotes bowel regularity, helps control blood sugar, and reduces cholesterol levels", "correct": true, "explanation": "Fiber is crucial for a healthy digestive system and overall metabolic health." },
    { "text": "It provides a lot of energy", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["health", "nutrition", "fiber"]
},
{
  "id": "q433",
  "category": "health-wellness",
  "question": "Why is regular dental hygiene (brushing and flossing) important for overall health?",
  "answers": [
    { "text": "To have fresh breath only", "correct": false },
    { "text": "It only prevents cavities", "correct": false },
    { "text": "Prevents cavities, gum disease, and can impact systemic health by reducing inflammation and the risk of other chronic conditions", "correct": true, "explanation": "Oral health is strongly linked to overall body health, including heart health." },
    { "text": "It makes your teeth sparkle", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["health", "dental-hygiene", "oral-health"]
},
{
  "id": "q434",
  "category": "health-wellness",
  "question": "What is 'mindfulness' and how can it benefit mental health?",
  "answers": [
    { "text": "A way to forget your problems", "correct": false },
    { "text": "Constantly thinking about the future", "correct": false },
    { "text": "A state of focused awareness on the present moment, intentionally observing thoughts and feelings without judgment, which reduces stress and improves emotional regulation", "correct": true, "explanation": "Mindfulness practices can help manage anxiety, depression, and improve overall well-being." },
    { "text": "Ignoring your emotions", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["health", "mental-health", "mindfulness", "stress-reduction"]
},
{
  "id": "q435",
  "category": "health-wellness",
  "question": "What is the recommended frequency for performing a skin self-exam to check for moles or spots?",
  "answers": [
    { "text": "Once a year by a dermatologist", "correct": false },
    { "text": "Only if you notice a new or changing spot", "correct": false },
    { "text": "Monthly, to become familiar with your skin and easily detect any new or changing moles/lesions", "correct": true, "explanation": "Regular self-exams are crucial for early detection of skin cancer." },
    { "text": "Every few years", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["health", "skin-self-exam", "skin-cancer", "prevention"]
},

{
  "id": "q436",
  "category": "cyberbullying",
  "question": "If someone posts an embarrassing photo of you online without your permission, what is your best course of action?",
  "answers": [
    { "text": "Post an embarrassing photo of them in retaliation", "correct": false },
    { "text": "Ignore it and hope it goes away", "correct": false },
    { "text": "Ask them to remove it, report the post to the platform's administrators, and if necessary, involve a trusted adult or legal counsel", "correct": true, "explanation": "You have the right to control your image. Platforms often have policies against non-consensual sharing of photos." },
    { "text": "Delete all your social media accounts", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["cyberbullying", "privacy", "non-consensual-images"]
},
{
  "id": "q437",
  "category": "cyberbullying",
  "question": "What is 'catfishing' in the context of online interactions?",
  "answers": [
    { "text": "Luring people into online fishing games", "correct": false },
    { "text": "Pretending to be someone else online to deceive or exploit others, often in romantic relationships", "correct": true, "explanation": "Catfishing involves creating fake online identities to trick individuals, leading to emotional or financial harm." },
    { "text": "Sharing adorable cat videos online", "correct": false },
    { "text": "An online scam involving fake prize winnings", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["cyberbullying", "catfishing", "online-deception", "scams"]
},
{
  "id": "q438",
  "category": "cyberbullying",
  "question": "Why is it important to use strong privacy settings on gaming platforms and social media?",
  "answers": [
    { "text": "To keep your friends list short", "correct": false },
    { "text": "To make it harder for you to find new friends", "correct": false },
    { "text": "To control who can interact with you, see your content, and access your personal information, reducing exposure to cyberbullying and predatory behavior", "correct": true, "explanation": "Tailored privacy settings are your first line of defense against unwanted attention and harassment online." },
    { "text": "To optimize game performance", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["cyberbullying", "privacy-settings", "online-gaming", "social-media"]
},
{
  "id": "q439",
  "category": "cyberbullying",
  "question": "If you witness cyberbullying occurring in an online group chat, what is a responsible action?",
  "answers": [
    { "text": "Ignore it, it's not happening to you", "correct": false },
    { "text": "Join in on the bullying to avoid being targeted", "correct": false },
    { "text": "Speak up if safe, support the victim privately, report the behavior to the group administrator or platform, and do not forward or share the content", "correct": true, "explanation": "Being an active bystander and reporting abusive behavior helps create a safer online community." },
    { "text": "Leave the group chat without saying anything", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["cyberbullying", "bystander", "reporting"]
},
{
  "id": "q440",
  "category": "cyberbullying",
  "question": "What is a key difference between online harassment and cyberbullying?",
  "answers": [
    { "text": "There is no difference, they are interchangeable terms", "correct": false },
    { "text": "Online harassment is always illegal, cyberbullying is not", "correct": false },
    { "text": "Cyberbullying typically involves minors and targets, often with an imbalance of power, while online harassment can target anyone and may involve a single incident", "correct": true, "explanation": "While both are harmful, cyberbullying often has a distinct dynamic, frequently occurring among young people." },
    { "text": "Cyberbullying only happens on social media, harassment happens everywhere online", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["cyberbullying", "online-harassment", "definitions"]
},

{
  "id": "q441",
  "category": "road-safety",
  "question": "What does a solid yellow line on your side of the road typically mean?",
  "answers": [
    { "text": "You can pass if the way is clear", "correct": false },
    { "text": "You can only turn left", "correct": false },
    { "text": "No passing allowed from your lane", "correct": true, "explanation": "Solid lines indicate areas where passing is prohibited for safety reasons, such as curves or hilltops." },
    { "text": "A bike lane is ahead", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["road-safety", "road-markings", "driving-rules"]
},
{
  "id": "q442",
  "category": "road-safety",
  "question": "When driving in adverse weather conditions (rain, snow, ice), what should you primarily do?",
  "answers": [
    { "text": "Drive faster to get through it quickly", "correct": false },
    { "text": "Use cruise control to maintain a steady speed", "correct": false },
    { "text": "Reduce your speed, increase following distance, and ensure all lights are on", "correct": true, "explanation": "These actions compensate for reduced traction and visibility, minimizing accident risk." },
    { "text": "Brake sharply to test your tires' grip", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["road-safety", "adverse-weather", "driving-tips"]
},
{
  "id": "q443",
  "category": "road-safety",
  "question": "What is the purpose of ABS (Anti-lock Braking System) in a vehicle?",
  "answers": [
    { "text": "To make the car stop faster in all conditions", "correct": false },
    { "text": "To help the car accelerate quickly", "correct": false },
    { "text": "To prevent the wheels from locking up during hard braking, allowing the driver to maintain steering control", "correct": true, "explanation": "ABS helps avoid skidding and allows for safer emergency braking." },
    { "text": "To alert other drivers when you are braking", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["road-safety", "ABS", "braking"]
},
{
  "id": "q444",
  "category": "road-safety",
  "question": "If you are being tailgated, what is the safest response?",
  "answers": [
    { "text": "Brake suddenly to make them back off", "correct": false },
    { "text": "Speed up to increase the distance", "correct": false },
    { "text": "Gently reduce speed, move to another lane if possible, and allow them to pass, prioritizing safety over asserting your right of way", "correct": true, "explanation": "Aggressive responses can escalate the situation. Creating space is the safest strategy." },
    { "text": "Turn on your hazard lights", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["road-safety", "tailgating", "defensive-driving"]
},
{
  "id": "q445",
  "category": "road-safety",
  "question": "What does a flashing yellow traffic light indicate?",
  "answers": [
    { "text": "Stop immediately", "correct": false },
    { "text": "Proceed with caution, yielding to other traffic or pedestrians", "correct": true, "explanation": "A flashing yellow light warns drivers to be alert and prepared to stop if necessary." },
    { "text": "Speed up to clear the intersection", "correct": false },
    { "text": "The light is broken, treat it as a stop sign", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["road-safety", "traffic-lights", "driving-rules"]
},

{
  "id": "q446",
  "category": "emergency-preparedness",
  "question": "Why is it important to have an out-of-state contact for family communication during an emergency?",
  "answers": [
    { "text": "They will have better advice", "correct": false },
    { "text": "Local phone lines may be overwhelmed or out of service, while long-distance lines might still work", "correct": true, "explanation": "This provides a reliable point of contact for family members to check in and share information if local communications fail." },
    { "text": "It's easier to remember their number", "correct": false },
    { "text": "They can send help from a distance", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["emergency-preparedness", "communication-plan", "family-contact"]
},
{
  "id": "q447",
  "category": "emergency-preparedness",
  "question": "What is a simple, non-electronic method for lighting a dark room during a power outage?",
  "answers": [
    { "text": "Calling emergency services for light", "correct": false },
    { "text": "A gas-powered generator indoors", "correct": false },
    { "text": "Glow sticks or a hand-crank flashlight", "correct": true, "explanation": "These provide safe illumination without reliance on batteries or electricity, avoiding fire risks." },
    { "text": "Burning newspaper in a bucket", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["emergency-preparedness", "power-outage", "lighting"]
},
{
  "id": "q448",
  "category": "emergency-preparedness",
  "question": "What is the primary role of a designated emergency shelter during a widespread disaster?",
  "answers": [
    { "text": "To provide entertainment and recreation", "correct": false },
    { "text": "To offer luxury accommodations for evacuees", "correct": false },
    { "text": "To provide safe refuge, basic necessities (food, water, medical aid), and support services for displaced individuals", "correct": true, "explanation": "Shelters are critical for housing and assisting those affected by emergencies." },
    { "text": "To coordinate news broadcasts", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["emergency-preparedness", "shelter", "disaster-relief"]
},
{
  "id": "q449",
  "category": "emergency-preparedness",
  "question": "Why is it important to have an emergency supply of cash during a widespread power outage?",
  "answers": [
    { "text": "ATMs will still work if the power is out", "correct": false },
    { "text": "Credit card machines and ATMs will likely be non-functional, making cash the only accessible form of payment", "correct": true, "explanation": "Electronic transactions rely on power and network connectivity, which may be unavailable." },
    { "text": "To buy luxury items", "correct": false },
    { "text": "To invest in emergency stocks", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["emergency-preparedness", "power-outage", "cash-supply"]
},
{
  "id": "q450",
  "category": "emergency-preparedness",
  "question": "What is a basic tool you should have in your emergency kit for light manual tasks or minor repairs?",
  "answers": [
    { "text": "A laptop computer", "correct": false },
    { "text": "A full power tool set", "correct": false },
    { "text": "A multi-tool or basic wrench/pliers set", "correct": true, "explanation": "These tools can be invaluable for simple repairs, turning off utilities, or other urgent needs." },
    { "text": "A portable gaming console", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["emergency-preparedness", "emergency-kit", "tools"]
},

{
  "id": "q451",
  "category": "environmental-safety",
  "question": "What is the primary risk of swimming in natural bodies of water (lakes, rivers) after heavy rainfall?",
  "answers": [
    { "text": "The water will be colder", "correct": false },
    { "text": "The water will be too clear", "correct": false },
    { "text": "Increased levels of bacteria and pollutants from runoff, and stronger currents or hidden debris", "correct": true, "explanation": "Rainfall washes contaminants into waterways and can increase the force of currents, creating unsafe conditions." },
    { "text": "More fish will be present", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["environmental-safety", "water-pollution", "natural-water-bodies"]
},
{
  "id": "q452",
  "category": "environmental-safety",
  "question": "What is the purpose of 'boil water' advisories issued by public health authorities?",
  "answers": [
    { "text": "To save energy by not using hot water", "correct": false },
    { "text": "To make water taste better", "correct": false },
    { "text": "To warn residents that the tap water may be contaminated and needs to be boiled to kill harmful microorganisms before consumption", "correct": true, "explanation": "Boiling water is an effective way to purify it when contamination is suspected." },
    { "text": "To encourage bottled water sales", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["environmental-safety", "public-health", "boil-water-advisory"]
},
{
  "id": "q453",
  "category": "environmental-safety",
  "question": "What does a 'red flag' warning issued by weather services typically signify in fire-prone areas?",
  "answers": [
    { "text": "There's a beautiful sunset expected", "correct": false },
    { "text": "An upcoming heatwave", "correct": false },
    { "text": "Critical fire weather conditions (high winds, low humidity, dry fuels) are present or expected, increasing wildfire risk", "correct": true, "explanation": "Red flag warnings indicate that outdoor burning or activities that could spark a fire should be avoided." },
    { "text": "Heavy rainfall is imminent", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["environmental-safety", "wildfire", "red-flag-warning"]
},
{
  "id": "q454",
  "category": "environmental-safety",
  "question": "Why is it dangerous to feed wild animals, especially large mammals (bears, deer)?",
  "answers": [
    { "text": "It makes them lose their natural shyness", "correct": true, "explanation": "Feeding wild animals makes them lose their natural fear of humans, leading to dependency, aggression, and potential harm to both animals and humans." },
    { "text": "It changes their fur color", "correct": false },
    { "text": "It makes them too fat", "correct": false },
    { "text": "It encourages them to move to new areas", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["environmental-safety", "wildlife", "animal-feeding"]
},
{
  "id": "q455",
  "category": "environmental-safety",
  "question": "What is a safe and effective way to deter rodents and pests from entering your home?",
  "answers": [
    { "text": "Leave food scraps outside as bait", "correct": false },
    { "text": "Keep all windows and doors open", "correct": false },
    { "text": "Seal cracks and openings in foundations and walls, keep food in airtight containers, and maintain a clean environment", "correct": true, "explanation": "Excluding pests and removing food sources are the most effective preventative measures." },
    { "text": "Adopt a large number of cats", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["environmental-safety", "pest-control", "home-maintenance"]
},

{
  "id": "q456",
  "category": "public-health",
  "question": "What is the definition of a 'pandemic'?",
  "answers": [
    { "text": "A disease that is only found in one region", "correct": false },
    { "text": "A widespread occurrence of an infectious disease in a community at a particular time", "correct": false },
    { "text": "An epidemic of an infectious disease that has spread across a large region, for instance, multiple continents or worldwide", "correct": true, "explanation": "Pandemics are characterized by their global or widespread geographic reach." },
    { "text": "A non-infectious disease that affects many people", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["public-health", "pandemic", "disease"]
},
{
  "id": "q457",
  "category": "public-health",
  "question": "Why is proper waste disposal crucial for public health?",
  "answers": [
    { "text": "It makes cities look cleaner", "correct": false },
    { "text": "It helps recycle materials for profit", "correct": false },
    { "text": "Prevents the spread of diseases, controls pest populations, reduces environmental pollution, and ensures safe living conditions", "correct": true, "explanation": "Unmanaged waste is a breeding ground for pathogens and pests, posing significant health risks." },
    { "text": "It prevents bad smells", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["public-health", "waste-disposal", "sanitation"]
},
{
  "id": "q458",
  "category": "public-health",
  "question": "What is the 'incubation period' of an infectious disease?",
  "answers": [
    { "text": "The time it takes to recover from the disease", "correct": false },
    { "text": "The period during which the disease is most contagious", "correct": false },
    { "text": "The time interval between exposure to an infectious agent and the appearance of the first symptoms", "correct": true, "explanation": "Understanding the incubation period is important for contact tracing and disease control measures." },
    { "text": "The time spent in isolation after diagnosis", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["public-health", "infectious-disease", "incubation-period"]
},
{
  "id": "q459",
  "category": "public-health",
  "question": "What is the primary role of public health agencies (e.g., CDC, WHO)?",
  "answers": [
    { "text": "To treat individual patients in hospitals", "correct": false },
    { "text": "To develop new pharmaceutical drugs", "correct": false },
    { "text": "To protect and improve community health through disease prevention, health promotion, and emergency preparedness", "correct": true, "explanation": "Public health focuses on population-level health, distinct from individual medical care." },
    { "text": "To regulate food prices", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["public-health", "health-agencies", "disease-prevention"]
},
{
  "id": "q460",
  "category": "public-health",
  "question": "What is the primary benefit of maintaining a healthy gut microbiome for overall health?",
  "answers": [
    { "text": "It makes your stomach flatter", "correct": false },
    { "text": "It ensures you never get sick", "correct": false },
    { "text": "Supports digestion, nutrient absorption, immune system function, and can influence mental health", "correct": true, "explanation": "A balanced gut microbiome is increasingly recognized as central to many aspects of health." },
    { "text": "It helps you remember things better", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["public-health", "gut-health", "microbiome", "nutrition"]
},

{
  "id": "q461",
  "category": "online-safety",
  "question": "What is 'pharming' in online security?",
  "answers": [
    { "text": "A type of online gardening game", "correct": false },
    { "text": "A scam where users are redirected to fake websites despite typing the correct URL, typically through malicious code or DNS poisoning", "correct": true, "explanation": "Pharming bypasses initial user vigilance, making it a sophisticated form of online fraud." },
    { "text": "Collecting virtual animals online", "correct": false },
    { "text": "An online platform for agricultural businesses", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["online-safety", "pharming", "cybersecurity", "scams"]
},
{
  "id": "q462",
  "category": "online-safety",
  "question": "Why is it risky to connect unfamiliar USB drives to your computer?",
  "answers": [
    { "text": "They might be too slow", "correct": false },
    { "text": "They might not have enough storage space", "correct": false },
    { "text": "They could contain malware that automatically installs and infects your system upon connection", "correct": true, "explanation": "Malicious USB drives are a common vector for spreading viruses and ransomware." },
    { "text": "They might be incompatible with your operating system", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["online-safety", "USB-security", "malware"]
},
{
  "id": "q463",
  "category": "online-safety",
  "question": "What is 'digital etiquette' or 'netiquette'?",
  "answers": [
    { "text": "Strict rules for formatting online documents", "correct": false },
    { "text": "The proper way to dress when using a computer", "correct": false },
    { "text": "The set of informal rules and conventions that govern polite and respectful behavior in online interactions", "correct": true, "explanation": "Good netiquette fosters positive and productive online communication." },
    { "text": "A new programming language", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["online-safety", "netiquette", "online-behavior"]
},
{
  "id": "q464",
  "category": "online-safety",
  "question": "Why should you be cautious about granting excessive permissions to mobile apps (e.g., access to contacts, microphone, camera)?",
  "answers": [
    { "text": "It can slow down your phone", "correct": false },
    { "text": "It will use up your data plan quickly", "correct": false },
    { "text": "Over-permissioning can allow apps to collect sensitive personal data without your full awareness, potentially compromising privacy and security", "correct": true, "explanation": "Many apps request more permissions than they actually need to function, leading to privacy concerns." },
    { "text": "It makes the app harder to uninstall", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["online-safety", "app-permissions", "privacy"]
},
{
  "id": "q465",
  "category": "online-safety",
  "question": "What is the 'dark web'?",
  "answers": [
    { "text": "A section of the internet with poor lighting", "correct": false },
    { "text": "A secret network for government intelligence agencies only", "correct": false },
    { "text": "A part of the internet that is not indexed by conventional search engines and requires specific software (like Tor) to access, often associated with illicit activities but also privacy", "correct": true, "explanation": "While it has legitimate uses for privacy, the dark web is often known for hosting illegal marketplaces and activities." },
    { "text": "A network exclusively for streaming movies", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["online-safety", "dark-web", "cybersecurity", "privacy"]
},

{
  "id": "q466",
  "category": "street-safety",
  "question": "What is the purpose of reflective vests worn by construction workers or roadside personnel?",
  "answers": [
    { "text": "To keep them warm", "correct": false },
    { "text": "To identify their company affiliation", "correct": false },
    { "text": "To significantly increase their visibility to drivers, especially in low light or adverse weather conditions, preventing accidents", "correct": true, "explanation": "High-visibility clothing is crucial for protecting workers near traffic." },
    { "text": "To make them look official", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["street-safety", "worker-safety", "visibility"]
},
{
  "id": "q467",
  "category": "street-safety",
  "question": "If you are approached by someone asking for money, and you feel uneasy, what is a safe way to respond?",
  "answers": [
    { "text": "Give them all the cash you have to avoid confrontation", "correct": false },
    { "text": "Engage them in a lengthy conversation about their situation", "correct": false },
    { "text": "Politely say 'no' or 'sorry, I can't help,' maintain a confident demeanor, and continue walking without stopping", "correct": true, "explanation": "Direct refusal and disengagement are often the safest ways to handle such encounters." },
    { "text": "Invite them to your home to talk privately", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["street-safety", "strangers", "personal-safety"]
},
{
  "id": "q468",
  "category": "street-safety",
  "question": "What is the safest way to carry a backpack or purse in a crowded public area?",
  "answers": [
    { "text": "Slung loosely over one shoulder", "correct": false },
    { "text": "On your back, out of sight", "correct": false },
    { "text": "Worn on your front, with zippers facing towards your body, or with a cross-body strap", "correct": true, "explanation": "Keeping your bag visible and close to your body makes it much harder for pickpockets." },
    { "text": "Leave it in a public locker", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["street-safety", "pickpocketing", "valuables"]
},
{
  "id": "q469",
  "category": "street-safety",
  "question": "When walking near active construction sites, what should you be aware of?",
  "answers": [
    { "text": "The types of machinery being used for fun", "correct": false },
    { "text": "Potential falling debris, uneven surfaces, moving vehicles, and follow all posted safety signs and detours", "correct": true, "explanation": "Construction sites pose numerous hazards that require vigilance from pedestrians." },
    { "text": "The schedules of the workers", "correct": false },
    { "text": "The architectural plans for the new building", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["street-safety", "construction-sites", "pedestrian-safety"]
},
{
  "id": "q470",
  "category": "street-safety",
  "question": "If you are caught in a large, unmanageable crowd during an event, what is the safest strategy?",
  "answers": [
    { "text": "Push forcefully to get out as quickly as possible", "correct": false },
    { "text": "Lie down on the ground to avoid being trampled", "correct": false },
    { "text": "Move with the flow of the crowd, keep your hands up near your chest for protection, and try to move diagonally towards the edge", "correct": true, "explanation": "Fighting against the crowd can be exhausting and dangerous. Protecting yourself and moving with the flow increases survival chances." },
    { "text": "Shout loudly for attention", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["street-safety", "crowd-safety", "emergency"]
},

{
  "id": "q471",
  "category": "home-safety",
  "question": "What is the primary danger of leaving portable heaters unattended or too close to flammable materials?",
  "answers": [
    { "text": "They can consume too much electricity", "correct": false },
    { "text": "They might make the room too warm", "correct": false },
    { "text": "They can easily start a house fire due to overheating or igniting nearby curtains, furniture, or bedding", "correct": true, "explanation": "Portable heaters are a common cause of house fires when not used with caution." },
    { "text": "They can make a loud noise", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["home-safety", "portable-heaters", "fire-prevention"]
},
{
  "id": "q472",
  "category": "home-safety",
  "question": "How often should you replace the air filters in your HVAC system?",
  "answers": [
    { "text": "Only when they look very dirty", "correct": false },
    { "text": "Never, they are designed to last the life of the system", "correct": false },
    { "text": "Every 1-3 months, or more frequently if you have pets or allergies, to maintain air quality and system efficiency", "correct": true, "explanation": "Regular filter changes improve indoor air quality, reduce energy costs, and extend the life of your HVAC system." },
    { "text": "Once a year during routine maintenance", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["home-safety", "air-quality", "HVAC"]
},
{
  "id": "q473",
  "category": "home-safety",
  "question": "What is the safest way to store sharp kitchen knives?",
  "answers": [
    { "text": "Loose in a drawer with other utensils", "correct": false },
    { "text": "On an open magnetic strip on the wall", "correct": false },
    { "text": "In a knife block, a drawer organizer, or with blade guards, keeping edges covered and secured", "correct": true, "explanation": "Proper storage prevents accidental cuts and keeps knives sharp." },
    { "text": "Stacked in the dish drying rack", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["home-safety", "kitchen-safety", "knives"]
},
{
  "id": "q474",
  "category": "home-safety",
  "question": "What is the danger of storing flammable liquids (gasoline, paint thinners) in unmarked containers?",
  "answers": [
    { "text": "They might lose their potency", "correct": false },
    { "text": "They might attract pests", "correct": false },
    { "text": "Risk of accidental ingestion, improper use, or mixing with incompatible substances, leading to poisoning, fire, or explosions", "correct": true, "explanation": "Clear labeling in original containers is essential for identifying contents and preventing dangerous mistakes." },
    { "text": "They will evaporate faster", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["home-safety", "flammable-liquids", "poisoning", "fire-prevention"]
},
{
  "id": "q475",
  "category": "home-safety",
  "question": "Why should you regularly inspect and clean your chimney if you have a fireplace?",
  "answers": [
    { "text": "To improve the aesthetics of your fireplace", "correct": false },
    { "text": "To prevent birds from nesting in it", "correct": false },
    { "text": "To prevent creosote buildup, which is highly flammable and a common cause of chimney fires", "correct": true, "explanation": "Creosote is a byproduct of burning wood and can easily ignite if not regularly removed." },
    { "text": "To increase the draft for better heating efficiency", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["home-safety", "fireplace", "chimney-fire", "maintenance"]
},

{
  "id": "q476",
  "category": "travel-safety",
  "question": "What is the recommended practice for carrying a copy of your passport while traveling internationally?",
  "answers": [
    { "text": "Carry the original passport and leave copies at home", "correct": false },
    { "text": "Keep a physical copy in a separate location from your original passport, and a digital copy on a secure cloud service", "correct": true, "explanation": "Copies can expedite replacement if your original passport is lost or stolen, but should be stored separately for security." },
    { "text": "Do not carry any copies, it's unnecessary", "correct": false },
    { "text": "Carry a copy in the same pocket as your original passport", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["travel-safety", "passport", "documentation"]
},
{
  "id": "q477",
  "category": "travel-safety",
  "question": "When storing luggage on public transport (bus, train), what is a good security measure?",
  "answers": [
    { "text": "Place it far away so you have more space", "correct": false },
    { "text": "Leave it unlocked to allow for easy inspection", "correct": false },
    { "text": "Keep it within sight, use luggage locks, and consider securing it to a fixed object if possible", "correct": true, "explanation": "Keeping your luggage secure and visible reduces the risk of theft." },
    { "text": "Assume it's safe if it's in the designated luggage area", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["travel-safety", "luggage-security", "public-transport"]
},
{
  "id": "q478",
  "category": "travel-safety",
  "question": "What is the primary risk of using unregulated ride-sharing services in some foreign countries?",
  "answers": [
    { "text": "They might take a longer route", "correct": false },
    { "text": "The drivers might not speak your language", "correct": false },
    { "text": "Lack of background checks for drivers, unregulated vehicle safety, and no official recourse in case of incidents or overcharging", "correct": true, "explanation": "Unregulated services lack accountability and can expose travelers to various risks." },
    { "text": "They might not have air conditioning", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["travel-safety", "ride-sharing", "unregulated-services"]
},
{
  "id": "q479",
  "category": "travel-safety",
  "question": "Before visiting an area with potential political unrest or high crime rates, what should you do?",
  "answers": [
    { "text": "Assume everything will be fine", "correct": false },
    { "text": "Only rely on social media for information", "correct": false },
    { "text": "Check government travel advisories, consult local news, and understand the cultural context and current security situation", "correct": true, "explanation": "Being informed allows you to make safer decisions and take appropriate precautions." },
    { "text": "Plan to stay out late every night", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["travel-safety", "political-unrest", "crime-rates", "travel-advisories"]
},
{
  "id": "q480",
  "category": "travel-safety",
  "question": "What is a good way to secure your hotel room door beyond the standard lock?",
  "answers": [
    { "text": "Leave it slightly ajar for air circulation", "correct": false },
    { "text": "Assume the hotel's lock is completely secure", "correct": false },
    { "text": "Use a portable door alarm, door jammer, or extra security chain/bolt if available, and utilize the peephole before opening", "correct": true, "explanation": "Additional security measures provide extra peace of mind and protection against unauthorized entry." },
    { "text": "Hang a 'Do Not Disturb' sign", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["travel-safety", "hotel-security", "door-security"]
},

{
  "id": "q481",
  "category": "workplace-safety",
  "question": "What is the purpose of an MSDS (Material Safety Data Sheet) or SDS (Safety Data Sheet)?",
  "answers": [
    { "text": "To list the ingredients of a product for marketing", "correct": false },
    { "text": "To provide instructions on how to use a product", "correct": false },
    { "text": "To provide comprehensive information about hazardous substances, including properties, hazards, safe handling, and emergency procedures", "correct": true, "explanation": "SDS documents are crucial for informing workers and emergency responders about chemical risks." },
    { "text": "To document product inventory", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["workplace-safety", "MSDS", "SDS", "hazardous-materials"]
},
{
  "id": "q482",
  "category": "workplace-safety",
  "question": "Why are 'exit routes' in a workplace required to be clear and unobstructed?",
  "answers": [
    { "text": "To allow easy movement of goods and equipment", "correct": false },
    { "text": "To make the workplace look tidier", "correct": false },
    { "text": "To ensure rapid and safe evacuation of all personnel during an emergency like a fire or chemical spill", "correct": true, "explanation": "Blocked exit routes can impede escape and lead to injuries or fatalities in emergencies." },
    { "text": "To provide a clear path for daily commuting", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["workplace-safety", "evacuation", "exit-routes", "fire-safety"]
},
{
  "id": "q483",
  "category": "workplace-safety",
  "question": "What is 'confined space entry' in workplace safety?",
  "answers": [
    { "text": "Entering a small office cubicle", "correct": false },
    { "text": "Entering a space that has limited means of entry/exit, is not designed for continuous human occupancy, and has the potential for hazards", "correct": true, "explanation": "Confined spaces (e.g., tanks, silos) require specific safety protocols due to risks like atmospheric hazards, engulfment, or limited rescue options." },
    { "text": "Entering any room with the door closed", "correct": false },
    { "text": "Entering a crowded elevator", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["workplace-safety", "confined-space", "hazard-recognition"]
},
{
  "id": "q484",
  "category": "workplace-safety",
  "question": "What is the importance of proper manual handling techniques (lifting) in the workplace?",
  "answers": [
    { "text": "To make you look stronger", "correct": false },
    { "text": "To speed up the lifting process", "correct": false },
    { "text": "To prevent back injuries, muscle strains, and other musculoskeletal disorders by using correct posture and lifting methods", "correct": true, "explanation": "Improper lifting is a leading cause of workplace injuries." },
    { "text": "To impress your colleagues", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["workplace-safety", "manual-handling", "lifting", "injury-prevention"]
},
{
  "id": "q485",
  "category": "workplace-safety",
  "question": "If you witness a colleague being subjected to workplace bullying, what should you consider doing?",
  "answers": [
    { "text": "Ignore it, it's a personal matter between them", "correct": false },
    { "text": "Join in to support the bully", "correct": false },
    { "text": "Document the incidents, offer support to the victim, and report the bullying to HR or a supervisor through official channels", "correct": true, "explanation": "Bullying creates a toxic environment. Reporting it is essential for intervention and accountability." },
    { "text": "Confront the bully privately and aggressively", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["workplace-safety", "bullying", "reporting", "ethics"]
},

{
  "id": "q486",
  "category": "general-safety",
  "question": "What is the recommended practice for storing ladders when not in use?",
  "answers": [
    { "text": "Leaning against a wall in a high-traffic area", "correct": false },
    { "text": "Lying on the ground where they can be tripped over", "correct": false },
    { "text": "Secured horizontally on wall hooks or stored in a shed/garage, out of the way to prevent falling or tripping hazards", "correct": true, "explanation": "Proper storage prevents accidents and prolongs the life of the ladder." },
    { "text": "Propped against a fence outside", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["general-safety", "ladder-storage", "tripping-hazards"]
},
{
  "id": "q487",
  "category": "general-safety",
  "question": "When driving a car with children, what is the most important rule regarding their safety restraints?",
  "answers": [
    { "text": "They should only wear a regular seatbelt once they stop complaining about car seats", "correct": false },
    { "text": "They can share a seatbelt if they are small enough", "correct": false },
    { "text": "Every child must be secured in an age and size-appropriate car seat, booster seat, or seatbelt, according to legal requirements", "correct": true, "explanation": "Child safety restraints are legally mandated and critical for protecting children in a collision." },
    { "text": "They should be allowed to move freely to stay comfortable", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["general-safety", "child-safety", "car-safety", "seatbelts"]
},
{
  "id": "q488",
  "category": "general-safety",
  "question": "What is the danger of consuming wild berries or plants without absolute certainty of their edibility?",
  "answers": [
    { "text": "They might taste bad", "correct": false },
    { "text": "Many wild plants are poisonous and can cause severe illness, organ damage, or death", "correct": true, "explanation": "Misidentifying plants can have fatal consequences. Never eat wild plants unless identified by an expert." },
    { "text": "They might give you an upset stomach", "correct": false },
    { "text": "They might contain too many calories", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["general-safety", "wild-plants", "poisoning", "foraging"]
},
{
  "id": "q489",
  "category": "general-safety",
  "question": "What is the 'good Samaritan' law and how does it relate to providing first aid?",
  "answers": [
    { "text": "It requires everyone to be a trained first responder", "correct": false },
    { "text": "It allows you to bill people for first aid services", "correct": false },
    { "text": "It provides legal protection to people who give reasonable assistance to those who are injured, ill, or in peril, without fear of being sued", "correct": true, "explanation": "Good Samaritan laws encourage bystanders to offer help without undue legal risk, as long as they act reasonably." },
    { "text": "It only applies to doctors and nurses", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["general-safety", "good-samaritan-law", "first-aid", "legal-protection"]
},
{
  "id": "q490",
  "category": "general-safety",
  "question": "When disposing of broken glass, what is the safest practice?",
  "answers": [
    { "text": "Throw it directly into the trash can", "correct": false },
    { "text": "Wrap it in a single paper towel before discarding", "correct": false },
    { "text": "Wrap it securely in several layers of newspaper or cardboard, place it in a sturdy bag, and clearly label it 'BROKEN GLASS'", "correct": true, "explanation": "Proper disposal prevents injuries to household members and waste handlers." },
    { "text": "Sweep it into a dustpan and empty it loosely into the trash", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["general-safety", "broken-glass", "waste-disposal"]
},

{
  "id": "q491",
  "category": "health-wellness",
  "question": "What is the primary benefit of maintaining a healthy weight?",
  "answers": [
    { "text": "It guarantees a longer life", "correct": false },
    { "text": "It makes you look more attractive", "correct": false },
    { "text": "Reduces the risk of numerous chronic diseases (e.g., heart disease, diabetes, certain cancers), improves energy levels, and enhances overall quality of life", "correct": true, "explanation": "Healthy weight management is a cornerstone of preventative health." },
    { "text": "It eliminates the need for exercise", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["health", "weight-management", "chronic-disease-prevention"]
},
{
  "id": "q492",
  "category": "health-wellness",
  "question": "Why is stress management crucial for physical health?",
  "answers": [
    { "text": "It prevents you from feeling any emotions", "correct": false },
    { "text": "Chronic stress can lead to high blood pressure, heart disease, weakened immune system, and mental health issues like anxiety and depression", "correct": true, "explanation": "The body's 'fight or flight' response, when prolonged, has detrimental effects on various physiological systems." },
    { "text": "It makes you more productive at work", "correct": false },
    { "text": "It speeds up your metabolism", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["health", "stress-management", "chronic-stress"]
},
{
  "id": "q493",
  "category": "health-wellness",
  "question": "What is the importance of regular eye exams, even if you don't wear glasses?",
  "answers": [
    { "text": "To find a new pair of stylish glasses", "correct": false },
    { "text": "They only detect problems if your vision is blurry", "correct": false },
    { "text": "To detect early signs of eye diseases (e.g., glaucoma, cataracts) and other health conditions (e.g., diabetes, high blood pressure) that can manifest in the eyes", "correct": true, "explanation": "Many serious eye conditions are asymptomatic in early stages, making regular checks vital." },
    { "text": "To measure your eye color", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["health", "eye-health", "preventative-care"]
},
{
  "id": "q494",
  "category": "health-wellness",
  "question": "What is the main benefit of incorporating a variety of fruits and vegetables into your diet?",
  "answers": [
    { "text": "It makes your meals look more colorful", "correct": false },
    { "text": "To avoid eating other food groups", "correct": false },
    { "text": "Provides essential vitamins, minerals, fiber, and antioxidants, supporting immune function, disease prevention, and overall well-being", "correct": true, "explanation": "A diverse intake ensures a broad spectrum of nutrients crucial for health." },
    { "text": "It helps you remember their names", "correct": false }
  ],
  "difficulty": "easy",
  "tags": ["health", "nutrition", "fruits-vegetables"]
},
{
  "id": "q495",
  "category": "health-wellness",
  "question": "Why is it important to consult a doctor before starting a new intense exercise regimen, especially if you have pre-existing health conditions?",
  "answers": [
    { "text": "To get permission to exercise", "correct": false },
    { "text": "To ensure the regimen is safe, appropriate for your health status, and to identify any potential risks or modifications needed", "correct": true, "explanation": "Medical clearance helps prevent injuries or exacerbation of existing conditions." },
    { "text": "To get tips for faster results", "correct": false },
    { "text": "To make sure your insurance covers it", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["health", "exercise-safety", "medical-consultation"]
},

{
  "id": "q496",
  "category": "environmental-safety",
  "question": "What is a 'heat island' effect in urban areas, and why is it a concern?",
  "answers": [
    { "text": "An area with many outdoor heaters", "correct": false },
    { "text": "An urban area that is significantly warmer than surrounding rural areas due to human activities, increasing heat-related illnesses and energy consumption", "correct": true, "explanation": "Heat islands pose public health risks and increase demand for air conditioning." },
    { "text": "An island surrounded by warm ocean currents", "correct": false },
    { "text": "An area where temperatures are always consistent", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["environmental-safety", "urban-planning", "heat-island-effect"]
},
{
  "id": "q497",
  "category": "environmental-safety",
  "question": "Why is it dangerous to collect and consume rainwater directly from rooftops without purification?",
  "answers": [
    { "text": "It tastes bland", "correct": false },
    { "text": "It can be contaminated with pollutants, chemicals, and microorganisms from the roof surface and atmosphere", "correct": true, "explanation": "Rainwater is not inherently clean and requires filtration/purification for safe consumption." },
    { "text": "It is too acidic for consumption", "correct": false },
    { "text": "It contains too many minerals", "correct": false }
  ],
  "difficulty": "medium",
  "tags": ["environmental-safety", "rainwater", "water-contamination"]
},
{
  "id": "q498",
  "category": "environmental-safety",
  "question": "What is the significance of the ozone layer for human safety?",
  "answers": [
    { "text": "It regulates global temperatures", "correct": false },
    { "text": "It provides oxygen for breathing", "correct": false },
    { "text": "It absorbs most of the sun's harmful ultraviolet (UV) radiation, protecting living organisms from skin cancer, cataracts, and immune system damage", "correct": true, "explanation": "The ozone layer is a natural shield against dangerous UV rays." },
    { "text": "It is responsible for all weather patterns", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["environmental-safety", "ozone-layer", "UV-radiation"]
},
{
  "id": "q499",
  "category": "environmental-safety",
  "question": "What is the primary danger associated with exposure to asbestos?",
  "answers": [
    { "text": "It causes allergic reactions", "correct": false },
    { "text": "It is a fire hazard", "correct": false },
    { "text": "It can cause severe respiratory diseases, including asbestosis, lung cancer, and mesothelioma, due to inhalation of microscopic fibers", "correct": true, "explanation": "Asbestos is a known carcinogen and its fibers can remain in the lungs for decades, causing serious illness." },
    { "text": "It emits dangerous radiation", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["environmental-safety", "asbestos", "carcinogen", "respiratory-health"]
},
{
  "id": "q500",
  "category": "environmental-safety",
  "question": "What is the 'precautionary principle' in environmental safety and public health?",
  "answers": [
    { "text": "Only taking action after scientific certainty of harm is proven", "correct": false },
    { "text": "Prioritizing economic development over environmental protection", "correct": false },
    { "text": "When an activity raises threats of harm to human health or the environment, precautionary measures should be taken even if some cause-and-effect relationships are not fully established scientifically", "correct": true, "explanation": "This principle advocates for proactive measures to prevent harm when there's scientific uncertainty about potential risks." },
    { "text": "Relying solely on technological solutions to environmental problems", "correct": false }
  ],
  "difficulty": "hard",
  "tags": ["environmental-safety", "public-health", "precautionary-principle"]
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
