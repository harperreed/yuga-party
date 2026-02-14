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

// --- Yugaaaaa! Homepage — the 90s Yahoo-like starting portal ---

SiteRegistry.register({
    id: 'yugaaaaa',
    url: 'http://www.yugaaaaa.com',
    title: 'Yugaaaaa!',
    zone: 1,
    icon: '\uD83C\uDF10',
    requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-1 yugaaaaa-page';

        // Clear previous content
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Closure variable for hit counter
        var hitCount = 843297 + Math.floor(Math.random() * 100000);

        // ========================================
        // 1. Top marquee — welcome banner
        // ========================================
        var topMarquee = document.createElement('div');
        topMarquee.className = 'marquee yugaaaaa-top-marquee';
        var topMarqueeInner = document.createElement('div');
        topMarqueeInner.className = 'marquee-inner';

        var welcomeText = document.createTextNode('\uD83C\uDF10 Welcome to the INFORMATION SUPERHIGHWAY! \uD83C\uDF10 You are visitor #');
        topMarqueeInner.appendChild(welcomeText);

        var hitCounterSpan = document.createElement('span');
        hitCounterSpan.className = 'hit-counter';
        hitCounterSpan.textContent = String(hitCount);
        hitCounterSpan.addEventListener('click', function () {
            hitCount++;
            hitCounterSpan.textContent = String(hitCount);
        });
        topMarqueeInner.appendChild(hitCounterSpan);

        var trailingText = document.createTextNode(' \uD83C\uDF10 Have a GREAT day on the World Wide Web! \uD83C\uDF10');
        topMarqueeInner.appendChild(trailingText);
        topMarquee.appendChild(topMarqueeInner);
        container.appendChild(topMarquee);

        // ========================================
        // 2. Header area
        // ========================================
        var header = document.createElement('div');
        header.className = 'yugaaaaa-header';

        var logo = document.createElement('h1');
        logo.className = 'yugaaaaa-logo';
        logo.textContent = 'YUGAAAAA!';
        header.appendChild(logo);

        var subtitle = document.createElement('p');
        subtitle.className = 'yugaaaaa-subtitle';
        subtitle.textContent = "The Internet's #1 Portal Since 1996!";
        header.appendChild(subtitle);

        var rainbowHr = document.createElement('hr');
        rainbowHr.className = 'rainbow-hr';
        header.appendChild(rainbowHr);

        container.appendChild(header);

        // ========================================
        // 3. Search bar section
        // ========================================
        var searchSection = document.createElement('div');
        searchSection.className = 'yugaaaaa-search';

        var searchLabel = document.createElement('label');
        searchLabel.className = 'yugaaaaa-search-label';
        searchLabel.textContent = 'Search the Internet!';
        searchSection.appendChild(searchLabel);

        var searchRow = document.createElement('div');
        searchRow.className = 'yugaaaaa-search-row';

        var searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'yugaaaaa-search-input';
        searchInput.placeholder = 'Type your search here...';
        searchRow.appendChild(searchInput);

        var searchBtn = document.createElement('button');
        searchBtn.className = 'yugaaaaa-search-btn';
        searchBtn.textContent = 'Search!';
        searchRow.appendChild(searchBtn);

        searchSection.appendChild(searchRow);

        var searchPowered = document.createElement('p');
        searchPowered.className = 'yugaaaaa-search-powered';
        searchPowered.textContent = 'Powered by YugaaaSearch\u2122 Technology';
        searchSection.appendChild(searchPowered);

        container.appendChild(searchSection);

        // ========================================
        // 4. Banner ad (randomized)
        // ========================================
        var bannerAds = [
            { text: '\uD83D\uDD25 FREE INTERNET! Click Here! \uD83D\uDD25', clicks: 15 },
            { text: 'YOU are the 1,000,000th visitor! CLAIM YOUR PRIZE!', clicks: 25 },
            { text: 'Download MORE RAM now!! \u2192\u2192\u2192', clicks: 20 },
            { text: 'Hot Singles in Your Internet Connection Area!', clicks: 10 },
            { text: 'Make $$$ Fast with this ONE WEIRD TRICK', clicks: 15 }
        ];
        var chosenAd = bannerAds[Math.floor(Math.random() * bannerAds.length)];

        var bannerDiv = document.createElement('div');
        bannerDiv.className = 'banner-ad yugaaaaa-banner';
        bannerDiv.textContent = chosenAd.text;
        bannerDiv.setAttribute('data-clicks', String(chosenAd.clicks));
        // Banner click reward is handled manually since each ad has a different reward
        bannerDiv.addEventListener('click', function (e) {
            e.preventDefault();
            browser.handleReward({ clicks: chosenAd.clicks });
            bannerDiv.classList.add('clicked');
            setTimeout(function () { bannerDiv.classList.remove('clicked'); }, 200);
        });
        container.appendChild(bannerDiv);

        // ========================================
        // 5. Main content area: categories + sidebar
        // ========================================
        var mainArea = document.createElement('div');
        mainArea.className = 'yugaaaaa-main';

        // --- Categories grid ---
        var categoriesDiv = document.createElement('div');
        categoriesDiv.className = 'yugaaaaa-categories';

        var catHeader = document.createElement('h2');
        catHeader.textContent = 'Browse the Web by Category';
        categoriesDiv.appendChild(catHeader);

        var categories = [
            { emoji: '\uD83C\uDFA8', label: 'Arts & Humanities', site: 'coolguyz' },
            { emoji: '\uD83D\uDCBC', label: 'Business & Economy', site: 'hamstertrax' },
            { emoji: '\uD83D\uDDA5', label: 'Computers & Internet', site: 'webring' },
            { emoji: '\uD83C\uDFAD', label: 'Entertainment', site: 'freesmileyz' },
            { emoji: '\uD83D\uDCF0', label: 'News & Media', site: 'totallyrealfacts' },
            { emoji: '\uD83C\uDFC8', label: 'Recreation & Sports', site: 'mega-deals-warehouse' },
            { emoji: '\uD83C\uDF73', label: 'Food & Cooking', site: 'recipez4u' },
            { emoji: '\uD83D\uDCAC', label: 'Community & Chat', site: 'infinite-guestbook' }
        ];

        var catGrid = document.createElement('div');
        catGrid.className = 'yugaaaaa-cat-grid';

        categories.forEach(function (cat) {
            var link = document.createElement('a');
            link.className = 'category-link';
            link.href = '#';
            link.setAttribute('data-site', cat.site);
            link.textContent = cat.emoji + ' ' + cat.label;
            catGrid.appendChild(link);
        });

        categoriesDiv.appendChild(catGrid);
        mainArea.appendChild(categoriesDiv);

        // --- Sidebar ---
        var sidebar = document.createElement('div');
        sidebar.className = 'yugaaaaa-sidebar';

        // Cool Site of the Day
        var coolSiteWidget = document.createElement('div');
        coolSiteWidget.className = 'yugaaaaa-widget';
        var coolSiteTitle = document.createElement('h3');
        coolSiteTitle.textContent = '\u2B50 Cool Site of the Day';
        coolSiteWidget.appendChild(coolSiteTitle);
        var coolSiteNames = ['HamsterTrax', "Kevin's Cool Page", 'Recipez4U', 'FreeSmileyZ', 'TotallyRealFacts'];
        var coolSitePick = coolSiteNames[Math.floor(Math.random() * coolSiteNames.length)];
        var coolSiteP = document.createElement('p');
        coolSiteP.textContent = coolSitePick;
        coolSiteWidget.appendChild(coolSiteP);
        sidebar.appendChild(coolSiteWidget);

        // Weather widget
        var weatherWidget = document.createElement('div');
        weatherWidget.className = 'yugaaaaa-widget';
        var weatherTitle = document.createElement('h3');
        weatherTitle.textContent = 'Internet Weather';
        weatherWidget.appendChild(weatherTitle);
        var weatherP = document.createElement('p');
        weatherP.textContent = '\u2600\uFE0F SUNNY with a chance of pop-ups';
        weatherWidget.appendChild(weatherP);
        sidebar.appendChild(weatherWidget);

        // Email widget
        var emailWidget = document.createElement('div');
        emailWidget.className = 'yugaaaaa-widget email-widget';
        var emailText = document.createElement('p');
        emailText.textContent = '\uD83D\uDCE7 You have 9,999 unread messages!';
        emailWidget.appendChild(emailText);
        sidebar.appendChild(emailWidget);

        // Web counter widget
        var counterWidget = document.createElement('div');
        counterWidget.className = 'yugaaaaa-widget';
        var counterTitle = document.createElement('h3');
        counterTitle.textContent = 'Web Counter';
        counterWidget.appendChild(counterTitle);
        var counterSpan = document.createElement('span');
        counterSpan.className = 'hit-counter yugaaaaa-web-counter';
        counterSpan.textContent = String(hitCount);
        counterWidget.appendChild(counterSpan);
        sidebar.appendChild(counterWidget);

        mainArea.appendChild(sidebar);
        container.appendChild(mainArea);

        // ========================================
        // 6. "What's New on the Internet" section
        // ========================================
        var newsSection = document.createElement('div');
        newsSection.className = 'yugaaaaa-news';

        var newsHeader = document.createElement('h2');
        newsHeader.textContent = "\uD83D\uDCF0 What's New on the Internet";
        newsSection.appendChild(newsHeader);

        var newsList = document.createElement('ul');
        newsList.className = 'yugaaaaa-news-list';

        var headlines = [
            { text: 'LOCAL HAMSTER BREAKS STOCK MARKET RECORD', site: 'hamstertrax' },
            { text: "Kevin's Spoon Collection Reaches 47 Spoons", site: 'coolguyz' },
            { text: 'RECIPE: How to Make Toast on Toast', site: 'recipez4u' },
            { text: 'Scientists Confirm: The Sun is Cold', site: 'totallyrealfacts' },
            { text: 'DOWNLOAD: 500 Free Smileys (No Virus!)', site: 'freesmileyz' }
        ];

        headlines.forEach(function (headline) {
            var li = document.createElement('li');
            var link = document.createElement('a');
            link.className = 'news-link';
            link.href = '#';
            link.setAttribute('data-site', headline.site);
            link.textContent = headline.text;
            li.appendChild(link);
            newsList.appendChild(li);
        });

        newsSection.appendChild(newsList);
        container.appendChild(newsSection);

        // ========================================
        // 7. Stock ticker marquee
        // ========================================
        var tickerMarquee = document.createElement('div');
        tickerMarquee.className = 'marquee yugaaaaa-ticker';
        var tickerInner = document.createElement('div');
        tickerInner.className = 'marquee-inner';

        var stocks = [
            { name: 'HMSTR', change: '+420%' },
            { name: 'TOAST', change: '-69%' },
            { name: 'SPOON', change: '+1337%' },
            { name: 'WEBRING', change: '+\u221E%' },
            { name: 'CLICK', change: '-0.01%' }
        ];

        stocks.forEach(function (stock, idx) {
            if (idx > 0) {
                tickerInner.appendChild(document.createTextNode(' | '));
            }
            var stockSpan = document.createElement('span');
            stockSpan.className = 'stock-item';
            stockSpan.textContent = stock.name + ' ' + stock.change;
            tickerInner.appendChild(stockSpan);
        });

        tickerMarquee.appendChild(tickerInner);
        container.appendChild(tickerMarquee);

        // ========================================
        // 8. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'yugaaaaa-footer';

        var footerLines = [
            '\u00A9 1996-1999 Yugaaaaa! Inc. All Rights Reserved.',
            'Best viewed in Netscape Navigator 4.0 at 800x600',
            'This site is Netscape Now! approved'
        ];

        footerLines.forEach(function (line) {
            var p = document.createElement('p');
            p.textContent = line;
            footer.appendChild(p);
        });

        // Webring navigation
        var webringNav = document.createElement('div');
        webringNav.className = 'webring-nav';
        webringNav.textContent = '[\u2190 Previous] [Random] [Next \u2192]';
        footer.appendChild(webringNav);

        container.appendChild(footer);
    },

    clickTargets: [
        // Category links — navigate and earn clicks
        { selector: '[data-site="coolguyz"]', reward: { clicks: 5 }, action: 'navigate', target: 'coolguyz' },
        { selector: '[data-site="hamstertrax"]', reward: { clicks: 5 }, action: 'navigate', target: 'hamstertrax' },
        { selector: '[data-site="webring"]', reward: { clicks: 5 }, action: 'navigate', target: 'webring' },
        { selector: '[data-site="freesmileyz"]', reward: { clicks: 5 }, action: 'navigate', target: 'freesmileyz' },
        { selector: '[data-site="totallyrealfacts"]', reward: { clicks: 5 }, action: 'navigate', target: 'totallyrealfacts' },
        { selector: '[data-site="mega-deals-warehouse"]', reward: { clicks: 5 }, action: 'navigate', target: 'mega-deals-warehouse' },
        { selector: '[data-site="recipez4u"]', reward: { clicks: 5 }, action: 'navigate', target: 'recipez4u' },
        { selector: '[data-site="infinite-guestbook"]', reward: { clicks: 5 }, action: 'navigate', target: 'infinite-guestbook' },

        // Hit counter
        { selector: '.hit-counter', reward: { clicks: 1 } },

        // Stock ticker items
        { selector: '.stock-item', reward: { clicks: 2 } },

        // Email widget
        { selector: '.email-widget', reward: { clicks: 5 } }

        // Banner ad is handled manually inside render() because each ad has a unique reward value
    ]
});
