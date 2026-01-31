# THE_ARCHITECT_LOG

A portfolio experience that transforms code into visual narratives. Watch your projects come alive through synchronized scroll animations and terminal-inspired aesthetics.

![License](https://img.shields.io/badge/license-MIT-green)
![Astro](https://img.shields.io/badge/Astro-5.x-ff5d01)
![Svelte](https://img.shields.io/badge/Svelte-5.x-ff3e00)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)

## Features

- **Split-Screen Narrative** - Scroll through code on the left, watch visuals generate on the right
- **Syntax-Highlighted Typing** - Character-by-character code reveal with Shiki highlighting
- **Scroll Synchronization** - Visual panel updates in real-time as you scroll through content
- **Terminal Aesthetic** - Dark theme with terminal-inspired design tokens
- **Keyboard Navigation** - Navigate sections with arrow keys or vim-style (j/k)
- **Accessibility First** - ARIA live regions, skip links, reduced motion support
- **Static Generation** - Pre-rendered pages for optimal performance
- **View Transitions** - Smooth page transitions using the View Transitions API

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Astro 5](https://astro.build/) with SSG |
| UI Components | [Svelte 5](https://svelte.dev/) Islands |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Syntax Highlighting | [Shiki](https://shiki.style/) |
| Unit Testing | [Vitest](https://vitest.dev/) |
| E2E Testing | [Playwright](https://playwright.dev/) |
| Performance | [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── AriaLiveRegion.svelte    # Screen reader announcements
│   ├── CodeTypingAnimation.svelte # Syntax-highlighted typing
│   ├── KeyboardNavigation.svelte  # Arrow key navigation
│   ├── NarrativePanel.astro       # Left scrollable content
│   ├── Navigation.astro           # Site navigation
│   ├── ScrollSyncController.svelte # Scroll state management
│   ├── SplitScreenLayout.astro    # Two-column layout
│   ├── TypingAnimation.svelte     # Character reveal animation
│   ├── VisualGeneratorPanel.svelte # Right panel orchestrator
│   └── VisualPanel.astro          # Terminal-style container
├── content/
│   ├── config.ts                  # Content collection schemas
│   └── projects/                  # MDX project files
├── layouts/
│   └── Layout.astro               # Base layout with SEO
├── lib/
│   └── highlighter.ts             # Shiki syntax highlighting
├── pages/
│   ├── 404.astro                  # Terminal-style 404
│   ├── index.astro                # Homepage
│   └── projects/[...slug].astro   # Project pages
├── stores/
│   └── scrollProgress.ts          # Svelte scroll state store
└── styles/
    └── global.css                 # Design tokens & base styles
```

## Testing

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run Lighthouse audit
npm run lighthouse
```

## Design Tokens

The project uses a terminal-inspired dark theme with these key colors:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#0a0a0f` | Main background |
| `--color-terminal-green` | `#00ff88` | Accent color, links |
| `--color-syntax-keyword` | `#ff79c6` | Code keywords |
| `--color-syntax-function` | `#50fa7b` | Function names |
| `--color-syntax-string` | `#f1fa8c` | String literals |

## Accessibility

- Skip to main content link
- ARIA live regions for section changes
- Keyboard navigation (arrows, Home/End, j/k)
- Respects `prefers-reduced-motion`
- Semantic HTML landmarks
- Focus visible styles

## CI/CD

The project includes a GitHub Actions workflow that:

1. **Type checks** - Runs `astro check`
2. **Unit tests** - Runs Vitest
3. **Builds** - Creates production bundle
4. **E2E tests** - Runs Playwright on Chromium
5. **Lighthouse** - Audits performance & accessibility
6. **Deploys** - Publishes to GitHub Pages (on main branch)

## License

MIT

---

Built with [Astro](https://astro.build/) | Designed for developers who appreciate the terminal aesthetic
