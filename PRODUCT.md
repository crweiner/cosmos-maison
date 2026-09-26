# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, hosted on Automattic's Spacefast. This replaces the current Cloudflare Worker + KV deploy (`src/index.js`, `wrangler.jsonc`, `.github/workflows/deploy.yml`), which is being retired. The site ships as one page, but it must be built from reusable Astro layouts and components so more pages can be added later without restructuring.

## Users

The general public. They reach cosmos.maison from outside links and are curious enough to click. Some want a quick surprise and will take the random warp straight away. Others want to browse and learn which products belong to Automattic's constellation of brands.

## Product Purpose

cosmos.maison is the front door to Automattic's constellation of consumer brands (the Cosmos brands). It does two jobs:

1. **Random warp.** An "I'm Feeling Lucky"-style action that sends the visitor straight to the website of one Cosmos company, chosen at random.
2. **Exploration.** A single scrolling page with a stop for each Cosmos brand, so visitors can see the whole constellation and pick one themselves.

A visit succeeds when the visitor leaves for a Cosmos brand's site, whether through the warp or through a brand stop.

## Positioning

This is the only place that presents Automattic's Cosmos brands together as one constellation, and the only one that offers a warp to a random member of it.

## Operating Context

- Domain: cosmos.maison.
- Cosmos brands (each has a stop and is a warp destination): **Tumblr** (tumblr.com), **Day One** (dayoneapp.com), **Pocket Casts** (pocketcasts.com), **Me.sh** (me.sh), **Spacefast** (spacefast.com), **Beeper** (beeper.com). The list lives in `src/data/brands.ts`.
- Random warp: a uniform random pick in the browser that never repeats the brand chosen last in the same session. `/warp/` is a shareable random link, and it shows a plain list of destinations when JavaScript is off. Spacefast serves files only, so there is no server-side 302; a Spacefast Functions worker could add one later. The old Cloudflare Worker (weighted targets in KV) is retired.
- Visitors use both pointer and touch devices.

## Capabilities and Constraints

- Home page title: **"Welcome to our Cosmos"**.
- Supporting line: **"Explore Automattic's constellation of brands"**. Visible copy calls the group a "constellation", never a "family".
- Primary actions: **"Warp to a random Cosmos"** (sends the visitor straight to a random Cosmos brand's site) and **"I want to explore"** (scrolls down to the brand stops).
- Each brand stop shows that brand's logo and an original haiku written for that company.
- Every outbound link carries `utm_source=cosmos.maison&utm_medium=referral&utm_campaign=cosmos` plus `utm_content` naming the path (`warp`, `stop`, `warp-link`, `warp-list`), so brand logs credit cosmos.maison. Tagging lives in `referral()` in `src/data/brands.ts`; never link out without it.
- Each brand stop shows the official mark, the owner-approved haiku, and a link to the brand's site. Haikus use no em dashes (owner preference).

## Brand Commitments

Binding constraints the owner stated for the home page:

- The page looks like a gently swirling spiral galaxy of stars that responds lightly to the visitor's cursor or touch.
- As the visitor scrolls, the galaxies fade in and out gently between brand stops.
- The title font is futuristic, beautiful and easy to read.
- The overall feel should be beautiful and picturesque.

Each brand's own name and logo must be used as that brand publishes them.

## Evidence on Hand

- Official marks for all six brands are in `public/logos/`, sourced from the makers strip on spacefast.com (Automattic). Dark wordmark fills are reversed for the dark ground, and each SVG records its source. Never redraw or approximate them.
- The six haikus are original copy, approved by the owner. They are not quotes or endorsements.
- There are no testimonials, metrics or press, and none may be invented.

## Product Principles

1. **One click to somewhere real.** Both paths end on a real Cosmos brand's site, and the warp never feels slower than a plain link.
2. **The constellation, not a sales pitch.** Each brand stop introduces the brand with one plain line saying what it is, then links out. It makes no claims about the brand.
3. **Wonder without friction.** The galaxy sets the mood, but the title, the text and both actions stay readable and usable at all times.
4. **Built to grow.** Add each new brand or page as data plus a reusable template. Never hand-build a one-off section.

## Accessibility & Inclusion

The audience is the general public, so the site targets WCAG 2.2 AA. The galaxy and scroll motion must respect `prefers-reduced-motion`, and the page must stay fully usable with keyboard, touch and screen readers. Both actions and every brand stop must work with the animation turned off.
