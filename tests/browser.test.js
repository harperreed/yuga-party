// ABOUTME: Test suite for the browser navigation controller (browser.js).
// ABOUTME: Covers navigation, history, loading screen, address bar, currency display, bookmarks, and reward handling.

// --- Browser existence ---

test('Browser object exists globally', function () {
    assert(typeof Browser !== 'undefined', 'Browser should be defined');
});

test('Browser has an init method', function () {
    assertEqual(typeof Browser.init, 'function');
});

test('Browser has a navigate method', function () {
    assertEqual(typeof Browser.navigate, 'function');
});

test('Browser has a goBack method', function () {
    assertEqual(typeof Browser.goBack, 'function');
});

test('Browser has a goForward method', function () {
    assertEqual(typeof Browser.goForward, 'function');
});

test('Browser has a refresh method', function () {
    assertEqual(typeof Browser.refresh, 'function');
});

test('Browser has a showLoading method', function () {
    assertEqual(typeof Browser.showLoading, 'function');
});

test('Browser has an updateAddressBar method', function () {
    assertEqual(typeof Browser.updateAddressBar, 'function');
});

test('Browser has an updateCurrencyDisplay method', function () {
    assertEqual(typeof Browser.updateCurrencyDisplay, 'function');
});

test('Browser has an updateBookmarks method', function () {
    assertEqual(typeof Browser.updateBookmarks, 'function');
});

test('Browser has a handleReward method', function () {
    assertEqual(typeof Browser.handleReward, 'function');
});

// --- Initialization ---

test('Browser.init creates a gameState', function () {
    localStorage.removeItem('yugaaaaa-save');
    Browser.init();
    assert(Browser.gameState instanceof GameState, 'gameState should be a GameState instance');
});

test('Browser.init initializes navigation history', function () {
    localStorage.removeItem('yugaaaaa-save');
    Browser.init();
    assert(Array.isArray(Browser._history), 'history should be an array');
    assertEqual(typeof Browser._historyIndex, 'number');
});

// --- Address bar ---

test('updateAddressBar sets url-display innerHTML with protocol span', function () {
    Browser.init();
    Browser.updateAddressBar('http://www.yugaaaaa.com');
    var urlDisplay = document.getElementById('url-display');
    var protocolSpan = urlDisplay.querySelector('.url-protocol');
    assert(protocolSpan !== null, 'Should have a .url-protocol span');
    assertEqual(protocolSpan.textContent, 'http://');
});

test('updateAddressBar displays the full URL text', function () {
    Browser.init();
    Browser.updateAddressBar('http://www.coolsite.com');
    var urlDisplay = document.getElementById('url-display');
    assertEqual(urlDisplay.textContent, 'http://www.coolsite.com');
});

// --- Currency display ---

test('updateCurrencyDisplay shows correct clicks count', function () {
    Browser.init();
    Browser.gameState.clicks = 42;
    Browser.updateCurrencyDisplay();
    var clicksEl = document.getElementById('clicks-count');
    assertEqual(clicksEl.textContent, '42');
});

test('updateCurrencyDisplay shows formatted data', function () {
    Browser.init();
    Browser.gameState.data = 1024;
    Browser.updateCurrencyDisplay();
    var dataEl = document.getElementById('data-count');
    assertEqual(dataEl.textContent, '1.0 MB');
});

test('updateCurrencyDisplay shows reputation', function () {
    Browser.init();
    Browser.gameState.reputation = 7;
    Browser.updateCurrencyDisplay();
    var repEl = document.getElementById('reputation-count');
    assertEqual(repEl.textContent, '7');
});

// --- Handle reward ---

test('handleReward adds clicks to gameState', function () {
    Browser.init();
    Browser.gameState.clicks = 0;
    Browser.handleReward({ clicks: 5 });
    assertEqual(Browser.gameState.clicks, 5);
});

test('handleReward adds data to gameState', function () {
    Browser.init();
    Browser.gameState.data = 0;
    Browser.handleReward({ data: 14.4 });
    assertEqual(Browser.gameState.data, 14.4);
});

test('handleReward adds reputation to gameState', function () {
    Browser.init();
    Browser.gameState.reputation = 0;
    Browser.handleReward({ reputation: 3 });
    assertEqual(Browser.gameState.reputation, 3);
});

test('handleReward handles partial reward (only clicks)', function () {
    Browser.init();
    Browser.gameState.clicks = 10;
    Browser.gameState.data = 5;
    Browser.gameState.reputation = 2;
    Browser.handleReward({ clicks: 3 });
    assertEqual(Browser.gameState.clicks, 13);
    assertEqual(Browser.gameState.data, 5);
    assertEqual(Browser.gameState.reputation, 2);
});

test('handleReward updates currency display', function () {
    Browser.init();
    Browser.gameState.clicks = 0;
    Browser.handleReward({ clicks: 99 });
    var clicksEl = document.getElementById('clicks-count');
    assertEqual(clicksEl.textContent, '99');
});

// --- Navigation to unknown site (no SiteRegistry) ---

test('navigate to unknown site shows "page not found" in content area', function () {
    Browser.init();
    Browser.navigate('nonexistent-site-xyz');
    var content = document.getElementById('page-content');
    assert(content.textContent.indexOf('not found') !== -1 || content.textContent.indexOf('Not Found') !== -1,
        'Should show a not-found message for unknown sites');
});

test('navigate updates history stack', function () {
    Browser.init();
    Browser.navigate('site-a');
    Browser.navigate('site-b');
    assertEqual(Browser._history.length, 3); // starting site + 2 navigations
});

// --- History navigation ---

test('goBack moves historyIndex backward', function () {
    Browser.init();
    Browser.navigate('site-a');
    Browser.navigate('site-b');
    var indexBefore = Browser._historyIndex;
    Browser.goBack();
    assertEqual(Browser._historyIndex, indexBefore - 1);
});

test('goBack at start of history does nothing', function () {
    Browser.init();
    Browser._history = ['only-site'];
    Browser._historyIndex = 0;
    Browser.goBack();
    assertEqual(Browser._historyIndex, 0);
});

test('goForward moves historyIndex forward', function () {
    Browser.init();
    Browser.navigate('site-a');
    Browser.navigate('site-b');
    Browser.goBack();
    var indexBefore = Browser._historyIndex;
    Browser.goForward();
    assertEqual(Browser._historyIndex, indexBefore + 1);
});

test('goForward at end of history does nothing', function () {
    Browser.init();
    Browser.navigate('site-a');
    var indexBefore = Browser._historyIndex;
    Browser.goForward();
    assertEqual(Browser._historyIndex, indexBefore);
});

// --- Loading speed based on modem level ---

test('getLoadDuration returns 3000 for modem level 0', function () {
    Browser.init();
    Browser.gameState.modemLevel = 0;
    assertEqual(Browser.getLoadDuration(), 3000);
});

test('getLoadDuration returns 2000 for modem level 1', function () {
    Browser.init();
    Browser.gameState.modemLevel = 1;
    assertEqual(Browser.getLoadDuration(), 2000);
});

test('getLoadDuration returns 1200 for modem level 2', function () {
    Browser.init();
    Browser.gameState.modemLevel = 2;
    assertEqual(Browser.getLoadDuration(), 1200);
});

test('getLoadDuration returns 500 for modem level 3', function () {
    Browser.init();
    Browser.gameState.modemLevel = 3;
    assertEqual(Browser.getLoadDuration(), 500);
});

test('getLoadDuration returns 200 for modem level 4', function () {
    Browser.init();
    Browser.gameState.modemLevel = 4;
    assertEqual(Browser.getLoadDuration(), 200);
});

// --- Bookmarks ---

test('updateBookmarks adds .has-bookmarks class when bookmarks exist', function () {
    Browser.init();
    Browser.gameState.discoverSite('test-site');
    Browser.updateBookmarks();
    var bar = document.getElementById('bookmarks-bar');
    assert(bar.classList.contains('has-bookmarks'), 'Should have .has-bookmarks class');
});

test('updateBookmarks removes .has-bookmarks class when no bookmarks', function () {
    Browser.init();
    // Clear bookmarks manually (init discovers 'yugaaaaa' during navigate)
    Browser.gameState.bookmarks = [];
    Browser.updateBookmarks();
    var bar = document.getElementById('bookmarks-bar');
    assertEqual(bar.classList.contains('has-bookmarks'), false);
});

test('updateBookmarks creates clickable bookmark items', function () {
    Browser.init();
    // init discovers 'yugaaaaa', so start from a known clean slate
    Browser.gameState.bookmarks = [];
    Browser.gameState.discoverSite('site-alpha');
    Browser.gameState.discoverSite('site-beta');
    Browser.updateBookmarks();
    var items = document.getElementById('bookmarks-bar').querySelectorAll('.bookmark-item');
    assertEqual(items.length, 2);
});

// --- Refresh ---

test('refresh re-renders current site content', function () {
    Browser.init();
    // Navigate to a dummy site first
    Browser.navigate('test-site');
    var contentBefore = document.getElementById('page-content').innerHTML;
    Browser.refresh();
    // After refresh, content should still be present (re-rendered)
    var contentAfter = document.getElementById('page-content').innerHTML;
    assert(contentAfter.length > 0, 'Content should be present after refresh');
});

// --- getCurrentSiteId ---

test('getCurrentSiteId returns the current site id', function () {
    Browser.init();
    Browser.navigate('some-site');
    assertEqual(Browser.getCurrentSiteId(), 'some-site');
});
