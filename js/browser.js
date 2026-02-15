// ABOUTME: Fake browser navigation controller handling tabs, address bar, history, and page rendering.
// ABOUTME: Bridges the Chrome shell UI with the site registry and game state.

/**
 * Loading durations (ms) indexed by modem level.
 * Level 0 = 14.4k, Level 1 = 28.8k, Level 2 = 56k, Level 3 = DSL, Level 4 = Cable
 */
var LOAD_DURATIONS = [3000, 2000, 1200, 500, 200];

/**
 * Loading screen text sequence shown during navigation.
 * Displayed in order over the loading duration.
 */
var LOADING_MESSAGES = [
    'Dialing...',
    'Connecting at {modemSpeed}...',
    'Verifying username and password...',
    'Connected!'
];

/**
 * Monitor level display names, indexed by level.
 */
var MONITOR_NAMES = ['12-inch CRT', '15-inch CRT', '17-inch CRT', '21-inch Flatscreen'];

/**
 * Maximum number of tabs a player can have open simultaneously.
 */
var MAX_TABS = 5;

/**
 * Browser is the main controller for the fake browser chrome.
 * It manages navigation, history, loading animations, address bar,
 * currency display, bookmarks, tabs, upgrade shop, and wiring up
 * UI event listeners.
 */
var Browser = {
    /** @type {GameState} */
    gameState: null,

    /** @type {string[]} Navigation history stack of site IDs */
    _history: [],

    /** @type {number} Current position in the history stack */
    _historyIndex: -1,

    /** @type {string|null} The site ID currently displayed */
    _currentSiteId: null,

    /** @type {number|null} Auto-save interval handle */
    _saveInterval: null,

    /** @type {boolean} Whether a loading animation is in progress */
    _isLoading: false,

    /** @type {boolean} Whether the upgrade shop overlay is currently visible */
    _shopOpen: false,

    /**
     * Tab state. Each element: { id, siteId, history, historyIndex }
     * @type {Array}
     */
    _tabs: [],

    /** @type {number} Index of the currently active tab */
    _activeTabIndex: 0,

    /** @type {number} Auto-incrementing tab ID counter */
    _nextTabId: 1,

    /**
     * Initialize the browser: load or create game state, wire up
     * event listeners, navigate to the starting site, and start auto-save.
     */
    init: function () {
        // Clear any previous auto-save interval
        if (this._saveInterval) {
            clearInterval(this._saveInterval);
            this._saveInterval = null;
        }

        // Load or create game state
        this.gameState = GameState.load();

        // Reset navigation state
        this._history = [];
        this._historyIndex = -1;
        this._currentSiteId = null;
        this._isLoading = false;
        this._shopOpen = false;

        // Initialize tab system
        this._tabs = [];
        this._activeTabIndex = 0;
        this._nextTabId = 1;

        // Wire up nav button event listeners
        this._bindNavButtons();

        // Wire up the settings (shop) button
        this._bindSettingsButton();

        // Apply persisted upgrades (monitor level, tabs, search)
        this._applyUpgrades();

        // Create the initial tab
        this._createTab('yugaaaaa');

        // Start auto-save every 30 seconds
        var self = this;
        this._saveInterval = setInterval(function () {
            self.gameState.save();
        }, 30000);

        // Update the currency display
        this.updateCurrencyDisplay();
    },

    // ================================================================
    // Navigation
    // ================================================================

    /**
     * Bind click handlers to the navigation buttons.
     */
    _bindNavButtons: function () {
        var self = this;

        var backBtn = document.getElementById('btn-back');
        var fwdBtn = document.getElementById('btn-forward');
        var refreshBtn = document.getElementById('btn-refresh');

        if (backBtn) {
            backBtn.onclick = function () { self.goBack(); };
        }
        if (fwdBtn) {
            fwdBtn.onclick = function () { self.goForward(); };
        }
        if (refreshBtn) {
            refreshBtn.onclick = function () { self.refresh(); };
        }
    },

    /**
     * Navigate to a site by its registry ID.
     * Checks access requirements, spends data cost, triggers loading
     * animation, then renders the site content.
     *
     * @param {string} siteId - The site registry identifier
     */
    navigate: function (siteId) {
        // Close the shop if it's open
        if (this._shopOpen) {
            this._closeShop();
        }

        var site = this._lookupSite(siteId);

        // Check requirements if the site has them
        if (site && site.requirements) {
            if (!this.gameState.canAccessSite(site.requirements)) {
                this._renderAccessDenied(site);
                return;
            }
            // Spend data cost if the site requires it
            if (site.requirements.dataCost && site.requirements.dataCost > 0) {
                this.gameState.spendData(site.requirements.dataCost);
            }
        }

        // Mark site as discovered (adds to bookmarks list)
        this.gameState.discoverSite(siteId);

        // Push to history (truncate any forward history)
        this._history = this._history.slice(0, this._historyIndex + 1);
        this._history.push(siteId);
        this._historyIndex = this._history.length - 1;
        this._currentSiteId = siteId;

        // Update active tab state
        this._syncTabState();

        // Update nav button disabled states
        this._updateNavButtons();

        if (site) {
            // Show loading animation, then render the site
            var self = this;
            var duration = this.getLoadDuration();
            this.showLoading(duration, function () {
                self._renderSite(site);
            });
        } else {
            // No registry entry — show not found immediately
            this._renderNotFound(siteId);
        }

        // Update address bar, tab title, bookmarks, currencies
        this._updateChrome(site, siteId);
    },

    /**
     * Look up a site in the SiteRegistry. Returns null if the registry
     * doesn't exist yet or the site isn't registered.
     *
     * @param {string} siteId
     * @returns {object|null}
     */
    _lookupSite: function (siteId) {
        if (typeof SiteRegistry === 'undefined') {
            return null;
        }
        if (typeof SiteRegistry.get === 'function') {
            return SiteRegistry.get(siteId);
        }
        if (SiteRegistry[siteId]) {
            return SiteRegistry[siteId];
        }
        return null;
    },

    /**
     * Render a "page not found" message into the content area.
     * Built entirely with safe DOM methods.
     *
     * @param {string} siteId - The site that was not found
     */
    _renderNotFound: function (siteId) {
        var content = document.getElementById('page-content');
        if (!content) { return; }

        // Clear existing content
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        var container = document.createElement('div');
        container.style.cssText = 'text-align:center; padding:60px 20px; color:#666; font-family:Arial, sans-serif;';

        var heading = document.createElement('h1');
        heading.style.cssText = 'font-size:48px; color:#ccc; margin-bottom:16px;';
        heading.textContent = '404';

        var message = document.createElement('p');
        message.style.cssText = 'font-size:16px; margin-bottom:8px;';
        message.textContent = 'Page Not Found';

        var detail = document.createElement('p');
        detail.style.cssText = 'font-size:13px; color:#999;';
        detail.textContent = 'The page at "' + siteId + '" could not be located on the World Wide Web.';

        container.appendChild(heading);
        container.appendChild(message);
        container.appendChild(detail);
        content.appendChild(container);
    },

    /**
     * Render an "access denied" message when the player doesn't meet
     * site requirements. Built entirely with safe DOM methods.
     *
     * @param {object} site - The site object with requirements
     */
    _renderAccessDenied: function (site) {
        var content = document.getElementById('page-content');
        if (!content) { return; }

        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        var container = document.createElement('div');
        container.style.cssText = 'text-align:center; padding:60px 20px; color:#666; font-family:Arial, sans-serif;';

        var heading = document.createElement('h1');
        heading.style.cssText = 'font-size:36px; color:#c33; margin-bottom:16px;';
        heading.textContent = 'Access Denied';

        var message = document.createElement('p');
        message.style.cssText = 'font-size:14px;';
        message.textContent = 'Your connection is too slow or you lack the required resources to access this site.';

        container.appendChild(heading);
        container.appendChild(message);
        content.appendChild(container);
    },

    /**
     * Render a site's content into the page content area. Sites provide a
     * render(container, browser) function that builds DOM content safely.
     * After rendering, declarative click targets are wired up via
     * SiteRegistry.attachClickTargets.
     *
     * @param {object} site - The site object from the registry
     */
    _renderSite: function (site) {
        var content = document.getElementById('page-content');
        if (!content) { return; }

        // Sites are expected to provide a render function that builds DOM
        if (typeof site.render === 'function') {
            site.render(content, this);
        }

        // Wire up declarative click targets after the site has rendered its DOM
        if (typeof SiteRegistry !== 'undefined' && typeof SiteRegistry.attachClickTargets === 'function') {
            SiteRegistry.attachClickTargets(content, site, this);
        }
    },

    /**
     * Update all the chrome UI elements (address bar, tab title, bookmarks,
     * currency display) for the given site.
     *
     * @param {object|null} site - The site object (null for unknown sites)
     * @param {string} siteId - The site ID
     */
    _updateChrome: function (site, siteId) {
        var url = 'http://www.' + siteId + '.com';
        var title = siteId;

        if (site) {
            url = site.url || url;
            title = site.title || title;
        }

        this.updateAddressBar(url);
        this._updateTitleBar(title);
        this._updateTabTitle(title);
        this.updateBookmarks();
        this.updateCurrencyDisplay();
    },

    /**
     * Get the loading duration in ms based on the current modem level.
     *
     * @returns {number}
     */
    getLoadDuration: function () {
        var level = this.gameState.getModemLevel();
        if (level >= 0 && level < LOAD_DURATIONS.length) {
            return LOAD_DURATIONS[level];
        }
        return LOAD_DURATIONS[LOAD_DURATIONS.length - 1];
    },

    /**
     * Show the loading overlay with a progress bar animation and cycling
     * status messages. Calls the callback when the loading completes.
     *
     * @param {number} duration - Total loading time in ms
     * @param {function} callback - Called when loading finishes
     */
    showLoading: function (duration, callback) {
        var loadingScreen = document.getElementById('loading-screen');
        var loadingBar = loadingScreen ? loadingScreen.querySelector('.loading-bar') : null;
        var loadingText = loadingScreen ? loadingScreen.querySelector('.loading-text') : null;

        if (!loadingScreen) {
            // No loading screen in DOM (possibly in test environment), skip animation
            if (callback) { callback(); }
            return;
        }

        this._isLoading = true;

        // Reset bar width before animating
        if (loadingBar) {
            loadingBar.classList.remove('animating');
            loadingBar.style.width = '0%';
            // Force reflow so the transition restarts
            loadingBar.offsetWidth; // eslint-disable-line no-unused-expressions
        }

        // Show the loading screen
        loadingScreen.classList.add('visible');

        // Set the loading bar transition to match the duration
        if (loadingBar) {
            loadingBar.style.transition = 'width ' + duration + 'ms linear';
            loadingBar.classList.add('animating');
        }

        // Cycle through loading messages
        var modemSpeed = this.gameState.getModemName();
        var messages = LOADING_MESSAGES.map(function (msg) {
            return msg.replace('{modemSpeed}', modemSpeed);
        });
        var messageInterval = duration / messages.length;
        var messageTimers = [];

        messages.forEach(function (msg, i) {
            var timer = setTimeout(function () {
                if (loadingText) {
                    loadingText.textContent = msg;
                }
            }, messageInterval * i);
            messageTimers.push(timer);
        });

        // After the duration, hide loading and fire callback
        var self = this;
        setTimeout(function () {
            // Clean up message timers
            messageTimers.forEach(function (t) { clearTimeout(t); });

            // Hide loading screen
            loadingScreen.classList.remove('visible');

            // Reset bar
            if (loadingBar) {
                loadingBar.classList.remove('animating');
                loadingBar.style.width = '0%';
                loadingBar.style.transition = '';
            }

            self._isLoading = false;

            if (callback) { callback(); }
        }, duration);
    },

    /**
     * Navigate backward in history. Renders the previous site instantly
     * (no loading animation).
     */
    goBack: function () {
        if (this._historyIndex <= 0) {
            return;
        }

        this._historyIndex--;
        var siteId = this._history[this._historyIndex];
        this._currentSiteId = siteId;

        this._syncTabState();
        this._navigateInstant(siteId);
        this._updateNavButtons();
    },

    /**
     * Navigate forward in history. Renders the next site instantly
     * (no loading animation).
     */
    goForward: function () {
        if (this._historyIndex >= this._history.length - 1) {
            return;
        }

        this._historyIndex++;
        var siteId = this._history[this._historyIndex];
        this._currentSiteId = siteId;

        this._syncTabState();
        this._navigateInstant(siteId);
        this._updateNavButtons();
    },

    /**
     * Render a site instantly without loading animation (used for
     * back/forward navigation).
     *
     * @param {string} siteId
     */
    _navigateInstant: function (siteId) {
        var site = this._lookupSite(siteId);
        if (site) {
            this._renderSite(site);
        } else {
            this._renderNotFound(siteId);
        }
        this._updateChrome(site, siteId);
    },

    /**
     * Re-render the current site. Useful for sites that have randomized
     * content.
     */
    refresh: function () {
        if (!this._currentSiteId) { return; }

        var site = this._lookupSite(this._currentSiteId);
        if (site) {
            this._renderSite(site);
        } else {
            this._renderNotFound(this._currentSiteId);
        }
    },

    // ================================================================
    // Address Bar & URL Display
    // ================================================================

    /**
     * Update the address bar display with the given URL. Wraps the
     * "http://" protocol prefix in a styled span for green coloring.
     *
     * @param {string} url - The full URL to display
     */
    updateAddressBar: function (url) {
        var urlDisplay = document.getElementById('url-display');
        if (!urlDisplay) { return; }

        // Clear existing content
        while (urlDisplay.firstChild) {
            urlDisplay.removeChild(urlDisplay.firstChild);
        }

        // Separate the protocol from the rest of the URL
        var protocolEnd = url.indexOf('://');
        if (protocolEnd !== -1) {
            var protocol = url.substring(0, protocolEnd + 3);
            var rest = url.substring(protocolEnd + 3);

            var protocolSpan = document.createElement('span');
            protocolSpan.className = 'url-protocol';
            protocolSpan.textContent = protocol;

            urlDisplay.appendChild(protocolSpan);
            urlDisplay.appendChild(document.createTextNode(rest));
        } else {
            urlDisplay.textContent = url;
        }

        // Also update the input field value
        var urlInput = document.getElementById('url-input');
        if (urlInput) {
            urlInput.value = url;
        }
    },

    /**
     * Update the currency display in the status bar to reflect
     * current game state values.
     */
    updateCurrencyDisplay: function () {
        var clicksEl = document.getElementById('clicks-count');
        var dataEl = document.getElementById('data-count');
        var repEl = document.getElementById('reputation-count');

        if (clicksEl) {
            clicksEl.textContent = String(this.gameState.clicks);
        }
        if (dataEl) {
            dataEl.textContent = GameState.formatData(this.gameState.data);
        }
        if (repEl) {
            repEl.textContent = String(this.gameState.reputation);
        }
    },

    /**
     * Update the bookmarks bar based on discovered sites in the game state.
     * Looks up each bookmark in the SiteRegistry for display info.
     */
    updateBookmarks: function () {
        var bar = document.getElementById('bookmarks-bar');
        if (!bar) { return; }

        var bookmarks = this.gameState.getBookmarks();

        // Clear existing bookmark items
        while (bar.firstChild) {
            bar.removeChild(bar.firstChild);
        }

        if (bookmarks.length === 0) {
            bar.classList.remove('has-bookmarks');
            return;
        }

        bar.classList.add('has-bookmarks');

        var self = this;
        bookmarks.forEach(function (siteId) {
            var site = self._lookupSite(siteId);
            var title = siteId;
            var icon = '\u{1F310}'; // globe emoji as default icon

            if (site) {
                title = site.title || siteId;
                icon = site.icon || icon;
            }

            var item = document.createElement('div');
            item.className = 'bookmark-item';

            var iconSpan = document.createElement('span');
            iconSpan.className = 'bookmark-icon';
            iconSpan.textContent = icon;

            var titleSpan = document.createElement('span');
            titleSpan.textContent = title;

            item.appendChild(iconSpan);
            item.appendChild(titleSpan);

            item.addEventListener('click', function () {
                self.navigate(siteId);
            });

            bar.appendChild(item);
        });
    },

    /**
     * Handle a reward from clicking on site content. Adds the specified
     * currencies to the game state and updates the display.
     *
     * @param {object} reward - { clicks: N, data: N, reputation: N }
     */
    handleReward: function (reward) {
        if (!reward) { return; }

        if (reward.clicks) {
            this.gameState.addClicks(reward.clicks);
        }
        if (reward.data) {
            this.gameState.addData(reward.data);
        }
        if (reward.reputation) {
            this.gameState.addReputation(reward.reputation);
        }

        this.updateCurrencyDisplay();
    },

    /**
     * Get the currently displayed site's ID.
     *
     * @returns {string|null}
     */
    getCurrentSiteId: function () {
        return this._currentSiteId;
    },

    /**
     * Update the title bar text.
     *
     * @param {string} title
     */
    _updateTitleBar: function (title) {
        var titleEl = document.getElementById('page-title');
        if (titleEl) {
            titleEl.textContent = title + ' - The Internet';
        }
    },

    /**
     * Update the active tab's title text.
     *
     * @param {string} title
     */
    _updateTabTitle: function (title) {
        var activeTab = document.querySelector('.tab.active .tab-title');
        if (activeTab) {
            activeTab.textContent = title;
        }
    },

    /**
     * Enable/disable the back and forward buttons based on
     * the current history position.
     */
    _updateNavButtons: function () {
        var backBtn = document.getElementById('btn-back');
        var fwdBtn = document.getElementById('btn-forward');

        if (backBtn) {
            backBtn.disabled = (this._historyIndex <= 0);
        }
        if (fwdBtn) {
            fwdBtn.disabled = (this._historyIndex >= this._history.length - 1);
        }
    },

    // ================================================================
    // Upgrade Application (called on init and after purchases)
    // ================================================================

    /**
     * Apply all persisted upgrade states to the DOM. Called during init()
     * and after any upgrade purchase to sync the UI with game state.
     */
    _applyUpgrades: function () {
        this._applyMonitorLevel();
        this._applyTabsUnlock();
        this._applySearchUnlock();
    },

    /**
     * Apply the monitor level CSS class to the chrome shell.
     * Removes all monitor-level-N classes then adds the correct one.
     */
    _applyMonitorLevel: function () {
        var shell = document.getElementById('chrome-shell');
        if (!shell) { return; }

        for (var i = 0; i <= 3; i++) {
            shell.classList.remove('monitor-level-' + i);
        }
        shell.classList.add('monitor-level-' + this.gameState.getMonitorLevel());
    },

    /**
     * Show or hide the new-tab button in the tab bar based on whether
     * tabs are unlocked.
     */
    _applyTabsUnlock: function () {
        var tabBar = document.getElementById('tab-bar');
        if (!tabBar) { return; }

        // Remove any existing new-tab button
        var existingBtn = tabBar.querySelector('.tab-new-btn');
        if (existingBtn) {
            tabBar.removeChild(existingBtn);
        }

        if (this.gameState.hasTabsUnlocked()) {
            var btn = document.createElement('button');
            btn.className = 'tab-new-btn';
            btn.textContent = '+';
            btn.title = 'New Tab';
            var self = this;
            btn.addEventListener('click', function () {
                self._createTab('yugaaaaa');
            });
            tabBar.appendChild(btn);
        }
    },

    /**
     * Enable or disable the address bar search input based on whether
     * search is unlocked. When enabled, clicking the address bar
     * switches to input mode.
     */
    _applySearchUnlock: function () {
        var addressBar = document.getElementById('address-bar');
        if (!addressBar) { return; }

        if (this.gameState.hasSearchUnlocked()) {
            addressBar.classList.add('search-enabled');
            this._bindSearchInput();
        } else {
            addressBar.classList.remove('search-enabled');
            addressBar.classList.remove('search-active');
        }
    },

    /**
     * Wire up the address bar click-to-edit and Enter-to-navigate behavior.
     * Idempotent: rebinding replaces existing handlers.
     */
    _bindSearchInput: function () {
        var self = this;
        var addressBar = document.getElementById('address-bar');
        var urlDisplay = document.getElementById('url-display');
        var urlInput = document.getElementById('url-input');
        if (!addressBar || !urlDisplay || !urlInput) { return; }

        // Click the address bar to enter search mode
        addressBar.onclick = function () {
            if (!self.gameState.hasSearchUnlocked()) { return; }
            addressBar.classList.add('search-active');
            urlInput.value = urlDisplay.textContent;
            urlInput.focus();
            urlInput.select();
        };

        // Handle Enter key to navigate
        urlInput.onkeydown = function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                var query = urlInput.value.trim();
                if (query) {
                    self._navigateFromSearch(query);
                }
                addressBar.classList.remove('search-active');
                urlInput.blur();
            } else if (e.key === 'Escape') {
                addressBar.classList.remove('search-active');
                urlInput.blur();
            }
        };

        // Leave search mode when input loses focus
        urlInput.onblur = function () {
            // Delay to allow click events on other elements to fire first
            setTimeout(function () {
                addressBar.classList.remove('search-active');
            }, 150);
        };
    },

    /**
     * Attempt to match a user-typed URL or search query against known
     * sites in the registry. Strips common prefixes (http://, www., etc.)
     * and tries to find a matching site ID or URL.
     *
     * @param {string} query - Raw text from the address bar input
     */
    _navigateFromSearch: function (query) {
        // Normalize: lowercase, strip protocol and www prefix
        var normalized = query.toLowerCase().trim();
        normalized = normalized.replace(/^https?:\/\//, '');
        normalized = normalized.replace(/^www\./, '');
        normalized = normalized.replace(/\/$/, '');

        // Try to match against registered site URLs and IDs
        if (typeof SiteRegistry !== 'undefined' && typeof SiteRegistry.getAll === 'function') {
            var allSites = SiteRegistry.getAll();
            for (var i = 0; i < allSites.length; i++) {
                var site = allSites[i];

                // Check direct site ID match
                if (site.id === normalized) {
                    this.navigate(site.id);
                    return;
                }

                // Check URL match (normalize site URL same way)
                if (site.url) {
                    var siteUrl = site.url.toLowerCase();
                    siteUrl = siteUrl.replace(/^https?:\/\//, '');
                    siteUrl = siteUrl.replace(/^www\./, '');
                    siteUrl = siteUrl.replace(/\/$/, '');

                    if (siteUrl === normalized) {
                        this.navigate(site.id);
                        return;
                    }

                    // Partial match: query matches start of site URL domain
                    if (siteUrl.indexOf(normalized) === 0) {
                        this.navigate(site.id);
                        return;
                    }
                }
            }
        }

        // No match found — show a "site not found" page
        this._renderSearchNotFound(query);
    },

    /**
     * Render a message when a searched URL doesn't match any known site.
     *
     * @param {string} query - The URL the user typed
     */
    _renderSearchNotFound: function (query) {
        var content = document.getElementById('page-content');
        if (!content) { return; }

        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }

        var container = document.createElement('div');
        container.style.cssText = 'text-align:center; padding:60px 20px; color:#666; font-family:Arial, sans-serif;';

        var heading = document.createElement('h1');
        heading.style.cssText = 'font-size:24px; color:#999; margin-bottom:16px;';
        heading.textContent = 'This site does not exist... yet.';

        var detail = document.createElement('p');
        detail.style.cssText = 'font-size:13px; color:#aaa;';
        detail.textContent = 'Could not connect to "' + query + '". The internet is still growing!';

        container.appendChild(heading);
        container.appendChild(detail);
        content.appendChild(container);

        // Update address bar to show what was typed
        this.updateAddressBar(query);
    },

    // ================================================================
    // Tab System
    // ================================================================

    /**
     * Create a new tab navigated to the given site. If max tabs are
     * reached, does nothing. Switches to the newly created tab.
     *
     * @param {string} siteId - The site to load in the new tab
     */
    _createTab: function (siteId) {
        if (this._tabs.length >= MAX_TABS && this.gameState.hasTabsUnlocked()) {
            return;
        }

        var tabData = {
            id: this._nextTabId++,
            siteId: siteId,
            history: [siteId],
            historyIndex: 0
        };

        this._tabs.push(tabData);
        this._activeTabIndex = this._tabs.length - 1;

        // Restore this tab's navigation state as the active state
        this._history = tabData.history;
        this._historyIndex = tabData.historyIndex;
        this._currentSiteId = tabData.siteId;

        // Rebuild the tab bar DOM
        this._renderTabBar();

        // Navigate to the site in the new tab
        var site = this._lookupSite(siteId);
        if (site) {
            var self = this;
            var duration = this.getLoadDuration();
            this.showLoading(duration, function () {
                self._renderSite(site);
            });
        } else {
            this._renderNotFound(siteId);
        }
        this._updateChrome(site, siteId);
        this._updateNavButtons();
    },

    /**
     * Switch to a different tab by index. Saves the current tab state
     * and restores the target tab state, then renders the target tab's
     * current site instantly (no loading animation).
     *
     * @param {number} index - Index into the _tabs array
     */
    _switchToTab: function (index) {
        if (index < 0 || index >= this._tabs.length) { return; }
        if (index === this._activeTabIndex) { return; }

        // Save current tab state
        this._syncTabState();

        // Switch
        this._activeTabIndex = index;
        var tab = this._tabs[index];

        // Restore target tab state
        this._history = tab.history;
        this._historyIndex = tab.historyIndex;
        this._currentSiteId = tab.siteId;

        // Render the tab bar with updated active state
        this._renderTabBar();

        // Render the site instantly (tab switching is instant)
        this._navigateInstant(this._currentSiteId);
        this._updateNavButtons();
    },

    /**
     * Close a tab by index. If it's the only tab, does nothing.
     * If the active tab is closed, switches to the nearest remaining tab.
     *
     * @param {number} index - Index of the tab to close
     */
    _closeTab: function (index) {
        // Don't close the last tab
        if (this._tabs.length <= 1) { return; }

        this._tabs.splice(index, 1);

        // Adjust active index
        if (index < this._activeTabIndex) {
            this._activeTabIndex--;
        } else if (index === this._activeTabIndex) {
            // Closed the active tab — switch to the nearest
            if (this._activeTabIndex >= this._tabs.length) {
                this._activeTabIndex = this._tabs.length - 1;
            }
            var tab = this._tabs[this._activeTabIndex];
            this._history = tab.history;
            this._historyIndex = tab.historyIndex;
            this._currentSiteId = tab.siteId;
            this._navigateInstant(this._currentSiteId);
            this._updateNavButtons();
        }

        this._renderTabBar();
    },

    /**
     * Sync the Browser's current navigation state back into the active
     * tab's data object.
     */
    _syncTabState: function () {
        var tab = this._tabs[this._activeTabIndex];
        if (!tab) { return; }
        tab.history = this._history;
        tab.historyIndex = this._historyIndex;
        tab.siteId = this._currentSiteId;
    },

    /**
     * Rebuild the tab bar DOM to reflect the current _tabs array.
     * Clears and rebuilds all tab elements. Preserves the new-tab button
     * if tabs are unlocked.
     */
    _renderTabBar: function () {
        var tabBar = document.getElementById('tab-bar');
        if (!tabBar) { return; }

        // Clear existing tabs (but not the new-tab button, which we re-add)
        while (tabBar.firstChild) {
            tabBar.removeChild(tabBar.firstChild);
        }

        var self = this;

        this._tabs.forEach(function (tabData, index) {
            var tabEl = document.createElement('div');
            tabEl.className = 'tab';
            if (index === self._activeTabIndex) {
                tabEl.classList.add('active');
            }

            var titleSpan = document.createElement('span');
            titleSpan.className = 'tab-title';

            // Look up site title
            var site = self._lookupSite(tabData.siteId);
            titleSpan.textContent = (site && site.title) ? site.title : (tabData.siteId || 'New Tab');

            tabEl.appendChild(titleSpan);

            // Close button (only if more than one tab)
            if (self._tabs.length > 1) {
                var closeSpan = document.createElement('span');
                closeSpan.className = 'tab-close';
                closeSpan.textContent = '\u00D7'; // multiplication sign (x)
                closeSpan.addEventListener('click', function (e) {
                    e.stopPropagation();
                    self._closeTab(index);
                });
                tabEl.appendChild(closeSpan);
            }

            // Click tab to switch to it
            tabEl.addEventListener('click', function () {
                self._switchToTab(index);
            });

            tabBar.appendChild(tabEl);
        });

        // Re-add the new tab button if tabs are unlocked
        if (this.gameState.hasTabsUnlocked()) {
            var newTabBtn = document.createElement('button');
            newTabBtn.className = 'tab-new-btn';
            newTabBtn.textContent = '+';
            newTabBtn.title = 'New Tab';
            if (this._tabs.length >= MAX_TABS) {
                newTabBtn.disabled = true;
                newTabBtn.title = 'Max tabs reached';
            }
            newTabBtn.addEventListener('click', function () {
                self._createTab('yugaaaaa');
            });
            tabBar.appendChild(newTabBtn);
        }
    },

    // ================================================================
    // Settings / Upgrade Shop
    // ================================================================

    /**
     * Bind the settings gear button to open the upgrade shop.
     */
    _bindSettingsButton: function () {
        var self = this;
        var settingsBtn = document.getElementById('btn-settings');
        if (settingsBtn) {
            settingsBtn.onclick = function () {
                if (self._shopOpen) {
                    self._closeShop();
                } else {
                    self._openShop();
                }
            };
        }
    },

    /**
     * Open the upgrade shop overlay. Creates the panel DOM if it doesn't
     * exist, then shows it.
     */
    _openShop: function () {
        this._shopOpen = true;
        var contentArea = document.getElementById('content-area');
        if (!contentArea) { return; }

        // Remove any existing shop panel
        var existing = document.getElementById('upgrade-shop');
        if (existing) {
            contentArea.removeChild(existing);
        }

        // Build the shop panel
        var panel = this._buildShopPanel();
        contentArea.appendChild(panel);

        // Make it visible (after append so CSS transition can fire)
        requestAnimationFrame(function () {
            panel.classList.add('visible');
        });
    },

    /**
     * Close the upgrade shop overlay.
     */
    _closeShop: function () {
        this._shopOpen = false;
        var panel = document.getElementById('upgrade-shop');
        if (panel) {
            panel.classList.remove('visible');
            var parent = panel.parentNode;
            if (parent) {
                parent.removeChild(panel);
            }
        }
    },

    /**
     * Build the complete upgrade shop panel DOM. Returns the panel element.
     * All DOM is built with createElement — no innerHTML.
     *
     * @returns {HTMLElement}
     */
    _buildShopPanel: function () {
        var self = this;
        var gs = this.gameState;

        var panel = document.createElement('div');
        panel.id = 'upgrade-shop';

        // --- Header ---
        var header = document.createElement('div');
        header.className = 'shop-header';

        var headerTitle = document.createElement('h2');
        headerTitle.textContent = '\u2699 Internet Settings & Upgrades';

        var closeBtn = document.createElement('button');
        closeBtn.className = 'shop-close-btn';
        closeBtn.textContent = '\u00D7';
        closeBtn.addEventListener('click', function () {
            self._closeShop();
        });

        header.appendChild(headerTitle);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        // --- Body ---
        var body = document.createElement('div');
        body.className = 'shop-body';

        // Modem section
        body.appendChild(this._buildModemSection());

        // Monitor section
        body.appendChild(this._buildMonitorSection());

        // Tabs section
        body.appendChild(this._buildTabsSection());

        // Search section
        body.appendChild(this._buildSearchSection());

        panel.appendChild(body);

        return panel;
    },

    /**
     * Build the Modem Speed upgrade section.
     *
     * @returns {HTMLElement}
     */
    _buildModemSection: function () {
        var self = this;
        var gs = this.gameState;
        var section = document.createElement('div');
        section.className = 'shop-section';

        var title = document.createElement('div');
        title.className = 'shop-section-title';
        title.textContent = '\uD83D\uDCDE Modem Speed';
        section.appendChild(title);

        // Current modem
        var currentRow = document.createElement('div');
        currentRow.className = 'shop-section-row';
        var currentLabel = document.createElement('span');
        currentLabel.className = 'shop-section-label';
        currentLabel.textContent = 'Current:';
        var currentValue = document.createElement('span');
        currentValue.className = 'shop-section-value';
        currentValue.textContent = gs.getModemName();
        currentRow.appendChild(currentLabel);
        currentRow.appendChild(currentValue);
        section.appendChild(currentRow);

        // Speed bar visual
        var speedTrack = document.createElement('div');
        speedTrack.className = 'speed-bar-track';
        var speedFill = document.createElement('div');
        speedFill.className = 'speed-bar-fill';
        var modemPercent = ((gs.getModemLevel()) / (MODEM_NAMES.length - 1)) * 100;
        speedFill.style.width = modemPercent + '%';
        speedTrack.appendChild(speedFill);
        section.appendChild(speedTrack);

        // Next upgrade or max
        var isMaxModem = gs.getModemLevel() >= MODEM_NAMES.length - 1;
        if (isMaxModem) {
            var maxLabel = document.createElement('div');
            maxLabel.className = 'shop-max-label';
            maxLabel.textContent = 'Maximum speed reached! \uD83D\uDE80';
            section.appendChild(maxLabel);
        } else {
            var nextName = MODEM_NAMES[gs.getModemLevel() + 1];
            var nextCost = MODEM_COSTS[gs.getModemLevel()];

            var nextRow = document.createElement('div');
            nextRow.className = 'shop-section-row';
            var nextLabel = document.createElement('span');
            nextLabel.className = 'shop-section-label';
            nextLabel.textContent = 'Next: ' + nextName;
            var nextCostLabel = document.createElement('span');
            nextCostLabel.className = 'shop-section-value';
            nextCostLabel.textContent = 'Cost: ' + nextCost + ' clicks';
            nextRow.appendChild(nextLabel);
            nextRow.appendChild(nextCostLabel);
            section.appendChild(nextRow);

            var buyBtn = document.createElement('button');
            buyBtn.className = 'shop-buy-btn';
            buyBtn.textContent = 'Upgrade to ' + nextName;
            if (gs.clicks < nextCost) {
                buyBtn.disabled = true;
            }
            buyBtn.addEventListener('click', function () {
                if (self.gameState.upgradeModem()) {
                    self.updateCurrencyDisplay();
                    self.gameState.save();
                    // Refresh the shop panel to reflect new state
                    self._openShop();
                }
            });
            section.appendChild(buyBtn);
        }

        return section;
    },

    /**
     * Build the Monitor Size upgrade section.
     *
     * @returns {HTMLElement}
     */
    _buildMonitorSection: function () {
        var self = this;
        var gs = this.gameState;
        var section = document.createElement('div');
        section.className = 'shop-section';

        var title = document.createElement('div');
        title.className = 'shop-section-title';
        title.textContent = '\uD83D\uDCBB Monitor Size';
        section.appendChild(title);

        // Current monitor
        var currentRow = document.createElement('div');
        currentRow.className = 'shop-section-row';
        var currentLabel = document.createElement('span');
        currentLabel.className = 'shop-section-label';
        currentLabel.textContent = 'Current:';
        var currentValue = document.createElement('span');
        currentValue.className = 'shop-section-value';
        currentValue.textContent = MONITOR_NAMES[gs.getMonitorLevel()];
        currentRow.appendChild(currentLabel);
        currentRow.appendChild(currentValue);
        section.appendChild(currentRow);

        var desc = document.createElement('div');
        desc.className = 'shop-section-desc';
        desc.textContent = 'Your monitor is currently a ' + MONITOR_NAMES[gs.getMonitorLevel()] + '. Upgrade to see more of the internet!';
        section.appendChild(desc);

        // Next upgrade or max
        var isMaxMonitor = gs.getMonitorLevel() >= MONITOR_MAX;
        if (isMaxMonitor) {
            var maxLabel = document.createElement('div');
            maxLabel.className = 'shop-max-label';
            maxLabel.textContent = 'Maximum screen size! \uD83D\uDCFA';
            section.appendChild(maxLabel);
        } else {
            var nextName = MONITOR_NAMES[gs.getMonitorLevel() + 1];
            var nextCost = MONITOR_COSTS[gs.getMonitorLevel()];

            var nextRow = document.createElement('div');
            nextRow.className = 'shop-section-row';
            var nextLabel = document.createElement('span');
            nextLabel.className = 'shop-section-label';
            nextLabel.textContent = 'Next: ' + nextName;
            var nextCostLabel = document.createElement('span');
            nextCostLabel.className = 'shop-section-value';
            nextCostLabel.textContent = 'Cost: ' + nextCost + ' clicks';
            nextRow.appendChild(nextLabel);
            nextRow.appendChild(nextCostLabel);
            section.appendChild(nextRow);

            var buyBtn = document.createElement('button');
            buyBtn.className = 'shop-buy-btn';
            buyBtn.textContent = 'Upgrade to ' + nextName;
            if (gs.clicks < nextCost) {
                buyBtn.disabled = true;
            }
            buyBtn.addEventListener('click', function () {
                if (self.gameState.upgradeMonitor()) {
                    self._applyMonitorLevel();
                    self.updateCurrencyDisplay();
                    self.gameState.save();
                    self._openShop();
                }
            });
            section.appendChild(buyBtn);
        }

        return section;
    },

    /**
     * Build the Browser Tabs unlock section.
     *
     * @returns {HTMLElement}
     */
    _buildTabsSection: function () {
        var self = this;
        var gs = this.gameState;
        var section = document.createElement('div');
        section.className = 'shop-section';

        var title = document.createElement('div');
        title.className = 'shop-section-title';
        title.textContent = '\uD83D\uDCC4 Browser Tabs';
        section.appendChild(title);

        var desc = document.createElement('div');
        desc.className = 'shop-section-desc';
        desc.textContent = 'Open multiple sites at once!';
        section.appendChild(desc);

        if (gs.hasTabsUnlocked()) {
            var statusRow = document.createElement('div');
            statusRow.className = 'shop-section-row';
            var statusLabel = document.createElement('span');
            statusLabel.className = 'shop-status-unlocked';
            statusLabel.textContent = '\u2713 Tabs Unlocked!';
            statusRow.appendChild(statusLabel);
            section.appendChild(statusRow);
        } else {
            var costRow = document.createElement('div');
            costRow.className = 'shop-section-row';
            var costLabel = document.createElement('span');
            costLabel.className = 'shop-section-label';
            costLabel.textContent = 'Status: Locked';
            var costValue = document.createElement('span');
            costValue.className = 'shop-section-value';
            costValue.textContent = 'Cost: ' + TABS_COST + ' clicks';
            costRow.appendChild(costLabel);
            costRow.appendChild(costValue);
            section.appendChild(costRow);

            var buyBtn = document.createElement('button');
            buyBtn.className = 'shop-buy-btn';
            buyBtn.textContent = 'Unlock Tabs';
            if (gs.clicks < TABS_COST) {
                buyBtn.disabled = true;
            }
            buyBtn.addEventListener('click', function () {
                if (self.gameState.unlockTabs()) {
                    self._applyTabsUnlock();
                    self._renderTabBar();
                    self.updateCurrencyDisplay();
                    self.gameState.save();
                    self._openShop();
                }
            });
            section.appendChild(buyBtn);
        }

        return section;
    },

    /**
     * Build the Search Engine unlock section.
     *
     * @returns {HTMLElement}
     */
    _buildSearchSection: function () {
        var self = this;
        var gs = this.gameState;
        var section = document.createElement('div');
        section.className = 'shop-section';

        var title = document.createElement('div');
        title.className = 'shop-section-title';
        title.textContent = '\uD83D\uDD0D Search Engine';
        section.appendChild(title);

        var desc = document.createElement('div');
        desc.className = 'shop-section-desc';
        desc.textContent = 'Type URLs directly into the address bar!';
        section.appendChild(desc);

        if (gs.hasSearchUnlocked()) {
            var statusRow = document.createElement('div');
            statusRow.className = 'shop-section-row';
            var statusLabel = document.createElement('span');
            statusLabel.className = 'shop-status-unlocked';
            statusLabel.textContent = '\u2713 Search Unlocked!';
            statusRow.appendChild(statusLabel);
            section.appendChild(statusRow);
        } else {
            var costRow = document.createElement('div');
            costRow.className = 'shop-section-row';
            var costLabel = document.createElement('span');
            costLabel.className = 'shop-section-label';
            costLabel.textContent = 'Status: Locked';
            var costValue = document.createElement('span');
            costValue.className = 'shop-section-value';
            costValue.textContent = 'Cost: ' + SEARCH_COST + ' clicks';
            costRow.appendChild(costLabel);
            costRow.appendChild(costValue);
            section.appendChild(costRow);

            var buyBtn = document.createElement('button');
            buyBtn.className = 'shop-buy-btn';
            buyBtn.textContent = 'Unlock Search';
            if (gs.clicks < SEARCH_COST) {
                buyBtn.disabled = true;
            }
            buyBtn.addEventListener('click', function () {
                if (self.gameState.unlockSearch()) {
                    self._applySearchUnlock();
                    self.updateCurrencyDisplay();
                    self.gameState.save();
                    self._openShop();
                }
            });
            section.appendChild(buyBtn);
        }

        return section;
    }
};

// Start the browser when the page has loaded
document.addEventListener('DOMContentLoaded', function () {
    Browser.init();
});
