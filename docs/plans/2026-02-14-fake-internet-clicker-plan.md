# Fake Internet Clicker Game — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a clicker game disguised as a Chrome browser where players surf a deranged fake 90s internet, earning currencies to unlock deeper and weirder sites.

**Architecture:** Single-page vanilla app. A Chrome shell frame renders fake websites defined as JS data objects. Game engine manages currencies, upgrades, and progression separately from rendering. All state persists to localStorage.

**Tech Stack:** Vanilla HTML, CSS, JavaScript. No frameworks, no build tools. Simple test harness for game logic.

---

### Task 1: Project Scaffold

**Files:**
- Create: `index.html`
- Create: `css/chrome.css`
- Create: `css/sites.css`
- Create: `js/game.js`
- Create: `js/browser.js`
- Create: `js/sites.js`
- Create: `js/effects.js`
- Create: `tests/test.html`
- Create: `tests/game.test.js`
- Create: `.gitignore`
- Create: `CLAUDE.md`

**Step 1: Create `.gitignore`**

```
.DS_Store
*.swp
*.swo
```

**Step 2: Create `CLAUDE.md`**

Project-specific CLAUDE.md with name assignments (pick unhinged names per global instructions), project overview, and tech stack notes.

**Step 3: Create empty files for the project structure**

Create all the files listed above with ABOUTME comments. `index.html` should have a basic HTML5 skeleton that loads all CSS and JS files. `tests/test.html` loads game.js and game.test.js and runs assertions in-browser.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold project structure"
```

---

### Task 2: Game Engine — Core State & Currencies

**Files:**
- Modify: `js/game.js`
- Modify: `tests/game.test.js`

**Step 1: Write failing tests for currency system**

Tests for:
- `GameState` initializes with 0 clicks, 0 data, 0 reputation
- `addClicks(n)` increases click count
- `addData(n)` increases data (in KB)
- `addReputation(n)` increases reputation
- `spendClicks(n)` subtracts clicks, returns true. Returns false if insufficient.
- `spendData(n)` subtracts data, returns true. Returns false if insufficient.
- `formatData(kb)` returns human-readable string ("14.4 KB", "1.2 MB", "2.1 GB")

**Step 2: Run tests to verify they fail**

Open `tests/test.html` in browser. All tests should fail.

**Step 3: Implement GameState in `js/game.js`**

Simple object/class with currency properties and methods. No DOM interaction. Pure logic.

**Step 4: Run tests to verify they pass**

**Step 5: Write failing tests for save/load**

- `save()` serializes state to localStorage
- `load()` restores state from localStorage
- Loading with no save data returns fresh state

**Step 6: Implement save/load**

**Step 7: Run tests to verify they pass**

**Step 8: Commit**

```bash
git add js/game.js tests/game.test.js
git commit -m "feat: implement core game state and currency system"
```

---

### Task 3: Game Engine — Upgrades & Progression

**Files:**
- Modify: `js/game.js`
- Modify: `tests/game.test.js`

**Step 1: Write failing tests for upgrade system**

Tests for:
- `getModemLevel()` returns current modem tier (0-4)
- `getModemName()` returns name ("14.4k", "28.8k", "56k", "DSL", "Cable")
- `upgradeModem()` costs clicks, advances tier, returns true. False if can't afford.
- `getMonitorLevel()` returns 0-3
- `upgradeMonitor()` costs clicks, advances level
- `canAccessSite(site)` checks if player has enough data/reputation/modem level
- `getUnlockedSites()` returns list of accessible site IDs
- `discoverSite(id)` marks a site as discovered, adds to bookmarks
- `getBookmarks()` returns discovered sites
- `hasTabsUnlocked()` returns false initially
- `unlockTabs()` costs clicks, enables tabs
- `hasSearchUnlocked()` returns false initially
- `unlockSearch()` costs clicks, enables address bar

**Step 2: Run tests — should fail**

**Step 3: Implement upgrade system**

Upgrade costs scale exponentially. Modem: [100, 500, 2000, 10000]. Monitor: [200, 1000, 5000]. Tabs: 1500. Search: 3000.

**Step 4: Run tests — should pass**

**Step 5: Write failing tests for site access requirements**

Each site has requirements: `{ minModem: 0, dataCost: 10, reputationCost: 0, zone: 1 }`. Test that `canAccessSite` checks all requirements.

**Step 6: Implement site access logic**

**Step 7: Run tests — should pass**

**Step 8: Commit**

```bash
git add js/game.js tests/game.test.js
git commit -m "feat: implement upgrade and progression system"
```

---

### Task 4: Chrome Shell — HTML & CSS

**Files:**
- Modify: `index.html`
- Modify: `css/chrome.css`

**Step 1: Build the Chrome shell HTML structure**

```
div#chrome-shell
  div#title-bar         (title text, window buttons)
  div#tab-bar           (single tab initially)
  div#toolbar
    div#nav-buttons     (back, forward, refresh)
    div#address-bar     (shows current URL, input hidden until unlocked)
  div#bookmarks-bar     (empty, populated as sites discovered)
  div#content-area      (where fake sites render)
  div#status-bar        (currency display: clicks, data, reputation)
```

**Step 2: Style the Chrome shell in `css/chrome.css`**

Target ~2008 Chrome aesthetic:
- Blue-gray gradient title bar
- Rounded tabs with slight 3D effect
- Light gray toolbar
- White content area with subtle border
- Status bar at bottom showing currencies with retro icons

The shell should fill the viewport. Content area takes remaining space.

**Step 3: Style the currency display in the status bar**

Three counters with labels and icons:
- Clicks: cursor icon + count
- Data: disk icon + formatted amount
- Reputation: star icon + count

**Step 4: Verify in browser — shell should render correctly, content area empty**

**Step 5: Commit**

```bash
git add index.html css/chrome.css
git commit -m "feat: build Chrome browser shell UI"
```

---

### Task 5: Browser Navigation System

**Files:**
- Modify: `js/browser.js`
- Modify: `js/game.js`
- Modify: `index.html`

**Step 1: Implement the navigation controller in `js/browser.js`**

- `navigate(siteId)` — checks if player can access site (via game.js), deducts data cost, renders site content into content area, updates address bar, pushes to history
- `goBack()` / `goForward()` — navigate browser history
- `refresh()` — re-render current page (with randomized elements)
- `updateAddressBar(url)` — display the fake URL
- `updateTitle(title)` — update title bar and tab text
- `addBookmark(siteId)` — add to bookmarks bar

**Step 2: Wire up navigation buttons, tab clicks, bookmark clicks**

**Step 3: Implement the "loading" state**

When navigating, show a loading bar in the content area. Duration based on modem speed. Faster modem = shorter load. 14.4k = 3 seconds, Cable = instant.

**Step 4: Wire up currency display to game state**

Status bar updates in real-time as currencies change.

**Step 5: Verify in browser — clicking nav buttons should work (no sites yet, but structure functions)**

**Step 6: Commit**

```bash
git add js/browser.js js/game.js index.html
git commit -m "feat: implement browser navigation system"
```

---

### Task 6: Site Registry & Content Engine

**Files:**
- Modify: `js/sites.js`
- Modify: `js/browser.js`
- Modify: `css/sites.css`

**Step 1: Define the site data schema in `js/sites.js`**

Each site is an object:
```js
{
  id: "yugaaaaa",
  url: "http://www.yugaaaaa.com",
  title: "Yugaaaaa!",
  zone: 1,
  requirements: { minModem: 0, dataCost: 0, reputationCost: 0 },
  render: function(container, gameState) { ... },
  clickTargets: [ { selector: ".banner-ad", reward: { clicks: 5 }, action: "navigate", target: "hamstertrax" }, ... ]
}
```

**Step 2: Implement the rendering pipeline in `js/browser.js`**

When navigating to a site:
1. Look up site in registry
2. Check access requirements
3. Show loading animation
4. Call site's `render()` function to populate content area
5. Attach click handlers to all `clickTargets`
6. Each click handler: plays click animation, awards currency, optionally triggers navigation or special effect

**Step 3: Create base 90s CSS styles in `css/sites.css`**

- Zone 1: Bright backgrounds, Comic Sans/Times New Roman, tiled BG images (CSS patterns), `<marquee>` via CSS animation, blinking text via CSS animation
- Zone 2: Darker, more chaotic, overlapping elements, animated backgrounds
- Zone 3: Dark, minimal, monospace fonts, static/glitch effects

**Step 4: Verify rendering pipeline works with a placeholder test site**

**Step 5: Commit**

```bash
git add js/sites.js js/browser.js css/sites.css
git commit -m "feat: implement site registry and content rendering engine"
```

---

### Task 7: Zone 1 Sites — yugaaaaa.com (The Homepage)

**Files:**
- Modify: `js/sites.js`

**Step 1: Build yugaaaaa.com**

This is the starting page and most important site. It needs:
- Giant "YUGAAAAA!" logo in 90s style (gradient text, shadow)
- Search bar (cosmetic initially, functional after Search upgrade)
- Category links grid: "Arts & Humanities", "Business & Economy", "Computers & Internet", "Entertainment", "News & Media", "Recreation & Sports" — each links to a different fake site
- Rotating banner ad (cycles through fake ads, each clickable for bonus clicks)
- "What's New on the Internet" section with fake headlines linking to sites
- Scrolling marquee: "Welcome to the INFORMATION SUPERHIGHWAY! You are visitor #" + hit counter
- Hit counter (clickable, inflates on click)
- "Cool Site of the Day" sidebar featuring a random discovered site
- Weather widget: "Current internet weather: SUNNY with a chance of pop-ups"
- Stock ticker marquee with absurd stocks: "HMSTR +420%, TOAST -69%, SPOON +1337%"
- Email icon showing "You have 9,999 unread messages!"

**Click targets:**
- Each category link → navigates to corresponding site (5 clicks reward)
- Banner ads → 10-25 clicks reward per click
- Hit counter → 1 click reward, counter goes up
- Search bar → if search unlocked, navigate by URL
- Stock ticker items → 2 clicks each

**Step 2: Verify in browser — yugaaaaa.com renders as homepage, all click targets work**

**Step 3: Commit**

```bash
git add js/sites.js
git commit -m "feat: build yugaaaaa.com homepage"
```

---

### Task 8: Zone 1 Sites — Batch 1 (hamstertrax, coolguyz, recipez4u)

**Files:**
- Modify: `js/sites.js`

**Step 1: Build `hamstertrax.com`**

- Header: "HamsterTrax - Your #1 Source for Hamster Info!"
- MIDI player widget (cosmetic, "Now playing: hamsterdance.mid")
- Hamster photo gallery (CSS art or emoji-based)
- Sidebar: "Hamster Stock Exchange" with ticking prices for hamster breeds
- "Adopt a Virtual Hamster" button (earns reputation)
- Guest book link
- Click targets: hamster photos (3 clicks), stock prices (2 clicks), adopt button (10 reputation), MIDI player (5 clicks, "volume up!")

**Step 2: Build `coolguyz.net`**

- "Welcome to Kevin's Page" in WordArt-style CSS
- Under construction GIF (CSS animated)
- "About Me: My name is Kevin. I like spoons."
- Spoon collection gallery with descriptions for each spoon
- Visitor counter
- Webrings navigation at bottom
- Guestbook link
- Click targets: each spoon (2 clicks), under construction (1 click, after 50 clicks reveals secret), visitor counter (1 click), guestbook (5 reputation)

**Step 3: Build `recipez4u.com`**

- Recipe listing page styled like early food sites
- "Recipe of the Day: Extreme Toast"
- Recipe categories: "Breakfast Toast", "Lunch Toast", "Dinner Toast", "Dessert Toast", "Emergency Toast"
- Each recipe is earnestly detailed but absurd
- Print button ("Print Recipe" earns 5 clicks)
- Submit recipe form (cosmetic, earns reputation)
- Click targets: recipe links (3 clicks), print buttons (5 clicks), submit form (8 reputation)

**Step 4: Verify all three sites render and click targets work**

**Step 5: Commit**

```bash
git add js/sites.js
git commit -m "feat: add hamstertrax, coolguyz, and recipez4u sites"
```

---

### Task 9: Zone 1 Sites — Batch 2 (webring, totallyrealfacts, freesmileyz, mega-deals)

**Files:**
- Modify: `js/sites.js`

**Step 1: Build `www2.netsurf.org/~webring`**

- Classic webring hub page
- "NetSurf WebRing — Connecting the World Wide Web!"
- List of all Zone 1 member sites with descriptions and thumbnails
- "Previous | Random | Next" navigation
- "Join This WebRing" form (earns reputation)
- Banner ads
- Click targets: site links (navigate + 3 clicks), random (navigate to random site + 5 clicks), join form (15 reputation)

**Step 2: Build `totallyrealfacts.com`**

- Encyclopedia-style layout
- "Did You Know?" featured fact
- Category browse: Animals, Science, History, Geography
- Each fact is completely wrong but presented with total confidence
- "Cite This Fact" button
- Facts like: "The sun is actually cold", "Dolphins invented the internet", "Mount Everest is in Ohio"
- Click targets: each fact (2 clicks), cite button (3 clicks), category links (3 clicks)

**Step 3: Build `freesmileyz.biz`**

- Grid of smiley faces and custom cursors
- "FREE DOWNLOAD! NO VIRUS!"
- Download buttons that "install" cosmetic cursors (CSS cursor changes)
- Pop-up warnings: "Are you SURE you want this smiley? (YES) (ALSO YES)"
- Download counter per smiley
- Click targets: each smiley download (8 clicks + cosmetic effect), pop-up buttons (2 clicks)

**Step 4: Build `mega-deals-warehouse.com`**

- Shopping site with absurd products
- "MEGA SAVINGS! TODAY ONLY! (every day)"
- Products: "Invisible Hat - 1,000,000 clicks", "Used Air - 500,000 clicks", "Pet Rock NFT - 999,999 clicks"
- Shopping cart (cosmetic)
- Actually purchasable cheap item: "Slightly Used Pixel - 100 clicks" (awards data bonus)
- Click targets: product images (3 clicks), add to cart buttons (5 clicks), buy pixel (spend 100 clicks, gain 50 data)

**Step 5: Verify all four sites render and work**

**Step 6: Commit**

```bash
git add js/sites.js
git commit -m "feat: add webring, totallyrealfacts, freesmileyz, and mega-deals sites"
```

---

### Task 10: Zone 2 Sites — The Weird Web

**Files:**
- Modify: `js/sites.js`
- Modify: `css/sites.css`

**Step 1: Build `the-void.net`**

- Almost entirely black page
- Tiny text appears when you click in the darkness
- Each click in a new area reveals a word/phrase
- Phrases form a cryptic poem when assembled
- After revealing all text: "The void appreciates your company" + massive click bonus
- Requirements: minModem 1, dataCost 50
- Click targets: dark areas (5 clicks each, reveal text)

**Step 2: Build `infinite-guestbook.com`**

- Endlessly scrolling guestbook entries from fake users
- "Sign the Guestbook" button always visible
- Entries get weirder as you scroll: starts normal ("Great site! -Dave"), gets bizarre ("The hamsters know. -???")
- Each sign earns 15 reputation
- Auto-generates procedural entries as you scroll
- Requirements: minModem 1, dataCost 30, reputationCost 20
- Click targets: sign button (15 reputation), individual entries (2 clicks)

**Step 3: Build `ask-the-orb.com`**

- Centered glowing orb (CSS radial gradient + animation)
- "Ask the Orb a question" text input
- Orb gives philosophical/unsettling responses regardless of input
- Responses: "You already know the answer.", "The orb sees through you.", "Why do you click?", "There are no questions, only clicks.", "Your modem speed is irrelevant in the grand scheme."
- Requirements: minModem 1, dataCost 40
- Click targets: orb itself (10 clicks per consult), submit question (10 clicks + random response)

**Step 4: Build `geocities.com/~area51/TimeCube`**

- Wall of text in multiple colors and sizes
- Random text rotations and emphasis
- Earnest but incomprehensible theory about how "time is actually cube-shaped"
- Highlighted "key phrases" are clickable
- Scrolls forever with procedurally generated nonsense
- Requirements: minModem 2, dataCost 80
- Click targets: highlighted phrases (4 clicks each), the cube diagram (20 clicks)

**Step 5: Build `under-construction-forever.org`**

- Grid of animated "under construction" barrier GIFs (CSS animated)
- Clicking each one "removes" it, revealing... another construction sign beneath
- After clicking 100 total, reveal message: "Thank you for your patience. Construction will resume shortly."
- Then a single new construction sign appears
- Requirements: minModem 1, dataCost 25
- Click targets: construction signs (1 click each, 100 to complete, 500 click bonus)

**Step 6: Build `grandma-dot-com.net`**

- Floral background, large text, comic sans
- "Ethel's Internet Corner"
- Blog posts about mundane things that become accidentally profound
- "Today I watered the garden and thought about impermanence"
- "Harold next door got a new router. Life moves fast."
- Photo gallery of "my garden" (CSS flowers)
- "Send Ethel an Email" button (reputation)
- Requirements: minModem 1, dataCost 20
- Click targets: blog posts (5 clicks), photos (3 clicks), email button (20 reputation)

**Step 7: Verify all Zone 2 sites render with correct styling and access requirements**

**Step 8: Commit**

```bash
git add js/sites.js css/sites.css
git commit -m "feat: add Zone 2 weird web sites"
```

---

### Task 11: Zone 3 Sites — The Deep Web

**Files:**
- Modify: `js/sites.js`
- Modify: `css/sites.css`

**Step 1: Build `found-footage.net`**

- Dark page with VHS scanline effect (CSS)
- Grid of "photographs" — CSS art depicting vague/eerie scenes
- Each image has a date and cryptic caption
- Clicking images reveals a larger view with additional text
- Captions reference other sites in the game: "Taken at Kevin's house, 1997. He wasn't home."
- Requirements: minModem 3, dataCost 200, reputationCost 50
- Click targets: images (15 clicks each), captions (5 clicks)

**Step 2: Build `404-club.com`**

- Displays a 404 error page
- But moving mouse reveals faint text at the edges
- Hidden clickable areas in specific corners
- Navigating the hidden links opens "members only" area
- Members area: list of cryptic rules ("Rule 1: We do not talk about the 404 Club", "Rule 7: If this is your first time at 404 Club, you must click")
- Requirements: minModem 3, dataCost 150
- Click targets: hidden areas (25 clicks), each rule (10 clicks)

**Step 3: Build `last-visitor-1997.org`**

- Perfectly preserved 1997 personal homepage
- "Last updated: October 14, 1997"
- Hit counter frozen at 0023
- "I'll update this page soon!" at the bottom
- Everything is eerily intact. Links to sites that "no longer exist" (actually Zone 1 sites but described differently)
- A single new entry in the guestbook from today's date. Just: "Hello again."
- Requirements: minModem 3, dataCost 180, reputationCost 30
- Click targets: frozen elements (8 clicks), the guestbook entry (50 clicks + 30 reputation)

**Step 4: Build `mirror.mirror.mirror`**

- Renders a "mirror" version of the last site the player visited
- Same layout but colors inverted, text slightly altered
- Some words replaced with synonyms. Some sentences rearranged.
- A "reflection" of the player's click counter that counts down instead of up
- The deeper you look, subtle differences emerge
- Requirements: minModem 4, dataCost 300
- Click targets: differences from original (20 clicks per difference found), mirror counter (1 click, but counter goes down)

**Step 5: Build `the-end-of-the-internet.com`**

- Simple page: "Congratulations. You have reached the end of the internet."
- "There is nothing more to see. You may now turn off your computer."
- Below the fold: a single blinking cursor
- Clicking the cursor reveals one line at a time — a reflection on the journey
- Final line: "...but you could always go back to the beginning."
- Link back to yugaaaaa.com — but the homepage has subtle changes now
- Requirements: minModem 4, dataCost 500, reputationCost 100
- Click targets: the cursor (100 clicks per line, massive payoff), the return link (resets homepage with easter eggs)

**Step 6: Add Zone 3 CSS — dark themes, glitch effects, VHS scanlines, subtle animations**

**Step 7: Verify all Zone 3 sites render with correct tone shift and access requirements**

**Step 8: Commit**

```bash
git add js/sites.js css/sites.css
git commit -m "feat: add Zone 3 deep web sites"
```

---

### Task 12: Upgrade Shop UI

**Files:**
- Modify: `index.html`
- Modify: `css/chrome.css`
- Modify: `js/browser.js`
- Modify: `js/game.js`

**Step 1: Add upgrade shop to Chrome shell**

A "Settings" or gear icon in the toolbar that opens a panel over the content area. Shows available upgrades with costs, current levels, and buy buttons. Styled like a browser settings page but with 90s flair.

Upgrades:
- Modem Speed: shows current tier, cost for next, buy button
- Monitor Upgrade: shows current size, cost, buy button
- Browser Tabs: locked/unlocked, cost, buy button
- Search Engine: locked/unlocked, cost, buy button

**Step 2: Wire up buy buttons to game state**

Clicking buy: deducts clicks, updates game state, refreshes UI. If the player can't afford it, button is grayed out with "Not enough clicks!" tooltip.

**Step 3: Implement monitor size upgrade visual effect**

When monitor is upgraded, the content area literally gets bigger (padding decreases, or the chrome shell gets thinner). Feels like upgrading your CRT.

**Step 4: Implement tab unlock**

After purchasing, tab bar shows "+" button. Clicking "+" opens a new tab. Each tab maintains its own navigation history.

**Step 5: Implement search unlock**

After purchasing, address bar becomes an input field. Typing a known URL and pressing enter navigates there. Unknown URLs show "This site does not exist... yet."

**Step 6: Verify all upgrades work and persist after save/load**

**Step 7: Commit**

```bash
git add index.html css/chrome.css js/browser.js js/game.js
git commit -m "feat: implement upgrade shop UI"
```

---

### Task 13: Visual Effects & Polish

**Files:**
- Modify: `js/effects.js`
- Modify: `css/chrome.css`
- Modify: `css/sites.css`

**Step 1: Implement dial-up loading animation**

When navigating to a new site, show a loading bar in the content area. Include a "connecting..." animation with modem-style text: "Dialing...", "Connecting at 14.4 kbps...", "Verifying username and password...", "Connected!". Duration scales with modem upgrade.

**Step 2: Implement click feedback**

When clicking a reward target:
- Brief "+N clicks" / "+N data" / "+N rep" floating text animation
- Subtle pulse on the clicked element
- Status bar counter animates the increase

**Step 3: Implement cursor changes**

After downloading cursors from freesmileyz.biz, the cursor changes. Store unlocked cursors in game state. Player can pick active cursor from settings panel.

**Step 4: Implement auto-save**

Auto-save every 30 seconds. Show brief "Saving..." indicator in status bar.

**Step 5: Add sound toggle**

A speaker icon in the toolbar. When enabled, play subtle click sounds (Web Audio API, generated tones — no external files needed).

**Step 6: Commit**

```bash
git add js/effects.js css/chrome.css css/sites.css
git commit -m "feat: add visual effects, loading animation, and click feedback"
```

---

### Task 14: Integration Testing & Final Polish

**Files:**
- Modify: `tests/game.test.js`
- Modify: all files as needed

**Step 1: Write integration tests**

- Full navigation flow: start at yugaaaaa → click link → arrive at target site
- Currency earn/spend cycle: click targets → earn clicks → buy upgrade → verify upgrade effect
- Save/load round-trip: earn currencies, save, reload, verify state restored
- Zone gating: verify Zone 2/3 sites inaccessible without meeting requirements
- Progression: verify bookmark discovery, site unlock tracking

**Step 2: Run all tests, fix any failures**

**Step 3: Manual playtest**

Walk through the entire game from fresh start:
- Can navigate yugaaaaa.com
- Can click targets and earn currencies
- Can buy first modem upgrade
- Can access Zone 2 sites after progression
- Can eventually reach Zone 3 and the-end-of-the-internet.com
- Save/load works

**Step 4: Fix any issues found in playtest**

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: integration tests and final polish"
```
