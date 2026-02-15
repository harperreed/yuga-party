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

    // Upgrade state
    this.modemLevel = 0;
    this.monitorLevel = 0;
    this.tabsUnlocked = false;
    this.searchUnlocked = false;
    this.bookmarks = [];
    this.reachedEnd = false;
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

// --- Modem Upgrades ---

var MODEM_NAMES = ['14.4k', '28.8k', '56k', 'DSL', 'Cable'];
var MODEM_COSTS = [100, 500, 2000, 10000];

GameState.prototype.getModemLevel = function () {
    return this.modemLevel;
};

GameState.prototype.getModemName = function () {
    return MODEM_NAMES[this.modemLevel];
};

/**
 * Attempt to upgrade the modem to the next tier.
 * Returns true if successful, false if already at max or can't afford.
 */
GameState.prototype.upgradeModem = function () {
    if (this.modemLevel >= MODEM_NAMES.length - 1) {
        return false;
    }
    var cost = MODEM_COSTS[this.modemLevel];
    if (!this.spendClicks(cost)) {
        return false;
    }
    this.modemLevel++;
    return true;
};

// --- Monitor Upgrades ---

var MONITOR_COSTS = [200, 1000, 5000];
var MONITOR_MAX = 3;

GameState.prototype.getMonitorLevel = function () {
    return this.monitorLevel;
};

/**
 * Attempt to upgrade the monitor to the next level.
 * Returns true if successful, false if already at max or can't afford.
 */
GameState.prototype.upgradeMonitor = function () {
    if (this.monitorLevel >= MONITOR_MAX) {
        return false;
    }
    var cost = MONITOR_COSTS[this.monitorLevel];
    if (!this.spendClicks(cost)) {
        return false;
    }
    this.monitorLevel++;
    return true;
};

// --- Feature Unlocks ---

var TABS_COST = 1500;
var SEARCH_COST = 3000;

GameState.prototype.hasTabsUnlocked = function () {
    return this.tabsUnlocked;
};

/**
 * Unlock browser tabs. Returns true on success, false if already
 * unlocked or can't afford.
 */
GameState.prototype.unlockTabs = function () {
    if (this.tabsUnlocked) {
        return false;
    }
    if (!this.spendClicks(TABS_COST)) {
        return false;
    }
    this.tabsUnlocked = true;
    return true;
};

GameState.prototype.hasSearchUnlocked = function () {
    return this.searchUnlocked;
};

/**
 * Unlock the search engine. Returns true on success, false if already
 * unlocked or can't afford.
 */
GameState.prototype.unlockSearch = function () {
    if (this.searchUnlocked) {
        return false;
    }
    if (!this.spendClicks(SEARCH_COST)) {
        return false;
    }
    this.searchUnlocked = true;
    return true;
};

// --- Site Access ---

/**
 * Check whether the player meets the requirements to visit a site.
 * Requirements object shape: { minModem, dataCost, reputationCost }
 * Does NOT spend resources — only checks availability.
 */
GameState.prototype.canAccessSite = function (reqs) {
    if (this.modemLevel < reqs.minModem) {
        return false;
    }
    if (this.data < reqs.dataCost) {
        return false;
    }
    if (this.reputation < reqs.reputationCost) {
        return false;
    }
    return true;
};

// --- Bookmarks / Discovery ---

GameState.prototype.getBookmarks = function () {
    return this.bookmarks.slice();
};

GameState.prototype.discoverSite = function (id) {
    if (this.bookmarks.indexOf(id) === -1) {
        this.bookmarks.push(id);
    }
};

GameState.prototype.isSiteDiscovered = function (id) {
    return this.bookmarks.indexOf(id) !== -1;
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
        reputation: this.reputation,
        modemLevel: this.modemLevel,
        monitorLevel: this.monitorLevel,
        tabsUnlocked: this.tabsUnlocked,
        searchUnlocked: this.searchUnlocked,
        bookmarks: this.bookmarks.slice(),
        reachedEnd: this.reachedEnd
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
        gs.modemLevel = parsed.modemLevel || 0;
        gs.monitorLevel = parsed.monitorLevel || 0;
        gs.tabsUnlocked = parsed.tabsUnlocked || false;
        gs.searchUnlocked = parsed.searchUnlocked || false;
        gs.bookmarks = parsed.bookmarks || [];
        gs.reachedEnd = parsed.reachedEnd || false;
    } catch (e) {
        // Corrupt save data — return fresh state
    }
    return gs;
};
