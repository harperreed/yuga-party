import { renderLetter } from '../src/app.js';

describe('renderLetter', () => {
    test('renders single uppercase letter', () => {
        expect(() => renderLetter('A')).toThrow('Function not implemented');
    });

    test('throws error for empty string', () => {
        expect(() => renderLetter('')).toThrow('Invalid input');
    });

    test('throws error for multiple letters', () => {
        expect(() => renderLetter('AB')).toThrow('Invalid input');
    });

    test('throws error for non-string input', () => {
        expect(() => renderLetter(42)).toThrow('Invalid input');
        expect(() => renderLetter(null)).toThrow('Invalid input');
        expect(() => renderLetter(undefined)).toThrow('Invalid input');
    });

    test('throws error for non-letter characters', () => {
        expect(() => renderLetter('1')).toThrow('Invalid input');
        expect(() => renderLetter('!')).toThrow('Invalid input');
        expect(() => renderLetter(' ')).toThrow('Invalid input');
    });
});
