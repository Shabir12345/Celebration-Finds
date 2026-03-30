# 🎀 Celebration Finds: Design System
*Quiet luxury meets joyful celebration. Elegant but never cold, soft but never childish, upscale boutique but delightfully gift-like.*

This is the single source of truth for the visual foundation and component architecture for the **Celebration Finds** platform. It has been built specifically for Figma Make import and direct developer handoff to ensure perfect alignment with the Information Architecture and Technical Blueprint.

---

## 🎨 Colour System

Our palette evokes warm neutrals, soft blush, creamy ivory, deep emerald/navy accents, and metallic gold foil highlights. Every color has been carefully calibrated to feel like unwrapping a high-end, bespoke present.

### Core Tokens

| Token Name | Light Mode (Hex / HSL) | Dark Mode (Hex / HSL) | Usage Rules |
| :--- | :--- | :--- | :--- |
| `color-bg-primary` | `#FDFBF7` / `40, 43%, 98%` | `#1A1A1A` / `0, 0%, 10%` | Main page background; creamy ivory for light mode |
| `color-bg-secondary` | `#F5F2EB` / `41, 33%, 94%` | `#242424` / `0, 0%, 14%` | Cards, elevated surfaces, secondary sections |
| `color-bg-tertiary` | `#EBE6DF` / `35, 23%, 90%` | `#2E2E2E` / `0, 0%, 18%` | Input fields, inactive states, subtle dividers |
| `color-text-primary` | `#2D2B2A` / `15, 3%, 17%` | `#FDFBF7` / `40, 43%, 98%` | Primary headings, heavy body text; off-black |
| `color-text-secondary` | `#5C5856` / `15, 3%, 35%` | `#B3AAA5` / `21, 8%, 67%` | Body copy, secondary labels, metadata |
| `color-text-tertiary` | `#8C8681` / `27, 5%, 53%` | `#7A736E` / `25, 5%, 45%` | Placeholders, disabled text, subtle hints |
| `color-brand-blush` | `#F2D8D5` / `7, 44%, 89%` | `#E0BCB7` / `8, 38%, 80%` | Soft branding touchpoints, subtle active states |
| `color-accent-emerald` | `#1A4338` / `164, 44%, 18%`| `#2C6B5A` / `164, 42%, 30%` | Primary CTAs, high-contrast brand moments |
| `color-accent-navy` | `#1C2A3A` / `212, 35%, 17%` | `#2A3F57` / `212, 35%, 25%` | Secondary CTAs, alternate striking accents |
| `color-accent-gold` | `#D4AF37` / `46, 65%, 52%` | `#E5C765` / `46, 69%, 65%` | Metadata highlights, "luxury" touches, foil effects |
| `color-border-subtle` | `#E5DFD5` / `37, 23%, 86%` | `#3A3A3A` / `0, 0%, 23%` | General borders, dividing lines |
| `color-status-success` | `#2C5E47` / `152, 36%, 27%`| `#4D9976` / `152, 33%, 45%` | Success states, confirmation messages |
| `color-status-error` | `#8C2A2A` / `0, 54%, 35%` | `#CC4444` / `0, 50%, 53%` | Destructive actions, validation errors |

**State Modifiers (Brand & Accents)**
- **Hover**: 10% Lightness decrease (Light Mode) / 10% Lightness increase (Dark Mode)
- **Active / Pressed**: 15% Lightness decrease (Light Mode) / 15% increase (Dark Mode)
- **Disabled**: Drop opacity to 40%, desaturate by 20%

*Note on Gold Foil*: Gold (`#D4AF37`) is not fully solid. When applied to borders or typography in specific high-end components (e.g., `TextEngravingInput` preview), implement a subtle linear gradient to simulate metallic reflection: `linear-gradient(135deg, #D4AF37 0%, #FFF2CD 50%, #D4AF37 100%)`.

---

## 🔤 Typography Framework

**Rationale:** To achieve "quiet luxury," we pair a sweeping, elegant serif (Playfair Display) for moments of high emotional impact (hero headers, product titles, invitations) with a crisp, geometric sans-serif (Satoshi or Neue Haas Grotesk) to carry the heavy lifting of utility, technical choices, and readability (UI labels, body copy, descriptions).

### Font Families
- **Display / Heading Family (`font-serif`)**: Playfair Display (or similar elegant serif).
- **Body / Utility Family (`font-sans`)**: Satoshi (or Neue Haas Grotesk / Inter).

### 9-Step Type Scale

| Level | Desktop Size / Line-Height | Mobile Size / Line-Height | Weight | Letter Spacing | Font Family | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `text-display` | 72px / 1.1 | 48px / 1.15 | Regular (400) | -0.02em | Serif | Hero headlines, massive editorial moments |
| `text-h1` | 56px / 1.15 | 40px / 1.2 | Regular (400) | -0.01em | Serif | Major page titles, overarching step headers |
| `text-h2` | 40px / 1.2 | 32px / 1.25 | Medium (500) | Normal | Serif | Section headers (e.g., Portfolio Lookbook grids) |
| `text-h3` | 32px / 1.3 | 24px / 1.3 | Medium (500) | Normal | Serif | Product titles, Form section titles, Cart drawer headers |
| `text-h4` | 24px / 1.35 | 20px / 1.4 | SemiBold (600) | +0.01em | Sans | Component headers, wizard step titles |
| `text-body-l` | 18px / 1.6 | 16px / 1.6 | Regular (400) | Normal | Sans | Intro paragraphs, leading body copy |
| `text-body-m` | 16px / 1.6 | 16px / 1.6 | Regular (400) | Normal | Sans | Default body copy, descriptions, product details |
| `text-ui` | 14px / 1.5 | 14px / 1.5 | Medium (500) | +0.02em | Sans | Buttons, inputs, navigation, secondary UI |
| `text-micro` | 12px / 1.4 | 12px / 1.4 | Medium (500) | +0.05em | Sans | Badges, overlines, tooltips, legal footer text |

---

## 📐 Spatial System

Based on a strict 8px foundation with specific utility steps for tighter UI moments.

### Spacing Tokens
- `space-1`: 4px (Micro adjustments, very tight icon-to-text pairing)
- `space-2`: 8px (Inner component padding, tight lists)
- `space-3`: 12px (Form field internal padding, subtle offsets)
- `space-4`: 16px (Default component padding, standard gutters)
- `space-6`: 24px (Wider component padding, default section gap for mobile)
- `space-8`: 32px (Distance between related major UI blocks)
- `space-12`: 48px (Primary section gap on mobile, secondary on desktop)
- `space-16`: 64px (Distance between major components on desktop)
- `space-24`: 96px (Major section breaking, Hero bottom margin)
- `space-32`: 128px (Page top/bottom padding for spacious luxury feel)

### Layout & Containers
- `container-max`: 1440px
- `container-content`: 1200px
- `container-narrow`: 800px (Text-heavy sections, checkout forms, wizard steps)
- `grid-desktop`: 12 columns, 24px gutters, 48px margins
- `grid-tablet`: 8 columns, 24px gutters, 32px margins
- `grid-mobile`: 4 columns, 16px gutters, 20px margins

---

## 💎 Component Library (Figma-Ready)

*All components operate under the assumption of Auto-Layout, with fully documented properties and interaction states.*

### 1. Product & Customization Builders

#### `GiftBuilderWizard`
- **Description**: The multi-step guided flow framing the entire customization experience.
- **Auto-Layout**: Vertical, Gap: `space-8`.
- **Variants**:
  - `Device`: Desktop (horizontal timeline breadcrumbs), Mobile (collapsing step counter "Step X of Y", with horizontal scrolling).
  - `State`: Initial, Progress, Summary.
- **Composition**: Breadcrumb Header, Dynamic Content Area (injects fields), Fixed Bottom Action Bar (Price summary + Next/Prev).
- **Mobile Behavior**: The dynamic content takes full height. The summary & action bar stick to the bottom viewport. Breadcrumbs collapse into a minimal progress bar + step title.

#### `CustomizationFieldRenderer`
- **Description**: Dynamic wrapper handling different input types based on product taxonomy.
- **Auto-Layout**: Vertical, Gap: `space-6`.
- **Properties**: `FieldType` (Color, Text, Scent, Photo, Dropdown).
- **Visuals**: Distinct separation lines (`color-border-subtle`) between field groups. Inherits soft padding (`space-6`).

#### `ColorSwatchPicker`
- **Variants**: `Size` (Small 24px, Large 32px), `State` (Default, Hover, Selected, Out-of-stock).
- **Design rules**: Circular swatches. 
  - *Hover*: Slight scale up (`1.1`), soft box-shadow drop (`shadow-sm`).
  - *Selected*: 2px offset ring in `color-accent-emerald`.
- **Interaction**: Micro-interaction bounce on click.

#### `ScentSelector`
- **Variants**: `Layout` (Grid, List), `State` (Default, Hover, Active).
- **Design rules**: Grid of rounded-rectangle chips (`radius-md`). Background `color-bg-secondary`.
  - *Selected*: Background shifts to `color-brand-blush` (soft), text shifts to `color-text-primary`.
  - Include a tiny micro-icon (leaf, flower, woods) next to scent families if available.

#### `PhotoUploader`
- **Variants**: `State` (Empty, Dragging, Uploading, Filled/Preview).
- **Design rules**: Dashed border (`color-border-subtle`) wrapping a soft `color-bg-secondary` box. 
  - *Dragging*: Border shifts to `color-accent-emerald`, background fills with lowest opacity emerald (`rgba(26, 67, 56, 0.05)`).
  - *Preview*: Beautiful image fit `object-cover` with a floating action button to "Replace" inside the top-right corner.

#### `TextEngravingInput`
- **Variants**: `State` (Empty, Focused, Filled, Error).
- **Design rules**: An elegant single-line or text-area. 
  - *Focus state*: Highlight ring in gold foil gradient.
  - *Typography*: Live preview reflects the exact engraving font chosen (serif or script). It should feel like it's pressed into paper.

#### `LiveOrderSummary`
- **Description**: Sits alongside the builder (desktop) or sticky bottom (mobile).
- **Design rules**: Card container (`bg-primary`, `shadow-elegant`).
- **Typography hierarchy**: Totals use `text-h3` (Serif). Line items use `text-body-m`. Free shipping thresholds clearly displayed.
- **Interaction**: Items fade in (`transition-opacity`, 300ms) as the user makes choices in the builder.

### 2. Core Navigation & E-Commerce

#### `HeroSection`
- **Variants**: `Type` (Split Image/Text, Full Bleed Background, Editorial Collage).
- **Properties**: `HasOverlay` (Boolean).
- **Design rules**: Massive `text-display` serif typography. Subtle parallax scroll on image. 

#### `ProductCard`
- **Variants**: `Size` (Grid-Standard, Featured-Wide), `State` (Default, Hover).
- **Composition**: High-res image (`aspect-4/5`), Title (`text-h4`), Price, customizable badge (e.g., "Best Seller").
- **Hover behavior**: Image scales slowly (`1.05` over `600ms`), alternate lifestyle image fades in if available. Add-to-cart button fades in over the lower third.

#### `PortfolioCard` & `LookbookGrid`
- **Variants**: `Size` (1x1, 1x2 vertical, 2x2 massive).
- **Design rules**: Pinterest-style masonry or strict CSS Grid. Zero-gap or `space-2` (micro gap) to feel like an editorial magazine spread. 
- **Hover**: Dim image slightly (`rgba(0,0,0,0.1)` overlay), reveal elegant serif typography center-aligned.

#### `CartDrawer`
- **State**: Closed, Open, Empty, Populated.
- **Design rules**: Slides in from right (`cubic-bezier(0.16, 1, 0.3, 1)`, 400ms). Soft drop shadow overlapping the page. Backdrop blur on the remaining viewport (`backdrop-blur-sm`). Checkout button is `color-accent-emerald`.

#### `InquiryForm` & `NewsletterSignup`
- **Description**: High-end data capture.
- **Design rules**: Floating labels inside inputs (`text-text-tertiary`), solid bottom border only (no bounding box) for a refined, minimalist aesthetic. On focus, bottom border expands to `color-text-primary`.

#### `TestimonialBlock`
- **Composition**: Massive quotation mark (`color-brand-blush`), Serif `text-h2` for the quote, Sans `text-ui` for attribution. High whitespace padding (`space-12`).

### 3. Base UI Components

#### `Button`
- **Variants**:
  - `Primary`: Solid `color-accent-emerald`, white text. (Or deep Navy depending on section).
  - `Secondary`: Solid `color-bg-secondary`, dark text.
  - `Ghost`: Transparent bg, border `color-border-subtle`.
  - `Text`: Underline on hover only.
- **Sizes**: `sm` (height 32px), `md` (height 48px), `lg` (height 56px).
- **Corners**: `radius-sm` (4px).

#### `Forms & Inputs`
- **Sizes**: Height 48px to match `md` buttons.
- **States**: `Default`, `Hover`, `Focus` (1px ring `color-text-primary`), `Error` (1px ring `color-status-error`).
- **Radii**: 4px (`radius-sm`).

#### `Modals`
- **Design rules**: Overlay `rgba(26, 26, 26, 0.4)` with `backdrop-blur-sm`. Modal body is `bg-primary`, centered. Padding `space-8`. Close button (X) fixed top-right.

---

## ✨ Motion Principles

Micro-interactions must be subtle, intentional, and delightful. Never gimmicky. Like carefully unfolding wrapping paper.

- **Easing Curve ("Luxury Glide")**: `cubic-bezier(0.25, 0.1, 0.25, 1.0)`. Always smooth, never an abrupt linear stop.
- **Durations**:
  - `duration-fast`: 150ms (Hover states, button active states, tooltip fades)
  - `duration-normal`: 300ms (Drawer slides, modal opens, wizard step cross-fades)
  - `duration-slow`: 500ms (Hero image parallax, lookbook image scales)
- **Wizard Step Transitions**: A soft cross-fade (`opacity 0 -> 1`) combined with a microscopic vertical slide (`translateY 8px -> 0`).
- **Add-to-cart Animation**: A subtle checkmark morphs from the cart icon, button text updates to "Added" for 2 seconds, then reverts. Cart icon in the top header softly "pulses" (scale 1.1 then back) with a tiny dot indicator.

---

## ♿ Accessibility Standards (WCAG AA)

- **Contrast Ratios**: All text vs background combinations must meet at least `4.5:1` (AA). 
  - *Example*: `color-text-secondary` (#5C5856) on `color-bg-primary` (#FDFBF7) has a ratio of `6.09:1` (Pass).
- **Focus States**: Never remove `outline` without providing an explicit `:focus-visible` alternative. Use a 2px offset ring utilizing `color-accent-navy` or `color-accent-emerald`.
- **Screen Readers**:
  - The `GiftBuilderWizard` must announce step changes (e.g., *aria-live="polite"* "Step 2 of 4: Select Color").
  - `ColorSwatchPicker` inputs must use `<input type="radio" class="sr-only">` with visually hidden labels ("Emerald Green", "Blush Pink").
- **Motion**: Respect `prefers-reduced-motion: reduce` by replacing all translations/scales with simple opacity fades, and reducing durations to 0ms.

---

## 💻 Exported Formats

### 1. Design Tokens (JSON Structure)

```json
{
  "colors": {
    "light": {
      "bg-primary": "#FDFBF7",
      "bg-secondary": "#F5F2EB",
      "bg-tertiary": "#EBE6DF",
      "text-primary": "#2D2B2A",
      "text-secondary": "#5C5856",
      "text-tertiary": "#8C8681",
      "brand-blush": "#F2D8D5",
      "accent-emerald": "#1A4338",
      "accent-navy": "#1C2A3A",
      "accent-gold": "#D4AF37",
      "border-subtle": "#E5DFD5",
      "status-success": "#2C5E47",
      "status-error": "#8C2A2A"
    },
    "dark": {
      "bg-primary": "#1A1A1A",
      "bg-secondary": "#242424",
      "bg-tertiary": "#2E2E2E",
      "text-primary": "#FDFBF7",
      "text-secondary": "#B3AAA5",
      "text-tertiary": "#7A736E",
      "brand-blush": "#E0BCB7",
      "accent-emerald": "#2C6B5A",
      "accent-navy": "#2A3F57",
      "accent-gold": "#E5C765",
      "border-subtle": "#3A3A3A",
      "status-success": "#4D9976",
      "status-error": "#CC4444"
    }
  },
  "typography": {
    "families": {
      "serif": "'Playfair Display', ui-serif, Georgia, serif",
      "sans": "'Satoshi', 'Neue Haas Grotesk', system-ui, sans-serif"
    },
    "scale": {
      "display": { "size": "72px", "lineHeight": "1.1", "weight": "400", "tracking": "-0.02em" },
      "h1": { "size": "56px", "lineHeight": "1.15", "weight": "400", "tracking": "-0.01em" },
      "h2": { "size": "40px", "lineHeight": "1.2", "weight": "500", "tracking": "normal" },
      "h3": { "size": "32px", "lineHeight": "1.3", "weight": "500", "tracking": "normal" },
      "h4": { "size": "24px", "lineHeight": "1.35", "weight": "600", "tracking": "0.01em" },
      "body-l": { "size": "18px", "lineHeight": "1.6", "weight": "400", "tracking": "normal" },
      "body-m": { "size": "16px", "lineHeight": "1.6", "weight": "400", "tracking": "normal" },
      "ui": { "size": "14px", "lineHeight": "1.5", "weight": "500", "tracking": "0.02em" },
      "micro": { "size": "12px", "lineHeight": "1.4", "weight": "500", "tracking": "0.05em" }
    }
  },
  "spacing": {
    "1": "4px", "2": "8px", "3": "12px", "4": "16px", "6": "24px", 
    "8": "32px", "12": "48px", "16": "64px", "24": "96px", "32": "128px"
  },
  "radii": {
    "none": "0px",
    "sm": "4px",
    "md": "8px",
    "lg": "16px",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 2px 8px rgba(28, 42, 58, 0.05)",
    "elegant": "0 12px 32px rgba(28, 42, 58, 0.08)",
    "modal": "0 24px 64px rgba(28, 42, 58, 0.12)"
  },
  "motion": {
    "easing": {
      "luxury": "cubic-bezier(0.25, 0.1, 0.25, 1.0)"
    },
    "durations": {
      "fast": "150ms",
      "normal": "300ms",
      "slow": "500ms"
    }
  }
}
```

### 2. CSS Variable Declarations (Tailwind / CSS-Ready)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors - Light Theme */
    --color-bg-primary: 40 43% 98%;      /* #FDFBF7 */
    --color-bg-secondary: 41 33% 94%;    /* #F5F2EB */
    --color-bg-tertiary: 35 23% 90%;     /* #EBE6DF */
    --color-text-primary: 15 3% 17%;     /* #2D2B2A */
    --color-text-secondary: 15 3% 35%;   /* #5C5856 */
    --color-text-tertiary: 27 5% 53%;    /* #8C8681 */
    --color-brand-blush: 7 44% 89%;      /* #F2D8D5 */
    --color-accent-emerald: 164 44% 18%; /* #1A4338 */
    --color-accent-navy: 212 35% 17%;    /* #1C2A3A */
    --color-accent-gold: 46 65% 52%;     /* #D4AF37 */
    --color-border-subtle: 37 23% 86%;   /* #E5DFD5 */
    --color-status-success: 152 36% 27%; /* #2C5E47 */
    --color-status-error: 0 54% 35%;     /* #8C2A2A */

    /* Typography */
    --font-serif: "Playfair Display", ui-serif, Georgia, serif;
    --font-sans: "Satoshi", "Neue Haas Grotesk", system-ui, sans-serif;

    /* Base Body Applies */
    background-color: hsl(var(--color-bg-primary));
    color: hsl(var(--color-text-primary));
    font-family: var(--font-sans);
  }

  .dark {
    /* Colors - Dark Theme */
    --color-bg-primary: 0 0% 10%;        /* #1A1A1A */
    --color-bg-secondary: 0 0% 14%;      /* #242424 */
    --color-bg-tertiary: 0 0% 18%;       /* #2E2E2E */
    --color-text-primary: 40 43% 98%;    /* #FDFBF7 */
    --color-text-secondary: 21 8% 67%;   /* #B3AAA5 */
    --color-text-tertiary: 25 5% 45%;    /* #7A736E */
    --color-brand-blush: 8 38% 80%;      /* #E0BCB7 */
    --color-accent-emerald: 164 42% 30%; /* #2C6B5A */
    --color-accent-navy: 212 35% 25%;    /* #2A3F57 */
    --color-accent-gold: 46 69% 65%;     /* #E5C765 */
    --color-border-subtle: 0 0% 23%;     /* #3A3A3A */
    --color-status-success: 152 33% 45%; /* #4D9976 */
    --color-status-error: 0 50% 53%;     /* #CC4444 */
  }
}

@layer utilities {
  .luxury-transition {
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
    transition-duration: 300ms;
  }
  .gold-foil-text {
    background: linear-gradient(135deg, #D4AF37 0%, #FFF2CD 50%, #D4AF37 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .gold-foil-border {
    border-color: #D4AF37;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
  }
}
```

---
*Created continuously in alignment with platform technical blueprints to ensure exact 1:1 translation from Figma to Code.*
