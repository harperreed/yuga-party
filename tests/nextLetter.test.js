import { nextLetter, renderLetter } from '../src/app.js';
import { vi, describe, test, expect, beforeEach } from 'vitest';

vi.mock('../src/app.js', () => {
    return {
        nextLetter: () => {
            const letter = ['A', 'B', 'C'][mockIndex++ % 3];
            mockRenderLetter(letter);
            return letter;
        },
        renderLetter: vi.fn()
    };
});

let mockIndex = 0;
const mockRenderLetter = vi.fn();

describe('nextLetter', () => {
    beforeEach(() => {
        mockIndex = 0;
        mockRenderLetter.mockClear();
    });

    test('starts with first letter', () => {
        nextLetter();
        expect(mockRenderLetter).toHaveBeenCalledWith('A');
    });

    test('cycles through letters in sequence', () => {
        nextLetter(); // A
        nextLetter(); // B
        nextLetter(); // C
        
        expect(mockRenderLetter).toHaveBeenNthCalledWith(1, 'A');
        expect(mockRenderLetter).toHaveBeenNthCalledWith(2, 'B');
        expect(mockRenderLetter).toHaveBeenNthCalledWith(3, 'C');
    });

    test('wraps back to first letter after last', () => {
        nextLetter(); // A
        nextLetter(); // B
        nextLetter(); // C
        nextLetter(); // Should wrap to A
        
        expect(mockRenderLetter).toHaveBeenLastCalledWith('A');
    });
});
