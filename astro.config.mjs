// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

// Where the site is served from. Netlify/Vercel/Cloudflare: leave both unset.
// GitHub project pages: SITE_URL=https://<user>.github.io SITE_BASE=/<repo>
const site = process.env.SITE_URL || 'https://example.com';
const base = process.env.SITE_BASE || '/';

/**
 * The CMS writes body images as "/src/assets/uploads/<file>". Astro only optimizes
 * Markdown images with relative paths, so rewrite them relative to the .md file
 * before Astro's own image collector runs (user mdast plugins run first).
 */
const cmsImagePaths = {
  name: 'cms-image-paths',
  /** @param {{url: string}} node @param {any} ctx */
  image(node, ctx) {
    if (!node.url || !node.url.startsWith('/src/') || !ctx.fileURL) return;
    const abs = path.join(projectRoot, node.url);
    let rel = path
      .relative(path.dirname(fileURLToPath(ctx.fileURL)), abs)
      .split(path.sep)
      .join('/');
    if (!rel.startsWith('.')) rel = './' + rel;
    // satteri < 0.11 exposes setProperty; newer versions rename it to setField.
    const set = ctx.setField ?? ctx.setProperty;
    set.call(ctx, node, 'url', rel);
  },
};

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  markdown: {
    processor: satteri({ mdastPlugins: [cmsImagePaths] }),
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  fonts: [
    {
      // Handwritten face for the menu: names, headings, the sign.
      // Fontsource rather than Google: Gaegu is a Korean face and Google serves it as
      // ~90 numbered slices per weight that the `subsets` filter can't drop (178 files,
      // 178 preload tags). Fontsource ships one latin file per weight. Downloaded at
      // build time and self-hosted like the rest; nothing is fetched at runtime.
      provider: fontProviders.fontsource(),
      name: 'Gaegu',
      cssVariable: '--font-hand',
      weights: [400, 700],
      subsets: ['latin'],
      fallbacks: ['Comic Sans MS', 'cursive'],
    },
    {
      // Reading face for the writing itself.
      provider: fontProviders.google(),
      name: 'Literata',
      cssVariable: '--font-body',
      weights: ['300 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],
});
