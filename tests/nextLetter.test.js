import { nextLetter, renderLetter } from '../src/app.js';
import { vi, describe, test, expect, beforeEach } from 'vitest';

vi.mock('../src/app.js', () => ({
    renderLetter: vi.fn(),
    nextLetter: vi.importActual('../src/app.js').nextLetter
}));

describe('nextLetter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('starts with first letter', () => {
        nextLetter();
        expect(renderLetter).toHaveBeenCalledWith('A');
    });

    test('cycles through letters in sequence', () => {
        nextLetter(); // A
        nextLetter(); // B
        nextLetter(); // C
        
        expect(renderLetter).toHaveBeenNthCalledWith(1, 'A');
        expect(renderLetter).toHaveBeenNthCalledWith(2, 'B');
        expect(renderLetter).toHaveBeenNthCalledWith(3, 'C');
    });

    test('wraps back to first letter after last', () => {
        nextLetter(); // A
        nextLetter(); // B
        nextLetter(); // C
        nextLetter(); // Should wrap to A
        
        expect(renderLetter).toHaveBeenLastCalledWith('A');
    });
});
