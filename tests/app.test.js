import { Game } from '../src/app.js';

describe('Game', () => {
    let game;

    beforeEach(() => {
        game = new Game();
        // Mock DOM elements
        document.body.innerHTML = `
            <div id="score">Score: 0</div>
        `;
    });

    test('initial score should be 0', () => {
        expect(game.getScore()).toBe(0);
    });

    test('incrementScore should increase score by 1', () => {
        game.incrementScore();
        expect(game.getScore()).toBe(1);
    });

    test('score display should update when score increases', () => {
        game.incrementScore();
        const scoreElement = document.getElementById('score');
        expect(scoreElement.textContent).toBe('Score: 1');
    });
});
