# Design Brief: Proyecto Soberanía

## Overview
Retro 1980s CRT terminal interface for decentralized AI training protocol coordination. Deep black background with phosphor-green text, amber alerts, monospace typography, ASCII borders, scanline overlays, CRT glow effects.

## Visual Direction
Authoritative terminal aesthetic — no skeuomorphism, no nostalgia irony. Serious infrastructure operator interface. Recombinant pixel-perfect authority with faint glow and grid-aligned precision.

## Color Palette

| Token | OKLCH | Purpose |
|---|---|---|
| Background | 0.08 0 0 | Deep black (terminal screen) |
| Primary (Glow) | 0.72 0.2 120 | Phosphor green, text & borders |
| Secondary (Alert) | 0.68 0.15 45 | Amber, critical states & icons |
| Muted | 0.25 0 0 | Dim text, disabled state |
| Accent | 0.68 0.15 45 | Amber, same as secondary |
| Destructive | 0.68 0.15 45 | Amber, error + alert alignment |
| Border | 0.3 0.08 120 | Subtle green grid lines |
| Input | 0.15 0 0 | Nearly black input fields |
| Card | 0.12 0 0 | Slightly elevated panels |

## Typography

| Tier | Font | Weight | Use |
|---|---|---|---|
| Display | JetBrains Mono | 400 | Headers, titles, dashboard labels |
| Body | JetBrains Mono | 400 | Paragraph text, UI labels |
| Mono | Geist Mono | 400 | Code blocks, technical output |

## Shape Language
Zero border-radius (pixel-perfect blocks). ASCII box borders (`┌─┐│└┘`) for panels. 1px solid lines. Sharp 90° corners. Strict grid alignment on 2px scale for scanlines.

## Structural Zones

| Zone | Background | Treatment | Purpose |
|---|---|---|---|
| Header/Nav | card (0.12) | Top border, green border-b | Protocol status, navigation |
| Dashboard Content | background (0.08) | Grid panels with crt-border | Task cards, worker status, metrics |
| Sidebar (if used) | sidebar (0.1) | Green border-r, crt-border | Navigation, section links |
| Footer/Status | status-bar class | Bottom border-t, xs font | Generation counter, connection status |
| Modal/Popover | popover (0.15) | Card border, crt-glow shadow | Task forms, detail views |

## Spacing & Rhythm
Base unit: 4px. Gaps: 8px (xs), 16px (sm), 24px (md), 32px (lg). Dense information layout — no wasted vertical space. Monospace enforces consistent character-width alignment.

## Component Patterns
- **Button:** bg-primary text-primary-foreground crt-glow px-3 py-1 font-mono cursor-pointer (active: crt-active)
- **Input:** terminal-input class — bg-input border-border focus:border-primary focus:crt-glow
- **Card:** crt-border bg-card, content p-3 gap-2 flex flex-col
- **Badge:** inline-block px-2 py-0.5 bg-secondary text-secondary-foreground font-mono text-xs
- **Status Indicator:** w-2 h-2 rounded-full, color varies (green=active, amber=warning, red=error)
- **ASCII Frame:** border-l border-r border-t border-b border-primary, px-2 py-1, optional span corner chars "┌┐┘└"

## Motion & Animation
- **Scanlines:** Full-page overlay, 2px horizontal lines, animation loop 8s, opacity 0.15
- **CRT Glow:** text-shadow on primary text (0 0 4px + 0 0 8px + 0 0 12px compound glow)
- **Active State:** pulse-glow animation (2s ease-in-out), intensifies text-shadow on hover/focus
- **Cursor Blink:** cursor-blink class — 1s steps(1) infinite, for input focus indicator
- **Transition:** all 0.3s cubic-bezier(0.4, 0, 0.2, 1) for interactive elements

## Signature Detail
**CRT Scanline Overlay:** Persistent full-page background with animated 2px lines drifting downward. Reinforces temporal/real-time feel of protocol coordination. Subtle (-15% opacity) to maintain readability, animated at 8s loop for gentle motion.

## Constraints
- No rounded corners (border-radius: 0)
- All text monospace (JetBrains Mono primary)
- Green-on-black only (no other color text combinations)
- Amber for alerts/errors (secondary-foreground only in destructive/alert states)
- ASCII borders for panels (use CSS border utilities, optional span corners)
- Scanline overlay always visible (body::before pseudo-element)
- No drop-shadow, only inset glow via text-shadow and box-shadow inset

## Differentiation
**Terminal authority operator interface.** Pixel-perfect grid precision + CRT authenticity. No blur, no gradients, no modern "glass morphism." Raw ANSI-inspired color palette with technical text-shadow glows. Evokes 1980s scientific workstations — authoritative, trustworthy, slightly unsettling (good for serious systems).

## Accessibility
- Sufficient color contrast (WCAG AA+): terminal-green 0.72 on black 0.08 passes 7.2:1 ratio
- Readable monospace at all sizes (JetBrains Mono is professionally hinted)
- Scanline opacity at 15% preserves text legibility
- Focus states visible via crt-active + border-primary

