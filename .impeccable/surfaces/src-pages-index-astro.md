---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/warp.astro"]
---

# Home page (cosmos.maison)

Scope: the single home page at `/` plus the shareable `/warp/` random link. Visitor mode: Persuade. Success means the visitor leaves for a Cosmos brand's site, through the warp or through a brand stop.

Audience: the general public arriving from outside links, curious enough to click, on pointer or touch devices.
Actions: "Warp to a random Cosmos" is primary: a same-tab jump to a random brand, re-rolled every press. "I want to explore" is secondary: it scrolls to the six stops.
Content: six stops (Tumblr, Day One, Pocket Casts, Me.sh, Spacefast, Beeper), each with its official logo, an approved haiku and an outbound link. Claims, metrics and testimonials are not allowed.
Constraints: Astro static output on Spacefast, which runs no server code, so the warp pick happens client-side and `/warp/` is the no-JS fallback list. WCAG 2.2 AA. Must hold up under reduced motion, without WebGL and without JS.

## Direction contract

THESIS: A deep-sky observation plate you can stir with your hand. It refuses the category default of a centered title over a purple-cyan nebula with glowing pill buttons.
OWN-WORLD: Narrowband false color on a void close to black, with oxygen teal and hydrogen gold. Rust is reserved for dust and the rare hot accent. Photographic grain, and four-point diffraction spikes on the brightest stars. Text is set like plate annotations: a precise futuristic display face and small caption type, with hairline registration marks and catalog coordinates. No glow halos, glass, pills or cards.
STORY: The visitor sees a real-feeling galaxy that reacts to them, understands at once that this is a family of Automattic products, and either warps to a random one or tours six galaxies, one per brand, and leaves through one.
FIRST VIEWPORT: A full-bleed spiral fills the frame, its core offset toward the upper right. "Welcome to our Cosmos" is large in the lower left, the line sits under it, and both actions follow in the same column: Warp is a solid gold plate label and Explore is a hairline label. A catalog strip (six stop ticks) runs along the right edge.
FORM: Deep Field Plate, candidate 1 on the ordered list (IMPECCABLE'S PICK), seed key 1a5cfb8b. Signature interaction: pointer and touch gravity that displaces nearby stars, which then settle. Warp is a shutter opening: stars stretch into long-exposure trails before departure. Motion grammar: slow rotation, galaxy-to-galaxy crossfades driven by scroll, one exposure-style warp.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- A true server-side 302 for `/warp` would need a Spacefast Functions worker (not built).
- Logo recoloring per each brand's guidelines: use the official reversed/white marks where published.
