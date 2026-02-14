// ABOUTME: Test suite for the core game engine (game.js).
// ABOUTME: Covers currency system, upgrades, progression, and save/load logic.

// --- Constructor ---

test('GameState constructor initializes with 0 clicks', function () {
    var gs = new GameState();
    assertEqual(gs.clicks, 0);
});

test('GameState constructor initializes with 0 data', function () {
    var gs = new GameState();
    assertEqual(gs.data, 0);
});

test('GameState constructor initializes with 0 reputation', function () {
    var gs = new GameState();
    assertEqual(gs.reputation, 0);
});

// --- addClicks / addData / addReputation ---

test('addClicks increases click count by n', function () {
    var gs = new GameState();
    gs.addClicks(5);
    assertEqual(gs.clicks, 5);
    gs.addClicks(3);
    assertEqual(gs.clicks, 8);
});

test('addData increases data by n (in KB)', function () {
    var gs = new GameState();
    gs.addData(14.4);
    assertEqual(gs.data, 14.4);
    gs.addData(10);
    assertEqual(gs.data, 24.4);
});

test('addReputation increases reputation by n', function () {
    var gs = new GameState();
    gs.addReputation(100);
    assertEqual(gs.reputation, 100);
    gs.addReputation(50);
    assertEqual(gs.reputation, 150);
});

// --- spendClicks ---

test('spendClicks subtracts n clicks when sufficient and returns true', function () {
    var gs = new GameState();
    gs.addClicks(10);
    var result = gs.spendClicks(7);
    assertEqual(result, true);
    assertEqual(gs.clicks, 3);
});

test('spendClicks returns false and does not subtract when insufficient', function () {
    var gs = new GameState();
    gs.addClicks(5);
    var result = gs.spendClicks(10);
    assertEqual(result, false);
    assertEqual(gs.clicks, 5);
});

test('spendClicks handles exact balance', function () {
    var gs = new GameState();
    gs.addClicks(10);
    var result = gs.spendClicks(10);
    assertEqual(result, true);
    assertEqual(gs.clicks, 0);
});

// --- spendData ---

test('spendData subtracts n data when sufficient and returns true', function () {
    var gs = new GameState();
    gs.addData(1024);
    var result = gs.spendData(512);
    assertEqual(result, true);
    assertEqual(gs.data, 512);
});

test('spendData returns false and does not subtract when insufficient', function () {
    var gs = new GameState();
    gs.addData(100);
    var result = gs.spendData(200);
    assertEqual(result, false);
    assertEqual(gs.data, 100);
});

// --- spendReputation ---

test('spendReputation subtracts n reputation when sufficient and returns true', function () {
    var gs = new GameState();
    gs.addReputation(50);
    var result = gs.spendReputation(30);
    assertEqual(result, true);
    assertEqual(gs.reputation, 20);
});

test('spendReputation returns false and does not subtract when insufficient', function () {
    var gs = new GameState();
    gs.addReputation(10);
    var result = gs.spendReputation(20);
    assertEqual(result, false);
    assertEqual(gs.reputation, 10);
});

// --- formatData ---

test('formatData returns "0 KB" for 0', function () {
    assertEqual(GameState.formatData(0), '0 KB');
});

test('formatData returns KB string for values under 1024', function () {
    assertEqual(GameState.formatData(14.4), '14.4 KB');
});

test('formatData returns MB string for 1024 KB', function () {
    assertEqual(GameState.formatData(1024), '1.0 MB');
});

test('formatData returns GB string for 1048576 KB', function () {
    assertEqual(GameState.formatData(1048576), '1.0 GB');
});

test('formatData returns fractional MB correctly', function () {
    assertEqual(GameState.formatData(2560), '2.5 MB');
});

test('formatData returns fractional GB correctly', function () {
    assertEqual(GameState.formatData(1572864), '1.5 GB');
});

// --- save / load ---

test('save serializes state to localStorage key "yugaaaaa-save"', function () {
    localStorage.removeItem('yugaaaaa-save');
    var gs = new GameState();
    gs.addClicks(42);
    gs.addData(256);
    gs.addReputation(7);
    gs.save();
    var raw = localStorage.getItem('yugaaaaa-save');
    assert(raw !== null, 'save should write to localStorage');
    var parsed = JSON.parse(raw);
    assertEqual(parsed.clicks, 42);
    assertEqual(parsed.data, 256);
    assertEqual(parsed.reputation, 7);
    localStorage.removeItem('yugaaaaa-save');
});

test('GameState.load restores state from localStorage', function () {
    localStorage.removeItem('yugaaaaa-save');
    var gs = new GameState();
    gs.addClicks(99);
    gs.addData(512);
    gs.addReputation(33);
    gs.save();
    var loaded = GameState.load();
    assertEqual(loaded.clicks, 99);
    assertEqual(loaded.data, 512);
    assertEqual(loaded.reputation, 33);
    localStorage.removeItem('yugaaaaa-save');
});

test('GameState.load returns fresh GameState when no save data exists', function () {
    localStorage.removeItem('yugaaaaa-save');
    var loaded = GameState.load();
    assertEqual(loaded.clicks, 0);
    assertEqual(loaded.data, 0);
    assertEqual(loaded.reputation, 0);
});

test('Round-trip: create, add currencies, save, load — values match', function () {
    localStorage.removeItem('yugaaaaa-save');
    var gs = new GameState();
    gs.addClicks(1000);
    gs.addData(14.4);
    gs.addReputation(55);
    gs.spendClicks(100);
    gs.spendData(4.4);
    gs.spendReputation(5);
    gs.save();

    var loaded = GameState.load();
    assertEqual(loaded.clicks, 900);
    assertEqual(loaded.data, 10);
    assertEqual(loaded.reputation, 50);

    // loaded instance should also have working methods
    loaded.addClicks(1);
    assertEqual(loaded.clicks, 901);

    localStorage.removeItem('yugaaaaa-save');
});

// --- Modem Upgrades ---

test('getModemLevel returns 0 initially', function () {
    var gs = new GameState();
    assertEqual(gs.getModemLevel(), 0);
});

test('getModemName returns "14.4k" at level 0', function () {
    var gs = new GameState();
    assertEqual(gs.getModemName(), '14.4k');
});

test('getModemName returns correct name for each level', function () {
    var gs = new GameState();
    assertEqual(gs.getModemName(), '14.4k');
    // Manually set levels to test name mapping
    gs.modemLevel = 1;
    assertEqual(gs.getModemName(), '28.8k');
    gs.modemLevel = 2;
    assertEqual(gs.getModemName(), '56k');
    gs.modemLevel = 3;
    assertEqual(gs.getModemName(), 'DSL');
    gs.modemLevel = 4;
    assertEqual(gs.getModemName(), 'Cable');
});

test('upgradeModem spends clicks and advances modem level', function () {
    var gs = new GameState();
    gs.addClicks(100);
    var result = gs.upgradeModem();
    assertEqual(result, true);
    assertEqual(gs.getModemLevel(), 1);
    assertEqual(gs.clicks, 0);
});

test('upgradeModem costs follow exponential curve [100, 500, 2000, 10000]', function () {
    var gs = new GameState();
    // Level 0 -> 1 costs 100
    gs.addClicks(100);
    gs.upgradeModem();
    assertEqual(gs.getModemLevel(), 1);

    // Level 1 -> 2 costs 500
    gs.addClicks(500);
    gs.upgradeModem();
    assertEqual(gs.getModemLevel(), 2);

    // Level 2 -> 3 costs 2000
    gs.addClicks(2000);
    gs.upgradeModem();
    assertEqual(gs.getModemLevel(), 3);

    // Level 3 -> 4 costs 10000
    gs.addClicks(10000);
    gs.upgradeModem();
    assertEqual(gs.getModemLevel(), 4);
});

test('upgradeModem returns false if cannot afford', function () {
    var gs = new GameState();
    gs.addClicks(50); // need 100
    var result = gs.upgradeModem();
    assertEqual(result, false);
    assertEqual(gs.getModemLevel(), 0);
    assertEqual(gs.clicks, 50);
});

test('upgradeModem returns false if already at max level', function () {
    var gs = new GameState();
    gs.modemLevel = 4;
    gs.addClicks(99999);
    var result = gs.upgradeModem();
    assertEqual(result, false);
    assertEqual(gs.getModemLevel(), 4);
});

// --- Monitor Upgrades ---

test('getMonitorLevel returns 0 initially', function () {
    var gs = new GameState();
    assertEqual(gs.getMonitorLevel(), 0);
});

test('upgradeMonitor spends clicks and advances monitor level', function () {
    var gs = new GameState();
    gs.addClicks(200);
    var result = gs.upgradeMonitor();
    assertEqual(result, true);
    assertEqual(gs.getMonitorLevel(), 1);
    assertEqual(gs.clicks, 0);
});

test('upgradeMonitor costs follow curve [200, 1000, 5000]', function () {
    var gs = new GameState();
    // Level 0 -> 1 costs 200
    gs.addClicks(200);
    gs.upgradeMonitor();
    assertEqual(gs.getMonitorLevel(), 1);

    // Level 1 -> 2 costs 1000
    gs.addClicks(1000);
    gs.upgradeMonitor();
    assertEqual(gs.getMonitorLevel(), 2);

    // Level 2 -> 3 costs 5000
    gs.addClicks(5000);
    gs.upgradeMonitor();
    assertEqual(gs.getMonitorLevel(), 3);
});

test('upgradeMonitor returns false if cannot afford', function () {
    var gs = new GameState();
    gs.addClicks(100); // need 200
    var result = gs.upgradeMonitor();
    assertEqual(result, false);
    assertEqual(gs.getMonitorLevel(), 0);
    assertEqual(gs.clicks, 100);
});

test('upgradeMonitor returns false if already at max level', function () {
    var gs = new GameState();
    gs.monitorLevel = 3;
    gs.addClicks(99999);
    var result = gs.upgradeMonitor();
    assertEqual(result, false);
    assertEqual(gs.getMonitorLevel(), 3);
});

// --- Tabs Unlock ---

test('hasTabsUnlocked returns false initially', function () {
    var gs = new GameState();
    assertEqual(gs.hasTabsUnlocked(), false);
});

test('unlockTabs costs 1500 clicks and returns true', function () {
    var gs = new GameState();
    gs.addClicks(1500);
    var result = gs.unlockTabs();
    assertEqual(result, true);
    assertEqual(gs.hasTabsUnlocked(), true);
    assertEqual(gs.clicks, 0);
});

test('unlockTabs returns false if cannot afford', function () {
    var gs = new GameState();
    gs.addClicks(1000);
    var result = gs.unlockTabs();
    assertEqual(result, false);
    assertEqual(gs.hasTabsUnlocked(), false);
    assertEqual(gs.clicks, 1000);
});

test('unlockTabs returns false if already unlocked', function () {
    var gs = new GameState();
    gs.addClicks(3000);
    gs.unlockTabs();
    var result = gs.unlockTabs();
    assertEqual(result, false);
    assertEqual(gs.hasTabsUnlocked(), true);
});

// --- Search Unlock ---

test('hasSearchUnlocked returns false initially', function () {
    var gs = new GameState();
    assertEqual(gs.hasSearchUnlocked(), false);
});

test('unlockSearch costs 3000 clicks and returns true', function () {
    var gs = new GameState();
    gs.addClicks(3000);
    var result = gs.unlockSearch();
    assertEqual(result, true);
    assertEqual(gs.hasSearchUnlocked(), true);
    assertEqual(gs.clicks, 0);
});

test('unlockSearch returns false if cannot afford', function () {
    var gs = new GameState();
    gs.addClicks(2000);
    var result = gs.unlockSearch();
    assertEqual(result, false);
    assertEqual(gs.hasSearchUnlocked(), false);
    assertEqual(gs.clicks, 2000);
});

// --- Site Access ---

test('canAccessSite returns true for zero-requirement site on fresh state', function () {
    var gs = new GameState();
    var reqs = { minModem: 0, dataCost: 0, reputationCost: 0 };
    assertEqual(gs.canAccessSite(reqs), true);
});

test('canAccessSite returns false when modem level is too low', function () {
    var gs = new GameState();
    gs.addData(100);
    var reqs = { minModem: 1, dataCost: 50, reputationCost: 0 };
    assertEqual(gs.canAccessSite(reqs), false);
});

test('canAccessSite returns false when data is insufficient', function () {
    var gs = new GameState();
    gs.modemLevel = 2;
    gs.addData(10);
    var reqs = { minModem: 1, dataCost: 50, reputationCost: 0 };
    assertEqual(gs.canAccessSite(reqs), false);
});

test('canAccessSite returns false when reputation is insufficient', function () {
    var gs = new GameState();
    gs.modemLevel = 2;
    gs.addData(100);
    gs.addReputation(5);
    var reqs = { minModem: 1, dataCost: 50, reputationCost: 10 };
    assertEqual(gs.canAccessSite(reqs), false);
});

test('canAccessSite returns true when all requirements are met', function () {
    var gs = new GameState();
    gs.modemLevel = 2;
    gs.addData(100);
    gs.addReputation(20);
    var reqs = { minModem: 1, dataCost: 50, reputationCost: 10 };
    assertEqual(gs.canAccessSite(reqs), true);
});

// --- Bookmarks / Discovery ---

test('getBookmarks returns empty array initially', function () {
    var gs = new GameState();
    assertDeepEqual(gs.getBookmarks(), []);
});

test('discoverSite adds site to bookmarks', function () {
    var gs = new GameState();
    gs.discoverSite('geocities');
    assertDeepEqual(gs.getBookmarks(), ['geocities']);
});

test('discoverSite does not add duplicate', function () {
    var gs = new GameState();
    gs.discoverSite('geocities');
    gs.discoverSite('geocities');
    assertDeepEqual(gs.getBookmarks(), ['geocities']);
});

test('discoverSite adds multiple distinct sites', function () {
    var gs = new GameState();
    gs.discoverSite('geocities');
    gs.discoverSite('angelfire');
    assertDeepEqual(gs.getBookmarks(), ['geocities', 'angelfire']);
});

test('isSiteDiscovered returns true for discovered site', function () {
    var gs = new GameState();
    gs.discoverSite('geocities');
    assertEqual(gs.isSiteDiscovered('geocities'), true);
});

test('isSiteDiscovered returns false for undiscovered site', function () {
    var gs = new GameState();
    assertEqual(gs.isSiteDiscovered('geocities'), false);
});

// --- Save/Load round-trip with upgrade state ---

test('Save/Load preserves upgrade state (modem, monitor, tabs, search, bookmarks)', function () {
    localStorage.removeItem('yugaaaaa-save');
    var gs = new GameState();
    gs.addClicks(50000);

    // Upgrade modem twice
    gs.upgradeModem();
    gs.upgradeModem();

    // Upgrade monitor once
    gs.upgradeMonitor();

    // Unlock tabs and search
    gs.unlockTabs();
    gs.unlockSearch();

    // Discover some sites
    gs.discoverSite('geocities');
    gs.discoverSite('angelfire');

    gs.save();
    var loaded = GameState.load();

    assertEqual(loaded.getModemLevel(), 2);
    assertEqual(loaded.getMonitorLevel(), 1);
    assertEqual(loaded.hasTabsUnlocked(), true);
    assertEqual(loaded.hasSearchUnlocked(), true);
    assertDeepEqual(loaded.getBookmarks(), ['geocities', 'angelfire']);
    assertEqual(loaded.isSiteDiscovered('geocities'), true);
    assertEqual(loaded.isSiteDiscovered('neopets'), false);

    localStorage.removeItem('yugaaaaa-save');
});
