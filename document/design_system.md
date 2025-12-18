# CricFlash UI/UX Design Strategy

A guideline for building a premium, high-impact sports interface.

## Core Design Philosophy
*   **"Alive" Interface**: The app should feel active. Live scores pulse, numbers animate when changing, and interactions are immediate.
*   **Premium Dark Mode**: Default to a deep, rich dark theme (e.g., `hsl(220, 15%, 10%)`) to make content pop and save battery.
*   **Glassmorphism**: Use subtle semi-transparent backgrounds with blur for cards and overlays to create depth without clutter.

## Color Palette (HSL)
We will use HSL for dynamic theming.

**Base Colors**
- **Background**: `hsl(222, 47%, 11%)` (Deep Navy)
- **Surface**: `hsl(217, 33%, 17%)` (Lighter Navy - Cards)
- **Text Primary**: `hsl(210, 40%, 98%)` (White-ish)
- **Text Secondary**: `hsl(215, 20%, 65%)` (Grey-ish)

**Sport Accents (Dynamic)**
- **Cricket**: `hsl(210, 100%, 50%)` (Electric Blue)
- **Football**: `hsl(140, 70%, 50%)` (Turf Green)
- **Basketball**: `hsl(25, 95%, 50%)` (Vibrant Orange)
- **Live/Danger**: `hsl(350, 80%, 60%)` (Red)

## Typography
*   **Font Family**: `Inter` (UI) and `Oswald` (Headings/Scores).
*   **Scale**: Large, bold numbers for scores. Clean, legible text for news.

## Layout & Navigation
*   **Desktop**: Fixed Sidebar Navigation (Left). Search & User Profile (Top Right). Multi-column grid for content (Live matches on top/left, News on right).
*   **Mobile**: Bottom Navigation Bar (Matches, News, Series, More). Swipeable tabs for match lists.

## Key Component Designs

### 1. The "Live Match" Card
*   **Visuals**: High contrast. Team logos prominent.
*   **State**: If LIVE, show a pulsing red dot.
*   **Background**: Subtle gradient based on the sport accent showing faintly behind the card.
*   **Interaction**: Hover lifts the card; Click expands to details.

### 2. Match Details Page
*   **Hero Section**: Big score banner at the top. Background is a blurred version of team colors.
*   **Tabs**: "Scorecard", "Commentary" (Chat style bubbles), "Squads", "Info".
*   **Sticky Header**: Score remains visible when scrolling down stats.

### 3. News Feed
*   **Magazine Layout**: Featured Article is large with full-width image. Secondary stories are list-based.
*   **Readability**: Max-width text containers for comfortable reading line length.

## Animations
*   **Micro-interactions**: Buttons ripple on click. Toggle switches slide smoothly.
*   **Data Updates**: When a score changes, the number briefly flashes green (up) or red (down) or simply scales up/down.
*   **Page Transitions**: Smooth fade-in/slide-up.
