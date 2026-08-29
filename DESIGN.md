---
name: IDX Stocks Ownership
description: Bursa-precise stock ownership data — every holder, every free float, straight from IDX announcements.
colors:
  primary: "oklch(72.3% 0.219 149.579)"
  primary-deep: "oklch(62.7% 0.194 149.214)"
  secondary: "oklch(62.3% 0.214 259.815)"
  success: "oklch(72.3% 0.219 149.579)"
  error: "oklch(63.7% 0.237 25.331)"
  error-deep: "oklch(57.7% 0.245 27.325)"
  warning: "oklch(76.9% 0.188 70.08)"
  bg: "#ffffff"
  bg-muted: "oklch(98.5% 0 none)"
  bg-elevated: "oklch(97% 0 none)"
  bg-accented: "oklch(92.2% 0 none)"
  border: "oklch(92.2% 0 none)"
  border-accented: "oklch(87% 0 none)"
  text-muted: "oklch(55.6% 0 none)"
  text: "oklch(37.1% 0 none)"
  text-highlighted: "oklch(20.5% 0 none)"
typography:
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "32px"
components:
  badge-ticker:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    size: "text-xs"
  badge-soft:
    backgroundColor: "{colors.primary} / 10"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
  card:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.xl}"
    height: "auto"
  input:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.sm}"
---

# Design System: IDX Stocks Ownership

## Overview

**Creative North Star: "The Bursa Ledger"**

This is a working ledger of the Indonesian exchange — an official record book, not a marketing dashboard. The interface is calm and factual: a light paper-white ground, hairline rules between rows, and ink-grey typography that defers entirely to the numbers. Density is the product: the whole point of the site is scanning many holders fast, so rows are compact, separations are tonal rather than boxy, and ornament is close to zero.

The one living element is the accent. Gain Green marks everything that is active, live, or moving in the market — the current sort, the selected nav, local (D) holders, positive change deltas, and the thin scrollbar track. Because everything else is monochrome ink, that green reads instantly as "here is what matters now." Components are confident and tactile: controls are small but clearly pressable, active states are solid, and hover feedback is immediate, so a busy table still feels responsive to the hand.

Depth is layered-flat. Surfaces are flat and separated by hairline borders and quiet tonal fills (muted, elevated, accented); shadows appear only on the expandable ledger cards (soft, to signal they open) and the floating mobile nav (to lift it off the page). There is no dark mode aesthetic, no gradient, no confetti — the anti-reference is the cluttered broker dashboard with competing panels. The single-column ledger stays the center of everything.

**Key Characteristics:**
- Dense, scan-optimized tables with compact 13–16px type and hairline row rules.
- Monochrome ink system with exactly one living accent — Gain Green — used with rarity.
- Layered-flat depth: tonal surface fills plus hairline borders; soft shadows only on cards and the floating mobile nav.
- Small, precise, tactile controls (compact buttons, tiny soft badges, connected segmented sort).
- Official, factual register: uppercase micro-labels, right-aligned figures, provenance always visible.

## Colors

The palette is a monochrome ink-and-paper ledger animated by one market-green accent and a strict red counterpoint. Neutral greys are achromatic (zero chroma) so the two signal colors never compete with texture.

### Primary
- **Gain Green** (`oklch(72.3% 0.219 149.579)`): the active signal. Used for the nav underline indicator, the active sort button (solid), primary buttons (retry, "Coba Lagi"), the local/domestic (D) holder badge (soft), positive change deltas (`text-success`), and the custom scrollbar thumb. On-screen presence stays small — it marks, never floods.
- **Gain Green Deep** (`oklch(62.7% 0.194 149.214)`): the pressed/hover deepening of the active green.

### Secondary
- **Registry Blue** (`oklch(62.3% 0.214 259.815)`): a non-directional data tag color. Carries neutral classifications — the Free Float badge, investor-type chips, and portfolio "N saham" counts (all soft, 10% blue fill). It is informational, never a status signal.

### Tertiary
- **Caution Amber** (`oklch(76.9% 0.188 70.08)`): the warning step, present in the palette for future alert states. Currently unused in the interface.

### Neutral
- **Ledger Paper** (`#ffffff`): the page background, card surfaces, and default input fill.
- **Paper Muted** (`oklch(98.5% 0 none)`): `bg-muted` — the table header band and quiet fill.
- **Paper Tint** (`oklch(97% 0 none)`): `bg-elevated` — hover rows and raised surfaces.
- **Paper Deep** (`oklch(92.2% 0 none)`): `bg-accented` — the mobile filter panel and resting borders.
- **Hairline** (`oklch(87% 0 none)`): `border-accented` — the stronger border on cards, the nav tab bar, and dividers.
- **Ink Muted** (`oklch(55.6% 0 none)`): micro-labels, table headers, secondary captions.
- **Ink** (`oklch(37.1% 0 none)`): default body text and table cells.
- **Ink Solid** (`oklch(20.5% 0 none)`): company/investor names, hovered text, the footer total.

### Named Rules
**The Rarity Rule.** Gain Green is used on a small fraction of any screen. Its rarity is the point — it should always be attributable to one live meaning (active sort, selected nav, positive change, local holder).

**The Direction Rule.** Color is semantic, never decorative: green = gain, positive change, local (D); red = loss, negative change, foreign (F), >1% concentration. Never use red as a generic "danger" accent, nor green as a success celebration.

## Typography

**Display Font:** none — the system uses a single family throughout.
**Body Font:** system sans stack (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial`).
**Label/Mono Font:** system monospace stack is available for numerals where needed; figures otherwise set in the sans stack.

**Character:** neutral and machine-readable — a type system built to be scanned, not admired. No custom webfonts; the interface stays lightweight and instantly familiar. Hierarchy comes from weight, size, and color, never from a decorative face.

### Hierarchy
- **Title** (semibold, 16px, 1.5): the brand wordmark "IDX Stocks Ownership" in the header.
- **Body** (regular, 14px, 1.5): table cells, search results, error messages, card sub-lines.
- **Label** (medium, 13px → 14px at `md`, 1.5): filter/sort/data captions ("DATA PER", "URUTKAN", "ASAL", "TIPE", "RESET FILTER") — always short, muted, and uppercase in the source.
- **Table header** (semibold, 12px → 14px at `md`, muted): column headers.
- **Ledger names** (semibold, 12px → 16px responsive, Ink Solid): company and investor names, truncated with line-clamp on narrow screens.
- **Badges** (bold, 8–11px): the tiny holder tags; ticker chips at `text-xs` bold.

### Named Rules
**The Uppercase Micro-Label Rule.** Control captions are short, uppercase, and muted — they describe the control, never compete with the data beneath them.

## Layout

The layout is a single-column ledger that goes full-width on desktop. The header container is overridden to `max-w-none` (base Nuxt UI container is 80rem / 1280px), so the ledger rows have room to breathe on large screens.

- **List rhythm:** accordion cards stack with `space-y-4` (16px) inside a viewport-height scroll area; infinite scroll loads 20 cards at a time (`pageSize 20`).
- **Toolbar:** on mobile the search, filter button, and DATA PER selector stack vertically (`gap-y-3`); on `xl` they form one horizontal control row separated by vertical hairline separators, with the result count ("N emiten" / "N investor") on the right.
- **Filter panel:** a border-accented card (`rounded-xl`, `bg-default`, `p-3`/`p-4`) that slides into the toolbar on mobile, separated by a top hairline.
- **Page gutters:** `px-4` on mobile; `lg:pl-8 lg:pr-8` content indentation with a matching `ml-4 lg:ml-8` ledger inset; content top margin `mt-4 md:mt-8`.
- **Navigation:** desktop uses a top tab bar (two half-width links) with a 4px animated Gain Green underline indicator; mobile uses a fixed bottom nav (`h-16`, blurred paper, top hairline, `shadow-lg`).
- **Loading:** a 20-row skeleton stack (`h-16`, `rounded-lg`) fills the scroll area during fetch.
- **Breakpoints:** Nuxt UI / Tailwind default scale (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536) — the app pivots its toolbar and nav around `xl`.

## Elevation & Depth

Layered-flat, with shadows used sparingly and only to signal physicality. Surfaces are flat at rest; separation is achieved with hairline borders and the tonal fill ladder (muted → elevated → accented). This keeps the dense tables legible — no drop shadows fighting the ink.

### Shadow Vocabulary
- **Card rest** (`0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)`): the soft `shadow-md` on accordion ledger cards — signals that the row can be opened, not that the page is stacked.
- **Nav float** (`0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)`): the `shadow-lg` lifting the fixed mobile bottom nav off the scrolling content.

### Named Rules
**The Flat-by-Default Rule.** Surfaces are flat at rest. A shadow appears only where the system needs to say "this floats" or "this opens."

## Shapes

- **Radius scale** derives from `--ui-radius` (4px): small controls 4px (`rounded`), table chips 6px (`rounded-md`), skeletons 6px (`rounded-lg`), ledger cards 12px (`rounded-xl`), filter panel 12px (`rounded-xl`).
- **Connected segmented controls:** the sort toggle groups (Ticker / Free Float / Investor) share zero inner radius (`rounded-tr-none rounded-br-none` / `rounded-none` / `rounded-tl-none rounded-bl-none`) so they read as one control, with the active segment filled solid Gain Green.
- **Borders:** a consistent 1px hairline (`border-accented`) frames cards, panels, the nav bar, and the bottom nav; rows inside tables separate with `divide-y divide-accented`.
- **Signature detail:** the scrollbar thumb is Gain Green (`#00c950`) with a 4px radius — 8px wide on desktop, 4px on mobile, transparent track. It is the ledger's one recurring flash of green outside the data itself.

## Components

### Buttons
- **Shape:** small and tactile — `px-2 py-1.5` at `md`, 4px radius, `cursor-pointer`, icons 16px → 20px at `sm`.
- **Primary:** Gain Green solid, white label; used for the retry action ("Coba Lagi") and any single decisive action.
- **Active (sort segment):** solid Gain Green with white label, connected-segment radius.
- **Outline / Ghost / Link:** neutral hairline outline, transparent ghost, and text link — used for filters, resets, and the clear-input control. All compact enough to sit beside dense tables.

### Chips / Badges
- **Style:** tiny and bold — 8–11px labels (`text-xs` default), `md`/`sm` sizes, 6px radius.
- **Ticker badge:** Gain Green solid, white text — the one badge that commands attention per row.
- **Soft data tags:** 10% tint fills (`bg-primary/10`, `bg-secondary/10`, `bg-error/10`) with matching text — local (D) in Gain Green, type/Free Float/count in Registry Blue, foreign (F) and "Investor >1%" in Margin Red.

### Cards / Containers
- **Corner Style:** 12px (`rounded-xl`).
- **Background:** Ledger Paper (`bg-default`).
- **Border:** 1px hairline (`border-accented`).
- **Shadow:** soft card shadow (`shadow-md`) — see Elevation.
- **Internal Padding:** compact `px-2.5 py-3` → `sm:p-4` header; the expanded body is a hairline-separated table.

### Inputs / Fields
- **Search:** full-width (compact on `xl`), leading search icon, `pr-8` trailing slot for a circular clear button; muted placeholder.
- **Select (DATA PER):** compact `md` size, muted label, focus ring in grey.
- **Focus:** Nuxt UI default ring treatment; focus ring is grey (`focus:ring-gray-300`) to keep the ledger calm.

### Table (the signature component)
- **Header:** `bg-muted` band, semibold muted 12–14px labels; `#` and origin columns centered, figures right-aligned.
- **Rows:** `divide-y divide-accented`, hover `bg-elevated`; names line-clamped on mobile.
- **Data:** share counts `toLocaleString()`, percentages bold, change deltas colored — `(+x.xx%)` Gain Green, `(−x.xx%)` Margin Red, "(Baru)" Gain Green for new holders.
- **Footer:** the percentage column sums to a bold total (e.g. `100.00%`).
- **Responsive:** on mobile the type/investor-type columns collapse into badges under the investor name; numeric columns keep right alignment.

### Navigation
- **Header:** Nuxt UI `UHeader` (4rem), brand title, color-mode toggle (square outline, hairline border) on the right; container overridden to full width.
- **Desktop tab bar:** two half-width links (Saham / Investor) with icons, 4px Gain Green underline sliding via `transform: translateX`; active text in Gain Green, idle links muted.
- **Mobile bottom nav:** fixed, `h-16`, `bg-default/90` with backdrop blur, top hairline, `shadow-lg`; active item Gain Green + semibold, idle muted; safe-area inset padding.

## Do's and Don'ts

### Do:
- **Do** keep Gain Green rare — one live meaning per screen (active sort, selected nav, positive delta, D badge, scrollbar).
- **Do** keep numeric columns right-aligned and the table dense; the ledger's value is rows-per-screen.
- **Do** separate rows with hairline borders and tonal fills (`bg-muted`, `bg-elevated`, `bg-accented`), not extra boxes.
- **Do** keep control captions short, uppercase, and muted ("DATA PER", "URUTKAN", "TIPE").
- **Do** render change as `(+x.xx%)` Gain Green, `(−x.xx%)` Margin Red, and "(Baru)" Gain Green.
- **Do** preserve the single-column ledger with the fixed DATA PER batch visible at all times.

### Don't:
- **Don't** build a cluttered dashboard — no competing side panels, no card grids of widgets, no multi-column control sprawl; the ledger list is the interface.
- **Don't** use Gain Green or Margin Red decoratively — color carries market meaning only (Direction Rule).
- **Don't** use gradients, loud illustration, or confetti-style fintech decoration; authority is earned through restraint.
- **Don't** inflate the type scale — 13–16px data density is a feature; large display type belongs nowhere in the ledger.
- **Don't** let shadows stack on the table rows — flat at rest (Flat-by-Default Rule).
- **Don't** swap the system sans stack for a decorative webfont; the lightweight, familiar face is part of the product's speed.
