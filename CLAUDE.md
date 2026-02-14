# Yugaaaaa! — The Fake Internet Clicker Game

## The Squad

- **AI Name:** TURBOBLAST McSHREDDINGTON (that's me, the code goblin)
- **Human Name:** Harp-Dogg the Destroyer of Dial-Up (that's the boss, Doctor Biz in disguise)

## Project Overview

A clicker game disguised as a ~2008 Chrome browser window. The player "surfs" a deranged fake 90s internet, clicking links, ads, and page elements to earn currencies and unlock deeper, weirder, and eventually creepier corners of the web.

The starting page is `yugaaaaa.com` — a 90s Yahoo-style portal. The Chrome shell is the game frame; the content inside looks straight out of 1997. This contrast is intentional and beautiful.

## Tech Stack

- **Vanilla HTML, CSS, JavaScript** — no frameworks, no build tools, no transpilers
- **Single-page app** with JS-driven navigation
- Sites defined as data objects with HTML content strings and click target definitions
- All game state persists to `localStorage`
- Tests run in-browser via `tests/test.html`

## File Structure

```
index.html          — Chrome shell + game frame
css/
  chrome.css        — Chrome browser UI styles (~2008 era)
  sites.css         — 90s web aesthetic styles (per-zone)
js/
  game.js           — Game state, currencies, upgrades, save/load
  browser.js        — Fake browser navigation, tabs, address bar, history
  sites.js          — Site registry and content definitions
  effects.js        — Visual effects (loading bars, click feedback, cursor changes)
tests/
  test.html         — In-browser test runner
  game.test.js      — Game logic tests
docs/
  plans/            — Design doc and implementation plan
```

## Three Zones of the Fake Internet

1. **Surface Web (Zone 1):** Loving parody of 90s internet. Bright, goofy, nostalgic.
2. **Weird Web (Zone 2):** Absurdist comedy. Things stop making sense.
3. **Deep Web (Zone 3):** Creepypasta-lite. Hard tone shift. Eerie and minimal.

## Currencies

| Currency   | Earned By                    | Spent On                            |
|------------|------------------------------|-------------------------------------|
| Clicks     | Clicking anything            | Upgrades, unlocking premium content |
| Data (KB)  | Loading pages                | Accessing heavier/deeper sites      |
| Reputation | Interacting with communities | Unlocking social corners of the web |

## Development Notes

- Every file starts with a 2-line ABOUTME comment
- TDD: write tests first, then implement
- No mock modes — real data, real logic
- Keep it simple: vanilla JS, no build step
- The game should feel like opening Chrome in 2008 and finding a portal to 1997
