<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    ShieldCheck, 
    ArrowRight, 
    PlayCircle, 
    MapPin, 
    Radio, 
    Cpu, 
    BadgeCheck, 
    Map, 
    EyeOff, 
    BellRing,
    Smartphone,
    BrainCircuit,
    Megaphone,
    ScanEye,
    Users,
    LockKeyhole,
    FlagTriangleRight,
    PhoneCall,
    MessageCircle,
    X,
    Menu,
    Gamepad2,
    Trophy,
    Timer,
    AlertTriangle,
    CheckCircle2,
    Siren,
    Home,
    Car,
    Flame,
    Shield,
    Eye,
    Ear,
    Footprints,
    HeartPulse
  } from 'lucide-svelte';

  let isMenuOpen = $state(false);
  let activeGame = $state<string | null>(null);
  let gameScore = $state(0);
  let gameTimer = $state(0);
  let gameInterval: ReturnType<typeof setInterval> | null = null;

  // Game 1: Spot the Hazard
  let hazardItems = $state([
    { id: 1, x: 20, y: 30, type: 'spill', found: false, icon: '💧' },
    { id: 2, x: 70, y: 20, type: 'wire', found: false, icon: '🔌' },
    { id: 3, x: 45, y: 60, type: 'box', found: false, icon: '📦' },
    { id: 4, x: 80, y: 70, type: 'fire', found: false, icon: '🔥' },
    { id: 5, x: 15, y: 80, type: 'wet', found: false, icon: '⚠️' }
  ]);

  // Game 2: Emergency Response
  let emergencyScenario = $state({
    situation: 'Fire in the kitchen',
    options: [
      { id: 1, text: 'Use water to put out grease fire', correct: false },
      { id: 2, text: 'Cover with metal lid and turn off heat', correct: true },
      { id: 3, text: 'Throw flour on the fire', correct: false },
      { id: 4, text: 'Leave and call 911', correct: true }
    ],
    selected: [] as number[],
    submitted: false
  });

  // Game 3: Safety Crossword (Simplified Word Find)
  let crosswordWords = $state([
    { word: 'HELMET', found: false, hint: 'Head protection gear' },
    { word: 'EXIT', found: false, hint: 'Way out during emergency' },
    { word: 'ALERT', found: false, hint: 'Stay aware and watchful' },
    { word: 'FIRSTAID', found: false, hint: 'Emergency medical kit' }
  ]);
  let currentGuess = $state('');
  let foundWords = $state<string[]>([]);

  // Game 4: Traffic Safety Challenge
  let trafficQuestion = $state(0);
  let trafficScore = $state(0);
  let trafficQuestions = [
    {
      question: 'What does a flashing yellow light mean?',
      options: ['Stop immediately', 'Proceed with caution', 'Speed up', 'Pedestrian crossing'],
      correct: 1
    },
    {
      question: 'When should you use high beams?',
      options: ['In fog', 'In city traffic', 'On empty dark roads', 'Never'],
      correct: 2
    },
    {
      question: 'Safe following distance in dry conditions?',
      options: ['1 second', '2 seconds', '3+ seconds', '0.5 seconds'],
      correct: 2
    }
  ];

  // Game 5: PPE Matching
  let ppeItems = $state([
    { id: 1, name: 'Hard Hat', icon: '⛑️', matched: false },
    { id: 2, name: 'Safety Glasses', icon: '🥽', matched: false },
    { id: 3, name: 'Gloves', icon: '🧤', matched: false },
    { id: 4, name: 'Boots', icon: '👢', matched: false },
    { id: 5, name: 'Vest', icon: '🦺', matched: false },
    { id: 6, name: 'Mask', icon: '😷', matched: false }
  ]);
  let selectedPPE: number | null = $state(null);
  let ppeMatches = $state(0);

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    isMenuOpen = false;
  };

  // Game Functions
  function startGame(gameId: string) {
    activeGame = gameId;
    gameScore = 0;
    gameTimer = 0;
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      gameTimer++;
    }, 1000);
  }

  function endGame() {
    if (gameInterval) {
      clearInterval(gameInterval);
      gameInterval = null;
    }
    activeGame = null;
  }

  // Hazard Game Functions
  function findHazard(id: number) {
    const hazard = hazardItems.find(h => h.id === id);
    if (hazard && !hazard.found) {
      hazard.found = true;
      gameScore += 100;
      hazardItems = [...hazardItems];
      
      if (hazardItems.every(h => h.found)) {
        setTimeout(() => {
          alert(`🎉 You found all hazards! Score: ${gameScore}`);
          endGame();
        }, 500);
      }
    }
  }

  // Emergency Response Functions
  function selectEmergencyOption(id: number) {
    if (emergencyScenario.submitted) return;
    
    const idx = emergencyScenario.selected.indexOf(id);
    if (idx > -1) {
      emergencyScenario.selected = emergencyScenario.selected.filter(i => i !== id);
    } else {
      emergencyScenario.selected = [...emergencyScenario.selected, id];
    }
  }

  function submitEmergencyResponse() {
    emergencyScenario.submitted = true;
    let correct = 0;
    emergencyScenario.selected.forEach(id => {
      const option = emergencyScenario.options.find(o => o.id === id);
      if (option?.correct) correct++;
    });
    
    const wrong = emergencyScenario.selected.length - correct;
    gameScore = Math.max(0, correct * 100 - wrong * 50);
  }

  function resetEmergencyGame() {
    emergencyScenario = {
      ...emergencyScenario,
      selected: [],
      submitted: false
    };
    gameScore = 0;
  }

  // Crossword Functions
  function submitWordGuess() {
    const upper = currentGuess.toUpperCase();
    const word = crosswordWords.find(w => w.word === upper && !w.found);
    
    if (word) {
      word.found = true;
      foundWords = [...foundWords, upper];
      gameScore += word.word.length * 50;
      crosswordWords = [...crosswordWords];
    }
    currentGuess = '';
  }

  // Traffic Safety Functions
  function answerTrafficQuestion(answerIndex: number) {
    if (trafficQuestions[trafficQuestion].correct === answerIndex) {
      trafficScore += 100;
      gameScore += 100;
    }
    
    if (trafficQuestion < trafficQuestions.length - 1) {
      trafficQuestion++;
    } else {
      setTimeout(() => {
        alert(`🚗 Traffic Safety Complete! Score: ${trafficScore}`);
        trafficQuestion = 0;
        trafficScore = 0;
        endGame();
      }, 500);
    }
  }

  // PPE Matching Functions
  function selectPPE(id: number) {
    if (selectedPPE === null) {
      selectedPPE = id;
    } else {
      // Simple matching logic - in real game would check if they match
      const item1 = ppeItems.find(p => p.id === selectedPPE);
      const item2 = ppeItems.find(p => p.id === id);
      
      if (item1 && item2 && selectedPPE !== id) {
        item1.matched = true;
        item2.matched = true;
        ppeMatches++;
        gameScore += 150;
        ppeItems = [...ppeItems];
        
        if (ppeMatches >= 3) {
          setTimeout(() => {
            alert(`🦺 PPE Master! Score: ${gameScore}`);
            endGame();
          }, 500);
        }
      }
      selectedPPE = null;
    }
  }

  const games = [
    {
      id: 'hazard-hunt',
      title: 'Hazard Hunter',
      description: 'Find all 5 safety hazards in the workplace scene',
      icon: ScanEye,
      color: '#ef4444',
      difficulty: 'Easy'
    },
    {
      id: 'emergency-response',
      title: 'Emergency Response',
      description: 'Choose the correct actions for emergency situations',
      icon: Siren,
      color: '#f97316',
      difficulty: 'Medium'
    },
    {
      id: 'safety-words',
      title: 'Safety Word Find',
      description: 'Find safety-related words from the hints provided',
      icon: BrainCircuit,
      color: '#8b5cf6',
      difficulty: 'Easy'
    },
    {
      id: 'traffic-challenge',
      title: 'Traffic Safety Pro',
      description: 'Test your knowledge of road safety rules',
      icon: Car,
      color: '#06b6d4',
      difficulty: 'Medium'
    },
    {
      id: 'ppe-match',
      title: 'PPE Matcher',
      description: 'Match personal protective equipment pairs',
      icon: Shield,
      color: '#10b981',
      difficulty: 'Easy'
    },
    {
      id: 'home-safety',
      title: 'Home Safety Scan',
      description: 'Identify risks in a virtual home environment',
      icon: Home,
      color: '#f59e0b',
      difficulty: 'Hard'
    }
  ];
</script>

<svelte:head>
  <title>Lezie - Safety Games & Training</title>
  <meta name="description" content="Learn safety skills through interactive games and challenges." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<!-- FLOATING ACTION BUTTON -->
<a href="/report" class="lz-fab" aria-label="Report an incident">
  <FlagTriangleRight size={20} />
  <span>Report incident</span>
</a>

<!-- NAV -->
<nav class="lz-nav">
  <div class="lz-nav-inner">
    <button type="button" class="lz-logo" onclick={() => scrollToSection('home')}>
      <img src="/icons/lz_ico.png" alt="Lezie" class="lz-logo-img" width="32" height="32" />
      <span class="lz-logo-text">Lezie</span>
    </button>

    <button 
      type="button" 
      class="lz-hamburger" 
      onclick={() => isMenuOpen = !isMenuOpen} 
      aria-label="Toggle menu"
    >
      {#if isMenuOpen}
        <X size={22} />
      {:else}
        <Menu size={22} />
      {/if}
    </button>

    <div class="lz-nav-links" class:open={isMenuOpen}>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('games')}>Safety Games</button>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('features')}>Features</button>
      <button type="button" class="lz-nav-link" onclick={() => scrollToSection('how-it-works')}>How it works</button>
      <a href="/dashboard" class="lz-nav-cta">Dashboard</a>
    </div>
  </div>
</nav>

<!-- HERO -->
<section id="home" class="lz-hero">
  <div class="lz-hero-content">
    <div class="lz-badge animate-on-scroll">
      <Gamepad2 size={14} />
      Interactive Safety Training
    </div>

    <h1 class="lz-hero-title animate-on-scroll">
      Learn safety through<br>
      <span class="lz-violet-text">play & practice</span>
    </h1>

    <p class="lz-hero-desc animate-on-scroll">
      Master essential safety skills with our collection of interactive games. 
      From hazard identification to emergency response training — learn by doing.
    </p>

    <div class="lz-hero-btns animate-on-scroll">
      <button type="button" class="lz-btn-primary" onclick={() => scrollToSection('games')}>
        Play Now
        <ArrowRight size={16} />
      </button>
      <button 
        type="button" 
        class="lz-btn-secondary" 
        onclick={() => scrollToSection('how-it-works')}
      >
        <PlayCircle size={16} />
        How it works
      </button>
    </div>

    <div class="lz-stats animate-on-scroll">
      <div class="lz-stat">
        <span class="lz-stat-n">6</span>
        <span class="lz-stat-l">Safety Games</span>
      </div>
      <div class="lz-stat-sep"></div>
      <div class="lz-stat">
        <span class="lz-stat-n">50+</span>
        <span class="lz-stat-l">Scenarios</span>
      </div>
      <div class="lz-stat-sep"></div>
      <div class="lz-stat">
        <span class="lz-stat-n">10K+</span>
        <span class="lz-stat-l">Games Played</span>
      </div>
    </div>
  </div>

  <div class="lz-hero-visual animate-on-scroll">
    <div class="lz-map-card" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 1px solid rgba(139, 92, 246, 0.3);">
      <div class="lz-map-topbar" style="border-bottom: 1px solid rgba(139, 92, 246, 0.2);">
        <Gamepad2 size={14} style="color:var(--primary-color)" />
        <span>Active Games Arena</span>
        <span class="lz-live-dot"></span>
        <span style="font-size:0.75rem;color:var(--primary-color);font-weight:600">Live</span>
      </div>
      <div style="padding: 2rem; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
        {#each games.slice(0, 4) as game}
          <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 12px; padding: 1rem; text-align: center;">
            <svelte:component this={game.icon} size={24} style="color: {game.color}; margin: 0 auto 0.5rem;" />
            <div style="font-size: 0.75rem; color: #a0a0a0;">{game.title}</div>
          </div>
        {/each}
      </div>
      <div style="padding: 0 2rem 2rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #10b981;">
          <Trophy size={14} />
          <span>2,847 players online now</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- GAMES SECTION -->
<section id="games" class="lz-section lz-section-alt">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Safety Games</span>
      <h2>Choose your training mission</h2>
      <p>Select a game to test and improve your safety awareness</p>
    </div>

    {#if activeGame}
      <div class="game-interface animate-on-scroll">
        <div class="game-header">
          <div class="game-stats">
            <div class="stat-box">
              <Trophy size={16} />
              <span>{gameScore}</span>
            </div>
            <div class="stat-box">
              <Timer size={16} />
              <span>{Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
          <button class="lz-btn-secondary" onclick={endGame}>
            <X size={16} />
            Exit Game
          </button>
        </div>

        <!-- Hazard Hunter Game -->
        {#if activeGame === 'hazard-hunt'}
          <div class="game-canvas hazard-game">
            <h3>🔍 Find all 5 hazards in the scene!</h3>
            <div class="scene-container">
              <!-- Floor -->
              <div class="floor"></div>
              <!-- Desk -->
              <div class="desk"></div>
              <!-- Chair -->
              <div class="chair"></div>
              <!-- Shelves -->
              <div class="shelf"></div>
              
              <!-- Hazards -->
              {#each hazardItems as hazard}
                {#if !hazard.found}
                  <button
                    class="hazard-item"
                    style="left: {hazard.x}%; top: {hazard.y}%;"
                    onclick={() => findHazard(hazard.id)}
                    aria-label="Potential hazard"
                  >
                    <span class="hazard-pulse"></span>
                    <span class="hazard-icon">{hazard.icon}</span>
                  </button>
                {:else}
                  <div class="hazard-found" style="left: {hazard.x}%; top: {hazard.y}%;">
                    <CheckCircle2 size={20} color="#10b981" />
                  </div>
                {/if}
              {/each}
            </div>
            <div class="hazard-legend">
              <span>Found: {hazardItems.filter(h => h.found).length} / {hazardItems.length}</span>
            </div>
          </div>
        {/if}

        <!-- Emergency Response Game -->
        {#if activeGame === 'emergency-response'}
          <div class="game-canvas emergency-game">
            <div class="emergency-alert">
              <Siren size={32} color="#ef4444" />
              <h3>🚨 {emergencyScenario.situation}</h3>
              <p>Select ALL correct actions (multiple answers may be correct):</p>
            </div>
            
            <div class="options-grid">
              {#each emergencyScenario.options as option}
                <button
                  class="option-btn"
                  class:selected={emergencyScenario.selected.includes(option.id)}
                  class:correct={emergencyScenario.submitted && option.correct}
                  class:wrong={emergencyScenario.submitted && !option.correct && emergencyScenario.selected.includes(option.id)}
                  disabled={emergencyScenario.submitted}
                  onclick={() => selectEmergencyOption(option.id)}
                >
                  <span class="option-check">
                    {#if emergencyScenario.selected.includes(option.id)}
                      <CheckCircle2 size={18} />
                    {/if}
                  </span>
                  {option.text}
                </button>
              {/each}
            </div>

            {#if !emergencyScenario.submitted}
              <button 
                class="lz-btn-primary"
                disabled={emergencyScenario.selected.length === 0}
                onclick={submitEmergencyResponse}
              >
                Submit Response
              </button>
            {:else}
              <div class="result-box">
                <p>Score: {gameScore} points</p>
                <button class="lz-btn-secondary" onclick={resetEmergencyGame}>
                  Try Again
                </button>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Safety Word Find -->
        {#if activeGame === 'safety-words'}
          <div class="game-canvas word-game">
            <h3>📝 Find the Safety Words</h3>
            <div class="word-grid">
              {#each crosswordWords as word}
                <div class="word-item" class:found={word.found}>
                  <span class="word-hint">{word.hint}</span>
                  {#if word.found}
                    <span class="word-revealed">{word.word}</span>
                    <CheckCircle2 size={16} color="#10b981" />
                  {:else}
                    <span class="word-hidden">{'•'.repeat(word.word.length)}</span>
                  {/if}
                </div>
              {/each}
            </div>
            
            <div class="word-input-area">
              <input
                type="text"
                bind:value={currentGuess}
                placeholder="Enter word..."
                maxlength="10"
                onkeydown={(e) => e.key === 'Enter' && submitWordGuess()}
              />
              <button class="lz-btn-primary" onclick={submitWordGuess}>
                Submit
              </button>
            </div>
            
            <div class="found-words">
              <strong>Found: </strong>
              {#if foundWords.length === 0}
                <span style="color: #666;">None yet...</span>
              {:else}
                {#each foundWords as word}
                  <span class="word-tag">{word}</span>
                {/each}
              {/if}
            </div>
          </div>
        {/if}

        <!-- Traffic Safety -->
        {#if activeGame === 'traffic-challenge'}
          <div class="game-canvas traffic-game">
            <div class="progress-bar">
              <div class="progress-fill" style="width: {(trafficQuestion / trafficQuestions.length) * 100}%"></div>
            </div>
            <span class="question-counter">Question {trafficQuestion + 1} of {trafficQuestions.length}</span>
            
            <h3>🚦 {trafficQuestions[trafficQuestion].question}</h3>
            
            <div class="traffic-options">
              {#each trafficQuestions[trafficQuestion].options as option, i}
                <button class="traffic-btn" onclick={() => answerTrafficQuestion(i)}>
                  <span class="option-letter">{String.fromCharCode(65 + i)}</span>
                  {option}
                </button>
              {/each}
            </div>
            
            <div class="traffic-score">Current Score: {trafficScore}</div>
          </div>
        {/if}

        <!-- PPE Matching -->
        {#if activeGame === 'ppe-match'}
          <div class="game-canvas ppe-game">
            <h3>🦺 Match the PPE Items</h3>
            <p>Click two items to match them</p>
            
            <div class="ppe-grid">
              {#each ppeItems as item}
                <button
                  class="ppe-card"
                  class:selected={selectedPPE === item.id}
                  class:matched={item.matched}
                  disabled={item.matched}
                  onclick={() => selectPPE(item.id)}
                >
                  <span class="ppe-emoji">{item.icon}</span>
                  {#if item.matched}
                    <span class="ppe-name">{item.name}</span>
                    <CheckCircle2 size={16} color="#10b981" />
                  {/if}
                </button>
              {/each}
            </div>
            
            <div class="match-progress">
              Matches: {ppeMatches} / 3
            </div>
          </div>
        {/if}

        <!-- Home Safety (Placeholder for expansion) -->
        {#if activeGame === 'home-safety'}
          <div class="game-canvas home-game">
            <h3>🏠 Home Safety Scanner</h3>
            <p>Coming soon: Explore a 3D home environment and identify safety risks!</p>
            <div class="coming-soon-illustration">
              <Home size={64} color="#8b5cf6" />
              <Shield size={48} color="#10b981" style="position: absolute; bottom: 0; right: 0;" />
            </div>
            <button class="lz-btn-primary" onclick={() => startGame('hazard-hunt')}>
              Play Hazard Hunter Instead
            </button>
          </div>
        {/if}
      </div>
    {:else}
      <div class="games-grid">
        {#each games as game}
          <div class="game-card animate-on-scroll">
            <div class="game-icon-wrapper" style="background: {game.color}20; border-color: {game.color}40;">
              <svelte:component this={game.icon} size={32} style="color: {game.color};" />
            </div>
            <div class="game-difficulty" style="color: {game.color};">
              {game.difficulty}
            </div>
            <h3>{game.title}</h3>
            <p>{game.description}</p>
            <button class="lz-btn-primary game-start-btn" onclick={() => startGame(game.id)}>
              <PlayCircle size={16} />
              Play Now
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- FEATURES -->
<section id="features" class="lz-section">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">Features</span>
      <h2>Gamified safety learning</h2>
      <p>Effective training through interactive experiences</p>
    </div>

    <div class="lz-feat-grid">
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Trophy size={22} style="color:var(--primary-color)" /></div>
        <h3>Achievement System</h3>
        <p>Earn badges and certificates as you complete training modules. Track your progress and compete with colleagues.</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><BrainCircuit size={22} style="color:var(--primary-color)" /></div>
        <h3>Adaptive Difficulty</h3>
        <p>AI-powered difficulty adjustment ensures optimal learning pace. Questions adapt based on your performance.</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Users size={22} style="color:var(--primary-color)" /></div>
        <h3>Team Challenges</h3>
        <p>Compete in team-based safety challenges. Perfect for company training and community building.</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><ScanEye size={22} style="color:var(--primary-color)" /></div>
        <h3>Realistic Scenarios</h3>
        <p>High-fidelity simulations based on real incident reports. Practice decision-making in safe environments.</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><Timer size={22} style="color:var(--primary-color)" /></div>
        <h3>Timed Challenges</h3>
        <p>Pressure-testing mode for emergency response training. Improve reaction times under stress.</p>
      </div>
      <div class="lz-feat-card animate-on-scroll">
        <div class="lz-feat-icon"><BadgeCheck size={22} style="color:var(--primary-color)" /></div>
        <h3>Certification</h3>
        <p>Industry-recognized completion certificates. Share credentials and maintain compliance records.</p>
      </div>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section id="how-it-works" class="lz-section lz-section-alt">
  <div class="lz-container">
    <div class="lz-sec-head animate-on-scroll">
      <span class="lz-tag">How it works</span>
      <h2>Train in 3 simple steps</h2>
      <p>From signup to safety expert</p>
    </div>

    <div class="lz-steps">
      <div class="lz-step animate-on-scroll">
        <div class="lz-step-num">1</div>
        <div class="lz-step-ico"><Smartphone size={28} style="color:var(--primary-color)" /></div>
        <h3>Choose your role</h3>
        <p>Select your industry and role to get personalized safety training scenarios relevant to your work environment.</p>
      </div>
      <div class="lz-step animate-on-scroll">
        <div class="lz-step-num">2</div>
        <div class="lz-step-ico"><Gamepad2 size={28} style="color:var(--primary-color)" /></div>
        <h3>Play & Learn</h3>
        <p>Complete interactive games and simulations. Each scenario teaches critical safety skills through hands-on practice.</p>
      </div>
      <div class="lz-step animate-on-scroll">
        <div class="lz-step-num">3</div>
        <div class="lz-step-ico"><BadgeCheck size={28} style="color:var(--primary-color)" /></div>
        <h3>Get Certified</h3>
        <p>Pass assessments to earn certificates. Track compliance and share achievements with your organization.</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="lz-section">
  <div class="lz-container">
    <div class="lz-cta animate-on-scroll">
      <h2>Ready to become a safety expert?</h2>
      <p>Join thousands training with Lezie's interactive safety platform.</p>
      <div class="lz-cta-btns">
        <button type="button" class="lz-btn-primary lz-btn-lg" onclick={() => scrollToSection('games')}>
          <Gamepad2 size={16} />
          Start Training
        </button>
        <a href="/report" class="lz-btn-outline-lg">
          <FlagTriangleRight size={16} />
          Report incident
        </a>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="lz-footer">
  <div class="lz-container">
    <div class="lz-foot-grid">
      <div>
        <div class="lz-foot-logo">
          <div class="lz-logo-mark" style="width:26px;height:26px;border-radius:6px; background: var(--primary-color); display: flex; align-items: center; justify-content: center;">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L1 4.5L8 8L15 4.5L8 1Z" fill="white" fill-opacity=".9"/>
              <path d="M1 4.5V11.5L8 15L15 11.5V4.5" stroke="white" stroke-opacity=".6" stroke-width="1.2" fill="none"/>
            </svg>
          </div>
          Lezie
        </div>
        <p class="lz-foot-desc">Making communities safer through technology and collective action.</p>
        <div class="lz-socials">
          <button type="button" class="lz-soc" aria-label="X / Twitter">
            <X size={15} />
          </button>
          <button type="button" class="lz-soc" aria-label="Discord">
            <MessageCircle size={15} />
          </button>
        </div>
      </div>

      <div class="lz-foot-col">
        <h4>Training</h4>
        <button type="button" class="lz-foot-link" onclick={() => scrollToSection('games')}>Safety Games</button>
        <button type="button" class="lz-foot-link">Certifications</button>
        <button type="button" class="lz-foot-link">For Business</button>
        <button type="button" class="lz-foot-link">Leaderboard</button>
      </div>

      <div class="lz-foot-col">
        <h4>Product</h4>
        <button type="button" class="lz-foot-link" onclick={() => scrollToSection('features')}>Features</button>
        <button type="button" class="lz-foot-link" onclick={() => scrollToSection('how-it-works')}>How it works</button>
        <a href="/dashboard" class="lz-foot-link">Dashboard</a>
        <a href="/report" class="lz-foot-link">Report incident</a>
      </div>

      <div class="lz-foot-col">
        <h4>Resources</h4>
        <button type="button" class="lz-foot-link">Help centre</button>
        <button type="button" class="lz-foot-link">Safety tips</button>
        <button type="button" class="lz-foot-link">Privacy policy</button>
        <button type="button" class="lz-foot-link">Terms of service</button>
      </div>
    </div>

    <div class="lz-foot-bottom">
      <p>&copy; 2025 Lezie. All rights reserved.</p>
    </div>
  </div>
</footer>

<style>
  :global(:root) {
    --primary-color: #8b5cf6;
    --primary-light: #a78bfa;
    --primary-bg: rgba(139, 92, 246, 0.1);
    --bg-color: #0a0a0f;
    --card-bg: rgba(255, 255, 255, 0.03);
    --text-primary: #fafafa;
    --text-secondary: #a0a0a0;
    --border-color: rgba(255, 255, 255, 0.1);
  }

  /* Game Interface Styles */
  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .game-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .game-card:hover {
    transform: translateY(-4px);
    border-color: var(--primary-color);
    box-shadow: 0 10px 40px rgba(139, 92, 246, 0.2);
  }

  .game-icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    border: 2px solid;
  }

  .game-difficulty {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .game-card h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }

  .game-card p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .game-start-btn {
    width: 100%;
    justify-content: center;
  }

  .game-interface {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 2rem;
    margin-top: 2rem;
    min-height: 500px;
  }

  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  .game-stats {
    display: flex;
    gap: 1rem;
  }

  .stat-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--primary-bg);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    color: var(--primary-color);
    font-weight: 600;
  }

  .game-canvas {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 2rem;
    min-height: 400px;
  }

  .game-canvas h3 {
    margin-bottom: 1.5rem;
    color: var(--text-primary);
  }

  /* Hazard Game Styles */
  .hazard-game .scene-container {
    position: relative;
    width: 100%;
    height: 300px;
    background: linear-gradient(to bottom, #2a2a3e 0%, #1a1a2e 100%);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .floor {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40%;
    background: #3a3a4e;
    border-top: 2px solid #4a4a5e;
  }

  .desk {
    position: absolute;
    bottom: 20%;
    left: 10%;
    width: 30%;
    height: 15%;
    background: #8b5cf6;
    border-radius: 4px;
  }

  .chair {
    position: absolute;
    bottom: 25%;
    right: 20%;
    width: 15%;
    height: 20%;
    background: #06b6d4;
    border-radius: 8px 8px 0 0;
  }

  .shelf {
    position: absolute;
    top: 20%;
    right: 10%;
    width: 25%;
    height: 40%;
    background: #4a4a5e;
    border: 2px solid #5a5a6e;
  }

  .hazard-item {
    position: absolute;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 10;
    animation: pulse 2s infinite;
  }

  .hazard-pulse {
    position: absolute;
    width: 40px;
    height: 40px;
    background: rgba(239, 68, 68, 0.3);
    border-radius: 50%;
    animation: ripple 2s infinite;
  }

  .hazard-icon {
    position: relative;
    font-size: 1.5rem;
    display: block;
    transform: translate(8px, 8px);
  }

  .hazard-found {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(16, 185, 129, 0.2);
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes ripple {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  .hazard-legend {
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  /* Emergency Game Styles */
  .emergency-alert {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;
  }

  .emergency-alert h3 {
    margin: 1rem 0 0.5rem;
    color: #ef4444;
  }

  .options-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .option-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: var(--card-bg);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .option-btn:hover:not(:disabled) {
    border-color: var(--primary-color);
    background: var(--primary-bg);
  }

  .option-btn.selected {
    border-color: var(--primary-color);
    background: var(--primary-bg);
  }

  .option-btn.correct {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.2);
  }

  .option-btn.wrong {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.2);
    opacity: 0.7;
  }

  .option-check {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .result-box {
    text-align: center;
    padding: 1.5rem;
    background: var(--primary-bg);
    border-radius: 12px;
    margin-top: 1rem;
  }

  /* Word Game Styles */
  .word-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .word-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    transition: all 0.3s;
  }

  .word-item.found {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.1);
  }

  .word-hint {
    flex: 1;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .word-hidden {
    font-family: monospace;
    letter-spacing: 4px;
    color: var(--text-primary);
    font-size: 1.1rem;
  }

  .word-revealed {
    font-weight: 600;
    color: #10b981;
    margin-right: 0.5rem;
    letter-spacing: 2px;
  }

  .word-input-area {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .word-input-area input {
    flex: 1;
    padding: 0.75rem 1rem;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 1rem;
    text-transform: uppercase;
  }

  .word-input-area input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .found-words {
    padding: 1rem;
    background: rgba(139, 92, 246, 0.05);
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .word-tag {
    display: inline-block;
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    margin: 0.25rem;
    font-size: 0.8rem;
    font-weight: 600;
  }

  /* Traffic Game Styles */
  .progress-bar {
    width: 100%;
    height: 6px;
    background: var(--card-bg);
    border-radius: 3px;
    margin-bottom: 0.5rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary-color);
    transition: width 0.3s ease;
  }

  .question-counter {
    display: block;
    text-align: right;
    color: var(--text-secondary);
    font-size: 0.8rem;
    margin-bottom: 1.5rem;
  }

  .traffic-options {
    display: grid;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .traffic-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: var(--card-bg);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    font-size: 1rem;
  }

  .traffic-btn:hover {
    border-color: var(--primary-color);
    transform: translateX(4px);
  }

  .option-letter {
    width: 32px;
    height: 32px;
    background: var(--primary-bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: var(--primary-color);
  }

  .traffic-score {
    margin-top: 2rem;
    text-align: center;
    font-size: 1.25rem;
    color: var(--primary-color);
    font-weight: 600;
  }

  /* PPE Game Styles */
  .ppe-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 2rem 0;
  }

  .ppe-card {
    aspect-ratio: 1;
    background: var(--card-bg);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .ppe-card:hover:not(:disabled) {
    border-color: var(--primary-color);
    transform: scale(1.05);
  }

  .ppe-card.selected {
    border-color: var(--primary-color);
    background: var(--primary-bg);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }

  .ppe-card.matched {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.2);
    cursor: default;
  }

  .ppe-emoji {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .ppe-name {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-align: center;
  }

  .match-progress {
    text-align: center;
    color: var(--text-secondary);
    font-size: 1rem;
  }

  /* Home Game Styles */
  .home-game {
    text-align: center;
  }

  .coming-soon-illustration {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 2rem auto;
    background: var(--primary-bg);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .games-grid {
      grid-template-columns: 1fr;
    }
    
    .ppe-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .game-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
    
    .game-stats {
      justify-content: center;
    }
  }
</style>
