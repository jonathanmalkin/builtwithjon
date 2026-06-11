# Field Manual Design System

**Version:** 1.0 · June 2026
**Source:** `uploads/DESIGN (1).md` — Field Manual Design Language v1.0

---

## Overview

The Field Manual Design System is the visual and interaction language for the **Use Case Library** — an AI workflow audit product. The aesthetic is *earned authority*: a printed field guide, a technical almanac, a consultant's deliverable. Typography-forward, high-contrast, plain. Not a SaaS product, not a landing page — a reference document that has opinions.

**One product in scope:** Use Case Library (`src/components/UseCaseLibrary/`). A filterable library of 55+ workflow use cases, each tagged with one of five framework dispositions (Eliminate, Simplify, Automate, Optimize, Report).

---

## Content Fundamentals

**Voice:** Plain and dry. No exclamation marks. No marketing register ("We're excited to…"). The goal is credibility through restraint — the content does the work, not the hype.

**Pain lines are quoted.** Every use case opens with the owner's voice in italics. Quote marks are real curly quotes: `"…"` not `"..."`.

**Stats are attributed, never promised.** "X% of owners report Y (Source)." Never "You will save X hours." Every number has a mono attribution in ink-3.

**Casing:** Sentence case for headlines and body. ALL-CAPS (mono) for eyebrows, labels, tags, and section headers — these signal "this is a measured datum."

**"The bridge" is the conversion framing.** The library shows the *generic* version; the audit maps *theirs*. This framing appears in the Bridge CTA block and drives all conversion copy.

**AI-honesty caveat stays.** Every AI-involved use case has a "Where AI actually fits" section distinguishing AI from plain automation. This is the credibility strategy.

**No emoji.** The voice is dry; emoji reads as chatty.

**Numbers:** "52×/yr" not "52 times per year". "2.5 hrs/week" not "2.5 hours a week". Compact, attributed, mono.

---

## Visual Foundations

### Palette
Two layers: **paper + ink** (the base) and **five dispositions** (the only accent colors). Nothing else is colored. Color belongs to the taxonomy, not the chrome.

- Background: `#F6F2E9` — warm, slightly yellow. "Ink on stock," not pixels on a monitor.
- Cards: `#FFFDF8` — very slightly lighter
- Text: `#1B1813` near-black → `#5A5347` secondary → `#8B8475` tertiary
- Dividers: `#E2DBCC` / `#D2C9B5`

### Typography — three voices, never crossing
1. **Newsreader** (serif) — authority. Big display stats, section headlines, pain-line quotes (italic), "after state" narratives. `font-weight: 500; letter-spacing: -.02em`. Loaded via Google Fonts.
2. **Archivo** (grotesque) — plain reading. All body copy, longer descriptions, framework prose. `font-size: 15–16px; line-height: 1.5–1.55`. Never italic — that register belongs to Newsreader.
3. **IBM Plex Mono** (monospace) — field-manual signal. All metadata, labels, tags, attribution, counts, buttons, eyebrows. Signals "this is a measured, classified datum."

### Spacing & Layout
- Max-width: 1140px, `padding: 0 20px`
- Card grid: 1→2→3 col at 640/1000px, `gap: 14px`
- Header: 48px sticky, paper bg + ink border-bottom
- Filter toolbar: sticky at `top: 48px`

### Backgrounds & Surfaces
No gradient backgrounds — not even on the CTA. The only dark surface is the Bridge block (`--ucl-ink` bg). Cards sit on paper with a hairline border. No stock photo backgrounds, no patterns, no textures.

### Borders & Radius
Hard ink, not soft grey. Header border-bottom is solid black. Card borders are warm-grey (`--ucl-line-2`) at rest, ink on hover. Small radii: 3px (tags), 5px (stat cards), 6px (cards), 7px (bridge).

### Cards
- Rest: `1px solid var(--ucl-line-2)`, no shadow
- Hover: `border-color: var(--ucl-ink)`, `translateY(-2px)`, `box-shadow: 0 16px 30px -22px rgba(40,33,20,.55)`
- Transition: `.14s ease` — never longer than `.25s`

### Stat Card
Strong ink border (vs. card's hairline). Big Newsreader number + mono unit + grotesque description + mono attribution.

### Animation & Motion
- Button hover: `background → #000`, arrow `translateX(+3px)`, `.14s ease`
- Card hover: border → ink, `translateY(-2px)`, `.14s ease`
- Filter toggle opacity: `.42` (base) → `.72` (hover) → `1.0` (active)
- Detail panel entrance: `translateX(18px) → 0` over `260ms cubic-bezier(.2,.7,.2,1)`, scrim fades simultaneously
- No infinite loops, no decorative animations

### Imagery & Color Vibe
No stock photos. No illustrations. No SVG art. The visual strength comes entirely from type and color — the typography *is* the imagery. When space needs visual weight, use the ink-background Bridge block.

### Iconography
No icon system. Disposition tags use minimal inline SVGs (12×12px, stroke-based) — an X for Eliminate, right-arrow for Simplify, cycle for Automate, up-arrow for Optimize, bar chart for Report. No icon fonts, no CDN icon libraries. Emoji never used.

### What Not To Do
- No gradient backgrounds
- No rounded-corner + left-border "info card" pattern (use the left-border-only Callout)
- No emoji
- No Inter, Roboto, or Arial
- No colored CTAs (always ink-on-paper or paper-on-ink)
- No `--color-*` or `--font-*` tokens (always `--ucl-*`)
- No shadow-heavy cards at rest

---

## File Index

```
styles.css                          Global CSS entry (imports only)
tokens/
  fonts.css                         Google Fonts @import
  colors.css                        Paper+ink + 5 disposition palettes (44 tokens)
  typography.css                    --ucl-serif / --ucl-sans / --ucl-mono
  spacing.css                       Radii, layout, spacing scale

guidelines/
  colors-base.card.html             Paper + ink 7-swatch palette
  colors-dispositions.card.html     Five disposition palettes
  type-serif.card.html              Newsreader specimens
  type-sans.card.html               Archivo specimens
  type-mono.card.html               IBM Plex Mono use cases
  type-patterns.card.html           Eyebrow → Headline → Body pattern
  type-emphasis.card.html           .hl underline / .word color classes
  spacing.card.html                 Spacing scale bars
  layout.card.html                  Grid + max-width diagram
  radii.card.html                   5 border-radius steps
  interaction-buttons.card.html     Button states
  interaction-cards.card.html       Card hover states
  brand-callout.card.html           Callout + SectionHeader patterns
  brand-bridge.card.html            Bridge CTA block
  brand-voice.card.html             Copy voice: avoid vs. use

components/core/
  DispositionTag.jsx/.d.ts/.prompt.md    Five disposition pills
  ColorStrip.jsx/.d.ts/.prompt.md        Proportion strip for cards
  Button.jsx/.d.ts/.prompt.md            Primary / ghost / paper variants
  SectionHeader.jsx/.d.ts/.prompt.md     Mono all-caps ink divider
  Card.jsx/.d.ts/.prompt.md              Use-case item card
  StatCard.jsx/.d.ts/.prompt.md          Anchor statistic card
  Callout.jsx/.d.ts/.prompt.md           Left-border editorial stat
  Bridge.jsx/.d.ts/.prompt.md            Dark CTA conversion block
  core.card.html                         Components card (DS tab)

ui_kits/use_case_library/
  index.html                         Full interactive Use Case Library prototype

SKILL.md                            Agent skill definition
readme.md                           This file
```

---

## Components

| Component | Usage |
|---|---|
| `DispositionTag` | The five framework pills. Most-used component. Always ink+bg+border together. |
| `ColorStrip` | 6px proportion strip. Visual signature at card bottom. No labels. |
| `Button` | Ink/paper CTA. Never colored. Mono font. Has primary, ghost, paper variants. |
| `SectionHeader` | Mono all-caps + ink border-bottom. Strongest divider in the system. |
| `Card` | Use-case card. Hairline at rest, ink+lift+shadow on hover. |
| `StatCard` | Anchor stat. Ink border (strong). Big Newsreader number. Every stat attributed. |
| `Callout` | Left-border editorial stat. No background. Never rounded-corner variant. |
| `Bridge` | Dark ink CTA block. Only dark surface. Paper/ink reversed button. |

Load via: `const { DispositionTag, … } = window.FieldManualDesignSystem_f83cca`

---

## Fonts

All three fonts are loaded from Google Fonts CDN. No local font files included.

```html
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Or simply link `styles.css` — it imports `tokens/fonts.css` which includes the above.

---

## Disposition System

The five dispositions are the brand's only accent colors. Each carries three tokens: ink (text/icons), background tint, border.

| Disposition | Ink | Use |
|---|---|---|
| Eliminate | `#BB3A2B` red | Remove the step entirely |
| Simplify | `#A96A11` amber | Reduce friction, standardize |
| Automate | `#2D5AA6` blue | Machine handles it |
| Optimize | `#6A45A0` purple | Improve within current form |
| Report | `#297150` green | Generate insight from data |

**Rule:** Never use a disposition color outside a DispositionTag, ColorStrip, or direct disposition reference in copy (.hl / .word classes).
