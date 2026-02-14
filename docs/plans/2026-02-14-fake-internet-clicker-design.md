# Fake Internet Clicker Game — Design Document

## Concept

A clicker game disguised as a Chrome browser. The player "surfs" a deranged fake 90s internet, clicking on links, ads, and page elements to earn currencies and unlock deeper, weirder, and eventually creepier corners of the web.

The starting page is `yugaaaaa.com` — a 90s Yahoo-style portal.

## The Chrome Shell

The game frame is a pixel-perfect fake Chrome browser window (~2008 chunky blue era). The content inside looks 90s. This contrast is intentional.

**Components:**
- **Title bar** — shows current fake site title, window control buttons (close triggers "are you sure?" dialog)
- **Tab bar** — starts with one tab. Multi-tab unlocked via progression.
- **Address bar** — shows fake URLs (e.g., `http://www.yugaaaaa.com`). Direct URL entry unlocked later.
- **Bookmarks bar** — empty at start. Bookmarks earned by discovering sites. Acts as collection/progress tracker.
- **Navigation buttons** — back/forward/refresh. Refresh randomizes some page content.
- **Content area** — where fake sites render with era-appropriate styling.

## Currency & Clicking System

### Currencies

| Currency   | Earned By                          | Spent On                              |
|------------|------------------------------------|---------------------------------------|
| Clicks     | Clicking anything                  | Upgrades, unlocking premium content   |
| Data (KB/MB/GB) | Loading pages                | Accessing heavier/deeper sites        |
| Reputation | Interacting with communities       | Unlocking social corners of the web   |

### Clickable Elements

- **Links** — navigate to new sites (costs Data, earns Clicks)
- **Banner ads** — earn bonus Clicks, sometimes unlock secret sites
- **Hit counters** — click to inflate, earns small Clicks
- **"Under construction" GIFs** — clicking enough times "finishes" the page
- **Guestbook sign buttons** — earns Reputation
- **Blinking text, marquees, visitor counters** — all clickable, all earn something

### Upgrades (spend Clicks)

- **Modem speed** — 14.4k → 28.8k → 56k → DSL → Cable. Faster loading, heavier sites.
- **Monitor size** — literally makes the content area bigger.
- **Browser tabs** — unlock multi-tabbing.
- **Search engine** — unlock address bar for direct URL entry.

## The Fake Internet — Three Zones

Tone deepens as you progress. Surface = loving parody, middle = absurdist comedy, deep = creepypasta-lite.

### Zone 1 — The Surface Web (Parody, 8-10 sites)

Unlocked from the start or with minimal Data cost.

| Site                          | Description                                                        |
|-------------------------------|--------------------------------------------------------------------|
| `yugaaaaa.com`                | Homepage portal. Categories, fake news, search, rotating ads.      |
| `hamstertrax.com`             | Hamster fan page with MIDI. Secret hamster stock exchange sidebar.  |
| `coolguyz.net`                | GeoCities personal page. "Welcome to Kevin's Page." Kevin collects spoons. |
| `recipez4u.com`               | Every recipe is toast with unhinged variations.                    |
| `www2.netsurf.org/~webring`   | Webring hub connecting all Zone 1 sites.                           |
| `totallyrealfacts.com`        | Encyclopedia of confidently wrong information.                     |
| `freesmileyz.biz`             | Smiley/cursor download site. Installs cosmetic cursors.            |
| `mega-deals-warehouse.com`    | Fake shopping. Everything costs 1 million clicks.                  |

### Zone 2 — The Weird Web (Absurdist, 6-8 sites)

Higher Data cost. Things stop making sense.

| Site                               | Description                                              |
|------------------------------------|----------------------------------------------------------|
| `the-void.net`                     | Mostly empty. Clicking darkness reveals hidden text.     |
| `infinite-guestbook.com`           | Never-ending guestbook. Massive Reputation payoff.       |
| `ask-the-orb.com`                  | Magic 8-Ball with philosophical/unsettling answers.      |
| `geocities.com/~area51/TimeCube`   | Time Cube parody. Walls of colored text.                 |
| `under-construction-forever.org`   | Entire site is construction GIFs. Reveals more construction. |
| `grandma-dot-com.net`              | Grandma's blog. Accidentally profound.                   |

### Zone 3 — The Deep Web (Creepy, 5-6 sites)

Expensive to access. Hard tone shift.

| Site                        | Description                                                      |
|-----------------------------|------------------------------------------------------------------|
| `found-footage.net`         | Grainy images, cryptic captions.                                 |
| `404-club.com`              | Pretends to be broken. Has hidden navigation.                    |
| `last-visitor-1997.org`     | Perfectly preserved. Hit counter frozen since 1997.              |
| `mirror.mirror.mirror`      | "Reflections" of visited sites, subtly altered.                  |
| `the-end-of-the-internet.com` | The final site. The culmination.                              |

## Tech Stack

- Vanilla HTML/CSS/JS
- No build tools, no frameworks
- Single-page app with JS-driven navigation
- Sites defined as data objects with HTML content strings
- All game state in localStorage for persistence

## File Structure

```
index.html          — Chrome shell + game frame
css/
  chrome.css        — Chrome browser UI styles
  sites.css         — 90s web aesthetic styles (per-zone)
js/
  game.js           — Game state, currencies, upgrades, save/load
  browser.js        — Fake browser navigation, tabs, address bar
  sites.js          — Site registry and content definitions
  effects.js        — Visual effects (loading bars, dial-up sounds, cursor changes)
```
