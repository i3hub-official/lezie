<script lang="ts">
  import { safetyQuestions, getRandomQuestions } from '$lib/data/safetyQuestions';
  import { ShieldCheck, Trophy, ArrowRight, RefreshCw, Home, Sparkles } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let currentGame = $state<'menu' | 'quiz'>('menu');
  let questions = $state(getRandomQuestions(8));
  let currentIndex = $state(0);
  let score = $state(0);
  let selectedAnswer = $state<number | null>(null);
  let showExplanation = $state(false);
  let gameCompleted = $state(false);

  const totalQuestions = $derived(questions.length);

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
    if (questions[currentIndex].answers[index].correct) score++;
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
  <!-- Top Navigation -->
  <nav class="top-nav">
    <button class="back-btn" onclick={() => goto('/')}>
      <Home size={20} /> Back to Home
    </button>
    <div class="logo">
      <ShieldCheck size={28} color="#6a2c91" />
      <span>Lezie</span>
    </div>
  </nav>

  <div class="main-content">
    {#if currentGame === 'menu'}
      <!-- Beautiful Menu -->
      <div class="menu-screen">
        <div class="hero-section">
          <div class="badge"><Sparkles size={16} /> New Experience</div>
          <h1>Master Your Safety</h1>
          <p class="subtitle">Fun, interactive games that help you and your community stay safer every day.</p>
          
          <button class="primary-btn" onclick={startNewGame}>
            Start Safety Quest
            <ArrowRight size={24} />
          </button>
        </div>

        <div class="features">
          <div class="feature">
            <div class="icon-circle"><ShieldCheck size={28} /></div>
            <strong>Real Scenarios</strong>
            <span>Learn from everyday situations</span>
          </div>
          <div class="feature">
            <div class="icon-circle"><Trophy size={28} /></div>
            <strong>Earn Badges</strong>
            <span>Build your safety profile</span>
          </div>
        </div>
      </div>
    {:else}
      <!-- Quiz Interface -->
      <div class="quiz-screen">
        <div class="progress-container">
          <div class="progress-info">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span class="score-display">Score: <strong>{score}</strong></span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((currentIndex + 1) / totalQuestions) * 100}%"></div>
          </div>
        </div>

        {#if !gameCompleted}
          <div class="question-box">
            <h2>{questions[currentIndex].question}</h2>

            <div class="answers">
              {#each questions[currentIndex].answers as answer, i}
                <button
                  class="answer-card"
                  class:selected={selectedAnswer === i}
                  class:correct={selectedAnswer === i && answer.correct}
                  class:wrong={selectedAnswer === i && !answer.correct}
                  onclick={() => selectAnswer(i)}
                  disabled={selectedAnswer !== null}
                >
                  {answer.text}
                </button>
              {/each}
            </div>

            {#if showExplanation && questions[currentIndex].answers[selectedAnswer!]?.explanation}
              <div class="explanation-box">
                <strong>💡 Why this is important:</strong>
                <p>{questions[currentIndex].answers[selectedAnswer!].explanation}</p>
              </div>
            {/if}

            <button 
              class="next-button"
              disabled={selectedAnswer === null}
              onclick={nextQuestion}
            >
              {currentIndex === totalQuestions - 1 ? 'See My Results' : 'Continue'}
              <ArrowRight size={20} />
            </button>
          </div>
        {:else}
          <!-- Enhanced Results -->
          <div class="results-box">
            <Trophy size={110} color="#c4b5fd" />
            <h2>Congratulations!</h2>
            <div class="score-circle">
              <span class="big-score">{score}</span>
              <span class="total">/{totalQuestions}</span>
            </div>

            {#if score === totalQuestions}
              <p class="feedback perfect">You're a Safety Champion! 🎉</p>
            {:else if score >= Math.floor(totalQuestions * 0.75)}
              <p class="feedback good">Excellent work! You're well prepared.</p>
            {:else}
              <p class="feedback">Good effort. Keep playing to improve.</p>
            {/if}

            <div class="results-actions">
              <button class="restart-btn" onclick={restartGame}>
                <RefreshCw size={20} /> Play Again
              </button>
              <button class="menu-btn" onclick={() => currentGame = 'menu'}>
                Back to Games Menu
              </button>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .safety-games-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%);
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 2rem;
    background: white;
    border-bottom: 1px solid #e5e7eb;
  }

  .primary-btn {
    background: linear-gradient(135deg, #6a2c91, #4a1d6e);
    color: white;
    border: none;
    padding: 1.1rem 2.2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .primary-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(106, 44, 145, 0.35);
  }

  .question-box, .results-box, .menu-screen {
    background: white;
    border-radius: 1.75rem;
    padding: 2.5rem;
    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
    max-width: 720px;
    margin: 2rem auto;
  }

  .answers {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    margin: 2rem 0;
  }

  .answer-card {
    padding: 1.25rem 1.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    text-align: left;
    font-size: 1.02rem;
    line-height: 1.5;
    transition: all 0.25s;
    background: white;
  }

  .answer-card:hover:not(:disabled) {
    border-color: #c4b5fd;
    background: #f8f5ff;
  }

  .answer-card.selected.correct {
    border-color: #10b981;
    background: #f0fdf4;
  }

  .answer-card.selected.wrong {
    border-color: #ef4444;
    background: #fef2f2;
  }

  .next-button, .restart-btn, .menu-btn {
    width: 100%;
    padding: 1.1rem;
    font-size: 1.05rem;
    font-weight: 600;
    border-radius: 1rem;
    cursor: pointer;
  }

  .next-button, .restart-btn {
    background: linear-gradient(135deg, #6a2c91, #4a1d6e);
    color: white;
    border: none;
  }

  .score-circle {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    border: 8px solid #e0d4f5;
    margin: 1.5rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 2.8rem;
    font-weight: 700;
    color: #6a2c91;
  }
</style>