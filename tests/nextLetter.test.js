import { nextLetter } from '../src/app.js';
import { describe, test, expect } from 'vitest';

describe('nextLetter', () => {
    test('returns first letter initially', () => {
        expect(nextLetter()).toBe('A');
    });

    test('cycles through letters in sequence', () => {
        expect(nextLetter()).toBe('A');
        expect(nextLetter()).toBe('B');
        expect(nextLetter()).toBe('C');
    });

    test('wraps back to first letter after last', () => {
        nextLetter(); // A
        nextLetter(); // B
        nextLetter(); // C
        expect(nextLetter()).toBe('A');
    });
});
