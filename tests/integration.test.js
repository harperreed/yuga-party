// ABOUTME: Integration test suite exercising cross-module workflows end-to-end.
// ABOUTME: Covers navigation flows, currency earn/spend cycles, bookmark discovery, save/load round-trips, and site registry validation.

// ============================================================
// Navigation Flow Tests
// ============================================================

test('Integration: fresh GameState can access yugaaaaa.com (zone 1, no requirements)', function () {
    var gs = new GameState();
    var site = SiteRegistry.get('yugaaaaa');
    assert(site !== null, 'yugaaaaa should be registered');
    assertEqual(gs.canAccessSite(site.requirements), true);
});

test('Integration: navigating to a Zone 1 site with dataCost deducts data', function () {
    var gs = new GameState();
    gs.addData(100);
    var site = SiteRegistry.get('hamstertrax');
    assert(site !== null, 'hamstertrax should be registered');
    assert(site.requirements.dataCost > 0, 'hamstertrax should have a data cost');
    var dataBefore = gs.data;
    // Simulate what Browser.navigate does: check access then spend data
    assert(gs.canAccessSite(site.requirements), 'Should be able to access hamstertrax with enough data');
    gs.spendData(site.requirements.dataCost);
    assertEqual(gs.data, dataBefore - site.requirements.dataCost);
});

test('Integration: Zone 2 sites require minModem >= 1 (canAccessSite returns false for fresh state)', function () {
    var gs = new GameState();
    gs.addData(10000);
    gs.addReputation(1000);
    var zone2Sites = SiteRegistry.getByZone(2).filter(function (s) {
        // Exclude test fixture sites registered by other test files
        return s.id.indexOf('unit-test-') !== 0;
    });
    assert(zone2Sites.length > 0, 'Should have Zone 2 sites');
    zone2Sites.forEach(function (site) {
        assertEqual(gs.canAccessSite(site.requirements), false,
            site.id + ' should be inaccessible at modem level 0');
    });
});

test('Integration: after upgrading modem, Zone 2 sites with minModem 1 become accessible', function () {
    var gs = new GameState();
    gs.addClicks(100); // cost of first modem upgrade
    gs.addData(10000);
    gs.addReputation(1000);
    gs.upgradeModem();
    assertEqual(gs.getModemLevel(), 1);

    var theVoid = SiteRegistry.get('the-void');
    assert(theVoid !== null, 'the-void should be registered');
    assertEqual(theVoid.requirements.minModem, 1);
    assertEqual(gs.canAccessSite(theVoid.requirements), true);
});

// ============================================================
// Currency Earn/Spend Cycle Tests
// ============================================================

test('Integration: starting with 0 clicks, cannot buy modem upgrade (costs 100)', function () {
    var gs = new GameState();
    assertEqual(gs.clicks, 0);
    var result = gs.upgradeModem();
    assertEqual(result, false);
    assertEqual(gs.getModemLevel(), 0);
});

test('Integration: after adding 100 clicks, can upgrade modem and modemLevel is 1', function () {
    var gs = new GameState();
    gs.addClicks(100);
    var result = gs.upgradeModem();
    assertEqual(result, true);
    assertEqual(gs.getModemLevel(), 1);
    assertEqual(gs.clicks, 0);
});

test('Integration: handleReward with negative clicks clamps to zero', function () {
    Browser.init();
    Browser.gameState.clicks = 50;
    Browser.handleReward({ clicks: -100 });
    assert(Browser.gameState.clicks >= 0, 'Clicks should not go below zero');
    assertEqual(Browser.gameState.clicks, 0);
});

test('Integration: handleReward with negative data clamps to zero', function () {
    Browser.init();
    Browser.gameState.data = 10;
    Browser.handleReward({ data: -50 });
    assert(Browser.gameState.data >= 0, 'Data should not go below zero');
    assertEqual(Browser.gameState.data, 0);
});

test('Integration: handleReward with negative reputation clamps to zero', function () {
    Browser.init();
    Browser.gameState.reputation = 5;
    Browser.handleReward({ reputation: -20 });
    assert(Browser.gameState.reputation >= 0, 'Reputation should not go below zero');
    assertEqual(Browser.gameState.reputation, 0);
});

// ============================================================
// Bookmark Discovery Tests
// ============================================================

test('Integration: fresh state has no bookmarks', function () {
    var gs = new GameState();
    assertDeepEqual(gs.getBookmarks(), []);
});

test('Integration: after discovering a site, it appears in bookmarks', function () {
    var gs = new GameState();
    gs.discoverSite('hamstertrax');
    var bookmarks = gs.getBookmarks();
    assert(bookmarks.indexOf('hamstertrax') !== -1, 'hamstertrax should be in bookmarks');
});

test('Integration: discovering same site twice does not duplicate', function () {
    var gs = new GameState();
    gs.discoverSite('hamstertrax');
    gs.discoverSite('hamstertrax');
    var bookmarks = gs.getBookmarks();
    var count = bookmarks.filter(function (b) { return b === 'hamstertrax'; }).length;
    assertEqual(count, 1);
});

test('Integration: Browser.navigate discovers the site automatically', function () {
    Browser.init();
    Browser.gameState.bookmarks = [];
    Browser.navigate('test-site');
    assert(Browser.gameState.isSiteDiscovered('test-site'), 'test-site should be discovered after navigation');
});

// ============================================================
// Save/Load Round-Trip with Complex State
// ============================================================

test('Integration: save/load round-trip preserves complex state', function () {
    localStorage.removeItem('yugaaaaa-save');

    var gs = new GameState();
    // Build up a complex state
    gs.addClicks(50000);
    gs.addData(2048);
    gs.addReputation(200);

    // Upgrade modem twice
    gs.upgradeModem(); // costs 100 clicks
    gs.upgradeModem(); // costs 500 clicks

    // Upgrade monitor once
    gs.upgradeMonitor(); // costs 200 clicks

    // Unlock tabs and search
    gs.unlockTabs();     // costs 1500 clicks
    gs.unlockSearch();   // costs 3000 clicks

    // Discover 3 sites
    gs.discoverSite('hamstertrax');
    gs.discoverSite('coolguyz');
    gs.discoverSite('recipez4u');

    // Record expected values after all operations
    var expectedClicks = gs.clicks;
    var expectedData = gs.data;
    var expectedReputation = gs.reputation;

    gs.save();

    // Load into a brand new GameState
    var loaded = GameState.load();

    assertEqual(loaded.clicks, expectedClicks);
    assertEqual(loaded.data, expectedData);
    assertEqual(loaded.reputation, expectedReputation);
    assertEqual(loaded.getModemLevel(), 2);
    assertEqual(loaded.getMonitorLevel(), 1);
    assertEqual(loaded.hasTabsUnlocked(), true);
    assertEqual(loaded.hasSearchUnlocked(), true);
    assertDeepEqual(loaded.getBookmarks(), ['hamstertrax', 'coolguyz', 'recipez4u']);
    assertEqual(loaded.isSiteDiscovered('hamstertrax'), true);
    assertEqual(loaded.isSiteDiscovered('coolguyz'), true);
    assertEqual(loaded.isSiteDiscovered('recipez4u'), true);
    assertEqual(loaded.isSiteDiscovered('the-void'), false);

    // Verify the loaded instance still has working methods
    loaded.addClicks(1);
    assertEqual(loaded.clicks, expectedClicks + 1);

    localStorage.removeItem('yugaaaaa-save');
});

test('Integration: save/load preserves reachedEnd flag', function () {
    localStorage.removeItem('yugaaaaa-save');

    var gs = new GameState();
    gs.reachedEnd = true;
    gs.save();

    var loaded = GameState.load();
    assertEqual(loaded.reachedEnd, true);

    localStorage.removeItem('yugaaaaa-save');
});

// ============================================================
// Site Registry Validation Tests
// ============================================================

test('Integration: all expected site IDs are registered', function () {
    var expectedIds = [
        'test-site', 'yugaaaaa',
        'hamstertrax', 'coolguyz', 'recipez4u',
        'webring', 'totallyrealfacts', 'freesmileyz', 'mega-deals-warehouse',
        'the-void', 'infinite-guestbook', 'ask-the-orb', 'timecube',
        'under-construction-forever', 'grandma-dot-com',
        'found-footage', '404-club', 'last-visitor-1997', 'mirror-mirror',
        'the-end-of-the-internet'
    ];
    expectedIds.forEach(function (id) {
        var site = SiteRegistry.get(id);
        assert(site !== null, 'Site "' + id + '" should be registered');
    });
});

test('Integration: all Zone 1 sites have minModem 0', function () {
    var zone1Sites = SiteRegistry.getByZone(1);
    assert(zone1Sites.length > 0, 'Should have Zone 1 sites');
    zone1Sites.forEach(function (site) {
        assertEqual(site.requirements.minModem, 0,
            site.id + ' should have minModem 0');
    });
});

test('Integration: all Zone 2 sites have minModem >= 1', function () {
    var zone2Sites = SiteRegistry.getByZone(2).filter(function (s) {
        // Exclude test fixture sites registered by other test files
        return s.id.indexOf('unit-test-') !== 0;
    });
    assert(zone2Sites.length > 0, 'Should have Zone 2 sites');
    zone2Sites.forEach(function (site) {
        assert(site.requirements.minModem >= 1,
            site.id + ' should have minModem >= 1, got ' + site.requirements.minModem);
    });
});

test('Integration: all Zone 3 sites have minModem >= 3', function () {
    var zone3Sites = SiteRegistry.getByZone(3);
    assert(zone3Sites.length > 0, 'Should have Zone 3 sites');
    zone3Sites.forEach(function (site) {
        assert(site.requirements.minModem >= 3,
            site.id + ' should have minModem >= 3, got ' + site.requirements.minModem);
    });
});

test('Integration: no site has negative dataCost', function () {
    var allSites = SiteRegistry.getAll();
    allSites.forEach(function (site) {
        if (site.requirements) {
            assert(site.requirements.dataCost >= 0,
                site.id + ' has negative dataCost: ' + site.requirements.dataCost);
        }
    });
});

test('Integration: every site has a render function', function () {
    var allSites = SiteRegistry.getAll();
    allSites.forEach(function (site) {
        assertEqual(typeof site.render, 'function',
            site.id + ' should have a render function');
    });
});

test('Integration: site count is >= 20', function () {
    var allSites = SiteRegistry.getAll();
    assert(allSites.length >= 20,
        'Should have at least 20 sites, got ' + allSites.length);
});

test('Integration: every site has a url, title, and zone', function () {
    var allSites = SiteRegistry.getAll();
    allSites.forEach(function (site) {
        assert(typeof site.url === 'string' && site.url.length > 0,
            site.id + ' should have a non-empty url');
        assert(typeof site.title === 'string' && site.title.length > 0,
            site.id + ' should have a non-empty title');
        assert(typeof site.zone === 'number' && site.zone >= 1 && site.zone <= 3,
            site.id + ' should have a valid zone (1-3), got ' + site.zone);
    });
});

test('Integration: every site has requirements with minModem, dataCost, reputationCost', function () {
    var allSites = SiteRegistry.getAll();
    allSites.forEach(function (site) {
        assert(site.requirements !== undefined,
            site.id + ' should have requirements');
        assert(typeof site.requirements.minModem === 'number',
            site.id + ' should have numeric minModem');
        assert(typeof site.requirements.dataCost === 'number',
            site.id + ' should have numeric dataCost');
        assert(typeof site.requirements.reputationCost === 'number',
            site.id + ' should have numeric reputationCost');
    });
});

// ============================================================
// Cross-Module Wiring Tests
// ============================================================

test('Integration: Browser.init starts on yugaaaaa', function () {
    localStorage.removeItem('yugaaaaa-save');
    Browser.init();
    assertEqual(Browser.getCurrentSiteId(), 'yugaaaaa');
});

test('Integration: Browser.getLoadDuration matches LOAD_DURATIONS for each modem level', function () {
    Browser.init();
    var expectedDurations = [3000, 2000, 1200, 500, 200];
    for (var level = 0; level < expectedDurations.length; level++) {
        Browser.gameState.modemLevel = level;
        assertEqual(Browser.getLoadDuration(), expectedDurations[level],
            'Duration mismatch at modem level ' + level);
    }
});

test('Integration: Browser.updateCurrencyDisplay reflects gameState changes', function () {
    Browser.init();
    Browser.gameState.clicks = 1234;
    Browser.gameState.data = 2048;
    Browser.gameState.reputation = 42;
    Browser.updateCurrencyDisplay();

    var clicksEl = document.getElementById('clicks-count');
    var dataEl = document.getElementById('data-count');
    var repEl = document.getElementById('reputation-count');

    assertEqual(clicksEl.textContent, '1234');
    assertEqual(dataEl.textContent, '2.0 MB');
    assertEqual(repEl.textContent, '42');
});
