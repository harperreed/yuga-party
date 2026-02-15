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

                    // Play subtle click sound
                    if (typeof Effects !== 'undefined') {
                        Effects.playClick();
                    }

                    // Award reward currencies with click position for floating text
                    if (target.reward) {
                        browser.handleReward(target.reward, e.clientX, e.clientY);
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

        // Closure variable for hit counter — special case if player reached the end
        var hasReachedEnd = browser.gameState.reachedEnd;
        var hitCount = hasReachedEnd ? 1 : (843297 + Math.floor(Math.random() * 100000));

        // ========================================
        // 1. Top marquee — welcome banner
        // ========================================
        var topMarquee = document.createElement('div');
        topMarquee.className = 'marquee yugaaaaa-top-marquee';
        var topMarqueeInner = document.createElement('div');
        topMarqueeInner.className = 'marquee-inner';

        var welcomePrefix = hasReachedEnd
            ? '\uD83C\uDF10 Welcome back. \uD83C\uDF10 You are visitor #'
            : '\uD83C\uDF10 Welcome to the INFORMATION SUPERHIGHWAY! \uD83C\uDF10 You are visitor #';
        var welcomeText = document.createTextNode(welcomePrefix);
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
        var bannerAds = hasReachedEnd
            ? [{ text: 'Welcome back.', clicks: 100 }]
            : [
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
            browser.handleReward({ clicks: chosenAd.clicks }, e.clientX, e.clientY);
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

        // Hit counter — awards data to build toward Zone 2
        { selector: '.hit-counter', reward: { clicks: 1, data: 2 } },

        // Stock ticker items
        { selector: '.stock-item', reward: { clicks: 2, data: 1 } },

        // Email widget
        { selector: '.email-widget', reward: { clicks: 5, data: 3 } }

        // Banner ad is handled manually inside render() because each ad has a unique reward value
    ]
});

// --- HamsterTrax — Your #1 Source for Hamster Info ---

SiteRegistry.register({
    id: 'hamstertrax',
    url: 'http://www.hamstertrax.com',
    title: 'HamsterTrax - #1 Hamster Info Source!',
    zone: 1,
    icon: '\uD83D\uDC39',
    requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-1 hamstertrax-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // ========================================
        // 1. Header
        // ========================================
        var header = document.createElement('div');
        header.className = 'hamstertrax-header';

        var logo = document.createElement('h1');
        logo.className = 'hamstertrax-logo';
        logo.textContent = '\uD83D\uDC39 HamsterTrax';
        header.appendChild(logo);

        var subtitle = document.createElement('p');
        subtitle.className = 'hamstertrax-subtitle';
        subtitle.textContent = 'Your #1 Source for Hamster Info Since 1997!';
        header.appendChild(subtitle);

        var rainbowHr = document.createElement('hr');
        rainbowHr.className = 'rainbow-hr';
        header.appendChild(rainbowHr);

        container.appendChild(header);

        // ========================================
        // 2. MIDI player widget (cosmetic)
        // ========================================
        var midiWidget = document.createElement('div');
        midiWidget.className = 'hamstertrax-midi';

        var midiLabel = document.createElement('span');
        midiLabel.textContent = '\u266B Now Playing: hamsterdance.mid ';
        midiWidget.appendChild(midiLabel);

        var stopBtn = document.createElement('button');
        stopBtn.className = 'midi-btn';
        stopBtn.textContent = '\u25A0 Stop';
        midiWidget.appendChild(stopBtn);

        var spacer = document.createTextNode(' ');
        midiWidget.appendChild(spacer);

        var playBtn = document.createElement('button');
        playBtn.className = 'midi-btn';
        playBtn.textContent = '\u25BA Play';
        midiWidget.appendChild(playBtn);

        container.appendChild(midiWidget);

        // ========================================
        // 3. Main content area: gallery + sidebar
        // ========================================
        var mainArea = document.createElement('div');
        mainArea.className = 'hamstertrax-main';

        // --- Photo gallery ---
        var gallery = document.createElement('div');
        gallery.className = 'hamstertrax-gallery';

        var galleryTitle = document.createElement('h2');
        galleryTitle.textContent = '\uD83D\uDCF8 Hamster Photo Gallery';
        gallery.appendChild(galleryTitle);

        var galleryGrid = document.createElement('div');
        galleryGrid.className = 'hamstertrax-gallery-grid';

        var hamsters = [
            { name: 'Mr. Whiskers', color: '#ffb3ba' },
            { name: 'Hamtaro Jr.', color: '#bae1ff' },
            { name: 'Sir Nibbles III', color: '#baffc9' },
            { name: 'Princess Fluffbutt', color: '#ffffba' },
            { name: 'Captain Wheelrunner', color: '#e8baff' },
            { name: 'The Notorious H.A.M.', color: '#ffdfba' }
        ];

        hamsters.forEach(function (hamster) {
            var photo = document.createElement('div');
            photo.className = 'hamster-photo';
            photo.style.backgroundColor = hamster.color;

            var emoji = document.createElement('div');
            emoji.className = 'hamster-photo-emoji';
            emoji.textContent = '\uD83D\uDC39';
            photo.appendChild(emoji);

            var name = document.createElement('div');
            name.className = 'hamster-photo-name';
            name.textContent = hamster.name;
            photo.appendChild(name);

            galleryGrid.appendChild(photo);
        });

        gallery.appendChild(galleryGrid);
        mainArea.appendChild(gallery);

        // --- Sidebar: Hamster Stock Exchange ---
        var sidebar = document.createElement('div');
        sidebar.className = 'hamstertrax-sidebar';

        var stockTitle = document.createElement('h3');
        stockTitle.textContent = '\uD83D\uDC39 Hamster Stock Exchange';
        sidebar.appendChild(stockTitle);

        var stockTable = document.createElement('table');
        stockTable.className = 'hamstertrax-stock-table';

        var stockHeader = document.createElement('tr');
        var thBreed = document.createElement('th');
        thBreed.textContent = 'Breed';
        stockHeader.appendChild(thBreed);
        var thPrice = document.createElement('th');
        thPrice.textContent = 'Price';
        stockHeader.appendChild(thPrice);
        var thTrend = document.createElement('th');
        thTrend.textContent = 'Trend';
        stockHeader.appendChild(thTrend);
        stockTable.appendChild(stockHeader);

        var stocks = [
            { breed: 'Syrian Golden', price: '$42.00', trend: '\u2191' },
            { breed: 'Dwarf Campbell', price: '$18.50', trend: '\u2193' },
            { breed: 'Roborovski', price: '$99.99', trend: '\u2191\u2191' },
            { breed: 'Chinese', price: '$7.77', trend: '\u2192' },
            { breed: 'Winter White', price: '$33.33', trend: '\u2191' }
        ];

        stocks.forEach(function (stock) {
            var row = document.createElement('tr');
            row.className = 'stock-row';

            var tdBreed = document.createElement('td');
            tdBreed.textContent = stock.breed;
            row.appendChild(tdBreed);

            var tdPrice = document.createElement('td');
            tdPrice.textContent = stock.price;
            row.appendChild(tdPrice);

            var tdTrend = document.createElement('td');
            tdTrend.textContent = stock.trend;
            row.appendChild(tdTrend);

            stockTable.appendChild(row);
        });

        sidebar.appendChild(stockTable);
        mainArea.appendChild(sidebar);
        container.appendChild(mainArea);

        // ========================================
        // 4. Adopt button
        // ========================================
        var adoptBtn = document.createElement('button');
        adoptBtn.className = 'adopt-btn';
        adoptBtn.textContent = '\uD83D\uDC39 Adopt a Virtual Hamster! \uD83D\uDC39';
        container.appendChild(adoptBtn);

        // ========================================
        // 5. Guestbook link
        // ========================================
        var guestbookDiv = document.createElement('div');
        guestbookDiv.className = 'hamstertrax-guestbook';

        var guestbookLink = document.createElement('a');
        guestbookLink.className = 'guestbook-link';
        guestbookLink.href = '#';
        guestbookLink.textContent = '\uD83D\uDCD6 Sign Our Guestbook!';
        guestbookDiv.appendChild(guestbookLink);

        container.appendChild(guestbookDiv);

        // ========================================
        // 6. Footer with Netscape badge
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'hamstertrax-footer';

        var netscapeBadge = document.createElement('div');
        netscapeBadge.className = 'netscape-badge';
        netscapeBadge.textContent = '\uD83C\uDF10 Best viewed with Netscape Navigator';
        footer.appendChild(netscapeBadge);

        var copyright = document.createElement('p');
        copyright.textContent = '\u00A9 1997 HamsterTrax. All hamsters reserved.';
        footer.appendChild(copyright);

        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.hamster-photo', reward: { clicks: 3, data: 2 } },
        { selector: '.stock-row', reward: { clicks: 2, data: 1 } },
        { selector: '.midi-btn', reward: { clicks: 5, data: 3 } },
        { selector: '.adopt-btn', reward: { reputation: 10, data: 2 } },
        { selector: '.guestbook-link', reward: { reputation: 5 }, action: 'navigate', target: 'infinite-guestbook' }
    ]
});

// --- Kevin's Page — coolguyz.net ---

SiteRegistry.register({
    id: 'coolguyz',
    url: 'http://www.coolguyz.net',
    title: "Kevin's Page - coolguyz.net",
    zone: 1,
    icon: '\uD83D\uDE0E',
    requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-1 coolguyz-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Track under-construction click count in a closure
        var constructionClicks = 0;

        // ========================================
        // 1. Under construction banner
        // ========================================
        var ucBanner = document.createElement('div');
        ucBanner.className = 'under-construction-banner';
        ucBanner.textContent = '\uD83D\uDEA7 THIS PAGE IS UNDER CONSTRUCTION \uD83D\uDEA7';

        // Hidden secret text revealed after 50 clicks
        var secretText = document.createElement('div');
        secretText.className = 'coolguyz-secret';
        secretText.textContent = "KEVIN'S SECRET: Gerald the hamster can do a backflip";
        secretText.style.display = 'none';
        ucBanner.appendChild(secretText);

        ucBanner.addEventListener('click', function () {
            constructionClicks++;
            if (constructionClicks >= 50) {
                secretText.style.display = 'block';
            }
        });

        container.appendChild(ucBanner);

        // ========================================
        // 2. WordArt-style header
        // ========================================
        var header = document.createElement('div');
        header.className = 'coolguyz-header';

        var wordart = document.createElement('h1');
        wordart.className = 'coolguyz-wordart';
        wordart.textContent = "Welcome to Kevin's Page";
        header.appendChild(wordart);

        container.appendChild(header);

        // ========================================
        // 3. About Me section
        // ========================================
        var aboutSection = document.createElement('div');
        aboutSection.className = 'coolguyz-about';

        var aboutTitle = document.createElement('h2');
        aboutTitle.textContent = 'About Me';
        aboutSection.appendChild(aboutTitle);

        var aboutText = document.createElement('p');
        aboutText.textContent = 'My name is Kevin. I am 12. I like spoons. My favorite color is blue. My favorite food is macaroni. I have a hamster named Gerald.';
        aboutSection.appendChild(aboutText);

        container.appendChild(aboutSection);

        // ========================================
        // 4. Spoon Collection gallery
        // ========================================
        var spoonSection = document.createElement('div');
        spoonSection.className = 'coolguyz-spoons';

        var spoonTitle = document.createElement('h2');
        spoonTitle.textContent = '\uD83E\uDD44 My Spoon Collection \uD83E\uDD44';
        spoonSection.appendChild(spoonTitle);

        var spoonGrid = document.createElement('div');
        spoonGrid.className = 'coolguyz-spoon-grid';

        var spoons = [
            'Spoon #1: The Regular One (found at Denny\'s)',
            'Spoon #2: The Big One (from Grandma)',
            'Spoon #3: The Bent One (accident)',
            'Spoon #4: The Fancy One (Christmas 1998)',
            'Spoon #5: The Wooden One (camp)',
            'Spoon #6: The Mystery One (appeared one day)',
            'Spoon #7: The Plastic One (from the hospital)',
            'Spoon #8: Gerald\'s Spoon (he chose it himself)'
        ];

        spoons.forEach(function (spoonDesc) {
            var item = document.createElement('div');
            item.className = 'spoon-item';

            var emoji = document.createElement('div');
            emoji.className = 'spoon-emoji';
            emoji.textContent = '\uD83E\uDD44';
            item.appendChild(emoji);

            var desc = document.createElement('div');
            desc.className = 'spoon-desc';
            desc.textContent = spoonDesc;
            item.appendChild(desc);

            spoonGrid.appendChild(item);
        });

        spoonSection.appendChild(spoonGrid);
        container.appendChild(spoonSection);

        // ========================================
        // 5. Visitor counter
        // ========================================
        var counterDiv = document.createElement('div');
        counterDiv.className = 'coolguyz-counter';

        var counterLabel = document.createElement('span');
        counterLabel.textContent = 'You are visitor number: ';
        counterDiv.appendChild(counterLabel);

        var hitCounter = document.createElement('span');
        hitCounter.className = 'hit-counter';
        hitCounter.textContent = String(47 + Math.floor(Math.random() * 100));
        counterDiv.appendChild(hitCounter);

        container.appendChild(counterDiv);

        // ========================================
        // 6. Guestbook
        // ========================================
        var guestbookDiv = document.createElement('div');
        guestbookDiv.className = 'coolguyz-guestbook';

        var guestbookLink = document.createElement('a');
        guestbookLink.className = 'guestbook-link';
        guestbookLink.href = '#';
        guestbookLink.textContent = "\uD83D\uDCD6 Sign Kevin's Guestbook!";
        guestbookDiv.appendChild(guestbookLink);

        container.appendChild(guestbookDiv);

        // ========================================
        // 7. Friend links
        // ========================================
        var friendsDiv = document.createElement('div');
        friendsDiv.className = 'coolguyz-friends';

        var friendsLabel = document.createElement('span');
        friendsLabel.textContent = "My friend's pages: ";
        friendsDiv.appendChild(friendsLabel);

        var friendSites = [
            { label: 'HamsterTrax', site: 'hamstertrax' },
            { label: 'Recipez4U', site: 'recipez4u' }
        ];

        friendSites.forEach(function (friend, idx) {
            if (idx > 0) {
                friendsDiv.appendChild(document.createTextNode(' '));
            }
            var link = document.createElement('a');
            link.className = 'friend-link';
            link.href = '#';
            link.setAttribute('data-site', friend.site);
            link.textContent = '[' + friend.label + ']';
            friendsDiv.appendChild(link);
        });

        container.appendChild(friendsDiv);

        // ========================================
        // 8. Webring footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'coolguyz-footer';

        var webring = document.createElement('div');
        webring.className = 'webring-nav';
        webring.textContent = 'coolguyz.net is a proud member of the Spoon Lovers WebRing';
        footer.appendChild(webring);

        var webringLinks = document.createElement('div');
        webringLinks.className = 'webring-nav';
        webringLinks.textContent = '[\u2190 Previous] [Random] [Next \u2192]';
        footer.appendChild(webringLinks);

        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.spoon-item', reward: { clicks: 2, data: 1 } },
        { selector: '.under-construction-banner', reward: { clicks: 1, data: 1 } },
        { selector: '.hit-counter', reward: { clicks: 1, data: 1 } },
        { selector: '.guestbook-link', reward: { reputation: 5 }, action: 'navigate', target: 'infinite-guestbook' },
        { selector: '.friend-link[data-site="hamstertrax"]', reward: { clicks: 3 }, action: 'navigate', target: 'hamstertrax' },
        { selector: '.friend-link[data-site="recipez4u"]', reward: { clicks: 3 }, action: 'navigate', target: 'recipez4u' }
    ]
});

// --- Recipez4U — The Internet's Premier Toast Resource ---

SiteRegistry.register({
    id: 'recipez4u',
    url: 'http://www.recipez4u.com',
    title: 'Recipez4U - Every Recipe is Toast',
    zone: 1,
    icon: '\uD83C\uDF5E',
    requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-1 recipez4u-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // ========================================
        // 1. Header
        // ========================================
        var header = document.createElement('div');
        header.className = 'recipez4u-header';

        var logo = document.createElement('h1');
        logo.className = 'recipez4u-logo';
        logo.textContent = '\uD83C\uDF5E Recipez4U \uD83C\uDF5E';
        header.appendChild(logo);

        var subtitle = document.createElement('p');
        subtitle.className = 'recipez4u-subtitle';
        subtitle.textContent = "The Internet's Premier Toast Resource";
        header.appendChild(subtitle);

        var rainbowHr = document.createElement('hr');
        rainbowHr.className = 'rainbow-hr';
        header.appendChild(rainbowHr);

        container.appendChild(header);

        // ========================================
        // 2. Recipe of the Day featured box
        // ========================================
        var featured = document.createElement('div');
        featured.className = 'recipez4u-featured';

        var featuredTitle = document.createElement('h2');
        featuredTitle.className = 'blink';
        featuredTitle.textContent = '\u2B50 RECIPE OF THE DAY: Extreme Toast \u2B50';
        featured.appendChild(featuredTitle);

        var featuredDesc = document.createElement('p');
        featuredDesc.textContent = 'Take toast. Add more toast. Stack vertically. This is Extreme Toast.';
        featured.appendChild(featuredDesc);

        container.appendChild(featured);

        // ========================================
        // 3. Recipe cards
        // ========================================
        var recipesSection = document.createElement('div');
        recipesSection.className = 'recipez4u-recipes';

        var recipes = [
            {
                emoji: '\uD83C\uDF05',
                title: 'Breakfast Toast',
                desc: 'Toast with toast crumbs on top. Prep time: 2 min. Pairs well with: more toast.'
            },
            {
                emoji: '\uD83E\uDD6A',
                title: 'Lunch Toast',
                desc: 'Two slices of toast with a slice of toast in between. The classic toast sandwich.'
            },
            {
                emoji: '\uD83C\uDF7D',
                title: 'Dinner Toast',
                desc: 'Toast flamb\u00E9. Burn the toast. Serve on a plate. Garnish with breadcrumbs.'
            },
            {
                emoji: '\uD83C\uDF70',
                title: 'Dessert Toast',
                desc: 'Toast \u00E0 la mode. Put ice cream on toast. The ice cream will melt. This is fine.'
            },
            {
                emoji: '\uD83D\uDEA8',
                title: 'Emergency Toast',
                desc: 'For when all other toast has failed. Instructions: Toast.'
            }
        ];

        recipes.forEach(function (recipe) {
            var card = document.createElement('div');
            card.className = 'recipe-card';

            var cardTitle = document.createElement('h3');
            cardTitle.textContent = recipe.emoji + ' ' + recipe.title;
            card.appendChild(cardTitle);

            var cardDesc = document.createElement('p');
            cardDesc.textContent = recipe.desc;
            card.appendChild(cardDesc);

            var printBtn = document.createElement('button');
            printBtn.className = 'print-btn';
            printBtn.textContent = '\uD83D\uDDA8 PRINT RECIPE';
            card.appendChild(printBtn);

            recipesSection.appendChild(card);
        });

        container.appendChild(recipesSection);

        // ========================================
        // 4. Pro tip callout
        // ========================================
        var proTip = document.createElement('div');
        proTip.className = 'recipez4u-protip';

        var proTipTitle = document.createElement('strong');
        proTipTitle.textContent = '\uD83D\uDCA1 Pro Tip: ';
        proTip.appendChild(proTipTitle);

        var proTipText = document.createTextNode('Always butter BOTH sides of the toast');
        proTip.appendChild(proTipText);

        container.appendChild(proTip);

        // ========================================
        // 5. Submit recipe form
        // ========================================
        var formSection = document.createElement('div');
        formSection.className = 'recipez4u-submit';

        var formTitle = document.createElement('h2');
        formTitle.textContent = 'Submit YOUR Toast Recipe!';
        formSection.appendChild(formTitle);

        var formRow = document.createElement('div');
        formRow.className = 'recipez4u-form-row';

        var formInput = document.createElement('input');
        formInput.type = 'text';
        formInput.className = 'recipez4u-input';
        formInput.placeholder = 'Describe your toast masterpiece...';
        formRow.appendChild(formInput);

        var submitBtn = document.createElement('button');
        submitBtn.className = 'submit-recipe-btn';
        submitBtn.textContent = 'Submit!';
        formRow.appendChild(submitBtn);

        formSection.appendChild(formRow);
        container.appendChild(formSection);

        // ========================================
        // 6. Cookbook banner ad
        // ========================================
        var cookbookAd = document.createElement('div');
        cookbookAd.className = 'banner-ad cookbook-ad';
        cookbookAd.textContent = "\uD83D\uDCD5 Buy the Recipez4U Cookbook! Only $49.99! (it's just a picture of toast)";
        container.appendChild(cookbookAd);

        // ========================================
        // 7. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'recipez4u-footer';

        var copyright = document.createElement('p');
        copyright.textContent = '\u00A9 1998 Recipez4U. Toast rights reserved.';
        footer.appendChild(copyright);

        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.recipe-card', reward: { clicks: 3, data: 2 } },
        { selector: '.print-btn', reward: { clicks: 5, data: 3 } },
        { selector: '.submit-recipe-btn', reward: { reputation: 8, data: 2 } },
        { selector: '.cookbook-ad', reward: { clicks: 10, data: 5 } }
    ]
});

// --- NetSurf WebRing Hub — Connecting the World Wide Web ---

SiteRegistry.register({
    id: 'webring',
    url: 'http://www2.netsurf.org/~webring',
    title: 'NetSurf WebRing Hub',
    zone: 1,
    icon: '\uD83D\uDD17',
    requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-1 webring-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Member sites data for the webring
        var memberSites = [
            { id: 'yugaaaaa', name: 'yugaaaaa.com', desc: "The Internet's Premier Portal" },
            { id: 'hamstertrax', name: 'hamstertrax.com', desc: 'Everything Hamster, All Day' },
            { id: 'coolguyz', name: 'coolguyz.net', desc: "Kevin's Personal Homepage" },
            { id: 'recipez4u', name: 'recipez4u.com', desc: 'Toast Recipes and More (Just Kidding, Only Toast)' },
            { id: 'totallyrealfacts', name: 'totallyrealfacts.com', desc: '100% Verified Real Facts' },
            { id: 'freesmileyz', name: 'freesmileyz.biz', desc: 'Free Downloads, No Virus We Promise' },
            { id: 'mega-deals-warehouse', name: 'mega-deals-warehouse.com', desc: 'Unbeatable Deals on Stuff' }
        ];

        // Track current index for Previous/Next navigation
        var currentIndex = 0;

        // Helper to build the webring navigation bar
        function buildWebringNav() {
            var nav = document.createElement('div');
            nav.className = 'webring-nav-bar';

            var prevBtn = document.createElement('a');
            prevBtn.className = 'webring-nav-link';
            prevBtn.href = '#';
            prevBtn.textContent = '\u2190 Previous';
            prevBtn.addEventListener('click', function (e) {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + memberSites.length) % memberSites.length;
                browser.handleReward({ clicks: 5 });
                browser.navigate(memberSites[currentIndex].id);
            });
            nav.appendChild(prevBtn);

            var randomBtn = document.createElement('a');
            randomBtn.className = 'webring-nav-link';
            randomBtn.href = '#';
            randomBtn.textContent = 'Random';
            randomBtn.addEventListener('click', function (e) {
                e.preventDefault();
                var randIdx = Math.floor(Math.random() * memberSites.length);
                browser.handleReward({ clicks: 5 });
                browser.navigate(memberSites[randIdx].id);
            });
            nav.appendChild(randomBtn);

            var nextBtn = document.createElement('a');
            nextBtn.className = 'webring-nav-link';
            nextBtn.href = '#';
            nextBtn.textContent = 'Next \u2192';
            nextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % memberSites.length;
                browser.handleReward({ clicks: 5 });
                browser.navigate(memberSites[currentIndex].id);
            });
            nav.appendChild(nextBtn);

            return nav;
        }

        // ========================================
        // 1. Header
        // ========================================
        var header = document.createElement('div');
        header.className = 'webring-header';

        var logo = document.createElement('h1');
        logo.className = 'webring-logo';
        logo.textContent = '\uD83D\uDD17 NetSurf WebRing \u2014 Connecting the World Wide Web!';
        header.appendChild(logo);

        var subtitle = document.createElement('p');
        subtitle.className = 'webring-subtitle';
        subtitle.textContent = 'The Best of the Web, All in One Ring!';
        header.appendChild(subtitle);

        var rainbowHr = document.createElement('hr');
        rainbowHr.className = 'rainbow-hr';
        header.appendChild(rainbowHr);

        container.appendChild(header);

        // ========================================
        // 2. Top webring navigation
        // ========================================
        container.appendChild(buildWebringNav());

        // ========================================
        // 3. Banner ad (top)
        // ========================================
        var topBanner = document.createElement('div');
        topBanner.className = 'banner-ad webring-banner';
        topBanner.textContent = '\uD83D\uDD25 JOIN THE WEBRING REVOLUTION! Your Site Could Be Here! \uD83D\uDD25';
        container.appendChild(topBanner);

        // ========================================
        // 4. Member sites listing
        // ========================================
        var listSection = document.createElement('div');
        listSection.className = 'webring-listings';

        memberSites.forEach(function (site, idx) {
            var entry = document.createElement('div');
            entry.className = 'webring-entry';

            var siteNum = document.createElement('span');
            siteNum.className = 'webring-entry-num';
            siteNum.textContent = '#' + (idx + 1);
            entry.appendChild(siteNum);

            var siteInfo = document.createElement('div');
            siteInfo.className = 'webring-entry-info';

            var siteName = document.createElement('strong');
            siteName.textContent = site.name;
            siteInfo.appendChild(siteName);

            var siteDesc = document.createElement('p');
            siteDesc.textContent = site.desc;
            siteInfo.appendChild(siteDesc);

            entry.appendChild(siteInfo);

            var visitLink = document.createElement('a');
            visitLink.className = 'webring-visit';
            visitLink.href = '#';
            visitLink.setAttribute('data-site', site.id);
            visitLink.textContent = 'Visit \u2192';
            entry.appendChild(visitLink);

            listSection.appendChild(entry);

            // Insert a banner ad after every 3rd listing
            if ((idx + 1) % 3 === 0 && idx < memberSites.length - 1) {
                var midBanner = document.createElement('div');
                midBanner.className = 'banner-ad webring-banner';
                var adTexts = [
                    '\uD83C\uDF10 Get Your OWN WebRing! Only $9.99/month!',
                    '\u2B50 WebRing Pro: Unlimited Sites, Unlimited Fun!',
                    '\uD83D\uDCE7 FREE WebRing Newsletter - Subscribe Now!'
                ];
                midBanner.textContent = adTexts[Math.floor(Math.random() * adTexts.length)];
                listSection.appendChild(midBanner);
            }
        });

        container.appendChild(listSection);

        // ========================================
        // 5. Join button
        // ========================================
        var joinSection = document.createElement('div');
        joinSection.className = 'webring-join-section';

        var joinBtn = document.createElement('button');
        joinBtn.className = 'join-btn';
        joinBtn.textContent = '\uD83D\uDD17 Join This WebRing!';
        joinSection.appendChild(joinBtn);

        container.appendChild(joinSection);

        // ========================================
        // 6. Bottom banner ad
        // ========================================
        var bottomBanner = document.createElement('div');
        bottomBanner.className = 'banner-ad webring-banner';
        bottomBanner.textContent = '\uD83C\uDF1F Best of the Web Award Winner 1997! Click to Nominate YOUR Site!';
        container.appendChild(bottomBanner);

        // ========================================
        // 7. Bottom webring navigation
        // ========================================
        container.appendChild(buildWebringNav());

        // ========================================
        // 8. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'webring-footer';

        var footerText = document.createElement('p');
        footerText.textContent = 'This WebRing has been running since 1996. 847 sites and counting!';
        footer.appendChild(footerText);

        var copyright = document.createElement('p');
        copyright.textContent = '\u00A9 1996-1999 NetSurf WebRing. All rights reserved.';
        footer.appendChild(copyright);

        container.appendChild(footer);
    },

    clickTargets: [
        // Visit links navigate to the target site
        { selector: '.webring-visit[data-site="yugaaaaa"]', reward: { clicks: 3 }, action: 'navigate', target: 'yugaaaaa' },
        { selector: '.webring-visit[data-site="hamstertrax"]', reward: { clicks: 3 }, action: 'navigate', target: 'hamstertrax' },
        { selector: '.webring-visit[data-site="coolguyz"]', reward: { clicks: 3 }, action: 'navigate', target: 'coolguyz' },
        { selector: '.webring-visit[data-site="recipez4u"]', reward: { clicks: 3 }, action: 'navigate', target: 'recipez4u' },
        { selector: '.webring-visit[data-site="totallyrealfacts"]', reward: { clicks: 3 }, action: 'navigate', target: 'totallyrealfacts' },
        { selector: '.webring-visit[data-site="freesmileyz"]', reward: { clicks: 3 }, action: 'navigate', target: 'freesmileyz' },
        { selector: '.webring-visit[data-site="mega-deals-warehouse"]', reward: { clicks: 3 }, action: 'navigate', target: 'mega-deals-warehouse' },
        // Join button earns reputation
        { selector: '.join-btn', reward: { reputation: 15, data: 5 } },
        // Banner ads
        { selector: '.webring-banner', reward: { clicks: 8, data: 3 } }
        // Previous/Next/Random handled manually in render() because they need index tracking
    ]
});

// --- Totally Real Facts — 100% Verified by the Internet ---

SiteRegistry.register({
    id: 'totallyrealfacts',
    url: 'http://www.totallyrealfacts.com',
    title: 'Totally Real Facts - 100% Verified',
    zone: 1,
    icon: '\uD83D\uDCDA',
    requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-1 totallyrealfacts-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Fact categories with their facts
        var categories = [
            {
                emoji: '\uD83D\uDC3E',
                name: 'Animals',
                facts: [
                    'Dolphins invented the internet in 1987 but didn\'t tell humans until 1991.',
                    'Cats have exactly 47 bones. Scientists stopped counting there.',
                    'Goldfish have a memory of 30 years, but choose not to use it.'
                ]
            },
            {
                emoji: '\uD83D\uDD2C',
                name: 'Science',
                facts: [
                    'The sun is actually cold. It just looks hot because of the yellow color.',
                    'Gravity was invented by Isaac Newton when he dropped an apple on purpose.',
                    'Water is wet because it\'s made of tiny wet particles.'
                ]
            },
            {
                emoji: '\uD83D\uDCDC',
                name: 'History',
                facts: [
                    'The wheel was invented in 1997 by a man named Gary Wheel.',
                    'The moon landing was real but the moon is fake.',
                    'Ancient Egyptians had WiFi but with very slow speeds.'
                ]
            },
            {
                emoji: '\uD83C\uDF0D',
                name: 'Geography',
                facts: [
                    'Mount Everest is located in Ohio.',
                    'The ocean is just a really big lake that got out of hand.',
                    'Australia is upside down, which is why their toilets flush the other way.'
                ]
            }
        ];

        // Collect all facts for the random featured fact
        var allFacts = [];
        categories.forEach(function (cat) {
            cat.facts.forEach(function (f) { allFacts.push(f); });
        });
        var featuredFact = allFacts[Math.floor(Math.random() * allFacts.length)];

        // ========================================
        // 1. Header
        // ========================================
        var header = document.createElement('div');
        header.className = 'trf-header';

        var logo = document.createElement('h1');
        logo.className = 'trf-logo';
        logo.textContent = '\uD83D\uDCDA TOTALLY REAL FACTS';
        header.appendChild(logo);

        var subtitle = document.createElement('p');
        subtitle.className = 'trf-subtitle';
        subtitle.textContent = 'Verified by the Internet\u2122';
        header.appendChild(subtitle);

        var rainbowHr = document.createElement('hr');
        rainbowHr.className = 'rainbow-hr';
        header.appendChild(rainbowHr);

        container.appendChild(header);

        // ========================================
        // 2. Featured "Did You Know?" box
        // ========================================
        var featuredBox = document.createElement('div');
        featuredBox.className = 'trf-featured';

        var featuredTitle = document.createElement('h2');
        featuredTitle.className = 'blink';
        featuredTitle.textContent = '\uD83D\uDCA1 Did You Know?';
        featuredBox.appendChild(featuredTitle);

        var featuredText = document.createElement('p');
        featuredText.className = 'trf-featured-text';
        featuredText.textContent = featuredFact;
        featuredBox.appendChild(featuredText);

        container.appendChild(featuredBox);

        // ========================================
        // 3. Category browse sections
        // ========================================
        var categoriesSection = document.createElement('div');
        categoriesSection.className = 'trf-categories';

        categories.forEach(function (cat) {
            var catDiv = document.createElement('div');
            catDiv.className = 'trf-category';

            var catHeader = document.createElement('h2');
            catHeader.className = 'category-header';
            catHeader.textContent = cat.emoji + ' ' + cat.name;
            catDiv.appendChild(catHeader);

            cat.facts.forEach(function (factText) {
                var factItem = document.createElement('div');
                factItem.className = 'fact-item';

                var factP = document.createElement('p');
                factP.className = 'trf-fact-text';
                factP.textContent = '\u2714 ' + factText;
                factItem.appendChild(factP);

                var citeBtn = document.createElement('button');
                citeBtn.className = 'cite-btn';
                citeBtn.textContent = '\uD83D\uDCCB Cite This Fact';
                factItem.appendChild(citeBtn);

                catDiv.appendChild(factItem);
            });

            categoriesSection.appendChild(catDiv);
        });

        container.appendChild(categoriesSection);

        // ========================================
        // 4. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'trf-footer';

        var footerText = document.createElement('p');
        footerText.textContent = 'All facts verified by Dr. Reginald Facts, PhD in Factology';
        footer.appendChild(footerText);

        var copyright = document.createElement('p');
        copyright.textContent = '\u00A9 1998 TotallyRealFacts.com. Facts may not be real.';
        footer.appendChild(copyright);

        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.fact-item', reward: { clicks: 2, data: 2 } },
        { selector: '.cite-btn', reward: { clicks: 3, data: 2 } },
        { selector: '.category-header', reward: { clicks: 3, data: 1 } }
    ]
});

// --- FreeSmileyz.biz — FREE Downloads, No Virus We Promise ---

SiteRegistry.register({
    id: 'freesmileyz',
    url: 'http://www.freesmileyz.biz',
    title: 'FreeSmileyz.biz - FREE Downloads!',
    zone: 1,
    icon: '\uD83D\uDE00',
    requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-1 freesmileyz-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Smiley/cursor data with download counts and CSS cursor mappings
        var smileys = [
            { emoji: '\uD83D\uDE0A', name: 'Happy Smiley', downloads: 4782, cursor: '\uD83D\uDE0A' },
            { emoji: '\u2B50', name: 'Star Cursor', downloads: 3291, cursor: '\u2B50' },
            { emoji: '\uD83C\uDFAF', name: 'Crosshair Pro', downloads: 8104, cursor: '\uD83C\uDFAF' },
            { emoji: '\uD83C\uDF08', name: 'Rainbow Trail', downloads: 6543, cursor: '\uD83C\uDF08' },
            { emoji: '\uD83D\uDC80', name: 'Skull Cursor', downloads: 9876, cursor: '\uD83D\uDC80' },
            { emoji: '\uD83D\uDD25', name: 'Fire Cursor', downloads: 7210, cursor: '\uD83D\uDD25' },
            { emoji: '\u2764\uFE0F', name: 'Heart Smiley', downloads: 5555, cursor: '\u2764\uFE0F' },
            { emoji: '\uD83C\uDFB5', name: 'Music Note', downloads: 2345, cursor: '\uD83C\uDFB5' },
            { emoji: '\uD83D\uDC7D', name: 'Alien Smiley', downloads: 4321, cursor: '\uD83D\uDC7D' },
            { emoji: '\uD83E\uDD84', name: 'Unicorn Cursor', downloads: 6789, cursor: '\uD83E\uDD84' },
            { emoji: '\uD83D\uDC8E', name: 'Diamond Cursor', downloads: 1234, cursor: '\uD83D\uDC8E' },
            { emoji: '\uD83C\uDF19', name: 'Moon Cursor', downloads: 3456, cursor: '\uD83C\uDF19' }
        ];

        // Current cursor indicator text element (updated on download)
        var currentCursorName = 'DEFAULT';

        // ========================================
        // 1. Header with animated text
        // ========================================
        var header = document.createElement('div');
        header.className = 'freesmileyz-header';

        var logo = document.createElement('h1');
        logo.className = 'freesmileyz-logo blink';
        logo.textContent = '\uD83D\uDE00 FREE SMILEYZ & CURSORZ! \uD83D\uDE00';
        header.appendChild(logo);

        var noVirus = document.createElement('p');
        noVirus.className = 'freesmileyz-novirus blink';
        noVirus.textContent = '100% FREE! NO VIRUS! GUARANTEED!';
        header.appendChild(noVirus);

        var rainbowHr = document.createElement('hr');
        rainbowHr.className = 'rainbow-hr';
        header.appendChild(rainbowHr);

        container.appendChild(header);

        // ========================================
        // 2. Current cursor indicator
        // ========================================
        var cursorIndicator = document.createElement('div');
        cursorIndicator.className = 'freesmileyz-cursor-indicator';

        var cursorLabel = document.createElement('span');
        cursorLabel.textContent = 'Your current cursor: ';
        cursorIndicator.appendChild(cursorLabel);

        var cursorValue = document.createElement('strong');
        cursorValue.className = 'freesmileyz-cursor-value';
        cursorValue.textContent = currentCursorName;
        cursorIndicator.appendChild(cursorValue);

        container.appendChild(cursorIndicator);

        // ========================================
        // 3. Main layout: grid + sidebar
        // ========================================
        var mainArea = document.createElement('div');
        mainArea.className = 'freesmileyz-main';

        // --- Smiley grid ---
        var grid = document.createElement('div');
        grid.className = 'freesmileyz-grid';

        smileys.forEach(function (smiley) {
            var item = document.createElement('div');
            item.className = 'smiley-item';

            var emojiDiv = document.createElement('div');
            emojiDiv.className = 'smiley-emoji';
            emojiDiv.textContent = smiley.emoji;
            item.appendChild(emojiDiv);

            var nameDiv = document.createElement('div');
            nameDiv.className = 'smiley-name';
            nameDiv.textContent = smiley.name;
            item.appendChild(nameDiv);

            var downloadCount = document.createElement('div');
            downloadCount.className = 'smiley-download-count';
            downloadCount.textContent = 'Downloaded ' + smiley.downloads.toLocaleString() + ' times!';
            item.appendChild(downloadCount);

            var downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = '\u2B07 DOWNLOAD NOW \u2B07';

            // Capture smiley in closure for the popup
            (function (s, countEl) {
                downloadBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Create the fake popup overlay
                    var overlay = document.createElement('div');
                    overlay.className = 'freesmileyz-popup-overlay';

                    var popup = document.createElement('div');
                    popup.className = 'freesmileyz-popup';

                    var popupTitle = document.createElement('p');
                    popupTitle.className = 'freesmileyz-popup-title';
                    popupTitle.textContent = 'Are you SURE you want this smiley?';
                    popup.appendChild(popupTitle);

                    var popupBtns = document.createElement('div');
                    popupBtns.className = 'freesmileyz-popup-btns';

                    var yesBtn = document.createElement('button');
                    yesBtn.className = 'popup-btn';
                    yesBtn.textContent = 'YES';
                    popupBtns.appendChild(yesBtn);

                    var alsoYesBtn = document.createElement('button');
                    alsoYesBtn.className = 'popup-btn';
                    alsoYesBtn.textContent = 'ALSO YES';
                    popupBtns.appendChild(alsoYesBtn);

                    popup.appendChild(popupBtns);
                    overlay.appendChild(popup);
                    container.appendChild(overlay);

                    // Both buttons do the same thing
                    function handlePopupConfirm(evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        browser.handleReward({ clicks: 2 });
                        // Update cursor via Effects system
                        if (typeof Effects !== 'undefined') {
                            Effects.setCursor(s.cursor);
                        } else {
                            document.body.style.cursor = s.cursor;
                        }
                        cursorValue.textContent = s.name.toUpperCase();
                        // Increment download count
                        s.downloads++;
                        countEl.textContent = 'Downloaded ' + s.downloads.toLocaleString() + ' times!';
                        // Remove overlay
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }

                    yesBtn.addEventListener('click', handlePopupConfirm);
                    alsoYesBtn.addEventListener('click', handlePopupConfirm);
                });
            })(smiley, downloadCount);

            item.appendChild(downloadBtn);
            grid.appendChild(item);
        });

        mainArea.appendChild(grid);

        // --- Sidebar: Top Downloads This Week ---
        var sidebar = document.createElement('div');
        sidebar.className = 'freesmileyz-sidebar';

        var sidebarTitle = document.createElement('h3');
        sidebarTitle.textContent = '\uD83C\uDFC6 Top Downloads This Week';
        sidebar.appendChild(sidebarTitle);

        // Sort smileys by download count descending for ranking
        var ranked = smileys.slice().sort(function (a, b) { return b.downloads - a.downloads; });
        ranked.slice(0, 5).forEach(function (s, idx) {
            var rankItem = document.createElement('div');
            rankItem.className = 'freesmileyz-rank-item';
            rankItem.textContent = (idx + 1) + '. ' + s.emoji + ' ' + s.name;
            sidebar.appendChild(rankItem);
        });

        mainArea.appendChild(sidebar);
        container.appendChild(mainArea);

        // ========================================
        // 4. Disclaimer
        // ========================================
        var disclaimer = document.createElement('div');
        disclaimer.className = 'freesmileyz-disclaimer';
        disclaimer.textContent = '\u26A0\uFE0F This site is NOT responsible for any cursors that become sentient';
        container.appendChild(disclaimer);

        // ========================================
        // 5. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'freesmileyz-footer';

        var copyright = document.createElement('p');
        copyright.textContent = '\u00A9 1999 FreeSmileyz.biz. All smileys are free forever.';
        footer.appendChild(copyright);

        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.download-btn', reward: { clicks: 8, data: 4 } },
        // popup-btn reward handled manually in the popup confirm handler
        { selector: '.smiley-item', reward: { clicks: 3, data: 2 } }
    ]
});

// --- Mega Deals Warehouse — EVERYTHING MUST GO ---

SiteRegistry.register({
    id: 'mega-deals-warehouse',
    url: 'http://www.mega-deals-warehouse.com',
    title: 'MEGA DEALS WAREHOUSE - HUGE SAVINGS',
    zone: 1,
    icon: '\uD83D\uDCB0',
    requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-1 megadeals-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Cart item count (cosmetic for most, functional for pixel)
        var cartCount = 0;

        // Product data
        var products = [
            { emoji: '\uD83C\uDFA9', name: 'Invisible Hat', desc: "You can't see it, but trust us, it's there", price: 1000000 },
            { emoji: '\uD83D\uDCA8', name: 'Bottle of Used Air', desc: 'Pre-breathed for your convenience', price: 500000 },
            { emoji: '\uD83E\uDEA8', name: 'Pet Rock NFT', desc: 'Non-Fungible. Non-Moving. Non-Alive.', price: 999999 },
            { emoji: '\uD83D\uDCE6', name: 'Box of Nothing', desc: "What's in the box? Nothing. That's the product.", price: 750000 },
            { emoji: '\uD83D\uDD07', name: 'Sound of Silence (MP3)', desc: '3 hours of premium nothing', price: 250000 },
            { emoji: '\u2B1B', name: 'Slightly Used Pixel', desc: 'One pixel. Slightly used. Good condition.', price: 100 }
        ];

        // ========================================
        // 1. Header
        // ========================================
        var header = document.createElement('div');
        header.className = 'megadeals-header';

        var logo = document.createElement('h1');
        logo.className = 'megadeals-logo';
        logo.textContent = '\uD83D\uDCB0 MEGA DEALS WAREHOUSE \uD83D\uDCB0';
        header.appendChild(logo);

        var subtitle = document.createElement('p');
        subtitle.className = 'megadeals-subtitle';
        subtitle.textContent = 'EVERYTHING MUST GO! TODAY ONLY! (We say this every day)';
        header.appendChild(subtitle);

        var rainbowHr = document.createElement('hr');
        rainbowHr.className = 'rainbow-hr';
        header.appendChild(rainbowHr);

        container.appendChild(header);

        // ========================================
        // 2. Flashing SALE banner
        // ========================================
        var saleBanner = document.createElement('div');
        saleBanner.className = 'megadeals-sale-banner blink';
        saleBanner.textContent = 'SALE! SALE! SALE!';
        container.appendChild(saleBanner);

        // ========================================
        // 3. Shopping cart indicator
        // ========================================
        var cartDiv = document.createElement('div');
        cartDiv.className = 'megadeals-cart';

        var cartIcon = document.createElement('span');
        cartIcon.textContent = '\uD83D\uDED2 ';
        cartDiv.appendChild(cartIcon);

        var cartText = document.createElement('span');
        cartText.className = 'megadeals-cart-count';
        cartText.textContent = 'Items: 0';
        cartDiv.appendChild(cartText);

        container.appendChild(cartDiv);

        // ========================================
        // 4. Product grid
        // ========================================
        var productGrid = document.createElement('div');
        productGrid.className = 'megadeals-products';

        products.forEach(function (product) {
            var card = document.createElement('div');
            card.className = 'megadeals-product-card';

            var productImg = document.createElement('div');
            productImg.className = 'product-img';
            productImg.textContent = product.emoji;
            card.appendChild(productImg);

            var productName = document.createElement('h3');
            productName.className = 'megadeals-product-name';
            productName.textContent = product.name;
            card.appendChild(productName);

            var productDesc = document.createElement('p');
            productDesc.className = 'megadeals-product-desc';
            productDesc.textContent = product.desc;
            card.appendChild(productDesc);

            var productPrice = document.createElement('div');
            productPrice.className = 'megadeals-product-price';
            productPrice.textContent = product.price.toLocaleString() + ' clicks';
            card.appendChild(productPrice);

            // The pixel is the only purchasable item
            if (product.name === 'Slightly Used Pixel') {
                var buyBtn = document.createElement('button');
                buyBtn.className = 'megadeals-buy-btn';
                buyBtn.textContent = '\uD83D\uDED2 Buy Now!';
                buyBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Check if player can afford 100 clicks
                    if (browser.gameState.clicks < 100) {
                        var noFunds = document.createElement('div');
                        noFunds.className = 'megadeals-congrats';
                        noFunds.textContent = 'INSUFFICIENT CLICKS! You need 100 clicks to buy this pixel.';
                        card.appendChild(noFunds);
                        setTimeout(function () {
                            if (noFunds.parentNode) { noFunds.parentNode.removeChild(noFunds); }
                        }, 3000);
                        return;
                    }
                    // Spend 100 clicks, earn 50 data
                    browser.gameState.spendClicks(100);
                    browser.handleReward({ data: 50 }, e.clientX, e.clientY);
                    cartCount++;
                    cartText.textContent = 'Items: ' + cartCount;

                    // Show congratulations message
                    var congrats = document.createElement('div');
                    congrats.className = 'megadeals-congrats';
                    congrats.textContent = 'CONGRATULATIONS! You now own a slightly used pixel!';
                    card.appendChild(congrats);
                    setTimeout(function () {
                        if (congrats.parentNode) {
                            congrats.parentNode.removeChild(congrats);
                        }
                    }, 3000);
                });
                card.appendChild(buyBtn);
            } else {
                var addToCartBtn = document.createElement('button');
                addToCartBtn.className = 'add-to-cart';
                addToCartBtn.textContent = '\uD83D\uDED2 Add to Cart';
                card.appendChild(addToCartBtn);
            }

            productGrid.appendChild(card);
        });

        container.appendChild(productGrid);

        // ========================================
        // 5. Free shipping notice
        // ========================================
        var shippingNotice = document.createElement('div');
        shippingNotice.className = 'megadeals-shipping';
        shippingNotice.textContent = '\uD83D\uDE9A Free shipping on orders over 10,000,000 clicks!';
        container.appendChild(shippingNotice);

        // ========================================
        // 6. Customer reviews
        // ========================================
        var reviewsSection = document.createElement('div');
        reviewsSection.className = 'megadeals-reviews';

        var reviewsTitle = document.createElement('h2');
        reviewsTitle.textContent = '\u2B50 Customer Reviews';
        reviewsSection.appendChild(reviewsTitle);

        var reviews = [
            { stars: '\u2605\u2605\u2605\u2605\u2605', text: "I bought the invisible hat and I can confirm I cannot see it.", author: 'Dave' },
            { stars: '\u2605\u2605\u2605\u2605\u2605', text: 'The used air smells exactly like I expected.', author: 'Sandra' },
            { stars: '\u2605\u2605\u2605\u2606\u2606', text: 'The box of nothing arrived empty. 3 stars because the box itself was nice.', author: 'Greg' },
            { stars: '\u2605\u2605\u2605\u2605\u2605', text: "The sound of silence MP3 is my favorite album now.", author: 'DJ Quiet' }
        ];

        reviews.forEach(function (review) {
            var reviewDiv = document.createElement('div');
            reviewDiv.className = 'review-item';

            var reviewStars = document.createElement('span');
            reviewStars.className = 'megadeals-review-stars';
            reviewStars.textContent = review.stars;
            reviewDiv.appendChild(reviewStars);

            var reviewText = document.createElement('span');
            reviewText.className = 'megadeals-review-text';
            reviewText.textContent = ' "' + review.text + '" - ' + review.author;
            reviewDiv.appendChild(reviewText);

            reviewsSection.appendChild(reviewDiv);
        });

        container.appendChild(reviewsSection);

        // ========================================
        // 7. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'megadeals-footer';

        var guarantee = document.createElement('p');
        guarantee.textContent = 'Satisfaction Guaranteed (guarantee not guaranteed)';
        footer.appendChild(guarantee);

        var copyright = document.createElement('p');
        copyright.textContent = '\u00A9 1999 Mega Deals Warehouse. All deals are final. All deals are mega.';
        footer.appendChild(copyright);

        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.product-img', reward: { clicks: 3, data: 2 } },
        { selector: '.add-to-cart', reward: { clicks: 5, data: 3 } },
        // Pixel buy button handled manually in render()
        { selector: '.review-item', reward: { clicks: 2, data: 1 } }
    ]
});

// ============================================================
//   ZONE 2 — The Weird Web (darker, weirder, more unsettling)
// ============================================================

// --- The Void — Almost entirely black, cryptic hidden poetry ---

SiteRegistry.register({
    id: 'the-void',
    url: 'http://www.the-void.net',
    title: '...',
    zone: 2,
    icon: '\u2B1B',
    requirements: { minModem: 1, dataCost: 50, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-2 the-void-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // The phrases that form a cryptic poem about the void between pages
        var phrases = [
            'you click into nothing',
            'and nothing clicks back',
            'the bandwidth is infinite here',
            'no one counts the hits',
            'but the counter remembers',
            'every click echoes',
            'in the void between pages',
            'where deleted sites go',
            'to dream of visitors',
            'who never came'
        ];

        // Closure state for tracking revealed zones
        var revealedCount = 0;
        var allRevealed = false;

        // ========================================
        // 1. Minimal title — barely visible
        // ========================================
        var title = document.createElement('div');
        title.className = 'void-title';
        title.textContent = '...';
        container.appendChild(title);

        // ========================================
        // 2. Grid of invisible click zones
        // ========================================
        var grid = document.createElement('div');
        grid.className = 'void-grid';

        // Completion message element (hidden until all revealed)
        var completionMsg = document.createElement('div');
        completionMsg.className = 'void-completion';
        completionMsg.textContent = 'The void appreciates your company.';
        completionMsg.style.display = 'none';

        phrases.forEach(function (phrase) {
            var zone = document.createElement('div');
            zone.className = 'void-zone';

            var text = document.createElement('span');
            text.className = 'void-phrase';
            text.textContent = phrase;
            zone.appendChild(text);

            // Manual click handler for the reveal mechanic
            zone.addEventListener('click', function (e) {
                e.preventDefault();
                if (zone.classList.contains('void-revealed') || allRevealed) {
                    return;
                }
                zone.classList.add('void-revealed');
                revealedCount++;

                if (revealedCount >= phrases.length && !allRevealed) {
                    allRevealed = true;
                    completionMsg.style.display = 'block';
                    // Award 100 bonus clicks for completing the poem
                    browser.handleReward({ clicks: 100 });
                }
            });

            grid.appendChild(zone);
        });

        container.appendChild(grid);
        container.appendChild(completionMsg);

        // ========================================
        // 3. Footer — barely there
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'void-footer';
        footer.textContent = '[ ]';
        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.void-zone', reward: { clicks: 5 } }
    ]
});

// --- Infinite Guestbook — Endlessly scrolling guestbook entries ---

SiteRegistry.register({
    id: 'infinite-guestbook',
    url: 'http://www.infinite-guestbook.com',
    title: 'The Infinite Guestbook',
    zone: 2,
    icon: '\uD83D\uDCD6',
    requirements: { minModem: 1, dataCost: 30, reputationCost: 20 },

    render: function (container, browser) {
        container.className = 'zone-2 infinite-guestbook-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Pre-populated guestbook entries across three tiers of weirdness
        var entries = [
            // Normal tier (1-10)
            { text: 'Great site! Keep it up!', author: 'Dave, Ohio' },
            { text: 'Hello from Germany! Nice page!', author: 'Hans' },
            { text: 'first!!!!!', author: 'xXx_ShadowBlade_xXx' },
            { text: 'Cool guestbook. Signed, Tom.', author: 'Tom' },
            { text: 'Love your website! Bookmarked!', author: 'Jenny S.' },
            { text: 'Hi from California! :)', author: 'SurfDude99' },
            { text: 'My mom says hi too', author: 'Timmy, age 11' },
            { text: 'Neat site. How do I make one?', author: 'NewbieUser' },
            { text: 'Greetings from Japan!', author: 'Takeshi' },
            { text: 'Best guestbook on the web!', author: 'WebMaster Pete' },
            // Weird tier (11-20)
            { text: 'The hamsters know what you did.', author: 'Anonymous' },
            { text: "I've been scrolling for three days. Send help.", author: '???' },
            { text: "This is my 47th time signing this guestbook.", author: 'Kevin (yes, THAT Kevin)' },
            { text: 'Is anyone else seeing the faces in the static?', author: 'concerned_user_42' },
            { text: 'I left something here in 1998. Have you seen it?', author: 'ReturnVisitor' },
            { text: 'The guestbook signs you.', author: '[REDACTED]' },
            { text: 'Every entry here is a prayer to the old internet.', author: 'digital_monk' },
            { text: 'My cursor changed after visiting this page.', author: 'worried_parent' },
            { text: 'The entries are multiplying.', author: 'Observer' },
            { text: 'Why does this page know my name?', author: 'YOUR NAME HERE' },
            // Cryptic tier (21-30)
            { text: '01001000 01000101 01001100 01010000', author: '[no name]' },
            { text: "I signed this guestbook in 1997. I'm still here.", author: 'The First Visitor' },
            { text: "Don't scroll to the bottom.", author: 'A friend' },
            { text: 'There is no bottom.', author: '[entry appears to be dated tomorrow]' },
            { text: 'If you are reading this, it is already too late.', author: '[SYSTEM]' },
            { text: 'The guestbook remembers everyone. Everyone.', author: '...' },
            { text: 'Entry #\u221E', author: '[overflow error]' },
            { text: 'You were always here.', author: 'You' },
            { text: '                                          ', author: '[invisible ink]' },
            { text: 'Last entry. Or is it?', author: 'The Guestbook Itself' }
        ];

        // Visitor counter for the sign button
        var visitorNum = 10000 + Math.floor(Math.random() * 90000);

        // ========================================
        // 1. Header
        // ========================================
        var header = document.createElement('div');
        header.className = 'guestbook-header';

        var logo = document.createElement('h1');
        logo.className = 'guestbook-logo';
        logo.textContent = 'The Infinite Guestbook';
        header.appendChild(logo);

        var subtitle = document.createElement('p');
        subtitle.className = 'guestbook-subtitle';
        subtitle.textContent = 'Sign it. Read it. You can never leave.';
        header.appendChild(subtitle);

        container.appendChild(header);

        // ========================================
        // 2. Sign button (always visible at top)
        // ========================================
        var signSection = document.createElement('div');
        signSection.className = 'guestbook-sign-section';

        var signBtn = document.createElement('button');
        signBtn.className = 'sign-btn';
        signBtn.textContent = '\uD83D\uDD8A Sign the Guestbook';
        signSection.appendChild(signBtn);

        container.appendChild(signSection);

        // ========================================
        // 3. Entries list
        // ========================================
        var entriesList = document.createElement('div');
        entriesList.className = 'guestbook-entries';

        // Helper to create an entry DOM element
        function createEntryEl(entry) {
            var entryDiv = document.createElement('div');
            entryDiv.className = 'guestbook-entry';

            var entryText = document.createElement('p');
            entryText.className = 'guestbook-entry-text';
            entryText.textContent = '"' + entry.text + '"';
            entryDiv.appendChild(entryText);

            var entryAuthor = document.createElement('p');
            entryAuthor.className = 'guestbook-entry-author';
            entryAuthor.textContent = '- ' + entry.author;
            entryDiv.appendChild(entryAuthor);

            return entryDiv;
        }

        // Populate entries
        entries.forEach(function (entry) {
            entriesList.appendChild(createEntryEl(entry));
        });

        container.appendChild(entriesList);

        // Sign button handler: adds a new entry at the top
        signBtn.addEventListener('click', function (e) {
            e.preventDefault();
            visitorNum++;
            var newEntry = {
                text: 'You were here.',
                author: 'Visitor #' + visitorNum
            };
            var newEl = createEntryEl(newEntry);
            newEl.classList.add('guestbook-entry-new');
            entriesList.insertBefore(newEl, entriesList.firstChild);
        });

        // ========================================
        // 4. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'guestbook-footer';
        footer.textContent = 'Entries: \u221E | Est. 1996 | There is no page 2.';
        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.sign-btn', reward: { reputation: 15 } },
        { selector: '.guestbook-entry', reward: { clicks: 2 } }
    ]
});

// --- Ask The Orb — Centered glowing orb that dispenses cryptic wisdom ---

SiteRegistry.register({
    id: 'ask-the-orb',
    url: 'http://www.ask-the-orb.com',
    title: 'Ask The Orb',
    zone: 2,
    icon: '\uD83D\uDD2E',
    requirements: { minModem: 1, dataCost: 40, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-2 ask-the-orb-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Pool of orb responses (random, regardless of input)
        var responses = [
            'You already know the answer.',
            'The orb sees through you.',
            'Why do you click?',
            'There are no questions, only clicks.',
            'Your modem speed is irrelevant in the grand scheme.',
            'The orb was here before the internet. The orb will be here after.',
            'Have you asked the hamsters?',
            '404: Wisdom not found. Click again.',
            'The answer is always toast.',
            'You are the orb. The orb is you.',
            '...',
            'The orb declines to answer at this time.'
        ];

        // ========================================
        // 1. Header text
        // ========================================
        var header = document.createElement('div');
        header.className = 'orb-header';

        var title = document.createElement('h1');
        title.className = 'orb-title';
        title.textContent = 'The Orb Sees All.';
        header.appendChild(title);

        var subtitle = document.createElement('p');
        subtitle.className = 'orb-subtitle';
        subtitle.textContent = 'Ask Your Question.';
        header.appendChild(subtitle);

        container.appendChild(header);

        // ========================================
        // 2. The Orb itself (CSS radial-gradient circle with glow)
        // ========================================
        var orbContainer = document.createElement('div');
        orbContainer.className = 'orb-container';

        var orb = document.createElement('div');
        orb.className = 'the-orb';
        orbContainer.appendChild(orb);

        container.appendChild(orbContainer);

        // ========================================
        // 3. Input area
        // ========================================
        var inputSection = document.createElement('div');
        inputSection.className = 'orb-input-section';

        var questionInput = document.createElement('input');
        questionInput.type = 'text';
        questionInput.className = 'orb-question-input';
        questionInput.placeholder = 'Ask the orb...';
        inputSection.appendChild(questionInput);

        var consultBtn = document.createElement('button');
        consultBtn.className = 'consult-btn';
        consultBtn.textContent = 'Consult the Orb';
        inputSection.appendChild(consultBtn);

        container.appendChild(inputSection);

        // ========================================
        // 4. Response area
        // ========================================
        var responseArea = document.createElement('div');
        responseArea.className = 'orb-response-area';
        container.appendChild(responseArea);

        // Consult button handler: shows a random orb response
        consultBtn.addEventListener('click', function (e) {
            e.preventDefault();
            var response = responses[Math.floor(Math.random() * responses.length)];
            var responseEl = document.createElement('p');
            responseEl.className = 'orb-response';
            responseEl.textContent = response;

            // Clear previous response
            while (responseArea.firstChild) {
                responseArea.removeChild(responseArea.firstChild);
            }
            responseArea.appendChild(responseEl);
            questionInput.value = '';
        });

        // ========================================
        // 5. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'orb-footer';
        footer.textContent = 'The Orb has been consulted 1,847,293 times. It has never answered.';
        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.the-orb', reward: { clicks: 10 } },
        { selector: '.consult-btn', reward: { clicks: 10 } },
        { selector: '.orb-response', reward: { clicks: 3 } }
    ]
});

// --- TIME CUBE — Chaotic wall of multi-colored conspiracy text ---

SiteRegistry.register({
    id: 'timecube',
    url: 'http://www.geocities.com/~area51/TimeCube',
    title: 'TIME IS CUBE',
    zone: 2,
    icon: '\uD83D\uDFE8',
    requirements: { minModem: 2, dataCost: 80, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-2 timecube-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Paragraphs of Time Cube content with individual styling
        var paragraphs = [
            { text: 'EARTH HAS 4 CORNER SIMULTANEOUS 4-DAY TIME CUBE', color: '#ff0000', size: '28px', bold: true, key: true },
            { text: 'You are educated stupid if you do not understand TIME CUBE', color: '#6666ff', size: '18px', bold: false, key: false },
            { text: '4 CORNERS = 4 SIMULTANEOUS DAYS', color: '#00cc00', size: '24px', bold: true, key: true },
            { text: 'No one can disprove TIME CUBE', color: '#ffff00', size: '18px', bold: false, key: false },
            { text: 'Your teachers are LIARS. TIME is CUBE-SHAPED.', color: '#ff0000', size: '22px', bold: true, rotate: '2deg', key: true },
            { text: 'I have challenged every university professor. NONE can explain TIME CUBE.', color: '#00ffff', size: '16px', bold: false, key: false },
            { text: 'There are 4 days in a single rotation of Earth', color: '#ff00ff', size: '22px', bold: true, rotate: '-1deg', key: true },
            { text: 'Morning, Noon, Evening, and Night are SIMULTANEOUS', color: '#ff8800', size: '18px', bold: false, key: false },
            { text: 'YOU WERE TAUGHT LIES', color: '#ff0000', size: '28px', bold: true, underline: true, key: true },
            { text: 'The sun does not rise. YOU rotate to meet the sun.', color: '#00cc00', size: '18px', bold: false, italic: true, key: false },
            { text: 'THINK ABOUT IT', color: '#ffff00', size: '28px', bold: true, blink: true, key: true },
            { text: 'Gene Ray, Cubic Awareness Online', color: '#ffffff', size: '14px', bold: false, key: false }
        ];

        // ========================================
        // 1. Header
        // ========================================
        var header = document.createElement('div');
        header.className = 'timecube-header';

        var logo = document.createElement('h1');
        logo.className = 'timecube-logo';
        logo.textContent = 'TIME IS CUBE';
        header.appendChild(logo);

        container.appendChild(header);

        // ========================================
        // 2. Wall of text paragraphs
        // ========================================
        var content = document.createElement('div');
        content.className = 'timecube-content';

        paragraphs.forEach(function (para) {
            var p = document.createElement('p');
            p.className = 'timecube-para';
            if (para.key) {
                p.classList.add('key-phrase');
            }
            if (para.blink) {
                p.classList.add('blink');
            }

            p.style.color = para.color;
            p.style.fontSize = para.size;
            if (para.bold) { p.style.fontWeight = 'bold'; }
            if (para.italic) { p.style.fontStyle = 'italic'; }
            if (para.underline) { p.style.textDecoration = 'underline'; }
            if (para.rotate) { p.style.transform = 'rotate(' + para.rotate + ')'; }

            p.textContent = para.text;
            content.appendChild(p);
        });

        container.appendChild(content);

        // ========================================
        // 3. ASCII Cube Diagram
        // ========================================
        var diagramSection = document.createElement('div');
        diagramSection.className = 'timecube-diagram-section';

        var diagramLabel = document.createElement('h2');
        diagramLabel.className = 'timecube-diagram-label';
        diagramLabel.textContent = 'THE CUBE:';
        diagramLabel.style.color = '#ffff00';
        diagramSection.appendChild(diagramLabel);

        var diagram = document.createElement('pre');
        diagram.className = 'cube-diagram';
        diagram.textContent =
            '       +-------+\n' +
            '      /|      /|\n' +
            '     / |     / |\n' +
            '    +-------+  |\n' +
            '    |  +- - |--+\n' +
            '    | /     | /\n' +
            '    |/      |/\n' +
            '    +-------+\n' +
            '  4 CORNERS = 4 DAYS';
        diagramSection.appendChild(diagram);

        container.appendChild(diagramSection);

        // ========================================
        // 4. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'timecube-footer';
        footer.textContent = 'Cubic Awareness Online \u00A9 1997. You have been educated stupid.';
        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.key-phrase', reward: { clicks: 4 } },
        { selector: '.cube-diagram', reward: { clicks: 20 } }
    ]
});

// --- Under Construction Forever — A grid of endless construction signs ---

SiteRegistry.register({
    id: 'under-construction-forever',
    url: 'http://www.under-construction-forever.org',
    title: 'Under Construction',
    zone: 2,
    icon: '\uD83D\uDEA7',
    requirements: { minModem: 1, dataCost: 25, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-2 under-construction-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Closure counter for total clicks across all signs
        var totalClicks = 0;
        var bonusAwarded = false;

        // ========================================
        // 1. Header
        // ========================================
        var header = document.createElement('div');
        header.className = 'uc-header';

        var title = document.createElement('h1');
        title.className = 'uc-title';
        title.textContent = '\uD83D\uDEA7 UNDER CONSTRUCTION \uD83D\uDEA7';
        header.appendChild(title);

        var subtitle = document.createElement('p');
        subtitle.className = 'uc-subtitle';
        subtitle.textContent = 'Please pardon our dust. This page will be ready soon.';
        header.appendChild(subtitle);

        container.appendChild(header);

        // ========================================
        // 2. Click counter display
        // ========================================
        var counterDiv = document.createElement('div');
        counterDiv.className = 'uc-counter';

        var counterLabel = document.createElement('span');
        counterLabel.textContent = 'Construction progress: ';
        counterDiv.appendChild(counterLabel);

        var counterValue = document.createElement('span');
        counterValue.className = 'uc-counter-value';
        counterValue.textContent = '0%';
        counterDiv.appendChild(counterValue);

        container.appendChild(counterDiv);

        // ========================================
        // 3. Message area (for the 100-click completion message)
        // ========================================
        var messageArea = document.createElement('div');
        messageArea.className = 'uc-message-area';
        messageArea.style.display = 'none';
        container.appendChild(messageArea);

        // ========================================
        // 4. Grid of construction signs (5x4 = 20)
        // ========================================
        var grid = document.createElement('div');
        grid.className = 'uc-grid';

        // Helper to create a construction sign element
        function createSign() {
            var sign = document.createElement('div');
            sign.className = 'construction-sign';

            var signText = document.createElement('span');
            signText.className = 'construction-sign-text';
            signText.textContent = '\uD83D\uDEA7';
            sign.appendChild(signText);

            // Each sign click: fade out, reveal new sign beneath, increment counter
            sign.addEventListener('click', function (e) {
                e.preventDefault();
                if (bonusAwarded) { return; }

                totalClicks++;
                var progress = Math.min(Math.floor((totalClicks / 100) * 100), 100);
                counterValue.textContent = progress + '%';

                // Fade out effect: toggle class
                sign.classList.add('construction-sign-removed');

                // After fade, replace with a new sign
                setTimeout(function () {
                    sign.classList.remove('construction-sign-removed');
                }, 400);

                // Check for 100 click milestone
                if (totalClicks >= 100 && !bonusAwarded) {
                    bonusAwarded = true;
                    browser.handleReward({ clicks: 500 });

                    // Show completion message
                    messageArea.style.display = 'block';
                    var msg = document.createElement('p');
                    msg.className = 'uc-completion-msg';
                    msg.textContent = 'Thank you for your patience. Construction will resume shortly.';
                    messageArea.appendChild(msg);

                    // Reset all signs and show a single different one
                    while (grid.firstChild) {
                        grid.removeChild(grid.firstChild);
                    }
                    var finalSign = document.createElement('div');
                    finalSign.className = 'construction-sign construction-sign-final';
                    var finalText = document.createElement('span');
                    finalText.className = 'construction-sign-text';
                    finalText.textContent = '\uD83C\uDFD7\uFE0F';
                    finalSign.appendChild(finalText);
                    grid.appendChild(finalSign);
                }
            });

            return sign;
        }

        // Create the 5x4 grid (20 signs)
        for (var i = 0; i < 20; i++) {
            grid.appendChild(createSign());
        }

        container.appendChild(grid);

        // ========================================
        // 5. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'uc-footer';
        footer.textContent = 'Est. 1996 | Last updated: never | ETA: soon\u2122';
        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.construction-sign', reward: { clicks: 1 } }
    ]
});

// --- Ethel's Internet Corner — Warm, cozy, accidentally profound ---

SiteRegistry.register({
    id: 'grandma-dot-com',
    url: 'http://www.grandma-dot-com.net',
    title: "Ethel's Internet Corner",
    zone: 2,
    icon: '\uD83C\uDF38',
    requirements: { minModem: 1, dataCost: 20, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-2 grandma-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Visitor counter
        var visitorNum = 42 + Math.floor(Math.random() * 50);

        // ========================================
        // 1. Header
        // ========================================
        var header = document.createElement('div');
        header.className = 'grandma-header';

        var logo = document.createElement('h1');
        logo.className = 'grandma-logo';
        logo.textContent = "\uD83C\uDF38 Ethel's Internet Corner \uD83C\uDF38";
        header.appendChild(logo);

        var welcome = document.createElement('p');
        welcome.className = 'grandma-welcome';
        welcome.textContent = 'Welcome to my little spot on the World Wide Web!';
        header.appendChild(welcome);

        container.appendChild(header);

        // ========================================
        // 2. Garden photo (CSS flowers)
        // ========================================
        var gardenSection = document.createElement('div');
        gardenSection.className = 'grandma-garden';

        var gardenTitle = document.createElement('h2');
        gardenTitle.className = 'grandma-section-title';
        gardenTitle.textContent = '\uD83C\uDF3B My Garden';
        gardenSection.appendChild(gardenTitle);

        var gardenPlot = document.createElement('div');
        gardenPlot.className = 'grandma-garden-plot';

        // Create CSS flowers with colored circles and green stems
        var flowerColors = ['#ff6b8a', '#ffb347', '#ff69b4', '#dda0dd', '#ff4444', '#ff8c00'];
        flowerColors.forEach(function (color) {
            var flower = document.createElement('div');
            flower.className = 'garden-flower';

            var stem = document.createElement('div');
            stem.className = 'flower-stem';
            flower.appendChild(stem);

            var bloom = document.createElement('div');
            bloom.className = 'flower-bloom';
            bloom.style.backgroundColor = color;
            flower.appendChild(bloom);

            var center = document.createElement('div');
            center.className = 'flower-center';
            flower.appendChild(center);

            gardenPlot.appendChild(flower);
        });

        gardenSection.appendChild(gardenPlot);
        container.appendChild(gardenSection);

        // ========================================
        // 3. Blog posts
        // ========================================
        var blogSection = document.createElement('div');
        blogSection.className = 'grandma-blog';

        var blogTitle = document.createElement('h2');
        blogTitle.className = 'grandma-section-title';
        blogTitle.textContent = "\uD83D\uDCDD Ethel's Diary";
        blogSection.appendChild(blogTitle);

        var blogPosts = [
            {
                date: 'Tuesday, March 14',
                text: "Watered the garden today. Watched the sunflowers track the light. Thought about how we all just follow what's brightest. Then I had toast."
            },
            {
                date: 'Wednesday, March 15',
                text: "Harold next door got a new router. Life moves fast. I remember when the fastest thing was a telegram. Now Harold watches videos of cats while eating breakfast. Progress."
            },
            {
                date: 'Thursday, March 16',
                text: "Tried to email my grandson. The email bounced. Some things you send out just come back to you. Made soup."
            },
            {
                date: 'Friday, March 17',
                text: "The internet is a funny thing. Millions of people, all typing at once, and still somehow everyone feels alone. Anyway, here's my casserole recipe."
            },
            {
                date: 'Saturday, March 18',
                text: "A nice young person signed my guestbook today. Said they'd 'been surfing.' I hope they don't get wet. \uD83D\uDE0A"
            }
        ];

        blogPosts.forEach(function (post) {
            var postDiv = document.createElement('div');
            postDiv.className = 'blog-post';

            var postDate = document.createElement('h3');
            postDate.className = 'blog-post-date';
            postDate.textContent = post.date;
            postDiv.appendChild(postDate);

            var postText = document.createElement('p');
            postText.className = 'blog-post-text';
            postText.textContent = post.text;
            postDiv.appendChild(postText);

            blogSection.appendChild(postDiv);
        });

        container.appendChild(blogSection);

        // ========================================
        // 4. Email Ethel button
        // ========================================
        var emailSection = document.createElement('div');
        emailSection.className = 'grandma-email-section';

        var emailBtn = document.createElement('button');
        emailBtn.className = 'email-ethel';
        emailBtn.textContent = '\uD83D\uDCE7 Send Ethel an Email';
        emailSection.appendChild(emailBtn);

        container.appendChild(emailSection);

        // ========================================
        // 5. Photo Album link
        // ========================================
        var albumSection = document.createElement('div');
        albumSection.className = 'grandma-album-section';

        var albumLink = document.createElement('a');
        albumLink.className = 'photo-album-link';
        albumLink.href = '#';
        albumLink.textContent = "\uD83D\uDCF7 View Ethel's Photo Album";
        albumSection.appendChild(albumLink);

        container.appendChild(albumSection);

        // ========================================
        // 6. Recipe Corner
        // ========================================
        var recipeSection = document.createElement('div');
        recipeSection.className = 'recipe-section grandma-recipe';

        var recipeTitle = document.createElement('h2');
        recipeTitle.className = 'grandma-section-title';
        recipeTitle.textContent = "\uD83C\uDF73 Recipe Corner: Ethel's Famous Casserole";
        recipeSection.appendChild(recipeTitle);

        var ingredients = [
            '1 slice of bread (any variety)',
            '1 toaster (preheated to "toast" setting)',
            '1 pat of butter (optional, but recommended)',
            'A pinch of love',
            'Serve on finest china'
        ];

        var ingredientsList = document.createElement('ol');
        ingredientsList.className = 'grandma-recipe-list';
        ingredients.forEach(function (ingredient) {
            var li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });

        recipeSection.appendChild(ingredientsList);

        var recipeNote = document.createElement('p');
        recipeNote.className = 'grandma-recipe-note';
        recipeNote.textContent = 'Serves 1. Pairs well with a cup of tea and quiet reflection.';
        recipeSection.appendChild(recipeNote);

        container.appendChild(recipeSection);

        // ========================================
        // 7. Visitor counter
        // ========================================
        var counterDiv = document.createElement('div');
        counterDiv.className = 'grandma-counter';

        var counterText = document.createElement('span');
        counterText.textContent = "You are Ethel's visitor #";
        counterDiv.appendChild(counterText);

        var counterNum = document.createElement('span');
        counterNum.className = 'grandma-counter-num';
        counterNum.textContent = String(visitorNum);
        counterDiv.appendChild(counterNum);

        container.appendChild(counterDiv);

        // ========================================
        // 8. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'grandma-footer';

        var footerText = document.createElement('p');
        footerText.textContent = "Made with love by Ethel. My grandson helped me with the 'HTML.'";
        footer.appendChild(footerText);

        var footerText2 = document.createElement('p');
        footerText2.textContent = 'Best viewed with a warm cup of tea.';
        footer.appendChild(footerText2);

        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.blog-post', reward: { clicks: 5 } },
        { selector: '.garden-flower', reward: { clicks: 3 } },
        { selector: '.email-ethel', reward: { reputation: 20 } },
        { selector: '.photo-album-link', reward: { clicks: 3 } },
        { selector: '.recipe-section', reward: { clicks: 5 } }
    ]
});

// ============================================================
// ZONE 3 — THE DEEP WEB
// Dark, minimal, unsettling. The humor is gone. This is the deep web.
// ============================================================

// --- found-footage.net — VHS film archive with eerie photographs ---

SiteRegistry.register({
    id: 'found-footage',
    url: 'http://www.found-footage.net',
    title: 'found_footage',
    zone: 3,
    icon: '\uD83D\uDCF7',
    requirements: { minModem: 3, dataCost: 200, reputationCost: 50 },

    render: function (container, browser) {
        container.className = 'zone-3 found-footage-page scanlines';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        var photos = [
            {
                file: 'IMG_0023.jpg', date: 'March 12, 1997',
                caption: 'The house. Before.',
                hidden: 'The lights were on. No one was home.',
                sceneColor: '#3a3a00', sceneShape: 'window'
            },
            {
                file: 'IMG_0047.jpg', date: 'March 14, 1997',
                caption: 'Stars? No. Something else.',
                hidden: 'They moved in patterns. Deliberate patterns.',
                sceneColor: '#ffffff', sceneShape: 'dots'
            },
            {
                file: 'IMG_0089.jpg', date: 'March 19, 1997',
                caption: 'Taken at Kevin\'s house. He wasn\'t home.',
                hidden: 'Gerald was in the yard. The hamster. Just... sitting there.',
                sceneColor: '#1a3a1a', sceneShape: 'circle'
            },
            {
                file: 'IMG_0102.jpg', date: 'March 22, 1997',
                caption: 'I don\'t remember taking this.',
                hidden: 'The camera was found in a drawer. The drawer was sealed.',
                sceneColor: '#1a1a1a', sceneShape: 'faint'
            },
            {
                file: 'IMG_0156.jpg', date: 'April 1, 1997',
                caption: 'The counter reads 0023.',
                hidden: 'The counter hasn\'t changed since this was taken.',
                sceneColor: '#ffffff', sceneShape: 'grid'
            },
            {
                file: 'IMG_0200.jpg', date: 'undated',
                caption: 'last one.',
                hidden: '',
                sceneColor: '#000000', sceneShape: 'black'
            }
        ];

        // ========================================
        // 1. Header — barely visible
        // ========================================
        var header = document.createElement('div');
        header.className = 'found-header';
        var title = document.createElement('h1');
        title.className = 'found-title glitch-text';
        title.textContent = 'found_footage';
        header.appendChild(title);
        var subtitle = document.createElement('div');
        subtitle.className = 'found-subtitle';
        subtitle.textContent = 'recovered files — do not distribute';
        header.appendChild(subtitle);
        container.appendChild(header);

        // ========================================
        // 2. Photo grid
        // ========================================
        var grid = document.createElement('div');
        grid.className = 'found-grid';

        photos.forEach(function (photo) {
            var card = document.createElement('div');
            card.className = 'found-card';

            // The "photo" — a dark rectangle with a CSS-drawn scene
            var photoEl = document.createElement('div');
            photoEl.className = 'found-photo';

            // Draw scene elements inside the photo
            var scene = document.createElement('div');
            scene.className = 'found-scene found-scene-' + photo.sceneShape;
            photoEl.appendChild(scene);

            card.appendChild(photoEl);

            // File name
            var fileName = document.createElement('div');
            fileName.className = 'found-filename';
            fileName.textContent = photo.file;
            card.appendChild(fileName);

            // Date
            var dateEl = document.createElement('div');
            dateEl.className = 'found-date';
            dateEl.textContent = photo.date;
            card.appendChild(dateEl);

            // Caption
            var captionEl = document.createElement('div');
            captionEl.className = 'found-caption';
            captionEl.textContent = photo.caption;
            card.appendChild(captionEl);

            // Hidden text — revealed on click
            var hiddenEl = document.createElement('div');
            hiddenEl.className = 'found-hidden';
            if (photo.hidden) {
                hiddenEl.textContent = photo.hidden;
            }

            // Expanded view container (initially hidden)
            var expanded = document.createElement('div');
            expanded.className = 'found-expanded';
            var expandedPhoto = photoEl.cloneNode(true);
            expandedPhoto.className = 'found-photo found-photo-large';
            expanded.appendChild(expandedPhoto);
            expanded.appendChild(hiddenEl);

            card.appendChild(expanded);

            // Click to expand
            photoEl.addEventListener('click', function () {
                expanded.classList.toggle('found-expanded-visible');
            });

            grid.appendChild(card);
        });

        container.appendChild(grid);

        // ========================================
        // 3. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'found-footer';
        footer.textContent = 'archive recovered from [REDACTED] — 6 files total';
        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.found-photo', reward: { clicks: 15 } },
        { selector: '.found-caption', reward: { clicks: 5 } }
    ]
});

// --- 404-club.com — A secret club hidden behind a fake 404 page ---

SiteRegistry.register({
    id: '404-club',
    url: 'http://www.404-club.com',
    title: '404 Not Found',
    zone: 3,
    icon: '\u2049',
    requirements: { minModem: 3, dataCost: 150, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-3 club404-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        var membersRevealed = false;

        // ========================================
        // 1. Fake 404 error page
        // ========================================
        var errorPage = document.createElement('div');
        errorPage.className = 'club404-error';

        var errorH1 = document.createElement('h1');
        errorH1.className = 'error-text';
        errorH1.textContent = '404 Not Found';
        errorPage.appendChild(errorH1);

        var errorMsg = document.createElement('p');
        errorMsg.className = 'error-text';
        errorMsg.textContent = 'The requested URL /club was not found on this server.';
        errorPage.appendChild(errorMsg);

        var errorHr = document.createElement('hr');
        errorHr.className = 'club404-hr';
        errorPage.appendChild(errorHr);

        var serverSig = document.createElement('p');
        serverSig.className = 'error-text club404-server-sig';
        serverSig.textContent = 'Apache/1.3.27 Server at 404-club.com Port 80';
        errorPage.appendChild(serverSig);

        container.appendChild(errorPage);

        // ========================================
        // 2. Hidden corner text — barely visible
        // ========================================
        var corners = [
            { pos: 'top-left', text: 'look closer' },
            { pos: 'top-right', text: 'you found us' },
            { pos: 'bottom-left', text: 'click here' },
            { pos: 'bottom-right', text: 'rule 1' }
        ];

        corners.forEach(function (corner) {
            var el = document.createElement('div');
            el.className = 'hidden-corner club404-corner-' + corner.pos;
            el.textContent = corner.text;

            if (corner.pos === 'bottom-left') {
                el.addEventListener('click', function () {
                    if (membersRevealed) { return; }
                    membersRevealed = true;
                    errorPage.style.display = 'none';
                    membersArea.style.display = 'block';
                    // Reveal rules one at a time
                    var ruleEls = membersArea.querySelectorAll('.club-rule');
                    ruleEls.forEach(function (ruleEl, idx) {
                        setTimeout(function () {
                            ruleEl.classList.add('club-rule-visible');
                        }, (idx + 1) * 800);
                    });
                });
            }

            container.appendChild(el);
        });

        // ========================================
        // 3. Members area (hidden until activated)
        // ========================================
        var membersArea = document.createElement('div');
        membersArea.className = 'club404-members';
        membersArea.style.display = 'none';

        var membersTitle = document.createElement('h1');
        membersTitle.className = 'club404-members-title';
        membersTitle.textContent = 'THE 404 CLUB';
        membersArea.appendChild(membersTitle);

        var membersSub = document.createElement('div');
        membersSub.className = 'club404-members-subtitle';
        membersSub.textContent = 'MEMBERS AREA';
        membersArea.appendChild(membersSub);

        var rules = [
            'Rule 1: We do not talk about the 404 Club.',
            'Rule 2: We DO NOT talk about the 404 Club.',
            'Rule 3: If a page returns 404, it was one of us.',
            'Rule 4: Only two sites to a fight.',
            'Rule 5: One fight at a time.',
            'Rule 6: No shirts, no servers.',
            'Rule 7: Fights will go on as long as they have to.',
            'Rule 8: If this is your first time at 404 Club, you MUST click.'
        ];

        var rulesContainer = document.createElement('div');
        rulesContainer.className = 'club404-rules';

        rules.forEach(function (rule) {
            var ruleEl = document.createElement('div');
            ruleEl.className = 'club-rule';
            ruleEl.textContent = rule;
            rulesContainer.appendChild(ruleEl);
        });

        membersArea.appendChild(rulesContainer);
        container.appendChild(membersArea);
    },

    clickTargets: [
        { selector: '.hidden-corner', reward: { clicks: 25 } },
        { selector: '.club-rule', reward: { clicks: 10 } },
        { selector: '.error-text', reward: { clicks: 5 } }
    ]
});

// --- last-visitor-1997.org — Sarah's abandoned personal homepage ---

SiteRegistry.register({
    id: 'last-visitor-1997',
    url: 'http://www.last-visitor-1997.org',
    title: "Sarah's Homepage - Last Updated Oct 14, 1997",
    zone: 3,
    icon: '\uD83D\uDD78',
    requirements: { minModem: 3, dataCost: 180, reputationCost: 30 },

    render: function (container, browser) {
        container.className = 'zone-3 sarah-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // ========================================
        // 1. Header — friendly but faded
        // ========================================
        var header = document.createElement('div');
        header.className = 'sarah-header';

        var title = document.createElement('h1');
        title.className = 'sarah-title';
        title.textContent = "Welcome to Sarah's Homepage!";
        header.appendChild(title);

        var lastUpdated = document.createElement('div');
        lastUpdated.className = 'sarah-updated frozen-element';
        lastUpdated.textContent = 'Last updated: October 14, 1997';
        header.appendChild(lastUpdated);

        var hr = document.createElement('hr');
        hr.className = 'sarah-hr';
        header.appendChild(hr);

        container.appendChild(header);

        // ========================================
        // 2. Hit counter frozen at 0023
        // ========================================
        var counterDiv = document.createElement('div');
        counterDiv.className = 'sarah-counter';
        var counterLabel = document.createElement('span');
        counterLabel.textContent = 'Visitors: ';
        counterDiv.appendChild(counterLabel);
        var counterValue = document.createElement('span');
        counterValue.className = 'sarah-counter-value frozen-element';
        counterValue.textContent = '0023';
        counterDiv.appendChild(counterValue);
        container.appendChild(counterDiv);

        // ========================================
        // 3. About Me
        // ========================================
        var aboutSection = document.createElement('div');
        aboutSection.className = 'sarah-about';

        var aboutTitle = document.createElement('h2');
        aboutTitle.textContent = 'About Me';
        aboutSection.appendChild(aboutTitle);

        var aboutText = document.createElement('p');
        aboutText.textContent = "My name is Sarah. I'm a junior in high school. I like astronomy and writing poetry.";
        aboutSection.appendChild(aboutText);

        container.appendChild(aboutSection);

        // ========================================
        // 4. My Links
        // ========================================
        var linksSection = document.createElement('div');
        linksSection.className = 'sarah-links';

        var linksTitle = document.createElement('h2');
        linksTitle.textContent = 'My Links';
        linksSection.appendChild(linksTitle);

        var linksList = document.createElement('ul');
        linksList.className = 'sarah-links-list';

        // Cool Astronomy Sites — broken
        var astroLi = document.createElement('li');
        var astroLink = document.createElement('a');
        astroLink.href = '#';
        astroLink.className = 'sarah-link frozen-element';
        astroLink.textContent = 'Cool Astronomy Sites';
        astroLink.addEventListener('click', function (e) {
            e.preventDefault();
            // Show in-page dead link message instead of blocking alert
            var msg = document.createElement('div');
            msg.className = 'sarah-dead-link-msg';
            msg.textContent = 'This site no longer exists.';
            if (!astroLi.querySelector('.sarah-dead-link-msg')) {
                astroLi.appendChild(msg);
            }
        });
        astroLi.appendChild(astroLink);
        linksList.appendChild(astroLi);

        // My Poetry Page — broken
        var poetryLi = document.createElement('li');
        var poetryLink = document.createElement('a');
        poetryLink.href = '#';
        poetryLink.className = 'sarah-link frozen-element';
        poetryLink.textContent = 'My Poetry Page';
        poetryLink.addEventListener('click', function (e) {
            e.preventDefault();
            var msg = document.createElement('div');
            msg.className = 'sarah-dead-link-msg';
            msg.textContent = 'This site no longer exists.';
            if (!poetryLi.querySelector('.sarah-dead-link-msg')) {
                poetryLi.appendChild(msg);
            }
        });
        poetryLi.appendChild(poetryLink);
        linksList.appendChild(poetryLi);

        // Email Me — goes nowhere
        var emailLi = document.createElement('li');
        var emailLink = document.createElement('a');
        emailLink.href = '#';
        emailLink.className = 'sarah-link frozen-element';
        emailLink.textContent = 'Email Me!';
        emailLink.addEventListener('click', function (e) {
            e.preventDefault();
        });
        emailLi.appendChild(emailLink);
        linksList.appendChild(emailLi);

        // Kevin's Page — navigates to coolguyz
        var kevinLi = document.createElement('li');
        var kevinLink = document.createElement('a');
        kevinLink.href = '#';
        kevinLink.className = 'sarah-link frozen-element';
        kevinLink.setAttribute('data-site', 'coolguyz');
        kevinLink.textContent = "My Friend Kevin's Page";
        kevinLi.appendChild(kevinLink);
        linksList.appendChild(kevinLi);

        linksSection.appendChild(linksList);
        container.appendChild(linksSection);

        // ========================================
        // 5. Update promise — she never did
        // ========================================
        var promiseDiv = document.createElement('div');
        promiseDiv.className = 'sarah-promise';
        promiseDiv.textContent = "I'll update this page soon!";
        container.appendChild(promiseDiv);

        // ========================================
        // 6. Guestbook
        // ========================================
        var guestbookSection = document.createElement('div');
        guestbookSection.className = 'sarah-guestbook';

        var gbTitle = document.createElement('h2');
        gbTitle.textContent = 'Guestbook';
        guestbookSection.appendChild(gbTitle);

        var today = new Date();
        var todayStr = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

        var guestEntries = [
            { text: 'Great page Sarah! -Mom', date: 'Oct 10, 1997' },
            { text: 'Cool! I like space too :) -Kevin', date: 'Oct 12, 1997' },
            { text: 'update ur page!! -anonymous', date: 'Dec 3, 1997' },
            { text: 'is anyone still here?', date: 'March 15, 2003' },
            { text: 'Hello again.', date: todayStr, isToday: true }
        ];

        guestEntries.forEach(function (entry) {
            var entryDiv = document.createElement('div');
            entryDiv.className = entry.isToday ? 'sarah-gb-entry today-entry' : 'sarah-gb-entry';

            var entryText = document.createElement('div');
            entryText.className = 'sarah-gb-text';
            entryText.textContent = entry.text;
            entryDiv.appendChild(entryText);

            var entryDate = document.createElement('div');
            entryDate.className = 'sarah-gb-date';
            entryDate.textContent = entry.date;
            entryDiv.appendChild(entryDate);

            guestbookSection.appendChild(entryDiv);
        });

        container.appendChild(guestbookSection);

        // ========================================
        // 7. Footer
        // ========================================
        var footer = document.createElement('div');
        footer.className = 'sarah-footer';
        footer.textContent = 'Best viewed in Netscape Navigator 3.0';
        container.appendChild(footer);
    },

    clickTargets: [
        { selector: '.frozen-element', reward: { clicks: 8 } },
        { selector: '.today-entry', reward: { clicks: 50, reputation: 30 } },
        { selector: '.sarah-link[data-site]', action: 'navigate', target: 'coolguyz' }
    ]
});

// --- mirror.mirror.mirror — Renders an inverted mirror of the last visited site ---

SiteRegistry.register({
    id: 'mirror-mirror',
    url: 'http://mirror.mirror.mirror',
    title: '???',
    zone: 3,
    icon: '\uD83E\uDE9E',
    requirements: { minModem: 4, dataCost: 300, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-3 mirror-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Figure out the previous site from browser history
        var prevSiteId = null;
        if (browser._history && browser._historyIndex > 0) {
            prevSiteId = browser._history[browser._historyIndex - 1];
        }

        var prevSite = prevSiteId ? SiteRegistry.get(prevSiteId) : null;

        // ========================================
        // 1. Top text — faint
        // ========================================
        var topText = document.createElement('div');
        topText.className = 'mirror-text mirror-top-text';
        topText.textContent = 'This looks familiar.';
        container.appendChild(topText);

        // ========================================
        // 2. Mirror content area
        // ========================================
        var mirrorWrapper = document.createElement('div');
        mirrorWrapper.className = 'mirror-content';

        if (prevSite && typeof prevSite.render === 'function') {
            // Create a sub-container and render the previous site into it
            var subContainer = document.createElement('div');
            subContainer.className = 'mirror-sub-container';
            prevSite.render(subContainer, browser);
            mirrorWrapper.appendChild(subContainer);
        } else {
            // No previous site — empty mirror
            var emptyMsg = document.createElement('div');
            emptyMsg.className = 'mirror-empty';
            emptyMsg.textContent = 'The mirror reflects nothing. There is nothing to reflect.';
            mirrorWrapper.appendChild(emptyMsg);
        }

        // Glass overlay effect
        var glassOverlay = document.createElement('div');
        glassOverlay.className = 'mirror-glass-overlay';
        mirrorWrapper.appendChild(glassOverlay);

        container.appendChild(mirrorWrapper);

        // ========================================
        // 3. Mirror crack
        // ========================================
        var crack = document.createElement('div');
        crack.className = 'mirror-crack';

        var crackLine = document.createElement('div');
        crackLine.className = 'mirror-crack-line';
        crack.appendChild(crackLine);

        var crackShattered = false;
        crack.addEventListener('click', function () {
            if (crackShattered) { return; }
            crackShattered = true;
            mirrorWrapper.classList.add('mirror-shattered');
            // Brief shatter animation, then reveal text
            setTimeout(function () {
                var revealText = document.createElement('div');
                revealText.className = 'mirror-reveal-text';
                revealText.textContent = "You've been here before. You'll be here again.";
                container.appendChild(revealText);
            }, 600);
        });

        container.appendChild(crack);

        // ========================================
        // 4. Bottom text — faint
        // ========================================
        var bottomText = document.createElement('div');
        bottomText.className = 'mirror-text mirror-bottom-text';
        bottomText.textContent = 'But something is different.';
        container.appendChild(bottomText);
    },

    clickTargets: [
        { selector: '.mirror-crack', reward: { clicks: 20 } },
        { selector: '.mirror-text', reward: { clicks: 10 } },
        { selector: '.mirror-content', reward: { clicks: 5 } }
    ]
});

// --- the-end-of-the-internet.com — The final site. Simple, powerful. ---

SiteRegistry.register({
    id: 'the-end-of-the-internet',
    url: 'http://www.the-end-of-the-internet.com',
    title: 'The End',
    zone: 3,
    icon: '\u23F9',
    requirements: { minModem: 4, dataCost: 500, reputationCost: 100 },

    render: function (container, browser) {
        container.className = 'zone-3 end-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // ========================================
        // 1. Initial centered text
        // ========================================
        var centerBlock = document.createElement('div');
        centerBlock.className = 'end-center-block';

        var lines = [
            'Congratulations.',
            'You have reached the end of the internet.',
            'There is nothing more to see.',
            'You may now turn off your computer.'
        ];

        lines.forEach(function (line) {
            var p = document.createElement('p');
            p.className = 'end-text';
            p.textContent = line;
            centerBlock.appendChild(p);
        });

        container.appendChild(centerBlock);

        // ========================================
        // 2. Large empty space
        // ========================================
        var spacer = document.createElement('div');
        spacer.className = 'end-spacer';
        container.appendChild(spacer);

        // ========================================
        // 3. Blinking cursor — below the fold
        // ========================================
        var cursorArea = document.createElement('div');
        cursorArea.className = 'end-cursor-area';

        var cursorEl = document.createElement('div');
        cursorEl.className = 'end-cursor';
        cursorEl.textContent = '\u258C';
        cursorArea.appendChild(cursorEl);

        // Lines revealed one at a time by clicking the cursor
        var revealLines = [
            '...',
            'Still here?',
            "You've clicked through banner ads and hamster stock exchanges.",
            "You've signed guestbooks and consulted orbs.",
            "You've read every recipe for toast.",
            "You've stared into the void, and it stared back.",
            "You've visited the first page and the last.",
            'Every click was a choice.',
            'Every page was a world.',
            "And now you're here, at the end.",
            "But the internet never really ends, does it?",
            'It just loops back to the beginning.'
        ];

        var revealIndex = 0;
        var revealContainer = document.createElement('div');
        revealContainer.className = 'end-reveal-container';
        cursorArea.appendChild(revealContainer);

        cursorEl.addEventListener('click', function () {
            if (revealIndex >= revealLines.length) { return; }

            // Award 100 clicks per line
            browser.handleReward({ clicks: 100 });

            var lineEl = document.createElement('p');
            lineEl.className = 'end-revealed-line';
            lineEl.textContent = revealLines[revealIndex];
            revealContainer.appendChild(lineEl);

            revealIndex++;

            // After the last line, show the return link and set reachedEnd
            if (revealIndex >= revealLines.length) {
                cursorEl.style.display = 'none';
                browser.gameState.reachedEnd = true;
                browser.gameState.save();

                var returnLink = document.createElement('div');
                returnLink.className = 'return-link';
                returnLink.textContent = '\u2192 Return to yugaaaaa.com \u2190';
                returnLink.addEventListener('click', function () {
                    browser.navigate('yugaaaaa');
                });
                revealContainer.appendChild(returnLink);
            }
        });

        container.appendChild(cursorArea);
    },

    clickTargets: [
        { selector: '.end-text', reward: { clicks: 10 } }
    ]
});
