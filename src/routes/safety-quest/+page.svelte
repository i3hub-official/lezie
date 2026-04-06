<script lang="ts">
  import { safetyQuestions, getRandomQuestions } from '$lib/data/safetyQuestions';
  import { 
    ShieldCheck, Trophy, ArrowRight, RefreshCw, Home, Sparkles,
    Brain, Target, Zap, CheckCircle2, XCircle, ChevronRight,
    RotateCcw, Award, Flame, AlertCircle, TrendingUp, Gamepad2,
    Shield, Clock, Star, Calendar, Medal, Lock, Users
  } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // ====================== STATE ======================
  let currentGame = $state<'menu' | 'quiz' | 'results' | 'achievements'>('menu');
  
  let questions = $state<any[]>([]);
  let currentIndex = $state(0);
  let score = $state(0);
  let selectedAnswer = $state<number | null>(null);
  let showExplanation = $state(false);
  let streak = $state(0);
  let maxStreak = $state(0);
  let answersHistory = $state<boolean[]>([]);

  // Persistent Progress
  let totalGamesPlayed = $state(0);
  let totalXP = $state(0);
  let currentLevel = $state(1);
  let currentDayStreak = $state(1);
  let lastPlayedDate = $state('');
  let completedQuestionIds = $state<string[]>([]);
  let longestStreak = $state(0);
  let totalCorrectAnswers = $state(0);

  // Achievements
  let achievements = $state([
    { id: 'first_game', name: 'First Steps', desc: 'Complete your first quest', icon: Shield, xp: 50 },
    { id: 'perfect_8', name: 'Flawless', desc: 'Score 100% on a full quest', icon: Award, xp: 150 },
    { id: 'streak_3', name: 'Consistent', desc: 'Reach 3-day streak', icon: Flame, xp: 80 },
    { id: 'streak_7', name: 'Dedicated', desc: 'Reach 7-day streak', icon: Flame, xp: 200 },
    { id: 'score_50', name: 'High Scorer', desc: 'Earn 50 total XP', icon: Trophy, xp: 100 },
    { id: 'master_10', name: 'Safety Master', desc: 'Complete 10 quests', icon: Medal, xp: 250 },
    { id: 'accuracy_90', name: 'Precision', desc: 'Achieve 90%+ accuracy', icon: Target, xp: 120 },
    { id: 'streak_14', name: 'Unstoppable', desc: 'Reach 14-day streak', icon: Flame, xp: 300 }
  ]);

  let unlockedAchievements = $state<string[]>([]);

  // Derived
  let totalQuestions = $derived(questions.length);
  let accuracy = $derived(answersHistory.length > 0 ? Math.round((answersHistory.filter(Boolean).length / answersHistory.length) * 100) : 0);
  let progressPercent = $derived(((currentIndex + (currentIndex >= totalQuestions ? 1 : 0)) / totalQuestions) * 100);
  let xpForNextLevel = $derived(currentLevel * 220);
  let xpProgress = $derived(Math.min((totalXP / xpForNextLevel) * 100, 100));

  // ====================== STORAGE ======================
  function loadProgress() {
    const saved = localStorage.getItem('safetyQuestFullProgress');
    if (saved) {
      const data = JSON.parse(saved);
      totalGamesPlayed = data.totalGamesPlayed || 0;
      totalXP = data.totalXP || 0;
      currentLevel = data.currentLevel || 1;
      currentDayStreak = data.currentDayStreak || 1;
      lastPlayedDate = data.lastPlayedDate || '';
      completedQuestionIds = data.completedQuestionIds || [];
      longestStreak = data.longestStreak || 0;
      totalCorrectAnswers = data.totalCorrectAnswers || 0;
      unlockedAchievements = data.unlockedAchievements || [];
    }
  }

  function saveProgress() {
    const today = new Date().toISOString().split('T')[0];
    if (lastPlayedDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      currentDayStreak = lastPlayedDate === yesterday ? currentDayStreak + 1 : 1;
      lastPlayedDate = today;
    }
    if (currentDayStreak > longestStreak) longestStreak = currentDayStreak;
    localStorage.setItem('safetyQuestFullProgress', JSON.stringify({
      totalGamesPlayed, totalXP, currentLevel, currentDayStreak, lastPlayedDate,
      completedQuestionIds, longestStreak, totalCorrectAnswers, unlockedAchievements
    }));
  }

  function checkAndUnlockAchievements() {
    let newlyUnlocked = false;
    achievements.forEach(ach => {
      if (unlockedAchievements.includes(ach.id)) return;
      let should = false;
      if (ach.id === 'first_game' && totalGamesPlayed >= 1) should = true;
      if (ach.id === 'perfect_8' && score === totalQuestions && totalQuestions === 8) should = true;
      if (ach.id === 'streak_3' && currentDayStreak >= 3) should = true;
      if (ach.id === 'streak_7' && currentDayStreak >= 7) should = true;
      if (ach.id === 'streak_14' && currentDayStreak >= 14) should = true;
      if (ach.id === 'score_50' && totalXP >= 50) should = true;
      if (ach.id === 'master_10' && totalGamesPlayed >= 10) should = true;
      if (ach.id === 'accuracy_90' && accuracy >= 90) should = true;
      if (should) {
        unlockedAchievements = [...unlockedAchievements, ach.id];
        totalXP += ach.xp;
        newlyUnlocked = true;
      }
    });
    while (totalXP >= xpForNextLevel) currentLevel++;
    if (newlyUnlocked) saveProgress();
  }

  // ====================== GAME LOGIC ======================
  function startNewGame() {
    questions = getRandomQuestions(8);
    currentIndex = 0; score = 0; selectedAnswer = null;
    showExplanation = false; streak = 0; maxStreak = 0; answersHistory = [];
    currentGame = 'quiz';
  }

  function selectAnswer(index: number) {
    if (selectedAnswer !== null) return;
    selectedAnswer = index;
    const isCorrect = questions[currentIndex].answers[index].correct;
    if (isCorrect) {
      score++; streak++;
      if (streak > maxStreak) maxStreak = streak;
      totalCorrectAnswers++;
      const qId = questions[currentIndex].id || questions[currentIndex].question;
      if (!completedQuestionIds.includes(qId)) completedQuestionIds = [...completedQuestionIds, qId];
    } else { streak = 0; }
    answersHistory = [...answersHistory, isCorrect];
    showExplanation = true;
  }

  function nextQuestion() {
    selectedAnswer = null; showExplanation = false;
    if (currentIndex < totalQuestions - 1) {
      currentIndex++;
    } else {
      totalGamesPlayed++;
      totalXP += Math.floor(score * 15 + (accuracy > 75 ? 40 : 0));
      checkAndUnlockAchievements();
      saveProgress();
      currentGame = 'results';
    }
  }

  function resetGame() { currentGame = 'menu'; }

  onMount(() => { loadProgress(); });
</script>

<svelte:head>
  <title>Safety Quest — Lezie</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
</svelte:head>

<div class="page">

  <!-- ===== NAV ===== -->
  <header class="nav">
    <div class="nav-inner">
      <button class="back-btn" onclick={() => goto('/')}>
        <Home size={16} />
        <span>Dashboard</span>
      </button>
      <div class="nav-brand">
        <div class="brand-icon"><ShieldCheck size={18} /></div>
        <span>Safety Quest</span>
      </div>
      <div class="nav-right">
        <!-- empty spacer for flex balance -->
      </div>
    </div>
  </header>

  <main class="content">

    <!-- ==================== MENU ==================== -->
    {#if currentGame === 'menu'}
      <div class="menu-wrap">

        <!-- ACHIEVEMENTS STRIP (TOP) -->
        <section class="achievements-strip">
          <div class="strip-header">
            <div class="strip-title-row">
              <Trophy size={16} />
              <span>Achievements</span>
              <span class="strip-count">{unlockedAchievements.length}/{achievements.length}</span>
            </div>
            <button class="strip-see-all" onclick={() => currentGame = 'achievements'}>
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div class="strip-scroll">
            {#each achievements as ach}
              {@const unlocked = unlockedAchievements.includes(ach.id)}
              <div class="ach-chip" class:unlocked>
                <div class="ach-chip-icon">
                  <svelte:component this={ach.icon} size={18} />
                </div>
                <div class="ach-chip-body">
                  <span class="ach-chip-name">{ach.name}</span>
                  <span class="ach-chip-xp">+{ach.xp} XP</span>
                </div>
                {#if !unlocked}
                  <div class="ach-chip-lock"><Lock size={12} /></div>
                {:else}
                  <div class="ach-chip-check"><CheckCircle2 size={14} /></div>
                {/if}
              </div>
            {/each}
          </div>
        </section>

        <!-- PLAYER STATS BAR -->
        <section class="player-bar">
          <div class="player-level">
            <div class="level-badge">
              <Star size={14} />
              <span>Lv {currentLevel}</span>
            </div>
            <div class="xp-track">
              <div class="xp-fill" style="width: {xpProgress}%"></div>
            </div>
            <span class="xp-label">{totalXP} / {xpForNextLevel} XP</span>
          </div>
          <div class="player-divider"></div>
          <div class="player-streak">
            <Flame size={18} />
            <div>
              <span class="streak-num">{currentDayStreak}</span>
              <span class="streak-label">day streak</span>
            </div>
          </div>
          <div class="player-divider"></div>
          <div class="player-games">
            <Shield size={18} />
            <div>
              <span class="streak-num">{totalGamesPlayed}</span>
              <span class="streak-label">quests done</span>
            </div>
          </div>
          <div class="player-divider"></div>
          <div class="player-games">
            <TrendingUp size={18} />
            <div>
              <span class="streak-num">{longestStreak}</span>
              <span class="streak-label">best streak</span>
            </div>
          </div>
        </section>

        <!-- HERO CARD -->
        <div class="hero-card">
          <div class="hero-glow"></div>
          <div class="hero-body">
            <div class="hero-badge">
              <Sparkles size={13} />
              Daily Training — {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </div>
            <h1 class="hero-title">Master Safety<br/>Through Play</h1>
            <p class="hero-sub">Test your knowledge with real-world scenarios and build lasting safety habits one quest at a time.</p>
            <button class="cta-btn" onclick={startNewGame}>
              <Gamepad2 size={20} />
              Start Today's Quest
              <ArrowRight size={18} />
            </button>
          </div>
          <div class="hero-art">
            <div class="orbit orbit-1">
              <div class="orbit-icon"><Shield size={22} /></div>
            </div>
            <div class="orbit orbit-2">
              <div class="orbit-icon"><Target size={18} /></div>
            </div>
            <div class="orbit orbit-3">
              <div class="orbit-icon"><Zap size={16} /></div>
            </div>
            <div class="center-orb">
              <ShieldCheck size={32} />
            </div>
          </div>
        </div>

      </div>

    <!-- ==================== QUIZ ==================== -->
    {:else if currentGame === 'quiz'}
      <div class="quiz-wrap">

        <!-- Progress Bar -->
        <div class="q-progress-bar">
          <div class="q-progress-meta">
            <span class="q-counter">
              <Brain size={14} />
              {Math.min(currentIndex + 1, totalQuestions)} / {totalQuestions}
            </span>
            <div class="q-pills">
              {#if streak > 1}
                <span class="q-pill flame">
                  <Flame size={13} />
                  {streak} streak
                </span>
              {/if}
              {#if answersHistory.length > 0}
                <span class="q-pill accuracy">
                  <TrendingUp size={13} />
                  {accuracy}%
                </span>
              {/if}
            </div>
          </div>
          <div class="q-track">
            {#each questions as _, i}
              <div
                class="q-segment"
                class:done={i < currentIndex}
                class:active={i === currentIndex}
                class:correct={i < answersHistory.length && answersHistory[i]}
                class:wrong={i < answersHistory.length && !answersHistory[i]}
              ></div>
            {/each}
          </div>
        </div>

        <!-- Question Card -->
        <div class="q-card">
          <div class="q-tag">Safety Scenario</div>
          <h2 class="q-text">{questions[currentIndex]?.question}</h2>

          <div class="q-answers">
            {#each questions[currentIndex]?.answers || [] as answer, i}
              {@const isSelected = selectedAnswer === i}
              {@const isCorrect = answer.correct}
              {@const showResult = selectedAnswer !== null}

              <button
                class="q-answer"
                class:selected={isSelected}
                class:correct={showResult && isCorrect}
                class:incorrect={showResult && isSelected && !isCorrect}
                class:dim={showResult && !isSelected && !isCorrect}
                disabled={selectedAnswer !== null}
                onclick={() => selectAnswer(i)}
              >
                <span class="q-letter">
                  {#if showResult && isCorrect}
                    <CheckCircle2 size={17} />
                  {:else if showResult && isSelected && !isCorrect}
                    <XCircle size={17} />
                  {:else}
                    {String.fromCharCode(65 + i)}
                  {/if}
                </span>
                <span class="q-answer-text">{answer.text}</span>
              </button>
            {/each}
          </div>

          {#if showExplanation && questions[currentIndex]?.answers[selectedAnswer!]?.explanation}
            <div class="q-explanation" class:correct={questions[currentIndex].answers[selectedAnswer!].correct}>
              <div class="q-exp-head">
                {#if questions[currentIndex].answers[selectedAnswer!].correct}
                  <CheckCircle2 size={16} /> Correct!
                {:else}
                  <AlertCircle size={16} /> Not quite right
                {/if}
              </div>
              <p>{questions[currentIndex].answers[selectedAnswer!].explanation}</p>
            </div>
          {/if}

          <button
            class="q-next"
            class:visible={selectedAnswer !== null}
            onclick={nextQuestion}
          >
            {currentIndex === totalQuestions - 1 ? 'View Results' : 'Next Question'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

    <!-- ==================== RESULTS ==================== -->
    {:else if currentGame === 'results'}
      <div class="results-wrap">
        <div class="results-card">
          <div class="results-glow"></div>
          <div class="results-inner">
            <div class="results-badge">Quest Complete</div>
            <div class="score-ring-wrap">
              <svg class="score-ring" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8"/>
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="url(#scoreGrad)" stroke-width="8"
                  stroke-linecap="round"
                  stroke-dasharray="{Math.round((accuracy / 100) * 327)} 327"
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#10b981"/>
                    <stop offset="100%" stop-color="#34d399"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="score-center">
                <span class="score-big">{accuracy}%</span>
                <span class="score-sub">{score}/{totalQuestions}</span>
              </div>
            </div>
            <div class="xp-earned">
              <Zap size={18} />
              +{Math.floor(score * 15 + (accuracy > 75 ? 40 : 0))} XP earned
            </div>
            <div class="results-meta">
              <div class="r-stat">
                <span class="r-val">{maxStreak}</span>
                <span class="r-lbl">Best Streak</span>
              </div>
              <div class="r-stat">
                <span class="r-val">{totalGamesPlayed}</span>
                <span class="r-lbl">Total Quests</span>
              </div>
              <div class="r-stat">
                <span class="r-val">Lv {currentLevel}</span>
                <span class="r-lbl">Level</span>
              </div>
            </div>
            <div class="results-actions">
              <button class="cta-btn" onclick={startNewGame}>
                <RotateCcw size={16} />
                Play Again
              </button>
              <button class="ghost-btn" onclick={resetGame}>
                <Home size={16} />
                Menu
              </button>
            </div>
          </div>
        </div>
      </div>

    <!-- ==================== ACHIEVEMENTS FULL ==================== -->
    {:else if currentGame === 'achievements'}
      <div class="ach-full-wrap">
        <div class="ach-full-header">
          <Trophy size={28} />
          <div>
            <h1>Achievements</h1>
            <p>{unlockedAchievements.length} of {achievements.length} unlocked</p>
          </div>
        </div>
        <div class="ach-full-grid">
          {#each achievements as ach}
            {@const unlocked = unlockedAchievements.includes(ach.id)}
            <div class="ach-full-card" class:unlocked>
              <div class="ach-full-icon">
                <svelte:component this={ach.icon} size={28} />
              </div>
              <div class="ach-full-info">
                <strong>{ach.name}</strong>
                <span>{ach.desc}</span>
                <em>+{ach.xp} XP</em>
              </div>
              <div class="ach-full-status">
                {#if unlocked}
                  <CheckCircle2 size={20} />
                {:else}
                  <Lock size={18} />
                {/if}
              </div>
            </div>
          {/each}
        </div>
        <button class="ghost-btn" onclick={resetGame}>
          <ArrowRight size={16} style="transform: rotate(180deg)" />
          Back to Menu
        </button>
      </div>
    {/if}

  </main>
</div>

<style>
  /* ===== TOKENS ===== */
  :global(body) {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: #0a0e1a;
    color: #e2e8f0;
    margin: 0;
  }

  :root {
    --bg: #0a0e1a;
    --surface: #111827;
    --surface-2: #1a2235;
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.14);
    --teal: #10b981;
    --teal-dim: rgba(16,185,129,0.15);
    --teal-glow: rgba(16,185,129,0.25);
    --amber: #f59e0b;
    --amber-dim: rgba(245,158,11,0.15);
    --red: #ef4444;
    --red-dim: rgba(239,68,68,0.12);
    --text-1: #f1f5f9;
    --text-2: #94a3b8;
    --text-3: #64748b;
    --radius: 1rem;
    --font-display: 'Syne', sans-serif;
  }

  /* ===== PAGE ===== */
  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 60% 40% at 70% 0%, rgba(16,185,129,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 40% 30% at 10% 80%, rgba(99,102,241,0.05) 0%, transparent 60%);
  }

  /* ===== NAV ===== */
  .nav {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    background: rgba(10,14,26,0.8);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .nav-inner {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.625rem;
    color: var(--text-2);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .back-btn:hover {
    color: var(--text-1);
    border-color: var(--border-hover);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--text-1);
  }

  .brand-icon {
    width: 32px;
    height: 32px;
    background: var(--teal-dim);
    border: 1px solid rgba(16,185,129,0.3);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--teal);
  }

  .nav-right {
    width: 100px; /* balance the back button */
  }

  /* ===== CONTENT ===== */
  .content {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem 1.5rem 3rem;
  }

  /* ===== MENU ===== */
  .menu-wrap {
    width: 100%;
    max-width: 860px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* --- Achievements Strip --- */
  .achievements-strip {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.125rem 1.25rem 1rem;
  }

  .strip-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.875rem;
  }

  .strip-title-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-display);
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--text-2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .strip-count {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    background: var(--teal-dim);
    border-radius: 999px;
    color: var(--teal);
    font-weight: 600;
  }

  .strip-see-all {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    color: var(--teal);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s;
  }

  .strip-see-all:hover { opacity: 0.7; }

  .strip-scroll {
    display: flex;
    gap: 0.625rem;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;
  }

  .strip-scroll::-webkit-scrollbar { display: none; }

  .ach-chip {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 0.875rem 0.625rem 0.625rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    opacity: 0.5;
    transition: all 0.2s;
    position: relative;
  }

  .ach-chip.unlocked {
    opacity: 1;
    border-color: rgba(16,185,129,0.35);
    background: rgba(16,185,129,0.07);
  }

  .ach-chip-icon {
    width: 32px;
    height: 32px;
    border-radius: 0.5rem;
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-3);
    flex-shrink: 0;
  }

  .ach-chip.unlocked .ach-chip-icon {
    background: var(--teal-dim);
    color: var(--teal);
  }

  .ach-chip-body {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .ach-chip-name {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-1);
    white-space: nowrap;
  }

  .ach-chip-xp {
    font-size: 0.7rem;
    color: var(--text-3);
    font-weight: 500;
  }

  .ach-chip.unlocked .ach-chip-xp {
    color: var(--teal);
  }

  .ach-chip-lock {
    color: var(--text-3);
    margin-left: auto;
  }

  .ach-chip-check {
    color: var(--teal);
    margin-left: auto;
  }

  /* --- Player Stats Bar --- */
  .player-bar {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .player-level {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .level-badge {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: var(--teal-dim);
    border: 1px solid rgba(16,185,129,0.3);
    border-radius: 0.5rem;
    color: var(--teal);
    font-family: var(--font-display);
    font-size: 0.875rem;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .xp-track {
    flex: 1;
    height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 3px;
    overflow: hidden;
    min-width: 60px;
  }

  .xp-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--teal), #34d399);
    border-radius: 3px;
    transition: width 0.6s ease;
  }

  .xp-label {
    font-size: 0.75rem;
    color: var(--text-3);
    white-space: nowrap;
    font-weight: 500;
  }

  .player-divider {
    width: 1px;
    height: 32px;
    background: var(--border);
    flex-shrink: 0;
  }

  .player-streak, .player-games {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    color: var(--amber);
    flex-shrink: 0;
  }

  .player-games {
    color: var(--teal);
  }

  .streak-num {
    display: block;
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-1);
    line-height: 1;
  }

  .streak-label {
    font-size: 0.7rem;
    color: var(--text-3);
    font-weight: 500;
  }

  /* --- Hero Card --- */
  .hero-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    padding: 2.25rem;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

  .hero-glow {
    position: absolute;
    top: -40px;
    right: 100px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, var(--teal-glow) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.375rem 0.875rem;
    background: var(--teal-dim);
    border: 1px solid rgba(16,185,129,0.25);
    border-radius: 999px;
    color: var(--teal);
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--text-1);
    line-height: 1.15;
    margin: 0 0 0.875rem;
  }

  .hero-sub {
    font-size: 1rem;
    color: var(--text-2);
    line-height: 1.65;
    margin: 0 0 1.75rem;
    max-width: 420px;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.875rem 1.75rem;
    background: var(--teal);
    border: none;
    border-radius: 0.75rem;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 0 24px rgba(16,185,129,0.3);
  }

  .cta-btn:hover {
    background: #0ea472;
    box-shadow: 0 0 32px rgba(16,185,129,0.45);
    transform: translateY(-2px);
  }

  /* Hero art / orbits */
  .hero-art {
    position: relative;
    width: 180px;
    height: 180px;
    flex-shrink: 0;
  }

  .center-orb {
    position: absolute;
    inset: 50%;
    transform: translate(-50%, -50%);
    width: 68px;
    height: 68px;
    background: var(--teal-dim);
    border: 1px solid rgba(16,185,129,0.35);
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--teal);
    box-shadow: 0 0 40px var(--teal-glow);
  }

  .orbit {
    position: absolute;
  }

  .orbit-icon {
    width: 40px;
    height: 40px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-2);
  }

  .orbit-1 { top: 8%; left: 5%;  animation: float 3.2s ease-in-out infinite; }
  .orbit-2 { top: 50%; right: 0%;  animation: float 3.2s ease-in-out infinite 0.6s; }
  .orbit-3 { bottom: 8%; left: 25%; animation: float 3.2s ease-in-out infinite 1.1s; }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  /* ===== QUIZ ===== */
  .quiz-wrap {
    width: 100%;
    max-width: 680px;
    animation: fadeUp 0.4s ease both;
  }

  .q-progress-bar {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
  }

  .q-progress-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .q-counter {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-2);
  }

  .q-pills { display: flex; gap: 0.5rem; }

  .q-pill {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .q-pill.flame {
    background: var(--amber-dim);
    color: var(--amber);
    border: 1px solid rgba(245,158,11,0.25);
  }

  .q-pill.accuracy {
    background: var(--teal-dim);
    color: var(--teal);
    border: 1px solid rgba(16,185,129,0.25);
  }

  /* Segment track */
  .q-track {
    display: flex;
    gap: 4px;
  }

  .q-segment {
    flex: 1;
    height: 5px;
    border-radius: 3px;
    background: rgba(255,255,255,0.07);
    transition: background 0.3s;
  }

  .q-segment.correct { background: var(--teal); }
  .q-segment.wrong   { background: var(--red); }
  .q-segment.active  { background: rgba(255,255,255,0.2); }

  /* Question Card */
  .q-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    padding: 2rem;
  }

  .q-tag {
    display: inline-block;
    padding: 0.3rem 0.875rem;
    background: var(--teal-dim);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 999px;
    color: var(--teal);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 1rem;
  }

  .q-text {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-1);
    line-height: 1.45;
    margin: 0 0 1.5rem;
  }

  .q-answers {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin-bottom: 1.5rem;
  }

  .q-answer {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: var(--surface-2);
    border: 1.5px solid var(--border);
    border-radius: 0.875rem;
    color: var(--text-1);
    font-size: 0.9375rem;
    font-family: 'DM Sans', sans-serif;
    text-align: left;
    cursor: pointer;
    transition: all 0.18s;
    width: 100%;
  }

  .q-answer:hover:not(:disabled) {
    border-color: var(--border-hover);
    background: rgba(255,255,255,0.05);
    transform: translateX(3px);
  }

  .q-answer.selected {
    border-color: var(--teal);
    background: var(--teal-dim);
  }

  .q-answer.correct {
    border-color: var(--teal);
    background: rgba(16,185,129,0.12);
  }

  .q-answer.incorrect {
    border-color: var(--red);
    background: var(--red-dim);
  }

  .q-answer.dim {
    opacity: 0.4;
  }

  .q-answer:disabled { cursor: default; }

  .q-letter {
    width: 30px;
    height: 30px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--text-2);
    flex-shrink: 0;
  }

  .q-answer.correct .q-letter { background: var(--teal); color: #fff; }
  .q-answer.incorrect .q-letter { background: var(--red); color: #fff; }

  .q-answer-text { flex: 1; line-height: 1.5; }

  /* Explanation */
  .q-explanation {
    margin-bottom: 1.25rem;
    padding: 1.125rem;
    background: var(--red-dim);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 0.875rem;
  }

  .q-explanation.correct {
    background: var(--teal-dim);
    border-color: rgba(16,185,129,0.2);
  }

  .q-exp-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 0.9375rem;
    color: var(--red);
    margin-bottom: 0.625rem;
  }

  .q-explanation.correct .q-exp-head { color: var(--teal); }

  .q-explanation p {
    color: var(--text-2);
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
  }

  /* Next Button */
  .q-next {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.9375rem;
    background: var(--teal);
    border: none;
    border-radius: 0.875rem;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.25s;
    pointer-events: none;
    box-shadow: 0 0 20px rgba(16,185,129,0.2);
  }

  .q-next.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .q-next:hover { background: #0ea472; box-shadow: 0 0 28px rgba(16,185,129,0.35); }

  /* ===== RESULTS ===== */
  .results-wrap {
    width: 100%;
    max-width: 480px;
    animation: fadeUp 0.5s ease both;
  }

  .results-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1.5rem;
    padding: 2.5rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .results-glow {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .results-inner { position: relative; }

  .results-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.375rem 1rem;
    background: var(--teal-dim);
    border: 1px solid rgba(16,185,129,0.25);
    border-radius: 999px;
    color: var(--teal);
    font-size: 0.8125rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 1.75rem;
  }

  .score-ring-wrap {
    position: relative;
    width: 160px;
    height: 160px;
    margin: 0 auto 1.5rem;
  }

  .score-ring {
    width: 100%;
    height: 100%;
    transform: rotate(0deg);
  }

  .score-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .score-big {
    font-family: var(--font-display);
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--text-1);
    line-height: 1;
  }

  .score-sub {
    font-size: 0.875rem;
    color: var(--text-3);
    font-weight: 500;
    margin-top: 0.25rem;
  }

  .xp-earned {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background: rgba(245,158,11,0.1);
    border: 1px solid rgba(245,158,11,0.25);
    border-radius: 999px;
    color: var(--amber);
    font-weight: 700;
    font-size: 0.9375rem;
    margin-bottom: 1.75rem;
  }

  .results-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.25rem;
    background: var(--surface-2);
    border-radius: 1rem;
  }

  .r-stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .r-val {
    font-family: var(--font-display);
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--text-1);
  }

  .r-lbl {
    font-size: 0.75rem;
    color: var(--text-3);
    font-weight: 500;
  }

  .results-actions {
    display: flex;
    gap: 0.875rem;
  }

  .results-actions .cta-btn { flex: 1; justify-content: center; }
  .results-actions .ghost-btn { flex: 1; justify-content: center; }

  .ghost-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    color: var(--text-2);
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .ghost-btn:hover {
    border-color: var(--border-hover);
    color: var(--text-1);
  }

  /* ===== ACHIEVEMENTS FULL ===== */
  .ach-full-wrap {
    width: 100%;
    max-width: 860px;
    animation: fadeUp 0.4s ease both;
  }

  .ach-full-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    color: var(--teal);
  }

  .ach-full-header h1 {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--text-1);
    margin: 0 0 0.2rem;
  }

  .ach-full-header p {
    font-size: 0.9rem;
    color: var(--text-3);
    margin: 0;
  }

  .ach-full-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .ach-full-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.125rem;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 1rem;
    opacity: 0.5;
    transition: all 0.2s;
  }

  .ach-full-card.unlocked {
    opacity: 1;
    border-color: rgba(16,185,129,0.3);
    background: rgba(16,185,129,0.06);
  }

  .ach-full-icon {
    width: 52px;
    height: 52px;
    border-radius: 0.875rem;
    background: var(--surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-3);
    flex-shrink: 0;
  }

  .ach-full-card.unlocked .ach-full-icon {
    background: var(--teal-dim);
    color: var(--teal);
  }

  .ach-full-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .ach-full-info strong {
    font-family: var(--font-display);
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-1);
  }

  .ach-full-info span {
    font-size: 0.8125rem;
    color: var(--text-3);
  }

  .ach-full-info em {
    font-style: normal;
    font-size: 0.75rem;
    color: var(--teal);
    font-weight: 600;
  }

  .ach-full-status {
    color: var(--text-3);
    flex-shrink: 0;
  }

  .ach-full-card.unlocked .ach-full-status { color: var(--teal); }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 640px) {
    .content { padding: 1.25rem 1rem 2rem; }

    .hero-card { grid-template-columns: 1fr; }
    .hero-art { display: none; }

    .player-bar { flex-wrap: wrap; gap: 0.875rem; }
    .player-level { width: 100%; }

    .hero-title { font-size: 1.75rem; }

    .results-actions { flex-direction: column; }
    .results-meta { flex-direction: column; gap: 0.75rem; }

    .q-card { padding: 1.25rem; }
    .q-text { font-size: 1.125rem; }
  }
</style>
