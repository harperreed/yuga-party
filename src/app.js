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

const LETTERS = ['A', 'B', 'C'];
let currentIndex = -1;

export function nextLetter() {
    currentIndex = (currentIndex + 1) % LETTERS.length;
    const letter = LETTERS[currentIndex];
    renderLetter(letter);
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
        
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextLetter();
            });
        }
    });
}
