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
