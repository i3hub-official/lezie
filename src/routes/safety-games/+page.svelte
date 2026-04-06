<script lang="ts">
  import { safetyQuestions, getRandomQuestions } from '$lib/data/safetyQuestions';
  import { 
    ShieldCheck, 
    Trophy, 
    ArrowRight, 
    RefreshCw, 
    Home, 
    Sparkles,
    Brain,
    Target,
    Zap,
    CheckCircle2,
    XCircle,
    ChevronRight,
    RotateCcw,
    Award,
    Flame,
    AlertCircle,
    TrendingUp,
    Gamepad2,
    Shield,
    Clock,
    Star
  } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  // Game state
  let currentGame = $state<'menu' | 'quiz' | 'results'>('menu');
  let questions = $state(getRandomQuestions(8));
  let currentIndex = $state(0);
  let score = $state(0);
  let selectedAnswer = $state<number | null>(null);
  let showExplanation = $state(false);
  let streak = $state(0);
  let maxStreak = $state(0);
  let answersHistory = $state<boolean[]>([]);

  // Derived values using $derived
  let totalQuestions = $derived(questions.length);
  let progressPercent = $derived(((currentIndex + (gameCompleted ? 1 : 0)) / totalQuestions) * 100);
  let gameCompleted = $derived(currentIndex >= totalQuestions);
  let accuracy = $derived(answersHistory.length > 0 ? Math.round((answersHistory.filter(Boolean).length / answersHistory.length) * 100) : 0);

  // Performance level for results screen
  let performance = $derived(getPerformanceLevel());

  function startNewGame() {
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
      currentIndex++;
      currentGame = 'results';
    }
  }

  function getPerformanceLevel() {
    const percent = score / totalQuestions;
    if (percent === 1) return { level: 'master', color: '#10B981', bg: '#D1FAE5', icon: Award, title: 'Safety Master', desc: 'Perfect score! You are a true safety champion.' };
    if (percent >= 0.8) return { level: 'expert', color: '#8B5CF6', bg: '#EDE9FE', icon: Trophy, title: 'Safety Expert', desc: 'Outstanding knowledge! You are well-prepared for any situation.' };
    if (percent >= 0.6) return { level: 'proficient', color: '#06B6D4', bg: '#CFFAFE', icon: Target, title: 'Safety Proficient', desc: 'Good work! Keep practicing to reach expert level.' };
    return { level: 'learner', color: '#F59E0B', bg: '#FEF3C7', icon: Brain, title: 'Safety Learner', desc: 'Keep going! Every question helps you stay safer.' };
  }

  const features = [
    { icon: Brain, title: 'Learn', desc: 'Real-world scenarios', color: '#8B5CF6', bg: '#EDE9FE' },
    { icon: Target, title: 'Practice', desc: 'Test your knowledge', color: '#06B6D4', bg: '#CFFAFE' },
    { icon: Zap, title: 'Master', desc: 'Build safety habits', color: '#F59E0B', bg: '#FEF3C7' }
  ];

  const stats = [
    { value: '50+', label: 'Scenarios', icon: Shield, color: '#8B5CF6', bg: '#EDE9FE' },
    { value: '8', label: 'Questions', icon: Target, color: '#06B6D4', bg: '#CFFAFE' },
    { value: '3', label: 'Minutes', icon: Clock, color: '#F59E0B', bg: '#FEF3C7' }
  ];
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
                    
   
      </div>
      
      <div class="nav-stats" class:hidden={currentGame === 'menu'}>
        <div class="stat-pill">
          <Trophy size={14} />
          <span>{score}/{currentIndex}</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="content">
    {#if currentGame === 'menu'}
      <!-- Menu Screen -->
      <div class="menu-container">
        <div class="page-header-card">
          <div class="header-content">
            <div class="badge">
              <Sparkles size={14} />
              Interactive Training
            </div>
            
            <h1 class="title">Master Safety Through Play</h1>
            
            <p class="subtitle">
              Test your knowledge with real-world scenarios. Learn essential skills that keep you and your community safe.
            </p>
            
            <button class="btn-primary" onclick={startNewGame}>
              <Gamepad2 size={18} />
              <span>Start Safety Quest</span>
              <ArrowRight size={18} />
            </button>
          </div>
          
          <div class="header-visual">
            <div class="floating-icon icon-1">
              <Shield size={32} color="#8B5CF6" />
            </div>
            <div class="floating-icon icon-2">
              <Star size={24} color="#F59E0B" />
            </div>
            <div class="floating-icon icon-3">
              <CheckCircle2 size={28} color="#10B981" />
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="features-grid">
          {#each features as feature}
            <div class="feature-card">
              <div class="feature-icon" style="background: {feature.bg}; color: {feature.color};">
                <svelte:component this={feature.icon} size={24} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          {/each}
        </div>

        <!-- Stats Row -->
        <div class="stats-row">
          {#each stats as stat}
            <div class="stat-card">
              <div class="stat-icon" style="background: {stat.bg}; color: {stat.color};">
                <svelte:component this={stat.icon} size={22} />
              </div>
              <div class="stat-content">
                <span class="stat-value">{stat.value}</span>
                <span class="stat-label">{stat.label}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>

    {:else if currentGame === 'quiz'}
      <!-- Quiz Screen -->
      <div class="quiz-container">
        <!-- Progress Section -->
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

        <!-- Question Card -->
        <div class="question-card">
          <div class="question-header">
            <div class="category-badge">Safety Scenario</div>
            <h2 class="question-text">{questions[currentIndex]?.question}</h2>
          </div>

          <!-- Answers -->
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
                    <div class="result-icon correct-icon">
                      <CheckCircle2 size={20} />
                    </div>
                  {:else if showResult && isSelected && !isCorrect}
                    <div class="result-icon incorrect-icon">
                      <XCircle size={20} />
                    </div>
                  {:else}
                    <span class="option-letter">{String.fromCharCode(65 + i)}</span>
                  {/if}
                </div>
                
                <span class="answer-text">{answer.text}</span>
                
                {#if showResult && isCorrect && !isSelected}
                  <div class="correct-badge">
                    <CheckCircle2 size={16} />
                  </div>
                {/if}
              </button>
            {/each}
          </div>

          <!-- Explanation Panel -->
          {#if showExplanation && questions[currentIndex]?.answers[selectedAnswer]?.explanation}
            <div class="explanation-panel" class:correct={questions[currentIndex].answers[selectedAnswer].correct}>
              <div class="explanation-header">
                {#if questions[currentIndex].answers[selectedAnswer].correct}
                  <div class="explanation-icon correct">
                    <CheckCircle2 size={20} />
                  </div>
                  <span>Correct!</span>
                {:else}
                  <div class="explanation-icon incorrect">
                    <AlertCircle size={20} />
                  </div>
                  <span>Not quite right</span>
                {/if}
              </div>
              <p>{questions[currentIndex].answers[selectedAnswer].explanation}</p>
            </div>
          {/if}

          <!-- Next Button -->
          <button 
            class="btn-next"
            class:visible={selectedAnswer !== null}
            disabled={selectedAnswer === null}
            onclick={nextQuestion}
          >
            <span>{currentIndex === totalQuestions - 1 ? 'View Results' : 'Next Question'}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

    {:else}
      <!-- Results Screen -->
      <div class="results-container">
        <div class="results-card">
          <div class="results-icon-wrapper" style="background: {performance.bg}; color: {performance.color};">
            <svelte:component this={performance.icon} size={48} />
          </div>
          
          <h2 class="results-title">{performance.title}</h2>
          <p class="results-desc">{performance.desc}</p>
          
          <div class="score-display">
            <div class="score-circle" style="border-color: {performance.bg};">
              <div class="score-main">
                <span class="score-number" style="color: {performance.color};">{score}</span>
                <span class="score-total">/{totalQuestions}</span>
              </div>
              <div class="score-percent">{Math.round((score / totalQuestions) * 100)}%</div>
            </div>
          </div>

          <div class="results-stats">
            <div class="result-stat">
              <span class="stat-label-sm">Accuracy</span>
              <span class="stat-value" style="color: {performance.color};">{accuracy}%</span>
            </div>
            <div class="result-stat">
              <span class="stat-label-sm">Best Streak</span>
              <span class="stat-value">{maxStreak}</span>
            </div>
            <div class="result-stat">
              <span class="stat-label-sm">Correct</span>
              <span class="stat-value">{score}</span>
            </div>
          </div>

          <div class="results-actions">
            <button class="btn-primary" onclick={startNewGame}>
              <RotateCcw size={18} />
              <span>Play Again</span>
            </button>
            <button class="btn-secondary" onclick={() => currentGame = 'menu'}>
              <Home size={18} />
              <span>Main Menu</span>
            </button>
          </div>
        </div>
      </div>
    {/if}
  </main>

  <!-- Safety Banner -->
  <div class="safety-banner">
    <ShieldCheck size={20} />
    <div>
      <strong>Proactive Protection</strong> — Regular safety training helps you respond confidently in emergency situations.
    </div>
  </div>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

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
    --info-color: #06B6D4;
    --info-bg: #CFFAFE;
  }

  :global(body) {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    color: #0f172a;
    min-height: 100vh;
  }

  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
  }

  /* Navigation */
  .nav {
    margin-bottom: 2rem;
  }

  .nav-content {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    border-radius: 1rem;
    padding: 0.75rem 1.25rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .nav-back {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
    transition: all 0.2s;
  }

  .nav-back:hover {
    background: #f1f5f9;
    color: var(--primary-color);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

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
