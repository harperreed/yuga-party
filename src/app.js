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

export function nextLetter() {
    currentIndex = (currentIndex + 1) % currentSubsetSize;
    const letterData = LETTERS_DATA[currentIndex];
    const letter = letterData[currentLanguage];
    renderLetter(letter);
    if (audioEnabled) {
        playAudio(letterData.audio);
    }
    updateProgress();
    checkAndIncreaseSubset();
    return letter;
}

export class Game {
    constructor() {
        this.score = 0;
    }

    getScore() {
        return this.score;
    }
}

// Only run initialization if we're in a browser context
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        const game = new Game();
        renderLetter('A'); // Initialize with 'A'
        updateProgress(); // Show initial progress
        
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextLetter();
            });
        }

        const audioToggleBtn = document.getElementById('audioToggleBtn');
        if (audioToggleBtn) {
            audioToggleBtn.addEventListener('click', () => {
                toggleAudio();
            });
        }
    });
}
