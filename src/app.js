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
let currentSubsetSize = 1;
let completedRounds = 0;
let currentProgress = 0;
let gameInstance;

export function getCurrentSubsetSize() {
    return currentSubsetSize;
}

function updateProgress() {
    currentProgress = (currentIndex + 1) % currentSubsetSize;
    const progressElement = document.getElementById('progress');
    if (progressElement) {
        progressElement.textContent = `Progress: ${currentProgress + 1} / ${currentSubsetSize}`;
    }
}

function checkAndIncreaseSubset() {
    if (currentIndex + 1 >= currentSubsetSize) {
        completedRounds++;
        if (completedRounds >= 2 && currentSubsetSize < LETTERS_DATA.length) {
            currentSubsetSize = Math.min(currentSubsetSize + 1, LETTERS_DATA.length);
            completedRounds = 0;
        }
    }
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
        currentIndex = (currentIndex + 1) % currentSubsetSize;
        const nextLetterData = LETTERS_DATA[currentIndex];
        const nextLetter = nextLetterData[currentLanguage];
        renderLetter(nextLetter);
        updateProgress();
        checkAndIncreaseSubset();
        return true;
    }
    return false;
}

import confetti from 'canvas-confetti';

export class Game {
    constructor() {
        this.score = 0;
        this.starsEarned = 0;
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
        const newStars = Math.floor(this.score / 5);
        if (newStars > this.starsEarned) {
            this.starsEarned = newStars;
            this.updateStars();
        }
        
        if (this.score >= 25 && this.starsEarned === 5) {
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

// Only run initialization if we're in a browser context
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        gameInstance = new Game();
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
    });
}
