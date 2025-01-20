import { nextLetter, renderLetter } from '../src/app.js';
import { vi, describe, test, expect, beforeEach } from 'vitest';

describe('nextLetter', () => {
    const renderLetterSpy = vi.spyOn({ renderLetter }, 'renderLetter');

    beforeEach(() => {
        renderLetterSpy.mockClear();
    });

    test('starts with first letter', () => {
        nextLetter();
        expect(renderLetterSpy).toHaveBeenCalledWith('A');
    });

    test('cycles through letters in sequence', () => {
        nextLetter(); // A
        nextLetter(); // B
        nextLetter(); // C
        
        expect(renderLetterSpy).toHaveBeenNthCalledWith(1, 'A');
        expect(renderLetterSpy).toHaveBeenNthCalledWith(2, 'B');
        expect(renderLetterSpy).toHaveBeenNthCalledWith(3, 'C');
    });

    test('wraps back to first letter after last', () => {
        nextLetter(); // A
        nextLetter(); // B
        nextLetter(); // C
        nextLetter(); // Should wrap to A
        
        expect(renderLetterSpy).toHaveBeenLastCalledWith('A');
    });
});
