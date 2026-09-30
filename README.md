# Small Hours (working title)

A small bakery's online menu that is secretly a blog. Every item on the menu is a post; tapping one opens the writing instead of an order form. There is no cart, no checkout, no accounts, and none are planned. The name, intro line and the little sign are all editable, so "Small Hours" is only a placeholder.

- **Live prototype:** https://edwardkong.github.io/jo/ (search engines are told to ignore it while it's a prototype)
- **Doodle sketchbook:** https://edwardkong.github.io/jo/doodles/ (every animation slot at its real size, with tuning sliders)
- **Writing happens at:** https://app.pagescms.org (see "Writing a post from your phone")

Built with [Astro](https://astro.build) 7 as a fully static site. Posts are Markdown files in `src/content/posts/`, menu sections are small YAML files in `src/content/sections/`, photos live in `src/assets/uploads/` and are resized at build time. The four animations are inline SVG stand-ins that will be swapped for hand-drawn files later.



## Writing a post from your phone

Everything happens at **app.pagescms.org** in your phone's browser. Sign in with the email you were invited with (you get a code or a link by email; no GitHub account needed). Add the page to your home screen so it feels like an app.

**The menu on the left** has four things:

- **Menu items** – the posts. Each one is a dish on the menu.
- **Menu sections** – the headings on the menu (From the oven, Kitchen notes, Off-menu).
- **Site settings** – the name over the door, the intro, the little sign, the footer.
- **Photos** – everything you have uploaded.

**To write a new post**

1. Open **Menu items** and tap the **+** (or "Add").
2. **Name** – what it's called on the menu. This also becomes the web address, so pick it before you first save (see the note about same names below).
3. **One line** – the short line under the name, like a menu: "dense on purpose, I think".
4. **Section** – pick a heading from the list. If you delete a section later its posts don't vanish, they gather under "Specials" until you give them a home.
5. **Date** – starts as today. Newer posts sit higher on the menu.
6. **Cover photo** – optional. Tap it to pick from your camera roll. Keep it under about 3 MB (see photo tips).
7. **Still in the oven (hidden from the menu)** – this is on for every new post. While it's on, the post is not built into the site at all, so nobody can see it, not even with the link. Switch it off when it's ready.
8. **The writing** – the toolbar gives you headings, bold and italic, lists, quotes and photos. There's a small toggle to see the plain-text (Markdown) version if you ever want it.
9. Tap **Save**. The site rebuilds itself; give it a minute or two.

To change a post later, tap it in the list, edit, save. Changing the name later does not change the web address (that was fixed the first time you saved), which is fine, just good to know.

**How sections work.** A section is one small file with a heading, a line of small print and an "Order" number; lower comes first. Add one in **Menu sections**. Changing a heading is fine. An empty section still shows on the menu with nothing under it, which is intended: it reads as "coming soon".

**Photo tips**

- Portrait or landscape both work. The site makes smaller copies for phones by itself, so don't resize for quality's sake, only for size.
- The upload limit is about 3 MB per photo. A phone photo is often 2 to 5 MB. If one is refused, share it to yourself at "Large" or "Medium" size, or take a screenshot of it, and upload that.
- Photos need to be JPEG, PNG, WebP or GIF. iPhones usually hand the browser a JPEG automatically; if not, turn on Settings > Camera > Formats > Most Compatible.
- Filenames are tidied for you ("IMG 1234 (2).JPG" becomes "img-1234-2.jpg").
- One cover per post; put more photos in the writing with the photo button, and add a few words describing each one for people who can't see it.
- Removing a photo from a post does not delete the file; it stays in **Photos** until someone deletes it there.

**Two posts with the same name.** The web address is made from the name, so two posts called "Lemon loaf" would get the same address. The site does not complain; the newer one quietly replaces the older one. Give the newer one a different name ("Lemon loaf, again") before you first save it.

## Doodles

The little drawings on the menu (the steaming cup, the "kitchen's closed" sign, the whisk / crumbs / star beside each item, the rolling pin under a post) are stand-ins. They are pen lines drawn three times and flipped between a few times a second, so they shiver like a flipbook. They are there to be replaced by your own drawings whenever you like, without anyone touching the layout.

You can see all of them at their real size, and play with how much they move, at `/doodles` on the site (the "sketchbook" page; it is not linked from the menu).

### The slots

Each drawing lives in a fixed box. Draw at the "draw at" size (twice the box, because phone screens are sharp); the site shrinks it down.

| slot name | where it appears | size on the page | draw at |
|---|---|---|---|
| `header-steam` | homepage header, beside the name | 120 × 120 | 240 × 240 |
| `closed-sign` | homepage, below the last menu section | 160 × 110 | 320 × 220 |
| `item-whisk` | beside menu items (takes turns with crumb and star) | 40 × 40 | 80 × 80 |
| `item-crumb` | beside menu items | 40 × 40 | 80 × 80 |
| `item-star` | beside menu items | 40 × 40 | 80 × 80 |
| `footer-crumbs` | bottom of a post page | 240 × 60 | 480 × 120 |

The sign is the only one that "means" something: screen readers hear its text. The others are decoration.

### Exporting a drawing

- Transparent background (the paper colour shows through).
- One ink colour is enough; it does not have to match exactly.
- Animated: **APNG is the best choice** (crisp lines, transparency, no colour banding). GIF or animated WebP are fine too.
- Keep it slow: about 6 to 8 frames per second, and loop it.
- Also export **one still frame** as a PNG, named the same as the animation plus `-still`. For example `closed-sign.png` and `closed-sign-still.png`. The still is what people see if their phone is set to reduce motion, and it is what shows while the animation loads.

### Putting it on the site

1. Put both files in the `public/doodles/` folder.
2. Open `src/doodles.ts` and add one line to the list at the bottom, for example:

   ```ts
   export const doodleFiles = {
     'closed-sign': 'closed-sign.png',
   };
   ```

That is the whole swap. Slots without a line keep their stand-in, so you can replace them one at a time.

### Two knobs

At the top of `src/styles/doodles.css`:

- `--boil-fps: 7` — how many times a second the drawn lines are redrawn. 6 to 8 feels hand-made; 2 is sleepy; 12 is nervous.
- `--motion: 1` — how far things move, from 0 to 1. Halve it and the sign sways half as far, the steam rises half as high, the hover reactions shrink and the rolling pin slows down. At 0 only the line shiver is left.

The sliders on the sketchbook page try these out live without saving anything.

### Reduced motion

If a reader's phone or computer is set to "reduce motion", every doodle holds still on its first frame, hover does nothing, and your animated files are swapped for their `-still.png` versions. Nothing needs to be done for this; it is built in.

### For the owner

- Stand-in paths must avoid the SVG arc command (`A`); `wobble()` throws at build time if it sees one. Draw curves with `C`/`Q`.
- Hover reactions key off `.menu-item` (each item link) and `.closed-sign` (the sign wrapper) and only run inside `@media (hover: hover)`; `:focus-visible` triggers the same reactions everywhere.
- The menu-item doodles boil at 0.6× the root rate (`--boil-rate` on the slot) so twenty of them stay quiet.

## Owner setup
1. **Install the Pages CMS GitHub App.** Push this repo to GitHub, sign in at app.pagescms.org with GitHub, and install the app on your account, granting access to this repository only. It needs read and write on contents.
2. **Open the repo in Pages CMS.** It reads `.pages.yml` from the branch you pick (main). You should see Menu items, Menu sections, Site settings and Photos. If the config has a problem, the CMS shows the validation error on its Settings page; the file was checked against the Pages CMS 2.1.8 validator, so a problem most likely means a typo from a later edit.
3. **Invite her by email.** In the repo's Collaborators in Pages CMS, add her email. She gets a sign-in email and never needs a GitHub account. Collaborators can edit content and photos; they cannot change `.pages.yml` or manage collaborators.
4. **Commit identity.** `settings.commit.identity: user` puts her name and email on her commits "when available"; an email-only collaborator may show up as just the email. The default (`app`) would attribute everything to the Pages CMS app. Commit messages follow the templates in `.pages.yml` ("Add 2026-09-12-lemon-loaf.md to posts (via Pages CMS)").
5. **Upload limit.** The hosted app accepts files up to roughly 3.3 MB (it is a request-size limit on their side, 4.5 MB per request less the base64 overhead; it is not stated in the Pages CMS docs). Larger uploads fail at save time with an error; she can share a smaller copy. Self-hosting removes the limit.
6. **Lowercase extensions.** The Photos picker only lists files whose extension is in `media.extensions`, compared case-sensitively. Uploads through the CMS are lowercased and slugified automatically (`rename: safe`), but a `PHOTO.JPG` you copy into `src/assets/uploads/` by hand will not appear until you rename it. HEIC is deliberately not allowed: Astro's image tool cannot read it.
7. **When a build fails.** Every save is a commit; Netlify (or GitHub Pages) rebuilds on each one. If a build fails, the live site keeps the last good version, so readers see nothing wrong; you get the build log by email or in the Netlify dashboard. Usual causes: a photo referenced in a post that was deleted from Photos, or a hand-typed image path. Fix the post in the CMS (or in git) and the next commit rebuilds. Empty cover fields and posts pointing at a deleted section do not break the build.
8. **Same-title collision.** The post's URL is the filename with the date prefix removed, so `2026-09-12-lemon-loaf.md` and `2026-10-01-lemon-loaf.md` collide. Astro does not error; the later file wins and the earlier post disappears from the site. Fix by renaming one of the files (or its name before first save).
9. **Placeholders.** The four posts and two photos in the repo are stand-ins and say so in their first line. Delete them from the CMS (Menu items and Photos) once real ones exist. `node scripts/make-placeholders.mjs` regenerates the photos if ever needed.

## How the site is put together

The site is a menu that is secretly a blog. There are three kinds of page:

- **The menu** (`/`) — the bakery name, the intro line, one "shelf" per section with its posts, the hanging sign, and the footer line.
- **A post** (`/menu/<post-name>/`) — "← back to the menu", the title, "which shelf · long date", the cover photo (if there is one), the writing, an order slip where comments will go one day, and the crumbs doodle.
- **Not found** (`/404`) — "we're out of that." with a link back.

### Where things live

| What | File |
| --- | --- |
| The page shell every page uses (browser title, description, fonts, skip link, footer) | `src/layouts/Base.astro` |
| The menu page | `src/pages/index.astro` |
| A post page | `src/pages/menu/[slug].astro` |
| The "we're out of that" page | `src/pages/404.astro` |
| Name + cup + intro at the top of the menu | `src/components/SiteHeader.astro` |
| One shelf (section title, blurb, its items) | `src/components/MenuSection.astro` |
| One line of the menu (doodle, name, dotted leader, date, description, thumbnail) | `src/components/MenuItem.astro` |
| The hanging sign, centred under the last shelf | `src/components/ClosedSign.astro` |
| The comments placeholder ("order slip") | `src/components/CommentsSlot.astro` |
| The last line on every page | `src/components/SiteFooter.astro` |
| Colours, paper, type sizes, links, focus rings, and the `.prose` styles for the writing | `src/styles/global.css` |
| Doodle animations | `src/styles/doodles.css` and `src/components/doodles/` |
| The little browser-tab icon (a mug) | `public/favicon.svg` |

Words like the bakery name, the intro line, the sign text and the footer line come from `src/data/site.json` (edited in the CMS under "Site settings"), not from these files.

### Changing colours

Everything is driven by a handful of tokens at the top of `src/styles/global.css`:

```css
--paper: #f3ead9;      /* the background */
--paper-deep: #e9dcc4; /* rules and photo edges */
--ink: #2c2219;        /* the one ink colour */
--ink-soft: #7c6a57;   /* the same ink, lighter pressure */
--accent: #b5452f;     /* red pencil, used sparingly */
```

Change the hex values and the whole site follows. Two small things to keep in step by hand: the wavy underlines are tiny SVG drawings just below the tokens (`--wave-accent`, `--wave-soft`) and carry their own stroke colour; and `<meta name="theme-color">` in `Base.astro` is the paper colour for phone browser chrome.

### Changing fonts

Fonts are declared in the `fonts` array in `astro.config.mjs`. Two CSS variables matter and must keep their names: `--font-hand` (handwriting: names, headings, dates, the sign) and `--font-body` (the writing itself). Swap the `name` and `provider` to use a different face; the files are downloaded once at build time and served from the site itself, so readers never contact Google or anyone else. Gaegu is fetched from fontsource rather than Google on purpose: Google's copy is a Korean font sliced into ~180 files and the site would try to preload every one.

### Keeping the site out of search engines

In `src/data/site.json`, `"noindex": true` adds `<meta name="robots" content="noindex">` to every page. Set it to `false` when the site is ready for strangers to find it.

### Where the site is served from (Netlify vs GitHub Pages)

Astro needs to know the address it will live at so links and images point to the right place.

- **Netlify** (or any host that gives you your own domain / the root of a domain): set nothing. It builds with `base = "/"`.
- **GitHub project pages** (`https://<user>.github.io/<repo>/`): set two environment variables for the build:
  `SITE_URL=https://<user>.github.io` and `SITE_BASE=/<repo>`.

Every internal link and every file in `public/` goes through `withBase()` from `src/lib/url.ts`, so a change of host is a change of two variables, not a search-and-replace. To check a GitHub-style build locally: `SITE_BASE=/jo SITE_URL=https://example.github.io npm run build` and look for `/jo/` in the links inside `dist/`.

### Replacing the comments placeholder

`src/components/CommentsSlot.astro` is the dashed "order slip" at the bottom of a post. It deliberately does nothing. When a comment tool is chosen, replace the contents of that one file; the post page just renders `<CommentsSlot />` and needs no other change.

## Running it on your computer

You need Node 22 or newer (this repo has an `.nvmrc`; with fnm installed, `cd` into the folder and it switches automatically).

```sh
npm install
npm run dev        # http://localhost:4321 (also reachable from your phone on the same wifi)
npm run build      # writes the site to dist/
npm run preview    # serves dist/ the way a host would
npm run check      # type-checks the .astro and .ts files
```

Deploys: pushing to `main` runs `.github/workflows/deploy.yml` and publishes to GitHub Pages. `netlify.toml` is ready for the day it moves to Netlify (connect the repo, nothing else to set).

## What is deliberately not built yet

- Comments: the dashed "order slip" under each post is the placeholder (`src/components/CommentsSlot.astro`).
- The friends-only request page behind the "kitchen's closed" sign: the sign already takes a link (`sign_link` in Site settings).
- Cart, checkout, payment, accounts: never.
