# cosmos.maison

The front door to Automattic's Cosmos family: a WebGL spiral galaxy, a
"Warp to a random Cosmos" button, and a landing stop for each brand.

Built with [Astro](https://astro.build) as a static site, published on
[Spacefast](https://spacefast.com).

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Add or change a brand

Everything lives in `src/data/brands.ts`: name, URL, logo (in `public/logos/`),
haiku, and the shape of that brand's galaxy. A new entry adds a landing stop,
an entry in the stop index, and a new warp destination.

## Warp

The warp picks a brand in the browser. `/warp/` is a shareable link that does
the same thing, with a plain list of destinations when JavaScript is off.
