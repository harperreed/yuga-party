import { Game } from '../src/app.js';

describe('Game', () => {
    let game;
    
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
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

    test('should track mistakes', () => {
        game.incrementMistakes();
        expect(game.getMistakes()).toBe(1);
    });

    test('should show error message on incorrect letter', () => {
        document.body.innerHTML += '<div id="message" class="hidden">Try again!</div>';
        const result = checkLetter('X'); // Assuming 'X' is incorrect
        expect(result).toBe(false);
        const message = document.getElementById('message');
        expect(message.classList.contains('hidden')).toBe(false);
    });

    test('should repeat letters with high mistake count', () => {
        // Setup multiple mistakes for letter 'A'
        letterMistakes['A'] = 3;
        currentIndex = 0; // Assuming 'A' is at index 0
        
        // Mock Math.random to return 0.4 (less than 0.5 threshold)
        const mockMath = Object.create(global.Math);
        mockMath.random = () => 0.4;
        global.Math = mockMath;
        
        const nextIndex = getNextLetterIndex();
        expect(nextIndex).toBe(0); // Should repeat the same letter
    });

    test('should load saved game data', () => {
        const savedData = {
            name: 'TestPlayer',
            score: 10,
            stars: 2,
            mistakes: 3
        };
        localStorage.setItem('letterSwipeData', JSON.stringify(savedData));
        
        const loadedData = loadGameData();
        expect(loadedData.name).toBe('TestPlayer');
        expect(loadedData.score).toBe(10);
        expect(loadedData.stars).toBe(2);
        expect(loadedData.mistakes).toBe(3);
    });

    test('should initialize game with saved data', () => {
        const savedData = {
            score: 15,
            stars: 3,
            mistakes: 2
        };
        
        const game = new Game(savedData);
        expect(game.getScore()).toBe(15);
        expect(game.getStars()).toBe(3);
        expect(game.getMistakes()).toBe(2);
    });

    test('should save game data after score increment', () => {
        const game = new Game();
        game.incrementScore();
        
        const savedData = JSON.parse(localStorage.getItem('letterSwipeData'));
        expect(savedData.score).toBe(1);
        expect(savedData.stars).toBe(0);
    });

    test('should level up after completing required rounds', () => {
        // Start at level 1
        expect(getCurrentSubsetSize()).toBe(1);
        
        // Complete first round
        checkLetter(LETTERS_DATA[0][currentLanguage]);
        expect(roundsInLevel).toBe(1);
        
        // Complete second round
        checkLetter(LETTERS_DATA[0][currentLanguage]);
        
        // Should now be at level 2
        expect(getCurrentSubsetSize()).toBe(2);
        expect(roundsInLevel).toBe(0);
    });

    test('should only show letters for current level', () => {
        // At level 1, should only use first letter
        expect(getCurrentSubsetSize()).toBe(1);
        const firstLetter = LETTERS_DATA[0][currentLanguage];
        checkLetter(firstLetter);
        
        // Next letter should still be from level 1
        expect(LETTERS_DATA[currentIndex][currentLanguage]).toBe(firstLetter);
    });
});
