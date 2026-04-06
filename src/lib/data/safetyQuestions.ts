// src/lib/data/safetyQuestions.ts

export interface Answer {
  text: string;
  correct: boolean;
  explanation?: string; // Shown after answer for learning
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
      { text: "Never share your address with someone you met online", correct: true, explanation: "Never give personal address to new online contacts." },
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
      { text: "Send them — it’s easy money", correct: false },
      { text: "Block and report the account immediately", correct: true, explanation: "This is a common sextortion tactic." },
      { text: "Ask for more money first", correct: false },
      { text: "Agree but use fake photos", correct: false }
    ],
    difficulty: "medium",
    tags: ["sextortion", "scams"]
  },

  // ====================== STREET SAFETY ======================
  {
    id: "q3",
    category: "street",
    question: "You notice someone following you while walking at night. The best immediate action is:",
    answers: [
      { text: "Confront them angrily", correct: false },
      { text: "Go into the nearest open shop, cafe, or well-lit area", correct: true, explanation: "Public places with people are safest." },
      { text: "Run as fast as you can", correct: false },
      { text: "Ignore them completely", correct: false }
    ],
    difficulty: "medium",
    tags: ["night-safety", "awareness"]
  },
  {
    id: "q4",
    category: "street",
    question: "When using public transport at night, where is the safest place to sit?",
    answers: [
      { text: "At the back where it’s quiet", correct: false },
      { text: "Near the driver or conductor", correct: true, explanation: "Being close to authority figures increases safety." },
      { text: "Next to the emergency exit", correct: false },
      { text: "Anywhere, it doesn’t matter", correct: false }
    ],
    difficulty: "easy",
    tags: ["transport", "night-safety"]
  },

  // ====================== GENERAL / HOME ======================
  {
    id: "q5",
    category: "home",
    question: "You’re home alone and someone knocks claiming to be from a delivery service but you didn’t order anything. You should:",
    answers: [
      { text: "Open the door to check", correct: false },
      { text: "Ask them to leave the package outside and watch through the window", correct: true },
      { text: "Tell them to come back later", correct: false },
      { text: "Invite them in to wait", correct: false }
    ],
    difficulty: "medium",
    tags: ["home-safety"]
  },

  // Add more questions here...
];

export const getQuestionsByCategory = (category: SafetyQuestion['category']) => {
  return safetyQuestions.filter(q => q.category === category);
};

export const getRandomQuestions = (count: number = 10) => {
  return [...safetyQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
};