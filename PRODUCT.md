# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, hosted on Automattic's Spacefast. This replaces the current Cloudflare Worker + KV deploy (`src/index.js`, `wrangler.jsonc`, `.github/workflows/deploy.yml`), which is being retired. The site ships as one page, but it must be built from reusable Astro layouts and components so more pages can be added later without restructuring.

## Users

The general public. They reach cosmos.maison from outside links and are curious enough to click. Some want a quick surprise and will take the random warp straight away. Others want to browse and learn which products belong to Automattic's Cosmos family.

## Product Purpose

cosmos.maison is the front door to Automattic's Cosmos family of consumer brands. It does two jobs:

1. **Random warp.** An "I'm Feeling Lucky"-style action that sends the visitor straight to the website of one Cosmos company, chosen at random.
2. **Exploration.** A single scrolling page with a stop for each Cosmos brand, so visitors can see the whole family and pick one themselves.

A visit succeeds when the visitor leaves for a Cosmos brand's site, whether through the warp or through a brand stop.

## Positioning

This is the only place that presents Automattic's Cosmos brands together as one family, and the only one that offers a warp to a random member of it.

## Operating Context

- Domain: cosmos.maison.
- Brands with an exploration stop: **Tumblr, Day One, Pocket Casts, Me.sh, Spacefast**.
- Existing random-redirect behavior (to be carried over): a weighted random choice from a target list (`kv/targets.json`). A weight of 0 or less disables a target. Responses use `Cache-Control: no-store` so every visit gets a fresh pick.
- Visitors use both pointer and touch devices.

## Capabilities and Constraints

- Home page title: **"Welcome to our Cosmos"**.
- Supporting line: **"Explore our full galaxy of products"**.
- Primary actions: **"Warp to a random Cosmos"** (sends the visitor straight to a random Cosmos brand's site) and **"I want to explore"** (scrolls down to the brand stops).
- Each brand stop shows that brand's logo and an original haiku written for that company.
- Open decision: which brands the random warp can land on. The current list is Pocket Casts, Day One and Beeper. The exploration stops are Tumblr, Day One, Pocket Casts, Me.sh and Spacefast. Beeper has no stop, and three stops aren't in the warp list yet.
- Open decision: each brand's destination URL. Only pocketcasts.com, dayoneapp.com and beeper.com are confirmed in the repo.
- Open decision: whether weighting carries over, and whether the random pick runs server-side (an Astro endpoint or middleware on Spacefast) or client-side. This depends on what Spacefast's runtime supports.

## Brand Commitments

Binding constraints the owner stated for the home page:

- The page looks like a gently swirling spiral galaxy of stars that responds lightly to the visitor's cursor or touch.
- As the visitor scrolls, the galaxies fade in and out gently between brand stops.
- The title font is futuristic, beautiful and easy to read.
- The overall feel should be beautiful and picturesque.

Each brand's own name and logo must be used as that brand publishes them.

## Evidence on Hand

- No brand logos in the repo yet. The official Tumblr, Day One, Pocket Casts, Me.sh and Spacefast marks have to be sourced, never redrawn or approximated.
- The haikus will be newly written. They are original copy, not quotes or endorsements.
- There are no testimonials, metrics or press, and none may be invented.

## Product Principles

1. **One click to somewhere real.** Both paths end on a real Cosmos brand's site, and the warp never feels slower than a plain link.
2. **The family, not a sales pitch.** Each brand stop introduces the brand and links out. It makes no claims about the brand.
3. **Wonder without friction.** The galaxy sets the mood, but the title, the text and both actions stay readable and usable at all times.
4. **Built to grow.** Add each new brand or page as data plus a reusable template. Never hand-build a one-off section.

## Accessibility & Inclusion

The audience is the general public, so the site targets WCAG 2.2 AA. The galaxy and scroll motion must respect `prefers-reduced-motion`, and the page must stay fully usable with keyboard, touch and screen readers. Both actions and every brand stop must work with the animation turned off.
