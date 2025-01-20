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

    throw new Error('Function not implemented');
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
    const game = new Game();
    const container = document.getElementById('game-container');
}
