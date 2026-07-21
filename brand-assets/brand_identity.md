# Brand Identity & Design System Guide: SocialGraph Atlas

This document outlines the visual identity, brand guidelines, and design tokens for **SocialGraph Atlas**, our OSINT (Open Source Intelligence) geo-intelligence and relationship mapping web platform.

---

## 1. Brand Positioning & Tone of Voice

### Mission
To provide clear, compliance-first, highly detailed geolocational mapping and graph network visualization of public open-source profiles.

### Core Values
- **Integrity & Compliance**: Absolute respect for public-only data barriers, robot exclusions, and privacy concerns.
- **Traceability**: Every mapped coordinate, network connection, or node points back to a verifiable provenance snippet.
- **Sleek Intelligence**: Visualizing complex node connections cleanly so that analysts can see links and geographical overlaps instantly.

### Tone of Voice
- **Professional & Precise**: Explanations are empirical, metrics-focused, and scientific.
- **Security-Minded**: Reflecting the compliance-first architecture of OSINT operations.
- **User-Centric & Modern**: Clean layout interfaces that reduce cognitive overload when viewing massive graphs.

---

## 2. Color System (Semantic Design Tokens)

We use a cyber-intelligence dark mode theme. The colors represent distinct states and layers within the geo-intelligence mapping.

| Token | CSS Variable | HSL Value | hex Code | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Obsidian** | `--background` | `222.2 84% 4.9%` | `#020617` | Main interface backdrop |
| **Slate Surface** | `--card` | `222.2 84% 6.5%` | `#0f172a` | Layout sections, card backgrounds |
| **Silver Silver** | `--foreground` | `210 40% 98%` | `#f8fafc` | Primary titles and body text |
| **Muted Slate** | `--muted-foreground` | `215 20.2% 65.1%` | `#94a3b8` | Subtitles, labels, and secondary text |
| **Electric Blue** | `--primary` | `221.2 83.2% 53.3%` | `#3b82f6` | Primary CTAs, active selection, platform nodes |
| **Cyber Violet** | `--secondary` | `258.1 89.6% 66.3%` | `#8b5cf6` | Network connections, secondary tags |
| **Geo Emerald** | `--accent` | `162.2 77.9% 44.7%` | `#10b981` | Geographic markers, high confidence ratings |
| **Alert Red** | `--destructive` | `0 84.2% 60.2%` | `#ef4444` | High risk nodes, delete triggers, low confidence |

---

## 3. Typography Hierarchy

We use a modern, geometric sans-serif typeface system.

- **Primary Headings**: Inter or Outfit (Sans-serif)
  - Bold weights (`700`, `800`), tracking tight.
  - H1: `2.25rem` (36px) or `3rem` (48px)
  - H2: `1.5rem` (24px) or `1.875rem` (30px)
- **Body Copy**: Inter (Sans-serif)
  - Normal weight (`400`), leading relaxed.
  - Size: `0.875rem` (14px) or `1rem` (16px)
- **Monospace Code / Coordinates**: JetBrains Mono or Fira Code
  - Standard for geo-coordinates, IP addresses, confidence ratios, and raw evidence logs.

---

## 4. Spacing System

Adhering to a strict 8px layout grid:
- `padding-xs`: `0.25rem` (4px)
- `padding-sm`: `0.5rem` (8px)
- `padding-md`: `1rem` (16px)
- `padding-lg`: `1.5rem` (24px)
- `padding-xl`: `2rem` (32px)
- `padding-2xl`: `3rem` (48px)

---

## 5. Visual Stylings

- **Glassmorphism**: 
  - Background: `rgba(15, 23, 42, 0.4)`
  - Border: `1px solid rgba(255, 255, 255, 0.05)`
  - Backdrop Blur: `blur(12px)`
- **Shadows**: Custom ambient dropshadows for absolute positioning popups:
  - `shadow-premium`: `0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.6)`
- **Transitions**:
  - Duration: `150ms` or `200ms`
  - Timing: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)
