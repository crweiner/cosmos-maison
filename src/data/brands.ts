/**
 * The Cosmos family. Each entry becomes one landing stop on the home page and
 * one possible destination for "Warp to a random Cosmos". Add a brand here and
 * both the page and the warp pick it up.
 */
export interface GalaxyShape {
  /** Number of spiral arms. */
  arms: number;
  /** How tightly the arms wind (higher = more turns). */
  wind: number;
  /** Disk inclination toward the viewer, 0 = face-on, ~1.2 = nearly edge-on. */
  tilt: number;
  /** On-screen rotation of the disk's major axis, radians. */
  angle: number;
  /** Balance of the narrowband palette: 0 = oxygen teal, 1 = hydrogen gold. */
  warmth: number;
  /** Where the core sits in the viewport, 0..1 on each axis (desktop layout). */
  x: number;
  y: number;
}

export interface Brand {
  slug: string;
  name: string;
  url: string;
  host: string;
  logo: string;
  /** Logo viewBox aspect ratio (width / height), used to reserve space. */
  logoRatio: number;
  /** Optical size correction so marks with padding read at the same weight. */
  logoScale: number;
  haiku: [string, string, string];
  galaxy: GalaxyShape;
}

export const brands: Brand[] = [
  {
    slug: 'tumblr',
    name: 'Tumblr',
    url: 'https://www.tumblr.com/',
    host: 'tumblr.com',
    logo: '/logos/tumblr.svg',
    logoRatio: 73 / 15,
    logoScale: 1,
    haiku: ['Reblogged into light', 'a million small obsessions', 'orbit the same star'],
    galaxy: { arms: 2, wind: 2.6, tilt: 0.55, angle: -0.5, warmth: 0.35, x: 0.7, y: 0.5 },
  },
  {
    slug: 'day-one',
    name: 'Day One',
    url: 'https://dayoneapp.com/',
    host: 'dayoneapp.com',
    logo: '/logos/day-one.svg',
    logoRatio: 97 / 15,
    logoScale: 0.92,
    haiku: ["Write down tonight's sky", 'years from now the same small light', 'reaches you again'],
    galaxy: { arms: 3, wind: 3.4, tilt: 0.3, angle: 0.4, warmth: 0.7, x: 0.3, y: 0.5 },
  },
  {
    slug: 'pocket-casts',
    name: 'Pocket Casts',
    url: 'https://pocketcasts.com/',
    host: 'pocketcasts.com',
    logo: '/logos/pocket-casts.svg',
    logoRatio: 76 / 15,
    logoScale: 1,
    haiku: ['Voices in the dark', 'travel with you, episode', 'after episode'],
    galaxy: { arms: 2, wind: 1.9, tilt: 0.95, angle: 0.25, warmth: 0.85, x: 0.7, y: 0.5 },
  },
  {
    slug: 'mesh',
    name: 'Me.sh',
    url: 'https://me.sh/',
    host: 'me.sh',
    logo: '/logos/mesh.svg',
    logoRatio: 66 / 15,
    logoScale: 1,
    haiku: ['Every name, a star;', 'the constellation you keep', 'by remembering'],
    galaxy: { arms: 4, wind: 2.2, tilt: 0.2, angle: -0.2, warmth: 0.2, x: 0.3, y: 0.5 },
  },
  {
    slug: 'spacefast',
    name: 'Spacefast',
    url: 'https://spacefast.com/',
    host: 'spacefast.com',
    logo: '/logos/spacefast.svg',
    logoRatio: 152 / 28.9062,
    logoScale: 1.05,
    haiku: ['Something newly made', 'launched to a live address', 'a new light goes on'],
    galaxy: { arms: 2, wind: 3.9, tilt: 0.7, angle: -0.9, warmth: 0.5, x: 0.7, y: 0.5 },
  },
  {
    slug: 'beeper',
    name: 'Beeper',
    url: 'https://www.beeper.com/',
    host: 'beeper.com',
    logo: '/logos/beeper.svg',
    logoRatio: 73 / 15,
    logoScale: 1,
    haiku: ['Scattered signals merge', 'every chat in one bright sky,', 'one place to answer'],
    galaxy: { arms: 5, wind: 1.6, tilt: 0.4, angle: 0.8, warmth: 0.45, x: 0.3, y: 0.5 },
  },
];

/** The opening galaxy: large, core high and to the right of the title. */
export const heroGalaxy: GalaxyShape = {
  arms: 2,
  wind: 2.8,
  tilt: 0.62,
  angle: -0.42,
 
  warmth: 0.55,
  x: 0.64,
  y: 0.4,
};

/** Where a visitor left from, reported to the brand's analytics as utm_content. */
export type ReferralPath = 'warp' | 'stop' | 'warp-link' | 'warp-list';

/** Tag an outbound link so the destination's logs credit cosmos.maison. */
export function referral(url: string, path: ReferralPath): string {
  const u = new URL(url);
  u.searchParams.set('utm_source', 'cosmos.maison');
  u.searchParams.set('utm_medium', 'referral');
  u.searchParams.set('utm_campaign', 'cosmos');
  u.searchParams.set('utm_content', path);
  return u.toString();
}

/** Destinations the warp can land on: every brand with a stop. */
export const warpTargets = brands.map(({ name, url }) => ({ name, url }));

/** Warp destinations already tagged for a given path. */
export const trackedTargets = (path: ReferralPath) =>
  warpTargets.map(({ name, url }) => ({ name, url: referral(url, path) }));
