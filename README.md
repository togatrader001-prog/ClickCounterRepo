# The Gang Learns APIs (ClickCounter → API Lab)

Joke practice website for learning **HTTP APIs** with plain HTML / CSS / JavaScript.

Tone: immature on purpose. Goal: real `fetch()` practice.

## Run it

Open `index.html` in a browser (double-click or Live Server).

No build step. No API keys required for the demos on the page.

## What each section teaches

| # | Feature | API | You practice |
|---|---------|-----|--------------|
| 1 | Scheme counter | none | local state, DOM updates |
| 2 | Bitcoin price | Coinbase spot price | GET + nested JSON |
| 3 | Book search | Open Library | query params, arrays |
| 4 | Anime image | nekos.best | image URL from JSON |
| 5 | Jokes | Official Joke API | multiple string fields |
| 6 | Dog photo | Dog CEO | random image endpoint |
| 7 | Advice | Advice Slip | nested object (`slip.advice`) |
| 8 | Age guess | Agify | user input → query string |
| 9 | Pokémon | PokéAPI | path params, richer JSON |
| 10 | Cat fact | Cat Fact Ninja | simplest JSON field |

## How to learn from this

1. Open DevTools → **Network** tab.
2. Click a button.
3. Inspect the request URL, status code, and response JSON.
4. Change an input (fake Pokémon name, weird book query) and watch errors.
5. Read `script.js` — each handler is short and labeled.

## Next step (harder APIs)

When these feel easy, practice against:

- [Automation Exercise API list](https://automationexercise.com/api_list) (GET/POST/PUT/DELETE style flows)
- More public APIs: [public-apis](https://github.com/public-apis/public-apis)

## Security note

**Never put real API keys in frontend JavaScript.** Anyone can view source and steal them.

This project previously had a Marketstack key in `script.js`. It was removed. Use free public endpoints, or a small backend proxy if you need secrets later.

## Files

- `index.html` — page structure + API cards
- `style.css` — chaotic orange styling
- `script.js` — all `fetch()` practice code
- `images/` — local joke images
