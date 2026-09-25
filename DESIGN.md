---
name: cosmos.maison
description: The Cosmos family of Automattic brands, set as a deep-sky observation plate you can stir with your hand.
colors:
  void: "#04060b"
  ink: "#ede6da"
  ink-soft: "#b9c4c2"
  ink-faint: "rgb(237 230 218 / 0.38)"
  hairline: "rgb(237 230 218 / 0.22)"
  teal: "#1fa7a0"
  teal-bright: "#6fd6cb"
  gold: "#e3a24a"
  gold-bright: "#f2c47a"
  rust: "#b5452e"
  starlight-white: "#ffffff"
typography:
  display:
    fontFamily: "'Unbounded Variable', 'Unbounded', ui-sans-serif, sans-serif"
    fontSize: "clamp(2.4rem, min(0.9rem + 6.2vw, 12.5vh), 6rem)"
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Unbounded Variable', 'Unbounded', ui-sans-serif, sans-serif"
    fontSize: "clamp(2rem, 1rem + 4vw, 4.25rem)"
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
  frame-inset: "clamp(0.75rem, 1.6vw, 1.5rem)"
  action-gap: "0.875rem"
  column-gap: "1.5rem"
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
    backgroundColor: "rgb(4 6 11 / 0.25)"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.plate}"
    padding: "0 1.5rem"
    height: "3.5rem"
  button-explore-hover:
    textColor: "{colors.starlight-white}"
  stop-link:
    textColor: "{colors.gold-bright}"
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
---

# Design System: cosmos.maison

## Overview

**Creative North Star: "The Deep Field Plate"**

Every surface is an astronomical observation plate: narrowband false-color light on a void close to black, annotated in small, precise type. The sky is the image and the interface is the annotation on it. Oxygen teal and hydrogen gold carry the light; rust appears only as dust lanes and the rare hot star. A layer of photographic grain sits over everything drawn and beneath the text, and hairline registration marks hold the four corners of the viewport like the edges of a glass plate.

The type does the work that chrome would do elsewhere. A wide, light futuristic display face states the title; a quiet humanist sans sets verse, body and the uppercase caption annotations. Controls are plate labels: flat rectangles with a 2px corner, either a solid gold label or a hairline outline, never pills. Nothing floats on a card, a glass panel or a glow. Text sits directly on the sky and earns legibility from a soft void-colored shadow and from being placed where the galaxy leaves the frame empty.

Motion is astronomical, not decorative: slow differential rotation, scroll-driven crossfades between galaxies, stars that lean toward the pointer and settle, and one exposure-style warp in which the frame stops clearing and stars stretch into long-exposure trails. Everything reduces to a still, composed plate under `prefers-reduced-motion`.

**Key Characteristics:**
- Void ground, two narrowband light colors, rust held back for dust.
- Text set as plate annotation: display title, uppercase tracked captions, hairline rules.
- Four hairline registration marks and a plate designation as the persistent frame.
- Flat 2px plate labels for actions; no pills, cards, glass or UI glow.
- Content placed on the side of the frame the galaxy leaves empty.
- Photographic grain overlay; four-point diffraction spikes on the brightest stars.

## Colors

A narrowband palette: two emission colors and one absorption color on near-black, read through warm off-white ink.

### Primary
- **Hydrogen Gold** (gold): the one solid action color. Fills the Warp plate label, the selection highlight, the skip link, the current tick in the stop index and the hover rule under a brand link. In the sky it is the old-star and bulge light.
- **Pale Hydrogen** (gold-bright): hover state of the gold label and the resting color of outbound brand links, where it reads as the lit version of gold on the void.

### Secondary
- **Oxygen Teal** (teal): the young-star and arm light of every galaxy, rendered by the sky renderer; also the favicon spiral. Not used as a UI fill.
- **Pale Oxygen** (teal-bright): the focus ring (2px, 4px offset) and the hairline label's hover border. Teal in the interface means "attention here", never "act".

### Tertiary
- **Dust Rust** (rust): reserved for dust lanes and a sparse population of hot stars inside the galaxy. It never appears in type, borders or fills.

### Neutral
- **Plate Void** (void): page ground, theme color, scrollbar track, text on gold, the tone-mapping floor of the renderer and the color of every legibility text-shadow.
- **Plate Ink** (ink): headlines, verse, masthead mark and the hairline label's text. A warm off-white, never pure white at rest.
- **Soft Ink** (ink-soft): lede, captions, the plate designation, secondary notes and resting index labels.
- **Faint Ink** (ink-faint): registration marks, the caliper over each brand plate, resting index ticks, the colophon.
- **Hairline** (hairline): 1px rules that divide, such as the rule above a brand link and the rows of the warp destination list.
- **Starlight White** (starlight-white): hover only. Hairline labels and gold-text links brighten to white under the pointer.

### Named Rules
**The Narrowband Rule.** Light is teal or gold. Rust is dust. No purple, magenta or cyan-violet nebula tones; the palette is two emission lines and one absorber.

**The One Solid Rule.** Gold is the only filled control color, and each viewport carries at most one gold plate label per action group.

**The Ink At Rest Rule.** Resting text is warm ink, not white. Pure white is a hover response.

## Typography

**Display Font:** Unbounded Variable (with ui-sans-serif, sans-serif)
**Body Font:** Geologica Variable (with ui-sans-serif, sans-serif)

**Character:** Unbounded at weight 300 is wide, geometric and futuristic while staying readable at large sizes; it is used only for titles. Geologica is a calm humanist sans that sets verse, body, labels and caption annotations, so the voice of the plate stays quiet around the one loud title.

### Hierarchy
- **Display** (300, fluid up to 6rem, 1.02, -0.035em): the home title only. Max 11ch, balanced wrap, lower-left of the first viewport.
- **Headline** (300, fluid up to 4.25rem, 1.05, -0.03em): the closing line, the 404 title and the warp page title (the latter two use slightly different clamps within the same family and weight).
- **Title** (300, fluid 1.15 to 1.5rem, 1.4): the lede under the display title, in soft ink, max 30ch.
- **Verse** (300, sized from the plate's own inline size, 1.32, -0.01em): brand haikus. Lines never wrap; line two indents 1.2em and line three 0.6em, stepping down the plate.
- **Body** (400, 1.0625rem, 1.55): running text on the warp and 404 pages, max around 40ch.
- **Label** (600, 0.9375rem, 0.06em, uppercase): plate-label buttons and destination list links. Brand links use 500 at 0.875rem, 0.08em.
- **Caption** (500, 0.8125rem, 0.08em, uppercase): masthead mark, colophon, stop index names. The plate designation drops to 0.6875rem.

### Named Rules
**The One Voice Title Rule.** Unbounded appears once per viewport and only as a title. Everything else is Geologica.

**The Light Weight Rule.** Display and headline are set at 300. Heavier display weights break the plate's etched quality.

## Layout

Full-bleed, one fixed sky behind a scrolling column of viewport-height scenes (100svh each): hero, one stop per brand, close. Horizontal padding is the fluid gutter everywhere.

- **Hero:** content anchored bottom-left (grid, align end), max 44rem, galaxy core offset toward the upper right. Actions sit in the same column under the lede; below 759px they stack full-width up to 22rem.
- **Brand stops:** a 12-column grid with a 1.5rem column gap. The plate takes five columns (2 to 6, or 7 to 11) on whichever side the galaxy leaves empty. At 760 to 1099px it takes six columns. On phones and portrait tablets it stacks: galaxy above, plate below, starting at 60svh, max 36rem.
- **Close:** centered, single column, actions centered.
- **Fixed frame:** registration marks inset by the frame inset; the stop index is vertically centered on the right edge; the plate designation sits beside the lower-left mark and hides on the hero and close.
- **Short landscape (max-height 520px):** tighter hero padding, 3rem button height, index collapses to ticks.

Breakpoints observed: 420px (compact buttons), 759px (stacking), 1099px (mid-width plate), max-height 520px landscape.

## Elevation & Depth

The interface is flat. Depth belongs to the sky: additive star light tone-mapped against the void, multiplicative dust that tints rather than punches black, a grain overlay at 10% opacity in overlay blend, and a fixed layer order (fallback plate, sky canvas, grain, registration, page, fixed chrome, warp overlay).

The only shadows are legibility scrims: soft void-colored text-shadows under text that sits on the sky (0 2px 24px at 0.8 to 0.85 alpha for titles, 0 2px 18px for brand plates, 0 1px 10px for index labels). They darken, never glow.

### Named Rules
**The Sky Is The Depth Rule.** No box-shadows, no raised surfaces, no backdrop blur. If something needs to separate from the sky, move it to empty sky or give it a void text-shadow.

**The Star Light Belongs To Stars Rule.** Halos, bulge glow and four-point diffraction spikes are rendered star light and live only in the sky. UI elements never glow.

## Shapes

Rectilinear and hairline. Controls are rectangles with a 2px corner. Annotation devices are 1px lines in faint ink: L-shaped registration corners (18px arms), a caliper bracket (a 9px-tall three-sided hairline, up to 9rem wide) over each brand plate, 1px rules above links and between list rows, and 1px index ticks. Icons are hand-drawn 20px line icons, 1.6 stroke, square caps, in currentColor.

## Components

### Buttons
Plate labels, not pills: flat, uppercase, precise.
- **Shape:** near-square corners (2px), 1px border, 3.5rem minimum height, 1.5rem side padding, 0.85rem gap to a trailing line icon.
- **Warp (primary):** solid gold with void text. Hover lifts to pale gold and the arrow nudges 4px right.
- **Explore (secondary):** 1px ink border at 50% alpha over a 25% void wash, ink text. Hover turns the border pale teal and the text white; the arrow nudges 3px in its direction.
- **Active:** scales to 0.98. Transitions use the plate ease at 240ms for color, 160ms for transform, 320ms for the icon.
- **Focus:** 2px pale teal outline, 4px offset.
- **Compact (420px and under):** 1rem padding, 0.875rem type, label and icon pushed apart.

### Brand Plate (signature)
The per-brand annotation block. A hairline caliper over the official brand mark, the haiku in verse type, then an outbound link: gold-bright uppercase text on a 1px hairline rule, at least 16rem wide, icon pushed to the far end. Hover whitens the text, turns the rule gold and nudges the out-arrow up-right. Official marks are shown as the brand publishes them, reversed for the void where needed.

### Stop Index (navigation)
A catalog strip of 1px ticks on the right edge, one per brand. Ticks rest at 14px in faint ink; hover brightens to ink and reveals the uppercase name; the current stop widens to 28px in gold with its name shown. On phones and short screens it compacts to 10px / 18px ticks with no names.

### Plate Designation
An uppercase caption beside the lower-left registration mark reading "Plate n / total · Brand", updated as each stop enters, hidden on hero and close.

### Registration Frame
Four 18px L-shaped hairline corners in faint ink, fixed at the frame inset, present on every page.

### Destination List
Used on the warp page: a stacked list of uppercase gold-bright labels divided by hairline rules, whitening on hover.

## Do's and Don'ts

### Do:
- **Do** keep light narrowband: teal and gold for stars and gas, rust only for dust and rare hot stars.
- **Do** use a single solid gold plate label for the primary action and a hairline label for the secondary.
- **Do** set controls at a 2px corner with a 1px border and uppercase Geologica label type.
- **Do** place text on the side of the frame the galaxy leaves empty and back it with a void text-shadow.
- **Do** use hairlines in faint ink for annotation: registration corners, calipers, rules, ticks.
- **Do** use the plate ease (cubic-bezier(0.16, 1, 0.3, 1)) for interface transitions, and reduce the sky to a still composed frame under reduced motion.
- **Do** show every brand mark exactly as published, reversed for the void when the brand provides a reversed form.

### Don't:
- **Don't** use pills, cards, glass panels or backdrop blur for interface elements.
- **Don't** put glow halos or colored outer glows on text, buttons or logos; glow belongs to rendered stars.
- **Don't** introduce purple, magenta or violet nebula color.
- **Don't** use rust in type, borders or fills.
- **Don't** set body, verse or labels in Unbounded, or titles heavier than 300.
- **Don't** use pure white for resting text.
- **Don't** add invented sky coordinates, catalog numbers or other fabricated plate data.
