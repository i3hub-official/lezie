<script lang="ts">
  import { safetyQuestions, getRandomQuestions } from '$lib/data/safetyQuestions';
  import { ShieldCheck, Trophy, Clock, Users, ArrowRight, RefreshCw, Home } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let currentGame = $state<'menu' | 'quiz'>('menu');
  let questions = $state(getRandomQuestions(8));
  let currentIndex = $state(0);
  let score = $state(0);
  let selectedAnswer = $state<number | null>(null);
  let showExplanation = $state(false);
  let gameCompleted = $state(false);

  const totalQuestions = questions.length;

  function startNewGame() {
    questions = getRandomQuestions(8);
    currentIndex = 0;
    score = 0;
    selectedAnswer = null;
    showExplanation = false;
    gameCompleted = false;
    currentGame = 'quiz';
  }

  function selectAnswer(index: number) {
    if (selectedAnswer !== null) return;
    selectedAnswer = index;
    showExplanation = true;

    if (questions[currentIndex].answers[index].correct) {
      score++;
    }
  }

  function nextQuestion() {
    if (currentIndex < totalQuestions - 1) {
      currentIndex++;
      selectedAnswer = null;
      showExplanation = false;
    } else {
      gameCompleted = true;
    }
  }

  function restartGame() {
    startNewGame();
  }
</script>

<svelte:head>
  <title>Safety Games — Lezie</title>
</svelte:head>

<div class="safety-games-page">
  <!-- Header -->
  <header class="games-header">
    <div class="header-content">
      <button class="back-btn" onclick={() => goto('/')}>
        <Home size={20} /> Home
      </button>
      <div class="logo-section">
        <ShieldCheck size={32} color="#c4b5fd" />
        <h1>Lezie Safety Games</h1>
      </div>
      <p class="tagline">Learn safety skills while having fun</p>
    </div>
  </header>

  <main class="games-main">
    {#if currentGame === 'menu'}
      <!-- Game Selection Menu -->
      <div class="menu-container">
        <div class="hero-box">
          <div class="badge">New</div>
          <h2>Become a Safety Champion</h2>
          <p>Test your safety knowledge, earn points, and help make your community safer.</p>
          
          <button class="start-btn" on:click={startNewGame}>
            Start Safety Quest
            <ArrowRight size={22} />
          </button>
        </div>

        <div class="games-grid">
          <div class="game-card">
            <div class="card-icon"><ShieldCheck size={42} /></div>
            <h3>Safety Quest</h3>
            <p>Scenario-based quiz • 8 questions</p>
            <span class="difficulty easy">Easy to Hard</span>
          </div>

          <div class="game-card coming-soon">
            <div class="card-icon"><Trophy size={42} /></div>
            <h3>Badge Challenge</h3>
            <p>Earn collectible safety badges</p>
            <span class="coming">Coming Soon</span>
          </div>

          <div class="game-card coming-soon">
            <div class="card-icon"><Users size={42} /></div>
            <h3>Community Arena</h3>
            <p>Compete with friends</p>
            <span class="coming">Coming Soon</span>
          </div>
        </div>
      </div>
    {:else}
      <!-- Quiz Game -->
      <div class="quiz-container">
        <div class="quiz-header">
          <div class="progress-bar">
            <div class="progress" style="width: {((currentIndex + 1) / totalQuestions) * 100}%"></div>
          </div>
          <div class="score">
            Score: <strong>{score}</strong> / {totalQuestions}
          </div>
        </div>

        {#if !gameCompleted}
          <div class="question-card">
            <div class="question-number">Question {currentIndex + 1} of {totalQuestions}</div>
            <h3 class="question-text">{questions[currentIndex].question}</h3>

            <div class="answers-grid">
              {#each questions[currentIndex].answers as answer, i}
                <button
                  class="answer-option"
                  class:selected={selectedAnswer === i}
                  class:correct={selectedAnswer === i && answer.correct}
                  class:wrong={selectedAnswer === i && !answer.correct}
                  on:click={() => selectAnswer(i)}
                  disabled={selectedAnswer !== null}
                >
                  {answer.text}
                </button>
              {/each}
            </div>

            {#if showExplanation && questions[currentIndex].answers[selectedAnswer!].explanation}
              <div class="explanation">
                <strong>Why?</strong> {questions[currentIndex].answers[selectedAnswer!].explanation}
              </div>
            {/if}

            <button 
              class="next-btn"
              disabled={selectedAnswer === null}
              on:click={nextQuestion}
            >
              {currentIndex === totalQuestions - 1 ? 'See Results' : 'Next Question'}
              <ArrowRight size={18} />
            </button>
          </div>
        {:else}
          <!-- Results Screen -->
          <div class="results-screen">
            <Trophy size={90} color="#c4b5fd" />
            <h2>Congratulations!</h2>
            <div class="final-score">
              You scored <span class="highlight">{score}</span> out of {totalQuestions}
            </div>
            
            {#if score === totalQuestions}
              <p class="perfect">Perfect! You're a Safety Champion 🏆</p>
            {:else if score >= totalQuestions * 0.7}
              <p class="good">Great job! You have strong safety awareness.</p>
            {:else}
              <p class="okay">Good effort! Keep practicing to stay safer.</p>
            {/if}

            <div class="results-actions">
              <button class="restart-btn" on:click={restartGame}>
                <RefreshCw size={18} /> Play Again
              </button>
              <button class="home-btn" onclick={() => currentGame = 'menu'}>
                Back to Menu
              </button>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </main>
</div>

<style>
  .safety-games-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%);
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .games-header {
    background: linear-gradient(160deg, #1a0b2e, #2d1b4e);
    color: white;
    padding: 2rem 1.5rem;
    text-align: center;
  }

  .header-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .back-btn {
    position: absolute;
    top: 2rem;
    left: 2rem;
    background: rgba(255,255,255,0.1);
    color: white;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .logo-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .logo-section h1 {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 2.4rem;
    margin: 0;
  }

  .tagline {
    color: #c4b5fd;
    font-size: 1.1rem;
    margin: 0;
  }

  .games-main {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .hero-box {
    background: white;
    border-radius: 1.5rem;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1);
    margin-bottom: 3rem;
  }

  .start-btn {
    background: linear-gradient(135deg, #6a2c91, #4a1d6e);
    color: white;
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .start-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(106,44,145,0.4);
  }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .game-card {
    background: white;
    border-radius: 1.25rem;
    padding: 2rem 1.5rem;
    text-align: center;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    transition: transform 0.2s;
  }

  .game-card:hover {
    transform: translateY(-8px);
  }

  .quiz-container, .menu-container {
    max-width: 720px;
    margin: 0 auto;
  }

  .question-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2.5rem;
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1);
  }

  .results-screen {
    text-align: center;
    background: white;
    padding: 3rem 2rem;
    border-radius: 1.5rem;
    box-shadow: 0 20px 35px -12px rgba(0,0,0,0.1);
  }

  /* Add more styles as needed... */

  .answer-option {
    width: 100%;
    padding: 1rem 1.25rem;
    margin-bottom: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    text-align: left;
    font-size: 1rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .answer-option:hover:not(:disabled) {
    border-color: #c4b5fd;
    background: #f8f5ff;
  }

  .answer-option.selected.correct {
    border-color: #10b981;
    background: #f0fdf4;
  }

  .answer-option.selected.wrong {
    border-color: #ef4444;
    background: #fef2f2;
  }
</style>