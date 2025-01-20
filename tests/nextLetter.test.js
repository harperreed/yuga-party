import { nextLetter, renderLetter } from '../src/app.js';

jest.mock('../src/app.js', () => ({
    ...jest.requireActual('../src/app.js'),
    renderLetter: jest.fn()
}));

describe('nextLetter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
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
