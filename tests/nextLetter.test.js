import { nextLetter } from '../src/app.js';
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock the entire module
vi.mock('../src/app.js', async () => {
    const actual = await vi.importActual('../src/app.js');
    return {
        ...actual,
        renderLetter: vi.fn()
    };
});

describe('nextLetter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('starts with first letter', () => {
        nextLetter();
        expect(vi.mocked(renderLetter)).toHaveBeenCalledWith('A');
    });

    test('cycles through letters in sequence', () => {
        nextLetter(); // A
        nextLetter(); // B
        nextLetter(); // C
        
        const mock = vi.mocked(renderLetter);
        expect(mock).toHaveBeenNthCalledWith(1, 'A');
        expect(mock).toHaveBeenNthCalledWith(2, 'B');
        expect(mock).toHaveBeenNthCalledWith(3, 'C');
    });

    test('wraps back to first letter after last', () => {
        nextLetter(); // A
        nextLetter(); // B
        nextLetter(); // C
        nextLetter(); // Should wrap to A
        
        const mock = vi.mocked(renderLetter);
        expect(mock).toHaveBeenLastCalledWith('A');
    });
});
