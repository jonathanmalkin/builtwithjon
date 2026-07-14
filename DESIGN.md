---
name: Built with Jon
description: A practical operator's workbench for finding business leaks and taking a useful next step.
colors:
  paper: "#F6F2E9"
  surface: "#FFFDF8"
  ink: "#1B1813"
  ink-muted: "#5A5347"
  ink-tertiary: "#8B8475"
  line: "#E2DBCC"
  line-strong: "#D2C9B5"
  deals: "#E8752B"
  time: "#3B6E8F"
  cash: "#6E8B6F"
  segment: "#7A4E68"
  payoff: "#8F4E24"
  eliminate: "#BB3A2B"
  simplify: "#A96A11"
  automate: "#2D5AA6"
  optimize: "#6A45A0"
  report: "#297150"
typography:
  display:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.35rem, 7vw, 4.75rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.65rem, 4vw, 2.45rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo, system-ui, -apple-system, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "4px"
  md: "7px"
  lg: "12px"
  interactive: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "11px 17px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "20px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
---

# Design System: Built with Jon

## 1. Overview

**Creative North Star: “The Working Session”**

Built with Jon should feel like sitting down with an experienced operator who has already opened the real files, found the leak, and put one useful next step on the table. The interface uses paper, ink, direct language, screenshots, working tools, and restrained semantic color. It is credible enough for a business owner and technically honest enough for a builder.

This is one website design system. Long-form reading pages, interactive tools, and conversion pages vary through density, component choice, and meaning-bearing color—not through separate visual brands. The legacy names “Field Manual” and “Expressive” describe source history, not a choice a future page author should make.

The system rejects generic blue-gradient SaaS styling, dark hacker terminals, glossy consulting abstraction, creator funnels, literal coffee-shop theming, and decorative AI effects. It also rejects a page-building process that begins by choosing between multiple named registers.

**Key Characteristics:**

- Warm paper and near-black ink as the shared foundation.
- Newsreader for authority, Archivo for reading, IBM Plex Mono for short classified labels.
- Semantic color for business axes, dispositions, status, and outcomes.
- Real screenshots, demonstrations, and working interfaces as evidence.
- Flat, readable surfaces with restrained lift only when hierarchy or interaction requires it.
- One dominant action per page and low-JavaScript delivery by default.

## 2. Colors

The palette begins with paper and ink. Saturated colors are reserved for information: which business axis is active, which disposition applies, or what state the user is seeing.

### Primary

- **Working Ink** (`#1B1813`): Primary text, primary buttons, rules, and the strongest structural contrast.
- **Workshop Paper** (`#F6F2E9`): Default page background and the system’s physical-material cue.

### Secondary

- **Deals Orange** (`#E8752B`): Deals-axis state and rare focus accents.
- **Time Blue** (`#3B6E8F`): Time-axis state and selected utility emphasis.
- **Cash Sage** (`#6E8B6F`): Cash-axis state and positive operational signals.
- **Segment Plum** (`#7A4E68`): Introductory segmentation and category state.
- **Payoff Copper** (`#8F4E24`): Results, course progression, and outcome emphasis.

### Tertiary

- **Eliminate Red** (`#BB3A2B`), **Simplify Amber** (`#A96A11`), **Automate Blue** (`#2D5AA6`), **Optimize Purple** (`#6A45A0`), and **Report Green** (`#297150`) belong to the five-disposition framework. Use them only where the taxonomy is visible or directly referenced.

### Neutral

- **Working Surface** (`#FFFDF8`): Cards, forms, and readable foreground surfaces.
- **Muted Ink** (`#5A5347`): Secondary explanatory copy that still meets contrast requirements.
- **Tertiary Ink** (`#8B8475`): Short metadata only; never body paragraphs or placeholders.
- **Quiet Line** (`#E2DBCC`): Dividers and low-emphasis boundaries.
- **Strong Line** (`#D2C9B5`): Card and form borders that must remain visible on paper.

### Named Rules

**The Meaning-Before-Decoration Rule.** Every saturated color must communicate axis, disposition, status, or outcome. If its meaning cannot be named, remove it.

**The One Foundation Rule.** Do not remap the entire page into a separate palette for “reference” versus “interactive” work. Both use the same paper, ink, type, spacing, and component grammar.

## 3. Typography

**Display Font:** Newsreader (Georgia fallback)  
**Body Font:** Archivo (system sans-serif fallback)  
**Label/Mono Font:** IBM Plex Mono (system monospace fallback)

**Character:** Newsreader supplies earned authority without corporate polish. Archivo keeps instructions and operating explanations plain. IBM Plex Mono is a classification voice for short labels, metadata, counts, and button text—not a costume for technical sophistication.

### Hierarchy

- **Display** (500, `clamp(2.35rem, 7vw, 4.75rem)`, 1.08): One primary page idea. Keep letter spacing at `-0.02em`; never tighter than `-0.04em`.
- **Headline** (500, `clamp(1.65rem, 4vw, 2.45rem)`, 1.08): Section and outcome headings.
- **Title** (500, `1.35rem`, 1.12): Card, step, and compact feature titles.
- **Body** (400, `16px`, 1.5): Instructions and explanations. Keep reading lines at 65–75 characters where practical.
- **Label** (500, `11px`, `0.08em`, uppercase only when genuinely classificatory): Navigation metadata, compact labels, buttons, dates, and framework tags.

### Named Rules

**The Three Voices Rule.** Newsreader speaks authority, Archivo explains the work, and IBM Plex Mono classifies short data. Do not swap their roles for decoration.

**The Eyebrow Budget.** A short mono kicker can orient one important section. Repeating it above every heading is prohibited.

## 4. Elevation

The system is flat by default. Paper, spacing, borders, and type establish hierarchy before shadows. A small ambient shadow may distinguish an interactive or conversion surface from the page, but it cannot become the primary decoration.

### Shadow Vocabulary

- **Soft separation** (`0 6px 18px -12px rgba(31, 23, 19, 0.22)`): Forms and compact surfaces requiring separation from paper.
- **Focused surface** (`0 10px 30px -18px rgba(31, 23, 19, 0.30)`): One important instrument, result, or conversion surface.

### Named Rules

**The Flat-by-Default Rule.** Reading cards and repeated list items sit on borders without shadows. Elevation is reserved for the one surface asking for active attention.

## 5. Components

### Buttons

- **Shape:** Compact, squared-soft corners (`4px` to `7px`), never oversized pills.
- **Primary:** Working Ink background with Working Surface text; IBM Plex Mono label; approximately `12px 18px` padding.
- **Hover / Focus:** Hover darkens to black or moves by at most `1px`. Focus uses a visible `3px` orange outline with `4px` offset. Do not rely on color alone.
- **Secondary / Ghost:** Surface background, ink text, and one strong border. It must remain visibly subordinate to the primary action.

### Chips

- **Style:** Small framework or state labels. Use the exact semantic ink, tint, and border trio belonging to the disposition or axis.
- **State:** A selected chip may use a semantic wash; unselected chips remain paper and ink. Chips are not decorative category confetti.

### Cards / Containers

- **Corner Style:** Reading cards use `7px` to `12px`; interactive instruments may use up to `16px`.
- **Background:** Working Surface on Workshop Paper.
- **Shadow Strategy:** Border-only at rest for repeated cards. Use one approved elevation token for a primary instrument or conversion surface.
- **Border:** `1px` Strong Line at rest; ink border for strong hover or selection state.
- **Internal Padding:** `16px` to `24px`, proportional to density and viewport.

### Inputs / Fields

- **Style:** Working Surface background, Strong Line border, `7px` radius, Archivo body text, and explicit visible labels.
- **Focus:** Ink or Time Blue border plus a visible focus treatment. Placeholder text must meet 4.5:1 contrast or be replaced with helper text.
- **Error / Disabled:** Pair color with text and `aria` state. Never communicate failure with red alone.

### Navigation

- Use one global header and footer across the site. Navigation text uses Archivo; the wordmark may use the mono label voice. Active state is ink plus weight, not a separate palette. Mobile navigation must preserve keyboard focus, `aria-expanded`, and a clear close state.

### Interactive Instrument

Scorecards, calculators, and guided course steps may use one semantic axis hue at a time for progress, selected state, and result bars. The surrounding page remains on the shared paper-and-ink foundation.

## 6. Do's and Don'ts

### Do:

- **Do** lead with the business leak and make one next action visually dominant.
- **Do** use the shared `#F6F2E9` paper, `#FFFDF8` surface, and `#1B1813` ink foundation across reading, tools, and funnels.
- **Do** use semantic colors only for axes, dispositions, status, and outcomes.
- **Do** use real screenshots, product outputs, event photography, demonstrations, and worked examples as evidence.
- **Do** preserve WCAG 2.2 AA contrast, visible focus, semantic HTML, reduced-motion alternatives, and responsive behavior.
- **Do** keep long-form reading lines near 65–75 characters and make forms understandable without placeholder text.
- **Do** treat the old Field Manual and Expressive packages as source history until their useful material is consolidated; do not ask new pages to choose a register.

### Don't:

- **Don't** build generic blue-gradient SaaS pages.
- **Don't** use dark hacker-terminal styling or code as decorative proof of sophistication.
- **Don't** flex the tool stack or write for AI-agency peers before the business owner/operator.
- **Don't** use glossy enterprise-consulting abstraction.
- **Don't** introduce literal coffee-shop theming or faux-handmade decoration.
- **Don't** build creator-growth funnels aimed at prompt collectors.
- **Don't** create multiple named visual registers that force every new page to choose between competing design systems.
- **Don't** bury the useful action beneath explanations of MCP, models, agents, or infrastructure.
- **Don't** use endless identical cards, repeated eyebrow-heading-copy sections, decorative gradients, glass panels, or unearned motion.
- **Don't** use a colored side stripe wider than `1px` on cards or callouts.
- **Don't** pair a hairline border with a broad decorative shadow on the same repeated card.
- **Don't** set display letter spacing tighter than `-0.04em` or let headings overflow narrow viewports.
