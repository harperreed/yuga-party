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
 * Browser is the main controller for the fake browser chrome.
 * It manages navigation, history, loading animations, address bar,
 * currency display, bookmarks, and wiring up UI event listeners.
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

        // Wire up nav button event listeners
        this._bindNavButtons();

        // Navigate to the starting site
        this.navigate('yugaaaaa');

        // Start auto-save every 30 seconds
        var self = this;
        this._saveInterval = setInterval(function () {
            self.gameState.save();
        }, 30000);

        // Update the currency display
        this.updateCurrencyDisplay();
    },

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
    }
};

// Start the browser when the page has loaded
document.addEventListener('DOMContentLoaded', function () {
    Browser.init();
});
