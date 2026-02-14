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
