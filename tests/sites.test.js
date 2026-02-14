// ABOUTME: Test suite for the site registry and content rendering engine (sites.js).
// ABOUTME: Covers SiteRegistry methods, site schema validation, click target attachment, and the test-site pipeline.

// --- SiteRegistry existence ---

test('SiteRegistry object exists globally', function () {
    assert(typeof SiteRegistry !== 'undefined', 'SiteRegistry should be defined');
});

test('SiteRegistry has a register method', function () {
    assertEqual(typeof SiteRegistry.register, 'function');
});

test('SiteRegistry has a get method', function () {
    assertEqual(typeof SiteRegistry.get, 'function');
});

test('SiteRegistry has a getAll method', function () {
    assertEqual(typeof SiteRegistry.getAll, 'function');
});

test('SiteRegistry has a getByZone method', function () {
    assertEqual(typeof SiteRegistry.getByZone, 'function');
});

test('SiteRegistry has an attachClickTargets method', function () {
    assertEqual(typeof SiteRegistry.attachClickTargets, 'function');
});

// --- register / get ---

test('SiteRegistry.register stores a site retrievable by get', function () {
    SiteRegistry.register({
        id: 'unit-test-site',
        url: 'http://www.unit-test.com',
        title: 'Unit Test Site',
        zone: 1,
        requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },
        render: function () {}
    });
    var site = SiteRegistry.get('unit-test-site');
    assert(site !== null, 'Should retrieve registered site');
    assertEqual(site.id, 'unit-test-site');
    assertEqual(site.title, 'Unit Test Site');
});

test('SiteRegistry.get returns null for unregistered site', function () {
    var site = SiteRegistry.get('absolutely-does-not-exist-xyz');
    assertEqual(site, null);
});

// --- getAll ---

test('SiteRegistry.getAll returns an array', function () {
    var all = SiteRegistry.getAll();
    assert(Array.isArray(all), 'getAll should return an array');
});

test('SiteRegistry.getAll includes registered sites', function () {
    // Register a second distinct site for getAll testing
    SiteRegistry.register({
        id: 'unit-test-site-2',
        url: 'http://www.unit-test-2.com',
        title: 'Unit Test Site 2',
        zone: 2,
        requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },
        render: function () {}
    });
    var all = SiteRegistry.getAll();
    var ids = all.map(function (s) { return s.id; });
    assert(ids.indexOf('unit-test-site') !== -1, 'Should contain unit-test-site');
    assert(ids.indexOf('unit-test-site-2') !== -1, 'Should contain unit-test-site-2');
});

// --- getByZone ---

test('SiteRegistry.getByZone returns only sites in the specified zone', function () {
    var zone1Sites = SiteRegistry.getByZone(1);
    var zone2Sites = SiteRegistry.getByZone(2);
    zone1Sites.forEach(function (s) {
        assertEqual(s.zone, 1);
    });
    zone2Sites.forEach(function (s) {
        assertEqual(s.zone, 2);
    });
});

test('SiteRegistry.getByZone returns empty array for zone with no sites', function () {
    // Zone 99 should have no sites
    var result = SiteRegistry.getByZone(99);
    assert(Array.isArray(result), 'Should return an array');
    assertEqual(result.length, 0);
});

// --- test-site registration (pipeline verification) ---

test('test-site is registered and retrievable', function () {
    var site = SiteRegistry.get('test-site');
    assert(site !== null, 'test-site should be registered');
    assertEqual(site.id, 'test-site');
    assertEqual(site.url, 'http://www.test.com');
    assertEqual(site.title, 'Test Site');
    assertEqual(site.zone, 1);
});

test('test-site has correct requirements', function () {
    var site = SiteRegistry.get('test-site');
    assertEqual(site.requirements.minModem, 0);
    assertEqual(site.requirements.dataCost, 0);
    assertEqual(site.requirements.reputationCost, 0);
});

test('test-site has a render function', function () {
    var site = SiteRegistry.get('test-site');
    assertEqual(typeof site.render, 'function');
});

test('test-site render creates expected DOM content', function () {
    var site = SiteRegistry.get('test-site');
    var container = document.createElement('div');
    site.render(container, Browser);
    var h1 = container.querySelector('h1');
    assert(h1 !== null, 'Should render an h1 element');
    assertEqual(h1.textContent, 'Test Site Works!');
});

test('test-site render adds zone-1 class to container', function () {
    var site = SiteRegistry.get('test-site');
    var container = document.createElement('div');
    site.render(container, Browser);
    assert(container.classList.contains('zone-1'), 'Container should have zone-1 class');
});

test('test-site has clickTargets array', function () {
    var site = SiteRegistry.get('test-site');
    assert(Array.isArray(site.clickTargets), 'clickTargets should be an array');
    assertEqual(site.clickTargets.length, 1);
});

test('test-site clickTarget has correct selector and reward', function () {
    var site = SiteRegistry.get('test-site');
    var target = site.clickTargets[0];
    assertEqual(target.selector, '.test-click-target');
    assertEqual(target.reward.clicks, 5);
});

// --- attachClickTargets ---

test('attachClickTargets adds clickable class to matching elements', function () {
    var site = SiteRegistry.get('test-site');
    var container = document.createElement('div');
    site.render(container, Browser);
    SiteRegistry.attachClickTargets(container, site, Browser);
    var el = container.querySelector('.test-click-target');
    assert(el.classList.contains('clickable'), 'Should have clickable class');
});

test('attachClickTargets wires up click handler that awards reward', function () {
    Browser.init();
    Browser.gameState.clicks = 0;
    var site = SiteRegistry.get('test-site');
    var container = document.createElement('div');
    site.render(container, Browser);
    SiteRegistry.attachClickTargets(container, site, Browser);
    var el = container.querySelector('.test-click-target');
    el.click();
    assertEqual(Browser.gameState.clicks, 5);
});

test('attachClickTargets does nothing when site has no clickTargets', function () {
    var site = {
        id: 'no-clicks-site',
        render: function (c) {
            var p = document.createElement('p');
            p.textContent = 'No clicks here';
            c.appendChild(p);
        }
    };
    var container = document.createElement('div');
    site.render(container, Browser);
    // Should not throw
    SiteRegistry.attachClickTargets(container, site, Browser);
    assertEqual(container.querySelector('.clickable'), null);
});

test('attachClickTargets adds clicked class briefly on click', function () {
    var site = SiteRegistry.get('test-site');
    var container = document.createElement('div');
    site.render(container, Browser);
    SiteRegistry.attachClickTargets(container, site, Browser);
    var el = container.querySelector('.test-click-target');
    el.click();
    assert(el.classList.contains('clicked'), 'Should have clicked class immediately after click');
});

test('attachClickTargets handles navigate action', function () {
    SiteRegistry.register({
        id: 'nav-test-source',
        url: 'http://www.nav-test.com',
        title: 'Nav Test Source',
        zone: 1,
        requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },
        render: function (container) {
            var link = document.createElement('a');
            link.className = 'nav-link';
            link.textContent = 'Go to test site';
            link.href = '#';
            container.appendChild(link);
        },
        clickTargets: [
            { selector: '.nav-link', reward: { clicks: 1 }, action: 'navigate', target: 'test-site' }
        ]
    });
    Browser.init();
    var site = SiteRegistry.get('nav-test-source');
    var container = document.createElement('div');
    site.render(container, Browser);
    SiteRegistry.attachClickTargets(container, site, Browser);
    var link = container.querySelector('.nav-link');
    link.click();
    // After clicking, browser should have navigated to test-site
    assertEqual(Browser.getCurrentSiteId(), 'test-site');
});

// --- Browser integration: _renderSite calls attachClickTargets ---

test('Browser._renderSite attaches click targets after rendering', function () {
    Browser.init();
    Browser.gameState.clicks = 0;
    // Call _renderSite directly to bypass the async loading animation
    var site = SiteRegistry.get('test-site');
    Browser._renderSite(site);
    var content = document.getElementById('page-content');
    var el = content.querySelector('.test-click-target');
    assert(el !== null, 'test-click-target should be rendered');
    assert(el.classList.contains('clickable'), 'Should have clickable class from attachClickTargets');
});
