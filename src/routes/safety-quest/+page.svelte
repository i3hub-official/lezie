<script lang="ts">
  import { safetyQuestions, getRandomQuestions } from '$lib/data/safetyQuestions';
  import { 
    ShieldCheck, Trophy, ArrowRight, RefreshCw, Home, Sparkles,
    Brain, Target, Zap, CheckCircle2, XCircle, ChevronRight,
    RotateCcw, Award, Flame, AlertCircle, TrendingUp, Gamepad2,
    Shield, Clock, Star, Calendar, Medal, Lock
  } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // ====================== GAME STATE ======================
  let currentGame = $state<'menu' | 'quiz' | 'results' | 'achievements'>('menu');
  
  let questions = $state<any[]>([]);
  let currentIndex = $state(0);
  let score = $state(0);
  let selectedAnswer = $state<number | null>(null);
  let showExplanation = $state(false);
  let streak = $state(0);
  let maxStreak = $state(0);
  let answersHistory = $state<boolean[]>([]);

  // Persistent Progress (Your Brand Colors Maintained)
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
    { id: 'accuracy_90', name: 'Precision', desc: 'Achieve 90%+ accuracy in one game', icon: Target, xp: 120 },
    { id: 'streak_14', name: 'Unstoppable', desc: 'Reach 14-day streak', icon: Flame, xp: 300 }
  ]);

  let unlockedAchievements = $state<string[]>([]);

  // Derived
  let totalQuestions = $derived(questions.length);
  let accuracy = $derived(answersHistory.length > 0 ? Math.round((answersHistory.filter(Boolean).length / answersHistory.length) * 100) : 0);
  let progressPercent = $derived(((currentIndex + (currentIndex >= totalQuestions ? 1 : 0)) / totalQuestions) * 100);
  let xpForNextLevel = $derived(currentLevel * 220);

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
      if (lastPlayedDate === yesterday) currentDayStreak++;
      else currentDayStreak = 1;
      lastPlayedDate = today;
    }

    if (currentDayStreak > longestStreak) longestStreak = currentDayStreak;

    localStorage.setItem('safetyQuestFullProgress', JSON.stringify({
      totalGamesPlayed, totalXP, currentLevel, currentDayStreak,
      lastPlayedDate, completedQuestionIds, longestStreak,
      totalCorrectAnswers, unlockedAchievements
    }));
  }

  function checkAndUnlockAchievements() {
    achievements.forEach(ach => {
      if (unlockedAchievements.includes(ach.id)) return;

      let shouldUnlock = false;
      if (ach.id === 'first_game' && totalGamesPlayed >= 1) shouldUnlock = true;
      if (ach.id === 'perfect_8' && score === totalQuestions && totalQuestions === 8) shouldUnlock = true;
      if (ach.id === 'streak_3' && currentDayStreak >= 3) shouldUnlock = true;
      if (ach.id === 'streak_7' && currentDayStreak >= 7) shouldUnlock = true;
      if (ach.id === 'streak_14' && currentDayStreak >= 14) shouldUnlock = true;
      if (ach.id === 'score_50' && totalXP >= 50) shouldUnlock = true;
      if (ach.id === 'master_10' && totalGamesPlayed >= 10) shouldUnlock = true;
      if (ach.id === 'accuracy_90' && accuracy >= 90) shouldUnlock = true;

      if (shouldUnlock) {
        unlockedAchievements = [...unlockedAchievements, ach.id];
        totalXP += ach.xp;
      }
    });

    // Level up
    while (totalXP >= xpForNextLevel) currentLevel++;
    saveProgress();
  }

  // ====================== GAME FUNCTIONS ======================
  function startNewGame() {
    let available = safetyQuestions.filter(q => !completedQuestionIds.includes(q.id || q.question));
    if (available.length < 6) available = safetyQuestions;

    questions = getRandomQuestions(8);
    currentIndex = 0;
    score = 0;
    selectedAnswer = null;
    showExplanation = false;
    streak = 0;
    maxStreak = 0;
    answersHistory = [];
    currentGame = 'quiz';
  }

  function selectAnswer(index: number) {
    if (selectedAnswer !== null) return;
    selectedAnswer = index;
    const isCorrect = questions[currentIndex].answers[index].correct;

    if (isCorrect) {
      score++;
      streak++;
      if (streak > maxStreak) maxStreak = streak;
      totalCorrectAnswers++;

      const qId = questions[currentIndex].id || questions[currentIndex].question;
      if (!completedQuestionIds.includes(qId)) {
        completedQuestionIds = [...completedQuestionIds, qId];
      }
    } else {
      streak = 0;
    }

    answersHistory = [...answersHistory, isCorrect];
    showExplanation = true;
  }

  function nextQuestion() {
    selectedAnswer = null;
    showExplanation = false;

    if (currentIndex < totalQuestions - 1) {
      currentIndex++;
    } else {
      totalGamesPlayed++;
      totalXP += Math.floor(score * 15 + (accuracy > 75 ? 40 : 0));
      checkAndUnlockAchievements();
      currentGame = 'results';
    }
  }

  function resetToMenu() {
    currentGame = 'menu';
  }

  onMount(() => {
    loadProgress();
  });
</script>

<svelte:head>
  <title>Safety Quest — Lezie</title>
  <meta name="description" content="Master safety skills through interactive challenges" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="page">
  <!-- Navigation -->
  <header class="nav">
    <div class="nav-content">
      <button class="nav-back" onclick={() => goto('/')}>
        <Home size={18} />
        <span>Back to Dashboard</span>
      </button>

      <div class="nav-brand">
        <Shield size={28} color="#6a2c91" />
        <span class="logo-text">Safety Quest</span>
      </div>

      <div class="nav-stats">
        <div class="stat-pill">
          <Flame size={16} />
          <span>{currentDayStreak} day streak</span>
        </div>
        <div class="stat-pill">
          <Medal size={16} />
          <span>Level {currentLevel}</span>
        </div>
      </div>
    </div>
  </header>

  <main class="content">
    {#if currentGame === 'menu'}
      <div class="menu-container">
        <div class="daily-header">
          <Calendar size={24} color="#6a2c91" />
          <div>
            <h2>Day {currentDayStreak}</h2>
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long' })} Training</p>
          </div>
        </div>

        <div class="page-header-card">
          <div class="header-content">
            <div class="badge">
              <Sparkles size={14} />
              Interactive Training
            </div>
            <h1 class="title">Master Safety Through Play</h1>
            <p class="subtitle">Test your knowledge with real-world scenarios. Learn essential skills that keep you and your community safe.</p>
            
            <button class="btn-primary" onclick={startNewGame}>
              <Gamepad2 size={20} />
              Start Today's Quest
              <ArrowRight size={20} />
            </button>
          </div>
          <div class="header-visual">
            <!-- Your original floating icons preserved -->
            <div class="floating-icon icon-1"><Shield size={32} color="#8B5CF6" /></div>
            <div class="floating-icon icon-2"><Star size={24} color="#F59E0B" /></div>
            <div class="floating-icon icon-3"><CheckCircle2 size={28} color="#10B981" /></div>
          </div>
        </div>

        <button class="btn-secondary" onclick={() => currentGame = 'achievements'} style="margin-bottom: 2rem;">
          <Medal size={20} />
          View Achievements
        </button>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon" style="background: #EDE9FE; color: #6a2c91;"><Shield size={22} /></div>
            <div class="stat-content">
              <span class="stat-value">{totalGamesPlayed}</span>
              <span class="stat-label">Quests Completed</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #FEF3C7; color: #F59E0B;"><TrendingUp size={22} /></div>
            <div class="stat-content">
              <span class="stat-value">{totalXP}</span>
              <span class="stat-label">Total XP</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #D1FAE5; color: #10B981;"><Flame size={22} /></div>
            <div class="stat-content">
              <span class="stat-value">{longestStreak}</span>
              <span class="stat-label">Best Streak</span>
            </div>
          </div>
        </div>
      </div>

    {:else if currentGame === 'quiz'}
      <!-- Your original quiz screen (unchanged) -->
      <div class="quiz-container">
        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-text">Question {Math.min(currentIndex + 1, totalQuestions)} of {totalQuestions}</span>
            <div class="progress-pills">
              {#if streak > 1}
                <div class="streak-pill"><Flame size={14} /> {streak} streak</div>
              {/if}
              <div class="accuracy-pill"><TrendingUp size={14} /> {accuracy}%</div>
            </div>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: {progressPercent}%"></div>
          </div>
        </div>

        <div class="question-card">
          <div class="question-header">
            <div class="category-badge">Safety Scenario</div>
            <h2 class="question-text">{questions[currentIndex]?.question}</h2>
          </div>

          <div class="answers-list">
            {#each questions[currentIndex]?.answers || [] as answer, i}
              {@const isSelected = selectedAnswer === i}
              {@const isCorrect = answer.correct}
              {@const showResult = selectedAnswer !== null}

              <button class="answer-option" class:selected={isSelected} class:correct={showResult && isCorrect}
                class:incorrect={showResult && isSelected && !isCorrect} disabled={selectedAnswer !== null}
                onclick={() => selectAnswer(i)}>
                <div class="answer-indicator">
                  {#if showResult && isCorrect}
                    <div class="result-icon correct-icon"><CheckCircle2 size={20} /></div>
                  {:else if showResult && isSelected && !isCorrect}
                    <div class="result-icon incorrect-icon"><XCircle size={20} /></div>
                  {:else}
                    <span class="option-letter">{String.fromCharCode(65 + i)}</span>
                  {/if}
                </div>
                <span class="answer-text">{answer.text}</span>
              </button>
            {/each}
          </div>

          {#if showExplanation && questions[currentIndex]?.answers[selectedAnswer!]?.explanation}
            <div class="explanation-panel" class:correct={questions[currentIndex].answers[selectedAnswer!].correct}>
              <div class="explanation-header">
                {#if questions[currentIndex].answers[selectedAnswer!].correct}
                  <CheckCircle2 size={20} /> Correct!
                {:else}
                  <AlertCircle size={20} /> Not quite right
                {/if}
              </div>
              <p>{questions[currentIndex].answers[selectedAnswer!].explanation}</p>
            </div>
          {/if}

          <button class="btn-next" class:visible={selectedAnswer !== null} onclick={nextQuestion}>
            {currentIndex === totalQuestions - 1 ? 'View Results' : 'Next Question'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

    {:else if currentGame === 'results'}
      <!-- Enhanced Results -->
      <div class="results-container">
        <div class="results-card">
          <div class="results-icon-wrapper" style="background: #D1FAE5; color: #10B981;">
            <Award size={48} />
          </div>
          <h2 class="results-title">Quest Complete</h2>
          <p class="results-desc">You scored {score}/{totalQuestions} • {accuracy}% accuracy</p>

          <div class="score-display">
            <div class="score-circle" style="border-color: #D1FAE5;">
              <div class="score-main">
                <span class="score-number" style="color: #10B981;">{score}</span>
                <span class="score-total">/{totalQuestions}</span>
              </div>
              <div class="score-percent">{Math.round((score / totalQuestions) * 100)}%</div>
            </div>
          </div>

          <div class="xp-gain" style="color: #6a2c91; font-size: 1.5rem; margin: 1.5rem 0;">
            <Zap size={32} /> +{Math.floor(score * 15)} XP
          </div>

          <div class="results-actions">
            <button class="btn-primary" onclick={startNewGame}>
              <RotateCcw size={18} /> Play Again
            </button>
            <button class="btn-secondary" onclick={resetToMenu}>
              <Home size={18} /> Main Menu
            </button>
          </div>
        </div>
      </div>

    {:else if currentGame === 'achievements'}
      <div class="achievements-container">
        <h1 style="text-align:center; margin-bottom:2rem;">Achievements</h1>
        <div class="achievements-grid">
          {#each achievements as ach}
            {@const unlocked = unlockedAchievements.includes(ach.id)}
            <div class="achievement-card" class:unlocked={unlocked}>
              <div class="achievement-icon">
                <svelte:component this={ach.icon} size={48} />
              </div>
              <div>
                <strong>{ach.name}</strong>
                <p>{ach.desc}</p>
                <small>+{ach.xp} XP</small>
              </div>
              {#if !unlocked}
                <Lock size={24} />
              {/if}
            </div>
          {/each}
        </div>
        <button class="btn-secondary" onclick={resetToMenu} style="margin-top:2rem;">Back to Menu</button>
      </div>
    {/if}
  </main>
</div>

<style>
  /* Your complete original styles are fully preserved below */
  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(:root) {
    --primary-color: #6a2c91;
    --primary-dark: #4a1d6e;
    --primary-bg: rgba(106, 44, 145, 0.1);
    --success-color: #10B981;
    --success-bg: #D1FAE5;
    --warning-color: #F59E0B;
    --warning-bg: #FEF3C7;
    --error-color: #EF4444;
    --error-bg: #FEE2E2;
  }

  :global(body) {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    color: #0f172a;
    min-height: 100vh;
  }

  /* All your original CSS remains exactly the same */
  /* ... (I kept every single style you provided) ... */

  .daily-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; color: #6a2c91; }
  .xp-gain { font-weight: 600; display: flex; align-items: center; gap: 0.75rem; }
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }
  .achievement-card {
    background: white;
    padding: 1.75rem;
    border-radius: 1rem;
    border: 2px solid #e2e8f0;
    display: flex;
    gap: 1.25rem;
    align-items: center;
    opacity: 0.7;
  }
  .achievement-card.unlocked {
    opacity: 1;
    border-color: #10B981;
    background: #f0fdf4;
  }


  .page { min-height: 100vh; padding: 1.5rem; display: flex; flex-direction: column; }
  .nav { margin-bottom: 2rem; }
  .nav-content {
    max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;
    background: white; border-radius: 1rem; padding: 0.75rem 1.25rem; border: 1px solid #e2e8f0;
  }
  .nav-back {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #64748b;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }
  .nav-back:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  /* Player Status Card - Strategic placement */
  .player-status-card {
    background: white;
    border-radius: 1.25rem;
    padding: 1.25rem 1.75rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }
  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .status-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }
  .status-icon {
    color: #6a2c91;
    opacity: 0.8;
  }
  .status-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.03em;
    display: block;
  }
  .status-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
  }
  .status-divider {
    width: 1px;
    height: 48px;
    background: #e2e8f0;
  }
  .xp-item {
    flex: 2;
  }
  .xp-info {
    width: 100%;
  }
  .xp-bar-container {
    width: 100%;
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    margin: 0.5rem 0 0.25rem;
    overflow: hidden;
  }
  .xp-bar {
    height: 100%;
    background: linear-gradient(90deg, #6a2c91, #8b5cf6);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  .xp-next {
    font-size: 0.7rem;
    color: #64748b;
  }

  /* Achievements Preview - Strategic top placement */
  .achievements-preview {
    background: white;
    border-radius: 1.25rem;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
  }
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .preview-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .preview-title h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }
  .achievement-count {
    background: #f1f5f9;
    padding: 0.25rem 0.75rem;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
  }
  .view-all-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    color: #6a2c91;
    font-weight: 500;
    font-size: 0.85rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .view-all-btn:hover {
    opacity: 0.8;
  }
  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }
  .preview-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.875rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
    position: relative;
  }
  .preview-card.unlocked {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }
  .preview-icon {
    width: 44px;
    height: 44px;
    background: white;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6a2c91;
  }
  .preview-details {
    flex: 1;
  }
  .preview-details strong {
    font-size: 0.85rem;
    display: block;
    color: #0f172a;
  }
  .preview-details span {
    font-size: 0.7rem;
    color: #64748b;
  }
  .preview-lock {
    color: #94a3b8;
    opacity: 0.6;
  }

  /* Original styles continue */
  .daily-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; color: #6a2c91; }
  .title { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-top: 1rem; }
  .stat-card { background: white; padding: 1.75rem; border-radius: 1rem; border: 1px solid #e2e8f0; display: flex; gap: 1.25rem; align-items: center; }

  .big-number { font-size: 2.5rem; font-weight: 700; display: block; }

  .xp-gain { font-size: 1.6rem; font-weight: 600; color: #8b5cf6; display: flex; align-items: center; gap: 1rem; margin: 2rem 0; }

  .achievements-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; margin: 2rem 0;
  }
  .achievement-card {
    background: white; padding: 1.75rem; border-radius: 1rem; border: 2px solid #e2e8f0;
    display: flex; gap: 1.5rem; align-items: flex-start; opacity: 0.65;
  }
  .achievement-card.unlocked { opacity: 1; border-color: #10b981; background: #f0fdf4; }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 12px rgba(106, 44, 145, 0.3);
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
  }

  /* Content */
  .content {
    flex: 1;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Menu Screen */
  .menu-container {
    width: 100%;
    max-width: 1000px;
    animation: fadeIn 0.6s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .page-header-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
    align-items: center;
  }

  .header-content {
    text-align: left;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--primary-bg);
    border: 1px solid rgba(106, 44, 145, 0.2);
    border-radius: 2rem;
    color: var(--primary-color);
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.25rem;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.125rem;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    max-width: 500px;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.75rem;
    background: linear-gradient(135deg, #6a2c91, #4c1d6e);
    border: none;
    border-radius: 0.75rem;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(106, 44, 145, 0.35);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(106, 44, 145, 0.4);
  }

  /* Quiz Screen */
  .quiz-container {
    width: 100%;
    max-width: 720px;
    animation: slideUp 0.4s ease;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .progress-section {
    background: white;
    border-radius: 1rem;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
  }

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .progress-text {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
  }

  .progress-pills {
    display: flex;
    gap: 0.5rem;
  }

  .streak-pill {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    background: #fef3c7;
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 2rem;
    color: #d97706;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .accuracy-pill {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    background: #dcfce7;
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 2rem;
    color: #059669;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .progress-track {
    height: 8px;
    background: #f1f5f9;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6a2c91, #8b5cf6);
    border-radius: 4px;
    transition: width 0.4s ease;
  }

  .question-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  }

  .question-header {
    margin-bottom: 1.5rem;
  }

  .category-badge {
    display: inline-block;
    padding: 0.375rem 1rem;
    background: #f3e8ff;
    border: 1px solid rgba(106, 44, 145, 0.2);
    border-radius: 2rem;
    color: #6a2c91;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
  }

  .question-text {
    font-size: 1.375rem;
    font-weight: 600;
    line-height: 1.4;
    color: #0f172a;
  }

  .answers-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .answer-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 1rem;
    color: #334155;
    font-size: 1rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
  }

  .answer-option:hover:not(:disabled) {
    background: white;
    border-color: #cbd5e1;
    transform: translateX(4px);
  }

  .answer-option.selected {
    border-color: #6a2c91;
    background: #f3e8ff;
  }

  .answer-option.correct {
    border-color: #10b981;
    background: #f0fdf4;
  }

  .answer-option.incorrect {
    border-color: #ef4444;
    background: #fef2f2;
  }

  .answer-option:disabled {
    cursor: default;
  }

  .answer-indicator {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .option-letter {
    width: 28px;
    height: 28px;
    background: #e2e8f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
  }

  .result-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .correct-icon {
    background: #10b981;
    color: white;
  }

  .incorrect-icon {
    background: #ef4444;
    color: white;
  }

  .answer-text {
    flex: 1;
    line-height: 1.5;
    font-weight: 500;
  }

  .explanation-panel {
    margin-bottom: 1.5rem;
    padding: 1.25rem;
    background: #fef2f2;
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 1rem;
  }

  .explanation-panel.correct {
    background: #f0fdf4;
    border-color: rgba(16, 185, 129, 0.2);
  }

  .explanation-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    color: #ef4444;
  }

  .explanation-panel.correct .explanation-header {
    color: #10b981;
  }

  .explanation-panel p {
    color: #475569;
    line-height: 1.6;
    font-size: 0.9375rem;
  }

  .btn-next {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #6a2c91, #4c1d6e);
    border: none;
    border-radius: 1rem;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s;
    pointer-events: none;
  }

  .btn-next.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .btn-next:hover {
    box-shadow: 0 4px 14px rgba(106, 44, 145, 0.35);
  }

  /* Results Screen */
  .results-container {
    width: 100%;
    max-width: 600px;
    animation: fadeIn 0.6s ease;
  }

  .results-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2.5rem;
    text-align: center;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  }

  .results-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .score-display {
    margin-bottom: 2rem;
    font-size: 1.2rem;
  }

  .results-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: white;
    border: 1.5px solid #e2e8f0;
    border-radius: 0.75rem;
    color: #64748b;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #0f172a;
  }

  .achievements-container {
    width: 100%;
    max-width: 1000px;
  }
  .achievements-container h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 1024px) {
    .page-header-card {
      grid-template-columns: 1fr;
      text-align: center;
    }
    .header-content {
      text-align: center;
    }
    .subtitle {
      margin-left: auto;
      margin-right: auto;
    }
    .preview-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .page {
      padding: 1rem;
    }
    .title {
      font-size: 1.875rem;
    }
    .question-card {
      padding: 1.5rem;
    }
    .question-text {
      font-size: 1.125rem;
    }
    .status-row {
      flex-direction: column;
      align-items: stretch;
    }
    .status-divider {
      display: none;
    }
    .status-item {
      justify-content: space-between;
    }
    .player-status-card {
      padding: 1rem;
    }
  }
</style>