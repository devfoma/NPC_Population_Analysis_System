---
name: Kinetic Governance
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dce6'
  primary: '#e0fdff'
  on-primary: '#00373a'
  primary-container: '#00f2fe'
  on-primary-container: '#006a70'
  inverse-primary: '#00696f'
  secondary: '#adc7f7'
  on-secondary: '#133057'
  secondary-container: '#2f4a72'
  on-secondary-container: '#9fb9e8'
  tertiary: '#f6f7ff'
  on-tertiary: '#273141'
  tertiary-container: '#d1dbf1'
  on-tertiary-container: '#566072'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ff6ff'
  primary-fixed-dim: '#00dce6'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#adc7f7'
  on-secondary-fixed: '#001b3c'
  on-secondary-fixed-variant: '#2d476f'
  tertiary-fixed: '#d9e3f9'
  tertiary-fixed-dim: '#bdc7dc'
  on-tertiary-fixed: '#121c2c'
  on-tertiary-fixed-variant: '#3d4759'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 2rem
  gutter: 1.5rem
  section-gap: 3rem
  glass-padding: 1.5rem
---

## Brand & Style

This design system establishes a high-tech, authoritative visual language for national population analysis. It blends the gravitas of government data with a futuristic, data-centric aesthetic to evoke a sense of precision, transparency, and forward-thinking leadership.

The core style is **Premium Glassmorphism**. The interface relies on multi-layered translucency, high-fidelity backdrop blurs, and luminous accents to create a sense of infinite depth. By treating data as a physical light source within a crystalline environment, the system transforms complex statistics into a navigable, immersive experience. The emotional response should be one of "Informed Power"—where the user feels they are looking through a clear lens at the pulse of the nation.

## Colors

The palette is rooted in a deep, nocturnal foundation to allow glass effects and neon accents to resonate.

- **Background Strategy**: Use a dynamic mesh gradient primarily composed of Deep Charcoal (#2d3748) and Royal Blue (#1a365d), with localized Neon Cyan (#00f2fe) "light leaks" to suggest activity.
- **Primary Action**: Neon Cyan is reserved for critical data points, primary buttons, and active states. It represents the "data current" flowing through the system.
- **Glass Surfaces**: All containers use `rgba(255, 255, 255, 0.08)` for the fill, ensuring legibility against the dark background while maintaining the frosted glass metaphor.
- **Text Hierarchy**: 
    - **High-Contrast**: Pure White (#FFFFFF) for headlines and primary labels.
    - **Medium-Contrast**: `rgba(255, 255, 255, 0.70)` for secondary information and body text.
    - **Low-Contrast**: `rgba(255, 255, 255, 0.45)` for hints, timestamps, and disabled states.

## Typography

The system utilizes two typefaces to balance character and utility. **Outfit** is used for display and headlines to provide a modern, geometric, and sophisticated feel. **Inter** is employed for body text, data tables, and labels, ensuring maximum legibility across complex datasets.

- **Weight Hierarchy**: Use Bold (700) and Semi-Bold (600) for Outfit titles to contrast against the ethereal glass backgrounds. Use Regular (400) and Medium (500) for Inter to maintain a clean, systematic appearance.
- **Data Styling**: Tabular numbers should be used for all population figures to ensure vertical alignment in reports.

## Layout & Spacing

The layout follows a **Fluid Grid** model with high breathing room to prevent the interface from feeling cluttered or overwhelming.

- **Grid System**: 12-column desktop grid with 24px (1.5rem) gutters.
- **Margins**: Mobile uses 16px side margins; Tablet and Desktop use 32px (2rem) to allow the background mesh gradients to frame the glass cards effectively.
- **Glass Padding**: Elements within glass containers should never touch the edges. A minimum internal padding of 24px (1.5rem) is required to maintain the "floating" illusion.
- **Breakpoints**: 
    - Mobile: < 768px (4 columns)
    - Tablet: 768px - 1200px (8 columns)
    - Desktop: > 1200px (12 columns)

## Elevation & Depth

Visual hierarchy is managed through **Glassmorphism** layers rather than traditional shadows.

1.  **Base Layer**: The background mesh gradient.
2.  **Surface Layer**: Main content cards. Background: `rgba(255, 255, 255, 0.08)`, Backdrop Blur: `16px`. Border: `1px solid rgba(255, 255, 255, 0.12)`.
3.  **Raised Layer**: Hover states or active modals. Background: `rgba(255, 255, 255, 0.15)`, Backdrop Blur: `24px`.
4.  **Accent Depth**: Neon Cyan (#00f2fe) is applied as an inner glow or an outer `0 0 15px rgba(0, 242, 254, 0.4)` glow on primary elements to indicate they are "powered" and interactive.

Avoid traditional black shadows. If depth is required on top of glass, use a very subtle, large-radius shadow with a deep blue tint: `0 20px 40px rgba(0, 0, 0, 0.3)`.

## Shapes

The shape language is modern and approachable, utilizing consistent rounding to soften the high-tech aesthetic.

- **Main Cards**: Use `rounded-lg` (16px) to create a distinct frame for population data.
- **Buttons and Inputs**: Use `rounded-md` (8px) for a precise, functional look.
- **Active Indicators**: Use pill-shaped (full rounding) for status chips (e.g., "Live", "Verified").

## Components

### Navigation Sidebar
A floating glass panel positioned 16px from the left and top edges. It should have a full-height blur and a 1px right-side border. Active icons utilize a cyan glow and a vertical bar on the leading edge.

### Glass KPI Cards
Metric containers featuring a "Glowing Icon" in the top right. The metric value (e.g., 215M) should use **Outfit Bold**. A subtle trend line (sparkline) should be rendered in Neon Cyan at the bottom of the card.

### Chart Containers
Charts should be rendered without heavy grid lines. Use `rgba(255, 255, 255, 0.1)` for axis lines. Area charts should use a gradient fill from `rgba(0, 242, 254, 0.3)` to `transparent`.

### Form Fields & Inputs
- **Background**: `rgba(255, 255, 255, 0.05)`.
- **Border**: 1px solid `rgba(255, 255, 255, 0.1)`.
- **Focus State**: Border changes to Neon Cyan with a `0 0 8px rgba(0, 242, 254, 0.5)` glow.
- **Labels**: Floating labels that shrink and move to the top-left on focus, transitioning from 70% opacity to 100% white.

### Primary Buttons
Solid Neon Cyan (#00f2fe) background with Deep Charcoal (#2d3748) text for maximum legibility. On hover, increase the outer cyan glow intensity.