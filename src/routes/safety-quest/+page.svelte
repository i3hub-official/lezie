<script lang="ts">
  import { safetyQuestions, getRandomQuestions } from '$lib/data/safetyQuestions';
  import { 
    ShieldCheck, Trophy, ArrowRight, RefreshCw, Home, Sparkles,
    Brain, Target, Zap, CheckCircle2, XCircle, ChevronRight,
    RotateCcw, Award, Flame, AlertCircle, TrendingUp, Gamepad2,
    Shield, Clock, Star, Calendar, Medal, Lock, Users, BarChart3
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
  let xpProgressPercent = $derived((totalXP % xpForNextLevel) / xpForNextLevel * 100);
  let unlockedCount = $derived(unlockedAchievements.length);
  let totalAchievements = $derived(achievements.length);
  let overallAccuracy = $derived(totalCorrectAnswers > 0 ? Math.round((totalCorrectAnswers / (totalGamesPlayed * 8)) * 100) : 0);

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
  <!-- Navigation: clean back button only -->
  <header class="nav">
    <div class="nav-content">
      <button class="nav-back" onclick={() => goto('/')}>
        <Home size={18} />
        <span>Back to Dashboard</span>
      </button>
    </div>
  </header>

  <main class="content">
    {#if currentGame === 'menu'}
      <div class="menu-container">
        <!-- Top Stats Bar: Level, Streak, XP prominently displayed -->
        <div class="top-stats-bar">
          <div class="stat-block">
            <div class="stat-icon"><Medal size={28} /></div>
            <div class="stat-info">
              <span class="stat-label">Level</span>
              <span class="stat-number">{currentLevel}</span>
            </div>
          </div>
          <div class="stat-block">
            <div class="stat-icon"><Flame size={28} /></div>
            <div class="stat-info">
              <span class="stat-label">Day Streak</span>
              <span class="stat-number">{currentDayStreak}</span>
            </div>
          </div>
          <div class="stat-block xp-block">
            <div class="stat-icon"><Zap size={28} /></div>
            <div class="stat-info">
              <span class="stat-label">Total XP</span>
              <span class="stat-number">{totalXP}</span>
              <div class="xp-progress">
                <div class="xp-fill" style="width: {xpProgressPercent}%"></div>
              </div>
              <span class="xp-next">{totalXP % xpForNextLevel} / {xpForNextLevel}</span>
            </div>
          </div>
        </div>

        <!-- Achievements Preview - Strategic top placement with modern design -->
        <div class="achievements-preview">
          <div class="preview-header">
            <div class="preview-title">
              <Award size={22} />
              <h3>Recent Achievements</h3>
              <span class="achievement-count">{unlockedCount} / {totalAchievements}</span>
            </div>
            <button class="view-all-btn" onclick={() => currentGame = 'achievements'}>
              View All
              <ChevronRight size={16} />
            </button>
          </div>
          <div class="preview-scroll">
            {#each achievements as ach}
              {@const unlocked = unlockedAchievements.includes(ach.id)}
              <div class="preview-card" class:unlocked={unlocked}>
                <div class="preview-icon">
                  <svelte:component this={ach.icon} size={28} />
                </div>
                <div class="preview-details">
                  <strong>{ach.name}</strong>
                  <span>{ach.desc}</span>
                </div>
                {#if !unlocked}
                  <Lock size={14} class="preview-lock" />
                {:else}
                  <CheckCircle2 size={14} class="preview-check" />
                {/if}
              </div>
            {/each}
          </div>
        </div>

        <!-- Main CTA Hero Card -->
        <div class="hero-card">
          <div class="hero-content">
            <div class="badge">
              <Sparkles size={14} />
              Interactive Training
            </div>
            <h1 class="hero-title">Master Safety Through Play</h1>
            <p class="hero-subtitle">Test your knowledge with real-world scenarios and build lasting safety habits.</p>
            <button class="btn-primary" onclick={startNewGame}>
              <Gamepad2 size={20} />
              Start Today's Quest
              <ArrowRight size={20} />
            </button>
          </div>
          <div class="hero-visual">
            <div class="floating-icon icon-1"><Shield size={32} /></div>
            <div class="floating-icon icon-2"><Brain size={32} /></div>
            <div class="floating-icon icon-3"><Target size={32} /></div>
          </div>
        </div>

        <!-- Secondary Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <Shield size={28} class="card-icon" />
            <div>
              <span class="big-number">{totalGamesPlayed}</span>
              <span>Quests Completed</span>
            </div>
          </div>
          <div class="stat-card">
            <BarChart3 size={28} class="card-icon" />
            <div>
              <span class="big-number">{overallAccuracy}%</span>
              <span>Overall Accuracy</span>
            </div>
          </div>
          <div class="stat-card">
            <Flame size={28} class="card-icon" />
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
  :global(body) {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%);
    margin: 0;
    padding: 0;
  }

  .page { min-height: 100vh; padding: 1.5rem; display: flex; flex-direction: column; }
  .nav { margin-bottom: 2rem; }
  .nav-content {
    max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: flex-start;
    background: white; border-radius: 1rem; padding: 0.5rem 1.25rem; border: 1px solid #e2e8f0;
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

  /* Menu Container */
  .menu-container {
    width: 100%;
    max-width: 1200px;
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Top Stats Bar */
  .top-stats-bar {
    display: flex;
    background: white;
    border-radius: 1.5rem;
    padding: 1.25rem 2rem;
    margin-bottom: 1.5rem;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: space-around;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  }
  .stat-block {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }
  .stat-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6a2c91;
  }
  .stat-info {
    flex: 1;
  }
  .stat-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;
    color: #64748b;
    letter-spacing: 0.03em;
    display: block;
  }
  .stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
  }
  .xp-block {
    flex: 2;
  }
  .xp-progress {
    width: 100%;
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    margin: 0.5rem 0 0.25rem;
    overflow: hidden;
  }
  .xp-fill {
    height: 100%;
    background: linear-gradient(90deg, #6a2c91, #8b5cf6);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  .xp-next {
    font-size: 0.7rem;
    color: #64748b;
  }

  /* Achievements Preview - Horizontal scroll */
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
    padding: 0 0.25rem;
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
  .preview-scroll {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scrollbar-width: thin;
  }
  .preview-card {
    flex: 0 0 240px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 1rem;
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
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
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
  }
  .preview-check {
    color: #10b981;
  }

  /* Hero Card */
  .hero-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
    background: linear-gradient(145deg, #ffffff, #fafcff);
    box-shadow: 0 8px 20px rgba(0,0,0,0.03);
  }
  .hero-content {
    flex: 2;
    text-align: left;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f3e8ff;
    border: 1px solid rgba(106, 44, 145, 0.2);
    border-radius: 2rem;
    color: #6a2c91;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.25rem;
  }
  .hero-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #0f172a, #334155);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .hero-subtitle {
    font-size: 1.125rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1.75rem;
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
    transition: all 0.25s ease;
    box-shadow: 0 4px 12px rgba(106, 44, 145, 0.3);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(106, 44, 145, 0.35);
  }
  .hero-visual {
    flex: 1;
    position: relative;
    min-height: 140px;
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
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    border: 1px solid #e2e8f0;
    color: #6a2c91;
  }
  .icon-1 { top: 0; left: 0; animation: float 3s ease-in-out infinite; }
  .icon-2 { top: 30px; right: 20px; animation: float 3s ease-in-out infinite 0.5s; }
  .icon-3 { bottom: 0; left: 40px; animation: float 3s ease-in-out infinite 1s; }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
  }
  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 1.25rem;
    border: 1px solid #e2e8f0;
    display: flex;
    gap: 1rem;
    align-items: center;
    transition: all 0.2s;
  }
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.03);
  }
  .card-icon {
    color: #6a2c91;
    opacity: 0.8;
  }
  .big-number {
    font-size: 2rem;
    font-weight: 800;
    display: block;
    color: #0f172a;
  }
  .stat-card span:last-child {
    font-size: 0.85rem;
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
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e2e8f0;
  }
  .progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }
  .progress-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
  }
  .progress-pills {
    display: flex;
    gap: 0.5rem;
  }
  .streak-pill, .accuracy-pill {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 600;
  }
  .streak-pill {
    background: #fef3c7;
    color: #d97706;
  }
  .accuracy-pill {
    background: #dcfce7;
    color: #059669;
  }
  .progress-track {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6a2c91, #8b5cf6);
    border-radius: 4px;
    transition: width 0.3s;
  }
  .question-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    border: 1px solid #e2e8f0;
  }
  .category-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #f3e8ff;
    border-radius: 2rem;
    font-size: 0.7rem;
    font-weight: 600;
    color: #6a2c91;
    margin-bottom: 1rem;
  }
  .question-text {
    font-size: 1.35rem;
    font-weight: 600;
    line-height: 1.4;
    color: #0f172a;
  }
  .answers-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1.5rem 0;
  }
  .answer-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 1rem;
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
  .answer-indicator {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .option-letter {
    width: 28px;
    height: 28px;
    background: #e2e8f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #64748b;
  }
  .result-icon.correct-icon {
    background: #10b981;
    color: white;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .result-icon.incorrect-icon {
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .answer-text {
    flex: 1;
    font-weight: 500;
  }
  .explanation-panel {
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 1rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
  }
  .explanation-panel.correct {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }
  .explanation-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .btn-next {
    width: 100%;
    padding: 0.875rem;
    background: linear-gradient(135deg, #6a2c91, #4c1d6e);
    border: none;
    border-radius: 1rem;
    color: white;
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
  /* Results */
  .results-container {
    max-width: 500px;
    width: 100%;
  }
  .results-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    text-align: center;
  }
  .results-title {
    font-size: 1.75rem;
    margin: 1rem 0;
  }
  .xp-gain {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: #6a2c91;
    margin: 1.5rem 0;
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
    padding: 0.75rem 1.25rem;
    background: white;
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-secondary:hover {
    background: #f8fafc;
  }
  /* Achievements page */
  .achievements-container {
    width: 100%;
    max-width: 1000px;
  }
  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }
  .achievement-card {
    background: white;
    border-radius: 1rem;
    padding: 1.25rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    border: 1px solid #e2e8f0;
    opacity: 0.6;
  }
  .achievement-card.unlocked {
    opacity: 1;
    border-color: #10b981;
    background: #f0fdf4;
  }
  .achievement-icon {
    color: #6a2c91;
  }
  .achievement-info {
    flex: 1;
  }
  .lock {
    color: #94a3b8;
  }
  @media (max-width: 768px) {
    .page { padding: 1rem; }
    .top-stats-bar { flex-direction: column; gap: 1rem; padding: 1rem; }
    .stat-block { width: 100%; }
    .hero-title { font-size: 1.8rem; }
    .hero-visual { display: none; }
    .preview-scroll { flex-wrap: wrap; }
    .preview-card { flex: 1 1 100%; }
  }
</style>