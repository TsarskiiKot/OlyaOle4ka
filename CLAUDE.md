# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static artist portfolio website — no build step, no framework, no dependencies. Open `index.html` directly in a browser or serve with any static server (e.g. `npx serve .` or VS Code Live Server).

## Architecture

Three files, all vanilla:

| File | Role |
|------|------|
| `index.html` | All markup; one page, multiple `<section>` elements act as "pages" |
| `style.css` | All styles; CSS custom properties in `:root` for colours/spacing |
| `script.js` | All behaviour; no framework, no bundler |

**Page-switching model** — there is no router. Each `<section class="page">` is `display:none` by default; `showPage(name)` toggles the `active` class on exactly one at a time. `window.scrollTo(0,0)` resets scroll on every switch.

**Works data** — all content lives in the `WORKS` array at the top of `script.js`. Each entry has `section` (slug matching a nav button's `data-section`), `palette` (index into `PALETTE`), and `extraImages` (count). No images exist yet; coloured gradients stand in throughout.

**Colour palette and spacing** — edit `--red`, `--orange`, `--blue-name`, `--hh`, `--pad` in `:root` to adjust the whole site.

**Adding real images** — replace `background: pal.base / pal.slides[n]` colour strings with `url(...)` values, or set `background-image` directly on `.hero-bg`, `.work-card-base`, `.work-slide`, `.detail-hero-img`, and `.extra-img`.

**Font** — Cormorant SC (weight 300) loaded from Google Fonts. Headings/labels use `--font-sc`; body prose uses `--font-body` (Cormorant italic 300).

## Key interactions

- **Intro** → CSS animation (~2.9 s) → `startIntro()` removes overlay, reveals header + hero.
- **Menu open** → `main-nav.open` class slides nav into header bar (desktop) or from right edge (mobile ≤ 640 px).
- **Section selected** → nav hides, red badge (`.active-label`) appears, grid builds from filtered `WORKS`.
- **Card hover** → `startSlideshow()` cycles `.work-slide` layers at 220 ms intervals.
- **Card click** → `openDetail(work)` populates and shows `#page-detail`.
- **Image click** → `openLightbox(color)` shows fullscreen overlay.
- **Badge click** → if on detail page, returns to section grid; otherwise re-opens menu.
- **Logo click** → `goHome()` resets everything, returns to hero.
