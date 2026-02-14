// ABOUTME: Site registry and content definitions for the fake internet.
// ABOUTME: Each site is a data object with URL, title, zone, access requirements, render function, and click targets.

/**
 * SiteRegistry stores all registered fake internet sites and provides
 * lookup methods by ID and zone. Also handles wiring up declarative
 * click targets after a site renders its DOM content.
 */
var SiteRegistry = {
    _sites: {},

    /**
     * Register a site object. The site must have at minimum an `id` property.
     *
     * @param {object} site - Site object conforming to the site data schema
     */
    register: function (site) {
        this._sites[site.id] = site;
    },

    /**
     * Look up a site by its unique ID string.
     *
     * @param {string} id - The site identifier
     * @returns {object|null} The site object, or null if not found
     */
    get: function (id) {
        return this._sites[id] || null;
    },

    /**
     * Return an array of all registered sites.
     *
     * @returns {object[]}
     */
    getAll: function () {
        return Object.values(this._sites);
    },

    /**
     * Return an array of sites belonging to the specified zone number.
     *
     * @param {number} zone - Zone number (1, 2, or 3)
     * @returns {object[]}
     */
    getByZone: function (zone) {
        return this.getAll().filter(function (s) { return s.zone === zone; });
    },

    /**
     * After a site's render() function has populated a container with DOM
     * content, this method wires up any declarative clickTargets defined
     * on the site object. Each click target specifies a CSS selector,
     * an optional reward, and an optional navigation action.
     *
     * @param {HTMLElement} container - The DOM container with rendered site content
     * @param {object} site - The site object (may have a clickTargets array)
     * @param {object} browser - The Browser controller for rewards and navigation
     */
    attachClickTargets: function (container, site, browser) {
        if (!site.clickTargets) { return; }

        site.clickTargets.forEach(function (target) {
            var elements = container.querySelectorAll(target.selector);
            elements.forEach(function (el) {
                el.classList.add('clickable');
                el.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Award reward currencies
                    if (target.reward) {
                        browser.handleReward(target.reward);
                    }

                    // Handle navigation action
                    if (target.action === 'navigate' && target.target) {
                        browser.navigate(target.target);
                    }

                    // Visual feedback: add .clicked class briefly
                    el.classList.add('clicked');
                    setTimeout(function () { el.classList.remove('clicked'); }, 200);
                });
            });
        });
    }
};

// --- Test site (pipeline verification) ---

SiteRegistry.register({
    id: 'test-site',
    url: 'http://www.test.com',
    title: 'Test Site',
    zone: 1,
    requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },
    render: function (container, browser) {
        container.className = 'zone-1';
        var h1 = document.createElement('h1');
        h1.textContent = 'Test Site Works!';
        container.appendChild(h1);
        var p = document.createElement('p');
        p.className = 'test-click-target';
        p.textContent = 'Click me for 5 clicks!';
        container.appendChild(p);
    },
    clickTargets: [
        { selector: '.test-click-target', reward: { clicks: 5 } }
    ]
});
