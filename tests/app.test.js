import { Game } from '../src/app.js';

describe('Game', () => {
    let game;

    beforeEach(() => {
        game = new Game();
        // Mock DOM elements
        document.body.innerHTML = `
            <div id="score">Score: 0</div>
            <div id="stars">
                <span class="opacity-30"></span>
                <span class="opacity-30"></span>
                <span class="opacity-30"></span>
                <span class="opacity-30"></span>
                <span class="opacity-30"></span>
            </div>
            <div id="badge" class="hidden"></div>
        `;
    });

    test('initial score and stars should be 0', () => {
        expect(game.getScore()).toBe(0);
        expect(game.getStars()).toBe(0);
    });

    test('incrementScore should increase score by 1', () => {
        game.incrementScore();
        expect(game.getScore()).toBe(1);
    });

    test('should earn a star every 5 points', () => {
        for (let i = 0; i < 5; i++) {
            game.incrementScore();
        }
        expect(game.getStars()).toBe(1);
    });

    test('should show badge at 25 points with 5 stars', () => {
        for (let i = 0; i < 25; i++) {
            game.incrementScore();
        }
        expect(game.getStars()).toBe(5);
        const badge = document.getElementById('badge');
        expect(badge.classList.contains('hidden')).toBe(false);
    });
});
