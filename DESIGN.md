---
name: cosmos.maison
description: The Cosmos family of Automattic brands, set as a deep-sky observation plate you can stir with your hand.
colors:
  void: "#04060b"
  ink: "#ede6da"
  ink-soft: "#b9c4c2"
  ink-faint: "rgb(237 230 218 / 0.38)"
  ink-edge: "rgb(237 230 218 / 0.5)"
  hairline: "rgb(237 230 218 / 0.22)"
  void-wash: "rgb(4 6 11 / 0.25)"
  scrollbar-slate: "#2a3a3e"
  teal: "#1fa7a0"
  teal-bright: "#6fd6cb"
  gold: "#e3a24a"
  gold-bright: "#f2c47a"
  rust: "#c74d38"
  starlight-white: "#ffffff"
typography:
  display:
    fontFamily: "'Unbounded Variable', 'Unbounded', ui-sans-serif, sans-serif"
    fontSize: "clamp(min(2.4rem, 11vw), min(0.9rem + 6.2vw, 12.5vh), 6rem)"
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Unbounded Variable', 'Unbounded', ui-sans-serif, sans-serif"
    fontSize: "clamp(min(2rem, 9vw), 1rem + 4vw, 4.25rem)"
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Geologica Variable', 'Geologica', ui-sans-serif, sans-serif"
    fontSize: "clamp(1.15rem, 0.95rem + 0.8vw, 1.5rem)"
    fontWeight: 300
    lineHeight: 1.4
  verse:
    fontFamily: "'Geologica Variable', 'Geologica', ui-sans-serif, sans-serif"
    fontSize: "clamp(1rem, 5.3cqi, 2.5rem)"
    fontWeight: 300
    lineHeight: 1.32
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Geologica Variable', 'Geologica', ui-sans-serif, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Geologica Variable', 'Geologica', ui-sans-serif, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    letterSpacing: "0.06em"
  caption:
    fontFamily: "'Geologica Variable', 'Geologica', ui-sans-serif, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0.08em"
rounded:
  plate: "2px"
spacing:
  gutter: "clamp(1rem, 0.4rem + 3vw, 3.5rem)"
  gutter-left: "max(clamp(1rem, 0.4rem + 3vw, 3.5rem), env(safe-area-inset-left))"
  gutter-right: "max(clamp(1rem, 0.4rem + 3vw, 3.5rem), env(safe-area-inset-right))"
  frame-inset: "clamp(0.75rem, 1.6vw, 1.5rem)"
  action-gap: "0.875rem"
  column-gap: "min(1.5rem, 1.6vw)"
components:
  button-warp:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.void}"
    typography: "{typography.label}"
    rounded: "{rounded.plate}"
    padding: "0 1.5rem"
    height: "3.5rem"
  button-warp-hover:
    backgroundColor: "{colors.gold-bright}"
    textColor: "{colors.void}"
  button-explore:
    backgroundColor: "{colors.void-wash}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.plate}"
    padding: "0 1.5rem"
    height: "3.5rem"
  button-explore-hover:
    textColor: "{colors.starlight-white}"
  button-compact:
    padding: "0 1rem"
    typography: "{typography.caption}"
  stop-link:
    textColor: "{colors.gold-bright}"
    typography: "{typography.caption}"
    padding: "0.75rem 0"
    height: "2.75rem"
    width: "min(100%, 16rem)"
  stop-link-hover:
    textColor: "{colors.starlight-white}"
  index-tick:
    backgroundColor: "{colors.ink-faint}"
    width: "14px"
    height: "1px"
  index-tick-current:
    backgroundColor: "{colors.gold}"
    width: "28px"
    height: "1px"
  index-target-touch:
    width: "2.75rem"
    height: "2.75rem"
---

# Design System: cosmos.maison

## Overview

**Creative North Star: "The Deep Field Plate"**

Every surface is an astronomical observation plate: narrowband false-color light on a void close to black, annotated in small, precise type. The sky is the image and the interface is the annotation on it. Oxygen teal and hydrogen gold carry the light; rust appears only as dust lanes and the rare hot star. Photographic grain sits in the exposure itself, beneath the text, and hairline registration marks hold the four corners of the viewport like the edges of a glass plate.

The type does the work that chrome would do elsewhere. A wide, light futuristic display face states the title; a quiet humanist sans sets verse, body and the uppercase caption annotations. Controls are plate labels: flat rectangles with a 2px corner, either a solid gold label or a hairline outline, never pills. Nothing floats on a card, a glass panel or a glow. Text sits directly on the sky and earns legibility from a soft void-colored shadow and from being placed where the galaxy leaves the frame empty.

Motion is astronomical, not decorative: slow rotation with trailing arms, scroll-driven crossfades between galaxies, stars that lean toward the pointer and settle, and one exposure-style warp in which the frame stops clearing, stars stretch into long-exposure trails and the plate burns out to light. Everything reduces to a still, composed plate under `prefers-reduced-motion`, and the still plate is always there to fall back to.

**Key Characteristics:**
- Void ground, two narrowband light colors, rust held back for dust.
- Text set as plate annotation: display title, uppercase tracked captions, hairline rules.
- Four hairline registration marks and a plate designation as the persistent frame.
- Flat 2px plate labels for actions; no pills, cards, glass or UI glow.
- Content placed on the side of the frame the galaxy leaves empty.
- Photographic grain in the exposure; four-point diffraction spikes on the brightest stars.

## Colors

A narrowband palette: two emission colors and one absorption color on near-black, read through warm off-white ink.

### Primary
- **Hydrogen Gold** (gold): the one solid action color. Fills the Warp plate label, the selection highlight, the skip link, the current tick in the stop index and the hover rule under a brand link. In the sky it is the old-star and bulge light, and the core of the favicon.
- **Pale Hydrogen** (gold-bright): hover state of the gold label and the resting color of outbound brand links and warp destinations, where it reads as the lit version of gold on the void.

### Secondary
- **Oxygen Teal** (teal): the young-star and arm light of every galaxy, rendered by the sky renderer; also the favicon spiral. Not used as a UI fill.
- **Pale Oxygen** (teal-bright): the focus ring (2px, 4px offset) and the hairline label's hover border. Teal in the interface means "attention here", never "act".

### Tertiary
- **Dust Rust** (rust): reserved for dust lanes and a sparse population of hot stars inside the galaxy. The CSS token mirrors the renderer's own rust so the two never drift apart. It never appears in type, borders or fills.

### Neutral
- **Plate Void** (void): page ground, theme color, scrollbar track, text on gold, the tone-mapping floor of the renderer and the color of every legibility scrim.
- **Plate Ink** (ink): headlines, verse, masthead mark, the current index label and the hairline label's text. A warm off-white, never pure white at rest.
- **Soft Ink** (ink-soft): lede, body notes, captions, the plate designation, the colophon and resting index labels. The faintest color any text may take.
- **Faint Ink** (ink-faint): decoration only. Registration marks, the caliper over each brand plate, resting index ticks.
- **Ink Edge** (ink-edge): the 1px border of the hairline plate label, half-strength ink so the outline reads without competing with gold.
- **Hairline** (hairline): 1px rules that divide, such as the rule above a brand link and the rows of the warp destination list.
- **Void Wash** (void-wash): the quarter-strength void behind the hairline plate label, just enough to hold its text off a bright arm.
- **Scrollbar Slate** (scrollbar-slate): the thin scrollbar thumb on the void track; a dark teal-grey that stays out of the plate.
- **Starlight White** (starlight-white): hover response. Hairline labels, brand links and destinations brighten to white under the pointer. Also the warp status, which needs white for its difference blend.

### Named Rules
**The Narrowband Rule.** Light is teal or gold. Rust is dust. No purple, magenta or cyan-violet nebula tones; the palette is two emission lines and one absorber.

**The One Solid Rule.** Gold is the only filled control color, and each viewport carries at most one gold plate label per action group.

**The Ink At Rest Rule.** Resting text is warm ink, not white. Pure white is a hover response; the only resting white is the warp status, whose difference blend needs it to invert against the burning plate.

**The Faint Is Decoration Rule.** Faint ink draws annotation devices (registration corners, calipers, ticks) and never sets text. Any word on the plate is soft ink or brighter.

## Typography

**Display Font:** Unbounded Variable (with ui-sans-serif, sans-serif)
**Body Font:** Geologica Variable (with ui-sans-serif, sans-serif)

**Character:** Unbounded at weight 300 is wide, geometric and futuristic while staying readable at large sizes; it is used only for titles. Geologica is a calm humanist sans that sets verse, body, labels and caption annotations, so the voice of the plate stays quiet around the one loud title.

### Hierarchy
- **Display** (300, fluid up to 6rem, 1.02, -0.035em): the home title only. Max 11ch, balanced wrap, lower-left of the first viewport. Its floor gives way to the screen width on narrow phones (11vw) and its fluid term is capped by viewport height, so it fits phones and short landscape screens alike.
- **Headline** (300, fluid up to 4.25rem, 1.05, -0.03em, balanced wrap): one shared headline style serves the closing line, the 404 title and the /warp/ title. Its floor gives way to the screen width (9vw) on narrow phones. It carries the display scrim.
- **Title** (300, fluid 1.15 to 1.5rem, 1.4): the lede under the display title, in soft ink, max 30ch. The warp status reuses this size in the display face.
- **Verse** (300, sized from the plate's own inline size, 1.32, -0.01em): brand haikus. One line per verse at default text size; line two steps in 1.2em and line three 0.6em, down the plate. When enlarged text forces a verse to wrap, its continuation hangs 1em under the verse so three lines still read as three. Browsers without container units get a plain viewport-based size (clamp(1rem, 0.9rem + 1.3vw, 2.5rem)) on the same ramp.
- **Body** (400, 1.0625rem, 1.55): running text on the warp and 404 pages, max around 40ch.
- **Label** (600, 0.9375rem, 0.06em, uppercase): plate-label buttons. Warp destinations use the same size at 500.
- **Caption** (500, 0.8125rem, 0.08em, uppercase): the one small step. Masthead mark, colophon (tracked 0.06em), plate designation, stop index names, the brand-plate link, and plate labels on small phones (tracked 0.04em).

### Named Rules
**The One Voice Title Rule.** Unbounded appears once per viewport and only as a title. Everything else is Geologica.

**The Light Weight Rule.** Display and headline are set at 300. Heavier display weights break the plate's etched quality.

**The One Small Step Rule.** There is one size below the label: the caption step. Links, labels and annotations that need to be small snap to it rather than inventing a size between.

## Layout

Full-bleed, one fixed sky behind a scrolling column of viewport-height scenes (100svh each): hero, one stop per brand, close. Copy, galaxies and the stop index share one coordinate system, the viewport itself; there is no centered content frame. Horizontal padding is the fluid gutter everywhere, widened on either side to clear a landscape notch.

- **Hero:** a single fluid column (minmax(0, 1fr)) anchored bottom-left, content max 44rem, galaxy core offset toward the upper right. Actions sit in the same column under the lede with the action gap; below 759px they stack full-width up to 22rem.
- **Brand stops:** a 12-column grid whose gap scales with the viewport (never more than 1.5rem). The plate takes five columns (2 to 6, or 7 to 11) on whichever side the galaxy leaves empty. At 1099px and under it takes six. On phones and portrait tablets up to 1099px it stacks: galaxy above, plate below, starting at 60svh, max 36rem.
- **Close:** centered, single column, actions centered.
- **404 and /warp/:** a single fluid column (max 48rem and 40rem), bottom-anchored on the 404, centered on /warp/ and bottom-anchored there below 759px.
- **Pinned chrome:** registration marks, masthead, stop index, plate designation, colophon and warp status each take the larger of their own inset and the device safe area.
- **Plate designation:** sits beside the lower-left mark; hides on hero and close, and hides entirely below 23em (an em query, so enlarged text also hides it) where it would sit on the haiku.
- **Short landscape (max-height 520px):** tighter hero and close padding, 3rem button height, index collapses to ticks.

Breakpoints observed: 420px (compact buttons), 759px (stacking), 1099px (mid-width plate, and stacking in portrait), 23em (plate designation), max-height 520px (short landscape), coarse pointer (touch targets).

### Named Rules
**The One Coordinate System Rule.** The sky, the copy and the index are placed against the same viewport. Never wrap the copy in a max-width frame the galaxies do not share, or the empty side of the frame stops being empty.

**The Enlarged Text Rule.** Gaps are viewport-bounded and columns are minmax(0, 1fr), so enlarged text wraps inside its column instead of pushing the plate off screen.

## Elevation & Depth

The interface is flat. Depth belongs to the sky: additive star light tone-mapped against the void, multiplicative dust that tints rather than punches black, and photographic grain added per pixel in the renderer's final resolve pass. The layer order is fixed: still plate, live sky canvas, CSS grain, registration, page, pinned chrome, warp status, skip link.

The still plate and the CSS grain layer (10% overlay-blend noise) exist only where there is no live sky: still pages, a sky that fails to start, a GPU context the browser takes away, and no-JavaScript visits. When the context comes back, the live sky restarts on a fresh canvas. The warp adds no CSS color: the renderer holds the shutter open and raises the exposure until the plate burns out to light, while the page blurs out beneath it.

The sky renders its soft gas and dust at half resolution, holds the canvas to about 4.2 million pixels, eases to 30fps when nothing is moving, and steps its own resolution (and then star count) down if frames keep running long; none of this may change how the plate reads.

### Shadow Vocabulary
The only shadows are legibility scrims: soft void-colored text-shadows under text that sits on the sky, chosen by type size.
- **Display scrim** (`--scrim-display`, `text-shadow: 0 2px 24px rgb(4 6 11 / 0.85)`): the hero title and lede, and every headline.
- **Text scrim** (`--scrim-text`, `text-shadow: 0 2px 18px rgb(4 6 11 / 0.9)`): brand plates and running text on the 404 and /warp/.
- **Label scrim** (`--scrim-label`, `text-shadow: 0 1px 10px rgb(4 6 11 / 0.9)`): stop index names.

### Named Rules
**The Sky Is The Depth Rule.** No box-shadows, no raised surfaces, no backdrop blur. If something needs to separate from the sky, move it to empty sky or give it a void text-shadow.

**The Star Light Belongs To Stars Rule.** Halos, bulge glow and four-point diffraction spikes are rendered star light and live only in the sky. UI elements never glow.

**The Scrim By Size Rule.** Legibility shadows come from the three scrims, matched to type size. They darken, never glow, and never take a color other than void.

**The Plate Is The Floor Rule.** The live sky is an enhancement. Every page must read and work on the still plate alone.

## Shapes

Rectilinear and hairline. Controls are rectangles with a 2px corner. Annotation devices are 1px lines in faint ink: L-shaped registration corners (18px arms), a caliper bracket (a 9px-tall three-sided hairline, up to 9rem wide) over each brand plate, and 1px index ticks. Dividing rules above links and between list rows are 1px hairlines. Icons are hand-drawn 20px line icons, 1.6 stroke, square caps, in currentColor.

Galaxies share one silhouette grammar: every galaxy rotates with trailing arms, winding inward as real spirals do. Brands vary a galaxy by arm count, winding, tilt, angle, warmth and core position, never by spin direction.

## Components

### Buttons
Plate labels, not pills: flat, uppercase, precise.
- **Shape:** near-square corners (2px), 1px border, 3.5rem minimum height, 1.5rem side padding, 0.85rem gap to a trailing line icon.
- **Warp (primary):** solid gold with void text. Hover lifts to pale gold and the arrow nudges 4px right.
- **Explore (secondary):** ink-edge border over the void wash, ink text. Hover turns the border pale teal and the text white; the arrow nudges 3px in its direction.
- **Active:** scales to 0.98. Transitions use the plate ease at 240ms for color, 160ms for transform, 320ms for the icon.
- **Focus:** 2px pale teal outline, 4px offset.
- **Compact (420px and under):** 1rem padding, caption-step type tracked 0.04em, label and icon pushed apart.
- **Enlarged text:** a label stays on one line at default sizes and wraps balanced inside the button, never overflowing it.

### Brand Plate (signature)
The per-brand annotation block. A hairline caliper over the official brand mark, the haiku in verse type, then an outbound link: gold-bright caption-step uppercase text on a 1px hairline rule, at least 16rem wide and 2.75rem tall, icon pushed to the far end. Hover whitens the text, turns the rule gold and nudges the out-arrow up-right. A domain breaks only if it truly cannot fit. Official marks are shown as the brand publishes them, reversed for the void where needed.

### Stop Index (navigation)
A catalog strip of 1px ticks on the right edge, one per brand. Ticks rest at 14px in faint ink; hover brightens to ink and reveals the uppercase caption name; the current stop widens to 28px in gold with its name shown in ink. On phones and short screens it compacts to 10px / 18px ticks with no names. On touch the tick stays small but each tap area is at least 44 by 44px, dropping to 32px tall on short landscape screens so six rows still fit.

### Plate Designation
An uppercase caption beside the lower-left registration mark reading "Plate n / total · Brand", updated as each stop enters, faded out on hero and close.

### Registration Frame
Four 18px L-shaped hairline corners in faint ink, fixed at the frame inset (or the safe area, whichever is larger), present on every page.

### Destination List
Used on the warp page: a stacked list of uppercase gold-bright labels divided by hairline rules, whitening on hover.

### Warp Status
The one line shown while the warp runs: "Warping to [brand]", centered near the bottom, in the display face at the title size, in white with a difference blend so it stays legible as the plate burns from black to white. It fades in 250ms after the page begins to blur out. Its weight (400) departs from the Light Weight Rule; treat it as an open question, not a precedent.

## Do's and Don'ts

### Do:
- **Do** keep light narrowband: teal and gold for stars and gas, rust only for dust and rare hot stars.
- **Do** use a single solid gold plate label for the primary action and a hairline label for the secondary.
- **Do** set controls at a 2px corner with a 1px border and uppercase Geologica label type.
- **Do** place text on the side of the frame the galaxy leaves empty and back it with the scrim for its size.
- **Do** use hairlines in faint ink for annotation devices: registration corners, calipers, ticks.
- **Do** set every small word at the caption step in soft ink or brighter.
- **Do** clear the device safe area on every pinned element, and keep touch targets at least 44px on coarse pointers.
- **Do** use the plate ease (cubic-bezier(0.16, 1, 0.3, 1)) for interface transitions, and reduce the sky to a still composed frame under reduced motion.
- **Do** give every galaxy trailing arms; vary brands by arms, winding, tilt, angle and warmth.
- **Do** show every brand mark exactly as published, reversed for the void when the brand provides a reversed form.

### Don't:
- **Don't** use pills, cards, glass panels or backdrop blur for interface elements.
- **Don't** put glow halos or colored outer glows on text, buttons or logos; glow belongs to rendered stars.
- **Don't** introduce purple, magenta or violet nebula color.
- **Don't** use rust in type, borders or fills.
- **Don't** set body, verse or labels in Unbounded, or titles heavier than 300.
- **Don't** use pure white for resting text.
- **Don't** set text in faint ink.
- **Don't** wrap copy in a max-width frame the sky does not share.
- **Don't** add a CSS color wash to the warp; the exposure does it.
- **Don't** add invented sky coordinates, catalog numbers or other fabricated plate data.
