export function renderLetter(letter) {
    if (typeof letter !== 'string') {
        throw new Error('Invalid input');
    }
    
    if (letter.length !== 1) {
        throw new Error('Invalid input');
    }

    const isUppercaseLetter = /^[A-Z]$/.test(letter);
    if (!isUppercaseLetter) {
        throw new Error('Invalid input');
    }

    const cardElement = document.getElementById('card');
    if (!cardElement) {
        throw new Error('Card element not found');
    }
    cardElement.textContent = letter;
}

const LETTERS_DATA = [
    { en: 'A', es: 'A', jp: 'あ', audio: 'audio/en_a.mp3' },
    { en: 'B', es: 'B', jp: 'い', audio: 'audio/en_b.mp3' },
    { en: 'C', es: 'C', jp: 'う', audio: 'audio/en_c.mp3' }
];

let currentIndex = -1;
let currentLanguage = 'en';
let audioEnabled = true;
let currentLevel = 1;
let roundsInLevel = 0;
const ROUNDS_TO_LEVEL_UP = 2;
let currentProgress = 0;
let gameInstance;
let letterMistakes = {};
let playerName = '';
let toddlerMode = true;
let timedMode = false;
let timerInterval = null;
const TIMER_DURATION = 10; // seconds
let timeLeft = TIMER_DURATION;

// Load saved game data
function loadGameData() {
    const savedData = localStorage.getItem('letterSwipeData');
    if (savedData) {
        const data = JSON.parse(savedData);
        playerName = data.name || '';
        return data;
    }
    return null;
}

// Save game data
function saveGameData(data) {
    const gameData = {
        name: playerName,
        score: data.score,
        stars: data.stars,
        mistakes: data.mistakes,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('letterSwipeData', JSON.stringify(gameData));
}

function updateProgress() {
    const subsetSize = getCurrentSubsetSize();
    currentProgress = (currentIndex + 1) % subsetSize;
    const progressElement = document.getElementById('progress');
    if (progressElement) {
        progressElement.textContent = `Progress: ${currentProgress + 1} / ${subsetSize}`;
    }
}

function checkAndIncreaseLevel() {
    if (currentIndex + 1 >= getCurrentSubsetSize()) {
        roundsInLevel++;
        if (roundsInLevel >= ROUNDS_TO_LEVEL_UP && currentLevel < LETTERS_DATA.length) {
            currentLevel++;
            roundsInLevel = 0;
            updateLevelDisplay();
        }
    }
}

function updateLevelDisplay() {
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.textContent = `Level: ${currentLevel}`;
    }
}

export function getCurrentSubsetSize() {
    return Math.min(currentLevel, LETTERS_DATA.length);
}

export function playAudio(audioFile) {
    if (audioEnabled) {
        const audio = new Audio(audioFile);
        return audio.play();
    }
    return Promise.resolve();
}

export function toggleAudio() {
    audioEnabled = !audioEnabled;
    const btn = document.getElementById('audioToggleBtn');
    if (btn) {
        btn.textContent = audioEnabled ? '🔊 Audio On' : '🔈 Audio Off';
    }
    return audioEnabled;
}

export function checkLetter(input) {
    const currentLetter = LETTERS_DATA[currentIndex][currentLanguage];
    if (input === currentLetter) {
        if (audioEnabled) {
            playAudio(LETTERS_DATA[currentIndex].audio);
        }
        if (gameInstance) {
            gameInstance.incrementScore();
        }
        currentIndex = getNextLetterIndex();
        const nextLetterData = LETTERS_DATA[currentIndex];
        const nextLetter = nextLetterData[currentLanguage];
        renderLetter(nextLetter);
        updateProgress();
        checkAndIncreaseLevel();
        hideMessage();
        if (timedMode) {
            startTimer(); // Reset timer only in timed mode
        }
        return true;
    } else {
        letterMistakes[currentLetter] = (letterMistakes[currentLetter] || 0) + 1;
        showMessage("Try again!");
        return false;
    }
}

function getNextLetterIndex() {
    // If current letter has high mistakes, 50% chance to repeat it
    const currentLetter = LETTERS_DATA[currentIndex][currentLanguage];
    if (letterMistakes[currentLetter] >= 2 && Math.random() < 0.5) {
        return currentIndex;
    }
    return (currentIndex + 1) % getCurrentSubsetSize();
}

function showMessage(text) {
    if (toddlerMode) {
        const toddlerMessage = document.getElementById('toddlerMessage');
        if (toddlerMessage) {
            toddlerMessage.textContent = text === "Try again!" ? "❌" : "✨";
            toddlerMessage.classList.remove('hidden');
            setTimeout(() => hideMessage(), 1500);
        }
    } else {
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = text;
            messageElement.classList.remove('hidden');
        }
    }
}

function hideMessage() {
    const messageElement = document.getElementById('message');
    const toddlerMessage = document.getElementById('toddlerMessage');
    if (messageElement) {
        messageElement.classList.add('hidden');
    }
    if (toddlerMessage) {
        toddlerMessage.classList.add('hidden');
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = TIMER_DURATION;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = `Time Left: ${timeLeft}s`;
    }
}

function handleTimeUp() {
    if (gameInstance) {
        gameInstance.handleTimeOut();
    }
    currentIndex = getNextLetterIndex();
    const nextLetterData = LETTERS_DATA[currentIndex];
    const nextLetter = nextLetterData[currentLanguage];
    renderLetter(nextLetter);
    updateProgress();
    checkAndIncreaseLevel();
    showMessage("Time's up!");
    startTimer();
}

function toggleToddlerMode() {
    toddlerMode = !toddlerMode;
    const gameContainer = document.getElementById('game-container');
    const btn = document.getElementById('toddlerModeBtn');
    if (gameContainer && btn) {
        gameContainer.classList.toggle('toddler-mode', toddlerMode);
        btn.textContent = toddlerMode ? '👶 Normal Mode' : '👶 Toddler Mode';
    }
    // Initialize toddler mode on page load
    if (gameContainer) {
        gameContainer.classList.add('toddler-mode');
    }
}

function toggleTimedMode() {
    timedMode = !timedMode;
    const timerElement = document.getElementById('timer');
    const btn = document.getElementById('timedModeBtn');
    
    if (timerElement) {
        timerElement.style.display = timedMode ? 'block' : 'none';
    }
    
    if (btn) {
        btn.textContent = timedMode ? '⏱️ Untimed' : '⏱️ Timed';
    }
    
    if (timedMode) {
        startTimer();
    } else {
        clearInterval(timerInterval);
    }
}

import confetti from 'canvas-confetti';

export class Game {
    constructor(savedData = null) {
        if (savedData) {
            this.score = savedData.score || 0;
            this.starsEarned = savedData.stars || 0;
            this.mistakes = savedData.mistakes || 0;
        } else {
            this.score = 0;
            this.starsEarned = 0;
            this.mistakes = 0;
        }
        this.updateScoreDisplay();
        this.updateStars();
    }

    getMistakes() {
        return this.mistakes;
    }

    incrementMistakes() {
        this.mistakes++;
    }

    getScore() {
        return this.score;
    }

    getStars() {
        return this.starsEarned;
    }

    incrementScore() {
        this.score++;
        this.updateScoreDisplay();
        this.checkAchievements();
        this.celebrateSuccess();
        saveGameData(this);
    }

    handleTimeOut() {
        if (this.score > 0) {
            this.score--;
            this.updateScoreDisplay();
            saveGameData(this);
        }
    }

    updateScoreDisplay() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}`;
        }
    }

    celebrateSuccess() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    checkAchievements() {
        const newStars = Math.floor(this.score / 15);
        if (newStars > this.starsEarned) {
            this.starsEarned = newStars;
            this.updateStars();
        }
        
        if (this.score >= 75 && this.starsEarned === 5) {
            this.showBadge();
        }
    }

    updateStars() {
        const starsContainer = document.getElementById('stars');
        if (starsContainer) {
            const stars = starsContainer.children;
            for (let i = 0; i < stars.length; i++) {
                stars[i].classList.toggle('opacity-30', i >= this.starsEarned);
                stars[i].classList.toggle('text-yellow-400', i < this.starsEarned);
            }
        }
    }

    showBadge() {
        const badge = document.getElementById('badge');
        if (badge) {
            badge.classList.remove('hidden');
        }
    }
}

// Only run initialization if we're in a full browser context with DOM APIs
if (typeof window !== 'undefined' && window.document && 'addEventListener' in window) {
    window.addEventListener('DOMContentLoaded', () => {
        const savedData = loadGameData();
        
        const nameForm = document.getElementById('name-form');
        const gameContainer = document.getElementById('game-container');
        const startButton = document.getElementById('startButton');
        const playerNameInput = document.getElementById('playerName');
        const playerNameDisplay = document.getElementById('playerNameDisplay');

        // Check if we're on mobile
        const isMobile = window.innerWidth < 640; // matches sm: breakpoint

        const startGame = () => {
            playerName = (playerNameInput.value.trim() || savedData?.name || 'Friend');
            playerNameDisplay.textContent = playerName;
            nameForm.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            gameInstance = new Game(savedData);
            startTimer();
        };

        if (isMobile) {
            // Auto-start on mobile
            nameForm.style.display = 'none';
            startGame();
        } else {
            // On desktop, show name form and wait for click
            if (savedData && savedData.name) {
                playerNameInput.value = savedData.name;
            }
            
            startButton.addEventListener('click', startGame);
        }
        currentIndex = 0; // Start at first letter
        const firstLetter = LETTERS_DATA[currentIndex][currentLanguage];
        renderLetter(firstLetter);
        updateProgress();
        
        // Handle keyboard input anywhere on the page
        document.addEventListener('keypress', (e) => {
            const input = e.key.toUpperCase();
            if (/^[A-Z]$/.test(input)) {
                if (checkLetter(input)) {
                    // Success handled in checkLetter
                }
            }
        });

        // Keep hidden input for mobile support
        const letterInput = document.getElementById('letterInput');
        if (letterInput) {
            letterInput.addEventListener('input', (e) => {
                const input = e.target.value.toUpperCase();
                if (input) {
                    if (checkLetter(input)) {
                        e.target.value = ''; // Clear input on success
                    }
                }
            });
        }

        // Handle clicks anywhere to focus hidden input (for mobile)
        document.addEventListener('click', () => {
            letterInput?.focus();
        });

        const audioToggleBtn = document.getElementById('audioToggleBtn');
        if (audioToggleBtn) {
            audioToggleBtn.addEventListener('click', () => {
                toggleAudio();
            });
        }

        const toddlerModeBtn = document.getElementById('toddlerModeBtn');
        if (toddlerModeBtn) {
            toddlerModeBtn.addEventListener('click', toggleToddlerMode);
        }

        const timedModeBtn = document.getElementById('timedModeBtn');
        if (timedModeBtn) {
            timedModeBtn.addEventListener('click', toggleTimedMode);
        }

        // Hide timer initially
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.style.display = 'none';
        }
    });
}
