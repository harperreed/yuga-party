export class Game {
    constructor() {
        this.score = 0;
    }

    getScore() {
        return this.score;
    }
}

// Initialize game
const game = new Game();
const container = document.getElementById('game-container');
