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
    TrendingUp
  } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  // Game state
  let currentGame: 'menu' | 'quiz' | 'results' = 'menu';
  let questions = getRandomQuestions(8);
  let currentIndex = 0;
  let score = 0;
  let selectedAnswer: number | null = null;
  let showExplanation = false;
  let streak = 0;
  let maxStreak = 0;
  let answersHistory: boolean[] = [];

  // Derived values
  $: totalQuestions = questions.length;
  $: progressPercent = ((currentIndex + (gameCompleted ? 1 : 0)) / totalQuestions) * 100;
  $: gameCompleted = currentIndex >= totalQuestions;
  $: accuracy = answersHistory.length > 0 ? Math.round((answersHistory.filter(Boolean).length / answersHistory.length) * 100) : 0;

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
    if (percent === 1) return { level: 'master', color: '#10b981', icon: Award, title: 'Safety Master', desc: 'Perfect score! You are a true safety champion.' };
    if (percent >= 0.8) return { level: 'expert', color: '#8b5cf6', icon: Trophy, title: 'Safety Expert', desc: 'Outstanding knowledge! You are well-prepared for any situation.' };
    if (percent >= 0.6) return { level: 'proficient', color: '#06b6d4', icon: Target, title: 'Safety Proficient', desc: 'Good work! Keep practicing to reach expert level.' };
    return { level: 'learner', color: '#f59e0b', icon: Brain, title: 'Safety Learner', desc: 'Keep going! Every question helps you stay safer.' };
  }

  const features = [
    { icon: Brain, title: 'Learn', desc: 'Real-world scenarios', color: '#8b5cf6' },
    { icon: Target, title: 'Practice', desc: 'Test your knowledge', color: '#06b6d4' },
    { icon: Zap, title: 'Master', desc: 'Build safety habits', color: '#f59e0b' }
  ];
</script>

<svelte:head>
  <title>Safety Quest — Lezie</title>
  <meta name="description" content="Master safety skills through interactive challenges" />
</svelte:head>

<div class="page">
  <!-- Navigation -->
  <header class="nav">
    <div class="nav-content">
      <button class="nav-back" on:click={() => goto('/')}>
        <Home size={18} />
        <span>Home</span>
      </button>
      
      <div class="nav-brand">
        <div class="logo-icon">
          <ShieldCheck size={22} />
        </div>
        <span class="logo-text">Lezie</span>
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
        <div class="menu-hero">
          <div class="badge">
            <Sparkles size={14} />
            Interactive Training
          </div>
          
          <h1 class="title">
            Master Safety
            <span class="gradient">Through Play</span>
          </h1>
          
          <p class="subtitle">
            Test your knowledge with real-world scenarios. 
            Learn essential skills that keep you and your community safe.
          </p>
          
          <button class="btn-primary" on:click={startNewGame}>
            <span>Start Safety Quest</span>
            <ArrowRight size={20} />
          </button>
        </div>

        <div class="features-grid">
          {#each features as feature}
            <div class="feature-card" style="--feature-color: {feature.color}">
              <div class="feature-icon">
                <svelte:component this={feature.icon} size={24} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          {/each}
        </div>

        <div class="stats-preview">
          <div class="stat-item">
            <span class="stat-number">50+</span>
            <span class="stat-label">Scenarios</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-number">8</span>
            <span class="stat-label">Questions</span>
          </div>
          <div class="stat-divider" />
          <div class="stat-item">
            <span class="stat-number">3</span>
            <span class="stat-label">Minutes</span>
          </div>
        </div>
      </div>

    {:else if currentGame === 'quiz'}
      <!-- Quiz Screen -->
      <div class="quiz-container">
        <!-- Progress -->
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
            <div class="progress-fill" style="width: {progressPercent}%" />
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
                on:click={() => selectAnswer(i)}
              >
                <div class="answer-indicator">
                  {#if showResult && isCorrect}
                    <CheckCircle2 size={20} color="#10b981" />
                  {:else if showResult && isSelected && !isCorrect}
                    <XCircle size={20} color="#ef4444" />
                  {:else}
                    <span class="option-letter">{String.fromCharCode(65 + i)}</span>
                  {/if}
                </div>
                
                <span class="answer-text">{answer.text}</span>
                
                {#if showResult && isCorrect && !isSelected}
                  <CheckCircle2 size={18} color="#10b981" opacity={0.5} />
                {/if}
              </button>
            {/each}
          </div>

          <!-- Explanation -->
          {#if showExplanation && questions[currentIndex]?.answers[selectedAnswer]?.explanation}
            <div class="explanation-panel" class:correct={questions[currentIndex].answers[selectedAnswer].correct}>
              <div class="explanation-header">
                {#if questions[currentIndex].answers[selectedAnswer].correct}
                  <CheckCircle2 size={20} />
                  <span>Correct!</span>
                {:else}
                  <AlertCircle size={20} />
                  <span>Not quite right</span>
                {/if}
              </div>
              <p>{questions[currentIndex].answers[selectedAnswer].explanation}</p>
            </div>
          {/if}

          <!-- Action -->
          <button 
            class="btn-next"
            class:visible={selectedAnswer !== null}
            disabled={selectedAnswer === null}
            on:click={nextQuestion}
          >
            <span>{currentIndex === totalQuestions - 1 ? 'View Results' : 'Next Question'}</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

    {:else}
      <!-- Results Screen -->
      <div class="results-container">
        {@const performance = getPerformanceLevel()}
        
        <div class="results-card">
          <div class="results-icon" style="color: {performance.color}">
            <svelte:component this={performance.icon} size={64} strokeWidth={1.5} />
          </div>
          
          <h2 class="results-title">{performance.title}</h2>
          <p class="results-desc">{performance.desc}</p>
          
          <div class="score-display">
            <div class="score-main">
              <span class="score-number" style="color: {performance.color}">{score}</span>
              <span class="score-total">/{totalQuestions}</span>
            </div>
            <div class="score-percent">{Math.round((score / totalQuestions) * 100)}%</div>
          </div>

          <div class="results-stats">
            <div class="result-stat">
              <span class="stat-label-sm">Accuracy</span>
              <span class="stat-value" style="color: {performance.color}">{accuracy}%</span>
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
            <button class="btn-primary" on:click={startNewGame}>
              <RotateCcw size={18} />
              <span>Play Again</span>
            </button>
            <button class="btn-secondary" on:click={() => currentGame = 'menu'}>
              <Home size={18} />
              <span>Main Menu</span>
            </button>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: #0f0f23;
    color: #fafafa;
    min-height: 100vh;
  }

  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: 
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent),
      radial-gradient(ellipse 60% 40% at 50% 100%, rgba(139, 92, 246, 0.15), transparent),
      #0f0f23;
  }

  /* Navigation */
  .nav {
    padding: 1.25rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-back {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    color: #a1a1aa;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-back:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fafafa;
    border-color: rgba(255, 255, 255, 0.2);
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
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fafafa, #a1a1aa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 2rem;
    color: #c4b5fd;
    font-size: 0.875rem;
    font-weight: 600;
  }

  /* Content */
  .content {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Menu Screen */
  .menu-container {
    max-width: 800px;
    width: 100%;
    text-align: center;
    animation: fadeIn 0.6s ease;
  }

  .menu-hero {
    margin-bottom: 3rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 2rem;
    color: #c4b5fd;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }

  .title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }

  .title .gradient {
    display: block;
    background: linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
  }

  @keyframes gradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .subtitle {
    font-size: 1.25rem;
    color: #a1a1aa;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto 2rem;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    border: none;
    border-radius: 1rem;
    color: white;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5);
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .feature-card {
    padding: 2rem 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 1.25rem;
    transition: all 0.3s;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--feature-color);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    background: var(--feature-color);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto 1rem;
    opacity: 0.9;
  }

  .feature-card h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #fafafa;
  }

  .feature-card p {
    font-size: 0.875rem;
    color: #71717a;
  }

  .stats-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 1rem;
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fafafa;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #71717a;
  }

  .stat-divider {
    width: 1px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
  }

  /* Quiz Screen */
  .quiz-container {
    max-width: 720px;
    width: 100%;
    animation: slideUp 0.4s ease;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .progress-section {
    margin-bottom: 1.5rem;
  }

  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .progress-text {
    font-size: 0.875rem;
    color: #a1a1aa;
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
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 2rem;
    color: #fbbf24;
    font-size: 0.875rem;
    font-weight: 600;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  .accuracy-pill {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 2rem;
    color: #34d399;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .progress-track {
    height: 6px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #8b5cf6, #06b6d4);
    border-radius: 3px;
    transition: width 0.4s ease;
  }

  .question-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 1.5rem;
    padding: 2rem;
    backdrop-filter: blur(10px);
  }

  .question-header {
    margin-bottom: 1.5rem;
  }

  .category-badge {
    display: inline-block;
    padding: 0.375rem 1rem;
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 2rem;
    color: #c4b5fd;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
  }

  .question-text {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.4;
    color: #fafafa;
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
    background: rgba(255, 255, 255, 0.03);
    border: 2px solid rgba(255, 255, 255, 0.06);
    border-radius: 1rem;
    color: #e4e4e7;
    font-size: 1rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
  }

  .answer-option:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateX(4px);
  }

  .answer-option.selected {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.1);
  }

  .answer-option.correct {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.15);
  }

  .answer-option.incorrect {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.15);
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
    background: rgba(255, 255, 255, 0.06);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: #a1a1aa;
  }

  .answer-text {
    flex: 1;
    line-height: 1.5;
  }

  .explanation-panel {
    margin-bottom: 1.5rem;
    padding: 1.25rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 1rem;
  }

  .explanation-panel.correct {
    background: rgba(16, 185, 129, 0.1);
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
    color: #a1a1aa;
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
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
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
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
  }

  /* Results Screen */
  .results-container {
    max-width: 600px;
    width: 100%;
    animation: fadeIn 0.6s ease;
  }

  .results-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 2rem;
    padding: 3rem 2rem;
    text-align: center;
  }

  .results-icon {
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 4px 20px currentColor);
  }

  .results-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .results-desc {
    color: #a1a1aa;
    margin-bottom: 2rem;
    font-size: 1.125rem;
  }

  .score-display {
    margin-bottom: 2rem;
  }

  .score-main {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .score-number {
    font-size: 5rem;
    font-weight: 800;
    line-height: 1;
  }

  .score-total {
    font-size: 2rem;
    color: #71717a;
    font-weight: 600;
  }

  .score-percent {
    font-size: 1.5rem;
    color: #a1a1aa;
    font-weight: 600;
  }

  .results-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 1rem;
  }

  .result-stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-label-sm {
    font-size: 0.75rem;
    color: #71717a;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fafafa;
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
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    color: #fafafa;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .nav {
      padding: 1rem;
    }

    .nav-brand {
      position: static;
      transform: none;
    }

    .content {
      padding: 1.5rem;
    }

    .title {
      font-size: 2.5rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .stats-preview {
      flex-direction: column;
      gap: 1rem;
    }

    .stat-divider {
      width: 100%;
      height: 1px;
    }

    .question-card {
      padding: 1.5rem;
    }

    .question-text {
      font-size: 1.25rem;
    }

    .results-stats {
      grid-template-columns: 1fr;
    }

    .results-actions {
      flex-direction: column;
    }
  }
</style>
