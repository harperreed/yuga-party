import { Game } from '../src/app.js';

describe('Game', () => {
    test('initial score should be 0', () => {
        const game = new Game();
        expect(game.getScore()).toBe(0);
    });
});
