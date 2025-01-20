import { nextLetter } from '../src/app.js';

test('nextLetter cycles through A, B, C', () => {
    expect(nextLetter()).toBe('A');
    expect(nextLetter()).toBe('B');
    expect(nextLetter()).toBe('C');
    expect(nextLetter()).toBe('A');
});
