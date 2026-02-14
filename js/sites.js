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

// --- HamsterTrax — Your #1 Source for Hamster Info ---

SiteRegistry.register({
    id: 'hamstertrax',
    url: 'http://www.hamstertrax.com',
    title: 'HamsterTrax - #1 Hamster Info Source!',
    zone: 1,
    icon: '\uD83D\uDC39',
    requirements: { minModem: 0, dataCost: 5, reputationCost: 0 },

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
        { selector: '.hamster-photo', reward: { clicks: 3 } },
        { selector: '.stock-row', reward: { clicks: 2 } },
        { selector: '.midi-btn', reward: { clicks: 5 } },
        { selector: '.adopt-btn', reward: { reputation: 10 } },
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
    requirements: { minModem: 0, dataCost: 5, reputationCost: 0 },

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
        { selector: '.spoon-item', reward: { clicks: 2 } },
        { selector: '.under-construction-banner', reward: { clicks: 1 } },
        { selector: '.hit-counter', reward: { clicks: 1 } },
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
    requirements: { minModem: 0, dataCost: 5, reputationCost: 0 },

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
        { selector: '.recipe-card', reward: { clicks: 3 } },
        { selector: '.print-btn', reward: { clicks: 5 } },
        { selector: '.submit-recipe-btn', reward: { reputation: 8 } },
        { selector: '.cookbook-ad', reward: { clicks: 10 } }
    ]
});

// --- NetSurf WebRing Hub — Connecting the World Wide Web ---

SiteRegistry.register({
    id: 'webring',
    url: 'http://www2.netsurf.org/~webring',
    title: 'NetSurf WebRing Hub',
    zone: 1,
    icon: '\uD83D\uDD17',
    requirements: { minModem: 0, dataCost: 5, reputationCost: 0 },

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
        { selector: '.join-btn', reward: { reputation: 15 } },
        // Banner ads
        { selector: '.webring-banner', reward: { clicks: 8 } }
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
    requirements: { minModem: 0, dataCost: 5, reputationCost: 0 },

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
        { selector: '.fact-item', reward: { clicks: 2 } },
        { selector: '.cite-btn', reward: { clicks: 3 } },
        { selector: '.category-header', reward: { clicks: 3 } }
    ]
});

// --- FreeSmileyz.biz — FREE Downloads, No Virus We Promise ---

SiteRegistry.register({
    id: 'freesmileyz',
    url: 'http://www.freesmileyz.biz',
    title: 'FreeSmileyz.biz - FREE Downloads!',
    zone: 1,
    icon: '\uD83D\uDE00',
    requirements: { minModem: 0, dataCost: 10, reputationCost: 0 },

    render: function (container, browser) {
        container.className = 'zone-1 freesmileyz-page';

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Smiley/cursor data with download counts and CSS cursor mappings
        var smileys = [
            { emoji: '\uD83D\uDE0A', name: 'Happy Smiley', downloads: 4782, cursor: 'default' },
            { emoji: '\u2B50', name: 'Star Cursor', downloads: 3291, cursor: 'pointer' },
            { emoji: '\uD83C\uDFAF', name: 'Crosshair Pro', downloads: 8104, cursor: 'crosshair' },
            { emoji: '\uD83C\uDF08', name: 'Rainbow Trail', downloads: 6543, cursor: 'grab' },
            { emoji: '\uD83D\uDC80', name: 'Skull Cursor', downloads: 9876, cursor: 'not-allowed' },
            { emoji: '\uD83D\uDD25', name: 'Fire Cursor', downloads: 7210, cursor: 'cell' },
            { emoji: '\u2764\uFE0F', name: 'Heart Smiley', downloads: 5555, cursor: 'help' },
            { emoji: '\uD83C\uDFB5', name: 'Music Note', downloads: 2345, cursor: 'progress' },
            { emoji: '\uD83D\uDC7D', name: 'Alien Smiley', downloads: 4321, cursor: 'alias' },
            { emoji: '\uD83E\uDD84', name: 'Unicorn Cursor', downloads: 6789, cursor: 'zoom-in' },
            { emoji: '\uD83D\uDC8E', name: 'Diamond Cursor', downloads: 1234, cursor: 'col-resize' },
            { emoji: '\uD83C\uDF19', name: 'Moon Cursor', downloads: 3456, cursor: 'wait' }
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
                        // Update cursor
                        document.body.style.cursor = s.cursor;
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
        { selector: '.download-btn', reward: { clicks: 8 } },
        // popup-btn reward handled manually in the popup confirm handler
        { selector: '.smiley-item', reward: { clicks: 3 } }
    ]
});

// --- Mega Deals Warehouse — EVERYTHING MUST GO ---

SiteRegistry.register({
    id: 'mega-deals-warehouse',
    url: 'http://www.mega-deals-warehouse.com',
    title: 'MEGA DEALS WAREHOUSE - HUGE SAVINGS',
    zone: 1,
    icon: '\uD83D\uDCB0',
    requirements: { minModem: 0, dataCost: 10, reputationCost: 0 },

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
                    // Spend 100 clicks, earn 50 data
                    browser.handleReward({ clicks: -100, data: 50 });
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
        { selector: '.product-img', reward: { clicks: 3 } },
        { selector: '.add-to-cart', reward: { clicks: 5 } },
        // Pixel buy button handled manually in render()
        { selector: '.review-item', reward: { clicks: 2 } }
    ]
});
