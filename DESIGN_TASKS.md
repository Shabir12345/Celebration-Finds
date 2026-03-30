# Design System Implementation Tasks

## Phase 1: Foundation & Theming 🏗️
- [x] Configure Tailwind v4 `@theme` in `globals.css` (Colors, Spacing, Typography, Context Variables).
- [x] Set up Google Fonts (`Playfair Display` + `Inter`) in `layout.tsx`.
- [x] Implement `prefers-color-scheme` logic for dark/light mode toggles.
- [x] Establish global utility classes (e.g., `luxury-transition`, `gold-foil-text`).

## Phase 2: Atomic UI Elements 🧱
- [x] Build variant-driven `Button` component (Primary emerald, Ghost, Text-only).
- [x] Build foundational Forms & Inputs (Inputs with floating labels, Error states, Textareas).
- [x] Build generalized Modal / Drawer wrapper with backdrop blur and soft drop shadows.
- [ ] Build Badges & Typography helper wrappers.

## Phase 3: Builder & Interactive Tools ✨
- [x] Build `ColorSwatchPicker` (Circular swatches, states, bounce interactions).
- [x] Build `ScentSelector` (Grid of rounded chips with micro-icons).
- [x] Build `TextEngravingInput` (Foil highlight focus states, live preview rendering).
- [x] Build `PhotoUploader` (Drag-and-drop zones, emerald border highlights, image previews).
- [x] Combine all inputs into `CustomizationFieldRenderer` wrapper.
- [x] Build `LiveOrderSummary` sticky card (Price updates, line-item fades).

## Phase 4: Page Layout & Compositions 🏛️
- [x] Build `HeroSection` (Split image/text, parallax scroll).
- [x] Build `ProductCard` (Standard/Wide grids, hover lifestyle image swaps, add-to-cart).
- [x] Build `LookbookGrid` & `PortfolioCard` (Zero-space/tight masonry, editorial font).
- [x] Build `CartDrawer` (Slide-in animations, checkout flow).
- [x] Build `InquiryForm` & `TestimonialBlock`.

## Phase 5: Journey Assembly & Polish 🎀
- [x] Assemble `GiftBuilderWizard` multi-step logic (Breadcrumbs, next/prev actions, collapsing mobile behavior).
- [x] Conduct contrast requirement tests (WCAG AA).
- [x] Add `framer-motion` layout animations (e.g., adding to cart icon morph, wizard cross-fades).
