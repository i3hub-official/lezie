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
      if (lastPlayedDate === yesterday) {
        currentDayStreak++;
      } else {
        currentDayStreak = 1;
      }
      lastPlayedDate = today;
    }

    if (currentDayStreak > longestStreak) longestStreak = currentDayStreak;

    localStorage.setItem('safetyQuestFullProgress', JSON.stringify({
      totalGamesPlayed,
      totalXP,
      currentLevel,
      currentDayStreak,
      lastPlayedDate,
      completedQuestionIds,
      longestStreak,
      totalCorrectAnswers,
      unlockedAchievements
    }));
  }

  function checkAndUnlockAchievements() {
    let newlyUnlocked = false;

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
        newlyUnlocked = true;
      }
    });

    // Level up logic
    while (totalXP >= xpForNextLevel) {
      currentLevel++;
    }

    if (newlyUnlocked) saveProgress();
  }

  // ====================== GAME LOGIC ======================
  function startNewGame() {
    let available = safetyQuestions.filter(q => 
      !completedQuestionIds.includes(q.id || q.question)
    );

    if (available.length < 6) {
      available = safetyQuestions;
    }

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
      saveProgress();
      currentGame = 'results';
    }
  }

  function resetGame() {
    currentGame = 'menu';
  }

  onMount(() => {
    loadProgress();
  });
</script>

<svelte:head>
  <title>Safety Quest — Lezie</title>
  <meta name="description" content="Master safety skills through interactive challenges" />
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
        <Shield size={28} />
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
          <Calendar size={24} />
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
            <p class="subtitle">Test your knowledge with real-world scenarios and build lasting safety habits.</p>
            
            <button class="btn-primary" onclick={startNewGame}>
              <Gamepad2 size={20} />
              Start Today's Quest
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div class="menu-actions">
          <button class="btn-secondary" onclick={() => currentGame = 'achievements'}>
            <Medal size={20} />
            Achievements
          </button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <Shield size={28} />
            <div>
              <span class="big-number">{totalGamesPlayed}</span>
              <span>Quests Completed</span>
            </div>
          </div>
          <div class="stat-card">
            <TrendingUp size={28} />
            <div>
              <span class="big-number">{totalXP}</span>
              <span>Total XP</span>
            </div>
          </div>
          <div class="stat-card">
            <Flame size={28} />
            <div>
              <span class="big-number">{longestStreak}</span>
              <span>Best Streak</span>
            </div>
          </div>
        </div>
      </div>

    {:else if currentGame === 'quiz'}
      <div class="quiz-container">
        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-text">Question {Math.min(currentIndex + 1, totalQuestions)} of {totalQuestions}</span>
            <div class="progress-pills">
              {#if streak > 1}
                <div class="streak-pill">
                  <Flame size={14} />
                  {streak} streak
                </div>
              {/if}
              <div class="accuracy-pill">
                <TrendingUp size={14} />
                {accuracy}%
              </div>
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

              <button
                class="answer-option"
                class:selected={isSelected}
                class:correct={showResult && isCorrect}
                class:incorrect={showResult && isSelected && !isCorrect}
                disabled={selectedAnswer !== null}
                onclick={() => selectAnswer(i)}
              >
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

          <button 
            class="btn-next"
            class:visible={selectedAnswer !== null}
            onclick={nextQuestion}
          >
            {currentIndex === totalQuestions - 1 ? 'View Results' : 'Next Question'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

    {:else if currentGame === 'results'}
      <div class="results-container">
        <div class="results-card">
          <Award size={72} color="#10B981" />
          <h2 class="results-title">Quest Complete</h2>
          <p class="score-display">{score} / {totalQuestions} correct ({accuracy}%)</p>

          <div class="xp-gain">
            <Zap size={32} />
            <span>+{Math.floor(score * 15)} XP Earned</span>
          </div>

          <div class="results-actions">
            <button class="btn-primary" onclick={startNewGame}>
              <RotateCcw size={18} />
              Play Again
            </button>
            <button class="btn-secondary" onclick={resetGame}>
              <Home size={18} />
              Main Menu
            </button>
          </div>
        </div>
      </div>

    {:else if currentGame === 'achievements'}
      <div class="achievements-container">
        <h1>Achievements</h1>
        <div class="achievements-grid">
          {#each achievements as ach}
            {@const unlocked = unlockedAchievements.includes(ach.id)}
            <div class="achievement-card" class:unlocked={unlocked}>
              <div class="achievement-icon">
                <svelte:component this={ach.icon} size={48} />
              </div>
              <div class="achievement-info">
                <strong>{ach.name}</strong>
                <p>{ach.desc}</p>
                <small>+{ach.xp} XP</small>
              </div>
              {#if !unlocked}
                <Lock size={24} class="lock" />
              {/if}
            </div>
          {/each}
        </div>
        <button class="btn-secondary" onclick={resetGame}>Back to Menu</button>
      </div>
    {/if}
  </main>
</div>

<style>
  /* Paste all your original beautiful styles here + the new ones below */
  :global(body) {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .page { min-height: 100vh; padding: 1.5rem; display: flex; flex-direction: column; }
  .nav { margin-bottom: 2rem; }
  .nav-content {
    max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;
    background: white; border-radius: 1rem; padding: 0.75rem 1.25rem; border: 1px solid #e2e8f0;
  }
  .nav-brand { display: flex; align-items: center; gap: 0.75rem; font-weight: 700; font-size: 1.3rem; }
  .stat-pill {
    display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem;
    background: #f1f5f9; border-radius: 9999px; font-weight: 600; font-size: 0.9rem;
  }

  .daily-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; color: #6a2c91; }
  .title { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
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

  .nav-stats {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-stats.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .stat-pill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--primary-bg);
    border: 1px solid rgba(106, 44, 145, 0.2);
    border-radius: 2rem;
    color: var(--primary-color);
    font-size: 0.875rem;
    font-weight: 600;
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
    margin-bottom: 2rem;
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
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
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

  .header-visual {
    position: relative;
    width: 200px;
    height: 150px;
  }

  .floating-icon {
    position: absolute;
    width: 56px;
    height: 56px;
    background: white;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
  }

  .icon-1 { top: 20%; left: 10%; animation: float 3s ease-in-out infinite; }
  .icon-2 { top: 50%; right: 20%; animation: float 3s ease-in-out infinite 0.5s; }
  .icon-3 { bottom: 10%; left: 30%; animation: float 3s ease-in-out infinite 1s; }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  /* Features Grid */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .feature-card {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
    text-align: center;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
    border-color: #cbd5e1;
  }

  .feature-icon {
    width: 56px;
    height: 56px;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }

  .feature-card h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .feature-card p {
    font-size: 0.875rem;
    color: #64748b;
  }

  /* Stats Row */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat-card {
    background: white;
    border-radius: 1rem;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-content {
    flex: 1;
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #64748b;
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
    background: var(--warning-bg);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 2rem;
    color: var(--warning-color);
    font-size: 0.875rem;
    font-weight: 600;
  }

  .accuracy-pill {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    background: var(--success-bg);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 2rem;
    color: var(--success-color);
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
    background: linear-gradient(90deg, var(--primary-color), #8b5cf6);
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
    background: var(--primary-bg);
    border: 1px solid rgba(106, 44, 145, 0.2);
    border-radius: 2rem;
    color: var(--primary-color);
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
    border-color: var(--primary-color);
    background: var(--primary-bg);
  }

  .answer-option.correct {
    border-color: var(--success-color);
    background: var(--success-bg);
  }

  .answer-option.incorrect {
    border-color: var(--error-color);
    background: var(--error-bg);
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
    background: var(--success-color);
    color: white;
  }

  .incorrect-icon {
    background: var(--error-color);
    color: white;
  }

  .answer-text {
    flex: 1;
    line-height: 1.5;
    font-weight: 500;
  }

  .correct-badge {
    color: var(--success-color);
    opacity: 0.7;
  }

  .explanation-panel {
    margin-bottom: 1.5rem;
    padding: 1.25rem;
    background: var(--error-bg);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 1rem;
  }

  .explanation-panel.correct {
    background: var(--success-bg);
    border-color: rgba(16, 185, 129, 0.2);
  }

  .explanation-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    color: var(--error-color);
  }

  .explanation-panel.correct .explanation-header {
    color: var(--success-color);
  }

  .explanation-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .explanation-icon.correct {
    background: var(--success-color);
    color: white;
  }

  .explanation-icon.incorrect {
    background: var(--error-color);
    color: white;
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
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
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

  .results-icon-wrapper {
    width: 96px;
    height: 96px;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }

  .results-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .results-desc {
    color: #64748b;
    margin-bottom: 2rem;
    font-size: 1rem;
  }

  .score-display {
    margin-bottom: 2rem;
  }

  .score-circle {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    border: 8px solid;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .score-main {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .score-number {
    font-size: 4rem;
    font-weight: 800;
    line-height: 1;
  }

  .score-total {
    font-size: 1.5rem;
    color: #94a3b8;
    font-weight: 600;
  }

  .score-percent {
    font-size: 1.25rem;
    color: #64748b;
    font-weight: 600;
  }

  .results-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 1rem;
  }

  .result-stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-label-sm {
    font-size: 0.75rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 500;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
  }

  .results-actions {
    display: flex;
    gap: 1rem;
  }

  .results-actions .btn-primary,
  .results-actions .btn-secondary {
    flex: 1;
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

  /* Safety Banner */
  .safety-banner {
    max-width: 1400px;
    margin: 2rem auto 0;
    width: 100%;
    padding: 1rem 1.25rem;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .safety-banner strong {
    font-weight: 600;
  }

  /* Responsive */
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

    .header-visual {
      display: none;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .stats-row {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .page {
      padding: 1rem;
    }

    .nav-brand {
      position: static;
      transform: none;
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

    .results-stats {
      grid-template-columns: 1fr;
    }

    .results-actions {
      flex-direction: column;
    }

    .safety-banner {
      flex-direction: column;
      text-align: center;
    }
  }
</style>