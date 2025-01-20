export class GameState {
    constructor() {
        this.currentIndex = -1;
        this.currentLanguage = 'en';
        this.audioEnabled = true;
        this.currentLevel = 1;
        this.roundsInLevel = 0;
        this.currentProgress = 0;
        this.letterMistakes = {};
        this.playerName = '';
        this.toddlerMode = true;
        this.timedMode = false;
        this.timeLeft = 10;
        this.observers = new Set();
    }

    subscribe(callback) {
        this.observers.add(callback);
        return () => this.observers.delete(callback);
    }

    notify(property, value) {
        this.observers.forEach(callback => callback(property, value));
    }

    setCurrentIndex(value) {
        this.currentIndex = value;
        this.notify('currentIndex', value);
    }

    setCurrentLanguage(value) {
        this.currentLanguage = value;
        this.notify('currentLanguage', value);
    }

    setAudioEnabled(value) {
        this.audioEnabled = value;
        this.notify('audioEnabled', value);
    }

    setCurrentLevel(value) {
        this.currentLevel = value;
        this.notify('currentLevel', value);
    }

    setRoundsInLevel(value) {
        this.roundsInLevel = value;
        this.notify('roundsInLevel', value);
    }

    setCurrentProgress(value) {
        this.currentProgress = value;
        this.notify('currentProgress', value);
    }

    addLetterMistake(letter) {
        this.letterMistakes[letter] = (this.letterMistakes[letter] || 0) + 1;
        this.notify('letterMistakes', this.letterMistakes);
    }

    setPlayerName(value) {
        this.playerName = value;
        this.notify('playerName', value);
    }

    setToddlerMode(value) {
        this.toddlerMode = value;
        this.notify('toddlerMode', value);
    }

    setTimedMode(value) {
        this.timedMode = value;
        this.notify('timedMode', value);
    }

    setTimeLeft(value) {
        this.timeLeft = value;
        this.notify('timeLeft', value);
    }
}
