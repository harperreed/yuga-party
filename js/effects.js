// ABOUTME: Visual effects module for loading bars, click feedback, cursor changes, and sound.
// ABOUTME: Handles dial-up loading animations, floating reward text, cosmetic cursors, and auto-save indicator.

/**
 * Effects provides visual and audio feedback for the game: floating reward
 * text on clicks, cursor management, auto-save indicators, and synthesized
 * sound effects via the Web Audio API.
 */
var Effects = {
    /** @type {AudioContext|null} Lazily created audio context */
    _audioCtx: null,

    /** @type {boolean} Whether sound is enabled */
    _soundEnabled: false,

    /** @type {string} The current CSS cursor applied to #content-area */
    _currentCursor: 'default',

    // ================================================================
    // Floating Reward Text
    // ================================================================

    /**
     * Show floating "+N" text at the given screen coordinates for each
     * currency in the reward object. Uses the .reward-float CSS class.
     * Each currency type stacks vertically with a 20px offset.
     *
     * @param {number} x - Client X coordinate (from mouse event)
     * @param {number} y - Client Y coordinate (from mouse event)
     * @param {object} reward - { clicks: N, data: N, reputation: N }
     */
    showRewardFloat: function (x, y, reward) {
        if (!reward) { return; }

        var items = [];
        if (reward.clicks) {
            items.push({ text: '+' + reward.clicks + ' \uD83D\uDDB1', color: '#ffd700' });
        }
        if (reward.data) {
            items.push({ text: '+' + reward.data + ' \uD83D\uDCBE', color: '#4a90d9' });
        }
        if (reward.reputation) {
            items.push({ text: '+' + reward.reputation + ' \u2B50', color: '#9b59b6' });
        }

        items.forEach(function (item, index) {
            var el = document.createElement('span');
            el.className = 'reward-float';
            el.textContent = item.text;
            el.style.left = x + 'px';
            el.style.top = (y + index * 20) + 'px';
            el.style.color = item.color;
            document.body.appendChild(el);

            // Remove from DOM after the animation completes (1s)
            setTimeout(function () {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }, 1000);
        });
    },

    // ================================================================
    // Cursor Management
    // ================================================================

    /**
     * Generate a CSS cursor url() value from an emoji character by
     * rendering it onto a canvas and converting to a data URI.
     *
     * @param {string} emoji - The emoji to render as a cursor
     * @returns {string} A CSS cursor value like "url(...) 12 12, auto"
     */
    emojiToCursor: function (emoji) {
        if (this._cursorCache && this._cursorCache[emoji]) {
            return this._cursorCache[emoji];
        }
        if (!this._cursorCache) { this._cursorCache = {}; }

        var canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        var ctx = canvas.getContext('2d');
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 16, 17);
        var cursorVal = 'url(' + canvas.toDataURL() + ') 16 16, auto';
        this._cursorCache[emoji] = cursorVal;
        return cursorVal;
    },

    /**
     * Apply a cursor to the page. If the value starts with an emoji
     * (non-ASCII), render it as a custom cursor via canvas. Otherwise
     * treat it as a standard CSS cursor keyword.
     *
     * @param {string} cursorName - An emoji or CSS cursor keyword
     */
    setCursor: function (cursorName) {
        this._currentCursor = cursorName;

        // Determine the actual CSS cursor value
        var cssValue = cursorName;
        // Check if it looks like an emoji (starts with non-ASCII)
        if (cursorName && cursorName.charCodeAt(0) > 255) {
            cssValue = this.emojiToCursor(cursorName);
        }

        // Apply to both content area and body for full coverage
        var contentArea = document.getElementById('content-area');
        if (contentArea) {
            contentArea.style.cursor = cssValue;
        }
        document.body.style.cursor = cssValue;

        // Persist cursor preference (store the emoji/name, not the data URI)
        try { localStorage.setItem('yugaaaaa-cursor', cursorName); } catch (e) { /* ignore */ }
    },

    /**
     * Restore cursor preference from localStorage.
     */
    loadCursorPreference: function () {
        try {
            var saved = localStorage.getItem('yugaaaaa-cursor');
            if (saved) {
                this.setCursor(saved);
            }
        } catch (e) { /* ignore */ }
    },

    /**
     * Return the list of cursor names the player has available.
     * For now returns the built-in set that the freesmileyz site provides.
     *
     * @returns {string[]}
     */
    getAvailableCursors: function () {
        return ['default', 'crosshair', 'pointer', 'wait', 'help', 'move'];
    },

    // ================================================================
    // Auto-Save Indicator
    // ================================================================

    /**
     * Briefly show a save indicator in the status bar. Adds the .visible
     * class to #save-indicator for 2 seconds.
     */
    showSaveIndicator: function () {
        var indicator = document.getElementById('save-indicator');
        if (!indicator) { return; }

        indicator.classList.add('visible');
        setTimeout(function () {
            indicator.classList.remove('visible');
        }, 2000);
    },

    // ================================================================
    // Sound System (Web Audio API)
    // ================================================================

    /**
     * Lazily initialize the AudioContext on first use. AudioContext must
     * be created in response to a user gesture, so we defer creation.
     */
    initAudio: function () {
        if (this._audioCtx) { return; }
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            this._audioCtx = new AudioCtx();
        }
    },

    /**
     * Play a short, subtle click sound. Used when the player clicks
     * on site content.
     */
    playClick: function () {
        if (!this._soundEnabled) { return; }
        this.initAudio();
        if (!this._audioCtx) { return; }

        this._playTone(800, 0.03, 'sine', 0.15);
    },

    /**
     * Play a brief "blip" sound for page navigation. Slightly lower
     * tone than the click sound.
     */
    playNavigate: function () {
        if (!this._soundEnabled) { return; }
        this.initAudio();
        if (!this._audioCtx) { return; }

        this._playTone(440, 0.08, 'sine', 0.12);
    },

    /**
     * Play a tiny "bling" sound when the player earns a reward.
     * Higher pitch than click/navigate sounds.
     */
    playReward: function () {
        if (!this._soundEnabled) { return; }
        this.initAudio();
        if (!this._audioCtx) { return; }

        this._playTone(1200, 0.06, 'sine', 0.18);
    },

    /**
     * Toggle sound on/off and update the sound button icon. Stores
     * the preference in localStorage.
     */
    toggleSound: function () {
        this._soundEnabled = !this._soundEnabled;

        // Initialize audio context on first enable (user gesture requirement)
        if (this._soundEnabled) {
            this.initAudio();
            // Resume suspended context if needed
            if (this._audioCtx && this._audioCtx.state === 'suspended') {
                this._audioCtx.resume();
            }
        }

        // Update button icon
        var btn = document.getElementById('btn-sound');
        if (btn) {
            btn.textContent = this._soundEnabled ? '\uD83D\uDD0A' : '\uD83D\uDD07';
        }

        // Persist preference
        try {
            localStorage.setItem('yugaaaaa-sound', this._soundEnabled ? '1' : '0');
        } catch (e) {
            // localStorage may be unavailable
        }
    },

    /**
     * Load the sound preference from localStorage and apply it.
     * Called during initialization.
     */
    loadSoundPreference: function () {
        try {
            var pref = localStorage.getItem('yugaaaaa-sound');
            this._soundEnabled = (pref === '1');
        } catch (e) {
            this._soundEnabled = false;
        }

        // Update button icon to match persisted state
        var btn = document.getElementById('btn-sound');
        if (btn) {
            btn.textContent = this._soundEnabled ? '\uD83D\uDD0A' : '\uD83D\uDD07';
        }
    },

    /**
     * Play a synthesized tone via the Web Audio API.
     *
     * @param {number} frequency - Tone frequency in Hz
     * @param {number} duration - Tone duration in seconds
     * @param {string} type - Oscillator type ('sine', 'square', 'triangle', 'sawtooth')
     * @param {number} volume - Gain value (0.0 to 1.0)
     */
    _playTone: function (frequency, duration, type, volume) {
        var ctx = this._audioCtx;
        if (!ctx) { return; }

        var oscillator = ctx.createOscillator();
        var gainNode = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

        // Quick fade-out to avoid click artifacts
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    },

    // ================================================================
    // Initialization
    // ================================================================

    /**
     * Initialize the effects system: load sound preference, wire up
     * the sound toggle button.
     */
    init: function () {
        this.loadSoundPreference();
        this.loadCursorPreference();

        var self = this;
        var soundBtn = document.getElementById('btn-sound');
        if (soundBtn) {
            // Use onclick assignment to prevent duplicate listener accumulation
            soundBtn.onclick = function () {
                self.toggleSound();
            };
        }
    }
};
