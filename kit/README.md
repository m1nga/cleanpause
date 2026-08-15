# CleanPause / SIDE COURT — Design Kit

The visual world is a Mediterranean late afternoon that slides into night:
4 PM cream and ochre, a sunset field of orange and wine, a violet dusk,
plant-green evening, and finally the quiet black of the cleaning screen.
Color behaves like light and air, never like blocks. One text color everywhere.

Source of truth for the color field: the live site (https://m1nga.github.io/cleanpause/).

## Palette

| Token | Hex | Role |
|---|---|---|
| Ivory | `#f3e7d4` | The only text color, all surfaces |
| Chartreuse | `#dceb55` | Accent for the hold ring, progress, drop-card shadow. Never text. |
| Cream | `#f7e7c8` `#f7e0b7` | 4 PM sky |
| Ochre | `#f2c46d` `#efad58` | Late-afternoon ground |
| Sunset | `#ed7d4e` `#e45745` `#e8503a` | The sun, the warm field |
| Wine | `#b8496f` | Sunset depth |
| Plum | `#4c203e` | Shadow, scrims, selection, UI chrome |
| Night plum | `#1b0b19` `#140a14` | Transition into black; icon body |
| Twilight | `#39295f` `#7351a0` `#a4506e` `#6f5b78` | After the pause |
| Plant | `#4e695e` `#405f55` `#29483e` `#192822` | Evening greens |
| Night | `#181918` `#231d2a` | SIDE COURT ground |
| Black | `#000000` | The cleaning screen. Real black, no tint. |

Tokens as CSS custom properties: [`palette.css`](palette.css).

## Typography

- **DM Sans** 400 / 500 / 600 — everything structural. Labels are small caps
  with wide tracking (`.12em–.22em`, 8–10px). Headlines are tight (`-.045em`
  to `-.08em`) with line-height ≤ .9.
- **Newsreader** italic 300 — only for spoken lines: *"Let nothing happen."*,
  *"I'm just cleaning you."*, *"Okay. I'm back."*, *"Keep something yours."*
- In the macOS app, the serif italic maps to the system serif design
  (`.serif` + `.italic()`); ivory and chartreuse come from `CourtPalette`.

**Rules.** One text color (ivory) — hierarchy is size, weight, tracking,
position, and space. If the ground is too busy, treat the ground (soft plum
scrim, blur, local dark field), never the letterforms. No glow, no outlines,
no gradient text.

## Marks

- **App icon** — night squircle, ivory hold ring, chartreuse arc, ivory pause
  bars. Source: [`icon/cleanpause-icon.svg`](icon/cleanpause-icon.svg);
  exports: `icon-1024/512/256.png`, `CleanPause.icns`,
  full-bleed [`icon/icon-touch.svg`](icon/icon-touch.svg) for touch/tab icons.
- **The hold ring** — a thin ivory circle whose chartreuse arc fills in
  exactly 3 seconds. It is the product's signature interaction; wherever it
  appears (app overlay, site, icon) it should be honest — if it looks
  pressable, pressing it must work.
- **The drop card** — black rectangle, `DON'T REACT.` set tight in ivory,
  hard chartreuse shadow offset down-right. SIDE COURT's release mark.
- **Menu-bar icon** — monochrome template version of the ring
  (macOS tints it); pause bars omitted below 24px.

## Motion

Slow drift (30–60px over a whole scene), crossfades of .55–.75s, wind-like
easing. Nothing bounces, nothing pops. The one fast thing in the world is the
accidental gibberish typing — everything after it slows down on purpose.
Respect `prefers-reduced-motion`: all drift and loops collapse to a static,
legible state.

## Voice

Short declaratives in caps for structure; first-person serif italics for the
product speaking. The product never begs: it states ("DON'T REACT."), then
delivers. No fake community, no invented numbers, no sport imagery — the
court is a place, not a tennis reference.

## Assets index

```
kit/
  README.md            this file
  palette.css          color tokens
  icon/                app icon source + exports + icns + iconset
assets/ (site)
  favicon.svg          ring + pause bars, 64px
  apple-touch-icon.png 180px full-bleed
  app-icon.png         128px squircle (download section)
  og.jpg / og-night.jpg 1200×630 share images
  qr-court.svg         ivory QR → /side-court/ (the egg)
```
