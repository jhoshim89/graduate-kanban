# DESIGN.md - Vercel Stark Light Aesthetic Specifications

This document defines the design tokens and UI component style specifications inspired by Vercel's clean, high-precision developer aesthetic. The interface is optimized as a single-theme Stark Light system: pure white and soft gray canvases with sharp black ink, sleek blue accents, and highly consistent geometric borders.

---

## 1. Design Tokens

### Colors
- **Canvas (Primary Background):** `#ffffff` - Pure white for the main app container.
- **Canvas-Soft (Secondary Background):** `#fafafa` - Warm near-white for headers, empty states, and sidebar panels.
- **Canvas-Deep (Interactive Background):** `#f5f5f5` - Hover states and active selections.
- **Ink (Text & Dark Accents):** `#171717` - Pure dark graphite/black for text, solid buttons, and dark accents.
- **Body Text:** `#4d4d4d` - Softer dark gray for secondary descriptions and labels.
- **Mute / Metadata:** `#888888` - Medium gray for subtext, past dates, and icons.
- **Border / Hairline:** `#ebebeb` - Thin, precise divider line.
- **Border-Strong:** `#a1a1a1` - Darker border for focused elements.
- **Accent (Blue):** `#0070f3` - Vercel blue for primary selections, tabs, and focus outlines.
- **Success:** `#0070f3` - Reused for completed states to maintain color discipline.
- **Warning:** `#f5a623` - Amber for tasks due very soon (e.g., today/tomorrow).
- **Error:** `#ee0000` - Red for overdue tasks.

### Typography
- **Font Family:** `Geist, Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace Family (for dates and codes):** `"Geist Mono", SFMono-Regular, Consolas, Monaco, monospace`
- **Headings:** Bold (`600`), tight letter-spacing (`-0.03em`), pure ink color.
- **Body & Captions:** Clean, spacious line heights (`1.5`), precise spacing (`-0.01em`).

### Spacing & Layout
- **Grid / Alignment:** Strict grid alignment (multiples of 4px/8px: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`).
- **Outer Padding:** `24px` or `32px` on desktop for a premium, spacious feel.
- **Borders:** `1px solid var(--color-border)` everywhere instead of heavy shadows.
- **Radius:** Very slight roundness for a modern, geometric look:
  - Small (Buttons, Badges): `4px`
  - Medium (Cards, Inputs): `8px`
  - Large (Modals, Panels): `12px`

---

## 2. Component Design Specifications

### App Header / Navigation
- **Height:** `64px`
- **Background:** `#ffffff` with a bottom border of `1px solid var(--color-border)`.
- **Title:** Solid ink, `display-sm` (`18px`, `600`), tight letter spacing.
- **Tab Switching:** Monospaced pill tabs. Active tab has a solid ink underline or dark pill background.

### Kanban Board
- **Layout:** Three columns (`To Do`, `In Progress`, `Done`) arranged in a flexible CSS Grid.
- **Column Container:** Soft gray background (`#fafafa`) or pure white, partitioned by subtle `1px` borders.
- **Column Header:** Upper-case monospaced captions with the count of items in a gray pill badge.

### Kanban Cards
- **Background:** `#ffffff` (Pure White).
- **Border:** `1px solid var(--color-border)`.
- **Hover State:** Translate-Y up slightly (`-2px`), subtle box shadow (`0 4px 12px rgba(0, 0, 0, 0.05)`), border changes to `#a1a1a1`.
- **Active / Drag State:** Rotates slightly (`1deg`), opacity `0.6`, clean box shadow outline.

### Calendar View
- **Grid Layout:** 7-column layout (Sunday to Saturday) with perfect square ratios.
- **Date Cells:** Clean borders, dates placed in top-right or top-left corners using light gray text.
- **Today Highlight:** Pure blue border or subtle blue point.
- **Task Pill:** Simple compact bar with light background and ink text. Warning/Error colors on the left edge if close to due date.

### Modal & Dialogs
- **Backdrop:** Light glassmorphism overlay (`rgba(255, 255, 255, 0.7)` with `backdrop-filter: blur(8px)`).
- **Modal Window:** Pure white, `#ffffff`, sharp `12px` border radius, high-quality soft shadow (`0 30px 60px rgba(0, 0, 0, 0.12)`).
- **Inputs:** Clean white fields with `1px` light gray borders, focusing into `#0070f3` (Blue) border with no outline.
- **Buttons:**
  - **Primary:** Solid ink black (`#171717`) background, white text (`#ffffff`), hover becomes slightly transparent or greyish black.
  - **Secondary:** White background, light gray border, ink text, hover becomes `#fafafa`.
