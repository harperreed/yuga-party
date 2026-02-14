// ABOUTME: Core game engine managing state, currencies, upgrades, and save/load logic.
// ABOUTME: Pure logic module with no DOM interaction — all state manipulation happens here.

var SAVE_KEY = 'yugaaaaa-save';

/**
 * GameState holds all player currencies and provides methods to
 * manipulate them, serialize to localStorage, and deserialize back.
 */
function GameState() {
    this.clicks = 0;
    this.data = 0;       // stored in KB
    this.reputation = 0;
}

// --- Currency adders ---

GameState.prototype.addClicks = function (n) {
    this.clicks += n;
};

GameState.prototype.addData = function (n) {
    this.data += n;
};

GameState.prototype.addReputation = function (n) {
    this.reputation += n;
};

// --- Currency spenders (return true on success, false if insufficient) ---

GameState.prototype.spendClicks = function (n) {
    if (this.clicks < n) {
        return false;
    }
    this.clicks -= n;
    return true;
};

GameState.prototype.spendData = function (n) {
    if (this.data < n) {
        return false;
    }
    this.data -= n;
    return true;
};

GameState.prototype.spendReputation = function (n) {
    if (this.reputation < n) {
        return false;
    }
    this.reputation -= n;
    return true;
};

// --- Formatting ---

/**
 * Convert a KB value to a human-readable string.
 * Examples: 0 -> "0 KB", 14.4 -> "14.4 KB", 1024 -> "1.0 MB", 1048576 -> "1.0 GB"
 */
GameState.formatData = function (kb) {
    var GB = 1048576; // 1024 * 1024
    var MB = 1024;

    if (kb >= GB) {
        return (kb / GB).toFixed(1) + ' GB';
    }
    if (kb >= MB) {
        return (kb / MB).toFixed(1) + ' MB';
    }
    // For KB, show the raw number without unnecessary trailing decimals
    // but preserve meaningful decimals (e.g. 14.4)
    if (kb === Math.floor(kb)) {
        return kb + ' KB';
    }
    return kb + ' KB';
};

// --- Persistence ---

GameState.prototype.save = function () {
    var payload = {
        clicks: this.clicks,
        data: this.data,
        reputation: this.reputation
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
};

/**
 * Load a GameState from localStorage. Returns a fresh GameState if
 * no save data exists or if the data is corrupt.
 */
GameState.load = function () {
    var gs = new GameState();
    var raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
        return gs;
    }
    try {
        var parsed = JSON.parse(raw);
        gs.clicks = parsed.clicks || 0;
        gs.data = parsed.data || 0;
        gs.reputation = parsed.reputation || 0;
    } catch (e) {
        // Corrupt save data — return fresh state
    }
    return gs;
};
