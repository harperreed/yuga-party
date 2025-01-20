import { renderLetter } from '../src/app.js';
import '@testing-library/jest-dom';

describe('renderLetter', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="card"></div>';
    });
    test('renders single uppercase letter', () => {
        renderLetter('B');
        const cardElement = document.getElementById('card');
        expect(cardElement).toHaveTextContent('B');
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
