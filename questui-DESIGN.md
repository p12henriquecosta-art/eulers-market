# QuestUI Design System
**Codename: Obsidian Command**
**Version: 2.0 — Futuristic Minimalist RPG**

---

## Overview

QuestUI 2.0 abandons medieval ornamentation in favour of **Futuristic Minimalist RPG** — the aesthetic of a command system built after sight became irrelevant. Euler dictated theorems in total blindness and imposed systemic order on infinity. This design system encodes that same precision: deep obsidian voids, razor-thin cyan vector lines, and glassmorphic surfaces that appear to exist one layer above physical space.

Every element is reduced to its load-bearing geometry. No scrollwork. No gilded borders. Only signal.

---

## Colors

### Core Palette
| Token | Value | Usage |
|---|---|---|
| **Obsidian Void** | `#020408` | Page background — absolute darkness |
| **Surface 0** | `rgba(255,255,255,0.02)` | Default card/panel fill |
| **Surface 1** | `rgba(255,255,255,0.05)` | Elevated card/hover state |
| **Surface 2** | `rgba(255,255,255,0.08)` | Active/selected panel |

### System Colors
| Token | Value | Usage |
|---|---|---|
| **Primary Cyan** | `#00F2FE` | Primary actions, highlights, glows |
| **Secondary Blue** | `#4FACFE` | Gradients, secondary actions |
| **Gold Accent** | `#CA8A04` | Accent only — legendary/critical events |
| **Text Primary** | `#FFFFFF` | Headlines, active labels |
| **Text Dim** | `rgba(255,255,255,0.55)` | Body, descriptions, meta |
| **Glass Border** | `rgba(255,255,255,0.08)` | Default panel borders |
| **Active Border** | `rgba(0,242,254,0.25)` | Focused/active element borders |

### Semantic Colors
| Token | Value | Usage |
|---|---|---|
| **Success** | `#22C55E` | Confirmed transaction, node online |
| **Warning** | `#CA8A04` | Threshold alert, latency spike |
| **Error** | `#EF4444` | Rejected, failed, disconnected |
| **Info** | `#4FACFE` | Lore/context, informational state |

> ⚠ **Gold (#CA8A04) is an accent, not a primary.** Reserve it for stat anomalies, legendary-tier items, and system warnings. Never use as button fill.

---

## Typography

### Font Stack
- **Heading Font**: `Inter`, `-apple-system`, `sans-serif`
- **Body Font**: `Inter`, `-apple-system`, `sans-serif`
- **Mono Font**: `'JetBrains Mono'`, `'Fira Code'`, `monospace`

> Inter is the single-stack sans-serif. Its optical precision at all weights mirrors the mathematical rigour of Leonhard Euler's notation.

### Type Scale
| Role | Font | Size | Weight | Line Height | Tracking |
|---|---|---|---|---|---|
| **Display** | Inter | `clamp(4rem, 8.5vw, 7.5rem)` | 800 | 0.93 | −0.055em |
| **H1** | Inter | `3.5rem` | 800 | 1.1 | −0.04em |
| **H2** | Inter | `2.5rem` | 700 | 1.2 | −0.03em |
| **H3** | Inter | `1.75rem` | 600 | 1.3 | −0.02em |
| **H4** | Inter | `1.25rem` | 600 | 1.4 | −0.01em |
| **Body LG** | Inter | `1.2rem` | 400 | 1.65 | 0 |
| **Body** | Inter | `1rem` | 400 | 1.6 | 0 |
| **Body SM** | Inter | `0.875rem` | 400 | 1.55 | 0 |
| **Caption** | Inter | `0.75rem` | 500 | 1.4 | 0.05em |
| **Label** | Inter | `0.82rem` | 600 | 1.0 | 0.12em |
| **Code** | JetBrains Mono | `0.875rem` | 400 | 1.6 | 0 |

### Type Rules
1. **Do** use negative tracking (`-0.02em` to `-0.055em`) on all headings.
2. **Do** use `font-weight: 800` for Display/H1; step down by 100 per level.
3. **Don't** use serif fonts anywhere in the system — the void does not engrave.
4. **Do** apply `text-transform: uppercase` + `letter-spacing: 0.12em` to labels and chip text only.
5. **Don't** use `font-weight` below 400 in any UI context.

---

## Spacing

Base unit: **8px**

| Token | Value | Usage |
|---|---|---|
| **xs** | `4px` | Icon gaps, inline delimiters |
| **sm** | `8px` | Tight component padding |
| **md** | `16px` | Default padding |
| **lg** | `24px` | Card padding, section gaps |
| **xl** | `32px` | Panel gaps |
| **2xl** | `48px` | Layout sections |
| **3xl** | `64px` | Page-level spacing |
| **4xl** | `96px` | Section hero breaks |

---

## Border Radius

Smooth modern geometry — no angular edges.

| Token | Value | Usage |
|---|---|---|
| **sm** | `4px` | Inline tags, tiny badges |
| **DEFAULT** | `8px` | Inputs, small buttons |
| **md** | `12px` | Buttons (standard), feature cards |
| **lg** | `16px` | Panels, modals, forms |
| **xl** | `24px` | Glass panels, hero cards |
| **full** | `9999px` | Pills, dots, status indicators |

---

## Elevation

Glassmorphism replaces gold-glow shadows. Depth is achieved via blur and surface transparency.

| Level | `backdrop-filter` | Background | Border | Usage |
|---|---|---|---|---|
| **glass-0** | `blur(8px)` | `rgba(255,255,255,0.02)` | `rgba(255,255,255,0.06)` | Subtle inline panels |
| **glass-1** | `blur(12px)` | `rgba(255,255,255,0.03)` | `rgba(255,255,255,0.08)` | Default cards, feature panels |
| **glass-2** | `blur(20px)` | `rgba(255,255,255,0.05)` | `rgba(255,255,255,0.12)` | Modals, elevated forms |
| **glass-3** | `blur(32px)` | `rgba(255,255,255,0.08)` | `rgba(0,242,254,0.15)` | Active/focused panels, alerts |

Additional shadow for depth perception (no color):
```
box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.04);
```

---

## Components

### Buttons

#### Variants
| Variant | Fill | Text | Border | Hover |
|---|---|---|---|---|
| **Primary** | `linear-gradient(135deg, #00F2FE, #4FACFE)` | `#000` | none | `translateY(-2px)`, glow intensifies |
| **Secondary** | `transparent` | `#00F2FE` | `1px rgba(0,242,254,0.3)` | `rgba(0,242,254,0.06)` fill |
| **Ghost** | `transparent` | `rgba(255,255,255,0.55)` | none | `rgba(255,255,255,0.05)` fill |
| **Destructive** | `rgba(239,68,68,0.1)` | `#EF4444` | `1px rgba(239,68,68,0.3)` | `rgba(239,68,68,0.18)` fill |
| **Gold Accent** | `rgba(202,138,4,0.1)` | `#CA8A04` | `1px rgba(202,138,4,0.3)` | `rgba(202,138,4,0.18)` fill |

#### Sizes
| Size | Padding | Font Size | Height | Radius |
|---|---|---|---|---|
| **sm** | `6px 14px` | `0.8rem` | `32px` | `8px` |
| **md** | `10px 22px` | `0.9rem` | `40px` | `12px` |
| **lg** | `14px 32px` | `1rem` | `52px` | `12px` |

#### Disabled State
- `opacity: 0.35`
- `cursor: not-allowed`
- No glow or shadow

---

### Cards

| Variant | Fill | Border | Radius | Shadow |
|---|---|---|---|---|
| **Default** | `rgba(255,255,255,0.02)` | `1px rgba(255,255,255,0.08)` | `12px` | glass-1 |
| **Elevated** | `rgba(255,255,255,0.04)` | `1px rgba(255,255,255,0.10)` | `12px` | glass-2 |
| **Active** | `rgba(0,242,254,0.04)` | `1px rgba(0,242,254,0.2)` | `12px` | glass-3 |

- **Padding**: `24px` (default), `32px` (elevated)
- **Hover**: `border-color` transitions to `rgba(0,242,254,0.2)`, `translateY(-4px)` over `300ms`
- **Top accent**: optional `2px` top border in `rgba(0,242,254,0.5)` for critical/primary cards

---

### Inputs

| State | Border | Fill | Shadow |
|---|---|---|---|
| **Default** | `1px rgba(255,255,255,0.08)` | `rgba(255,255,255,0.04)` | none |
| **Hover** | `1px rgba(255,255,255,0.15)` | `rgba(255,255,255,0.05)` | none |
| **Focus** | `1px rgba(0,242,254,0.4)` | `rgba(255,255,255,0.07)` | `0 0 0 3px rgba(0,242,254,0.08)` |
| **Error** | `1px rgba(239,68,68,0.5)` | `rgba(255,255,255,0.04)` | `0 0 0 3px rgba(239,68,68,0.08)` |
| **Disabled** | `1px rgba(255,255,255,0.04)` | `rgba(255,255,255,0.01)` | none |

- **Height**: `48px` | **Padding**: `12px 16px` | **Radius**: `8px`
- **Font**: Inter `14px/500`, color `#fff`
- **Label**: Inter `12px/500`, color `rgba(255,255,255,0.55)`, `margin-bottom: 6px`
- **Helper/Error text**: Inter `12px/400`, `margin-top: 4px`

---

### Chips / Badges

| Variant | Fill | Text | Border | Radius |
|---|---|---|---|---|
| **Filter** | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.55)` | `1px rgba(255,255,255,0.08)` | `full` |
| **Filter Active** | `rgba(0,242,254,0.1)` | `#00F2FE` | `1px rgba(0,242,254,0.25)` | `full` |
| **Status Success** | `rgba(34,197,94,0.12)` | `#22C55E` | none | `full` |
| **Status Warning** | `rgba(202,138,4,0.12)` | `#CA8A04` | none | `full` |
| **Status Error** | `rgba(239,68,68,0.12)` | `#EF4444` | none | `full` |
| **Status Info** | `rgba(79,172,254,0.12)` | `#4FACFE` | none | `full` |

- **Padding**: `4px 12px`
- **Font**: Inter `0.75rem/600`, `text-transform: uppercase`, `letter-spacing: 0.1em`

---

### Lists

- **Row height**: `52px`
- **Padding**: `12px 16px`
- **Divider**: `1px rgba(255,255,255,0.05)`
- **Hover background**: `rgba(255,255,255,0.03)`
- **Active background**: `rgba(0,242,254,0.05)`
- **Label font**: Inter `16px/400` `#fff`
- **Description font**: Inter `14px/400` `rgba(255,255,255,0.55)`
- **Leading icon area**: `32px`, `12px` right margin

---

### Checkboxes

- **Size**: `20px × 20px` | **Radius**: `6px`
- **Unchecked**: `border: 1.5px rgba(255,255,255,0.2)`, fill `rgba(255,255,255,0.04)`
- **Checked**: fill `linear-gradient(135deg, #00F2FE, #4FACFE)`, border none, checkmark `#000`
- **Indeterminate**: fill `rgba(0,242,254,0.15)`, dash `#00F2FE`
- **Disabled**: `opacity: 0.35`, `cursor: not-allowed`
- **Label spacing**: `8px` left of label text

---

### Radio Buttons

- **Size**: `20px × 20px` | **Radius**: `full`
- **Unchecked**: `border: 1.5px rgba(255,255,255,0.2)`, fill `rgba(255,255,255,0.04)`
- **Selected**: `border: 1.5px #00F2FE`, inner dot `10px #00F2FE`
- **Disabled**: `opacity: 0.35`, `cursor: not-allowed`
- **Label spacing**: `8px` left of label text

---

### Tooltips

- **Background**: `rgba(10,15,25,0.92)`
- **Backdrop**: `blur(16px)`
- **Text**: Inter `12px/400`, `rgba(255,255,255,0.85)`
- **Border**: `1px rgba(255,255,255,0.1)`
- **Padding**: `8px 14px` | **Radius**: `8px`
- **Arrow**: `6px` triangle matching background
- **Max width**: `280px`
- **Delay**: `400ms` show, `0ms` hide

---

## Do's and Don'ts

1. **Do** use Inter for every text element — the system speaks in one voice.
2. **Do** apply glassmorphism (`backdrop-filter: blur(12px)`) to all panel/card surfaces.
3. **Do** use thin `1px` borders at `rgba(255,255,255,0.08)` as the default panel boundary.
4. **Don't** use gold (#CA8A04) as a fill or primary interactive color — accent only.
5. **Don't** use `box-shadow` colored glow for elevation — use blur + transparency depth.
6. **Do** set `border-radius: 12px` as the default for interactive components (buttons, cards).
7. **Don't** use pure `#FFFFFF` fills on any surface — the void must remain dominant.
8. **Do** apply `letter-spacing: 0.1em` + `text-transform: uppercase` on chip and badge labels.
9. **Do** transition hover states at `300ms cubic-bezier(0.23, 1, 0.32, 1)` — motion is deliberate.
10. **Don't** add decorative borders, drop shadows, or texture overlays — systemic command needs no ornament.