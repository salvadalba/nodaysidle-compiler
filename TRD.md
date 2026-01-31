# Technical Requirements Document

## 🧭 System Context
THE_ARCHITECT_LOG is a static portfolio website built with Astro 5 using islands architecture. It features a split-screen narrative experience where scrolling through code/content on the left panel triggers synchronized visual generation (terminal-style typing effect) on the right panel. Zero JavaScript by default with selective hydration for interactive typing animations and scroll-triggered effects. Content managed via Astro Content Collections with MDX files. Deployed to static hosting (Netlify/Vercel/Cloudflare Pages).

## 🔌 API Contracts
_None_

## 🧱 Modules
### ContentCollections
- **Responsibility:** _Not specified_
- **Dependencies:**
_None_

### SplitScreenLayout
- **Responsibility:** _Not specified_
- **Dependencies:**
_None_

### ScrollSyncController
- **Responsibility:** _Not specified_
- **Dependencies:**
_None_

### TypingAnimationIsland
- **Responsibility:** _Not specified_
- **Dependencies:**
_None_

### VisualGeneratorPanel
- **Responsibility:** _Not specified_
- **Dependencies:**
_None_

### ProjectNarrativeRenderer
- **Responsibility:** _Not specified_
- **Dependencies:**
_None_

### NavigationComponent
- **Responsibility:** _Not specified_
- **Dependencies:**
_None_

### SEOMetaComponent
- **Responsibility:** _Not specified_
- **Dependencies:**
_None_

## 🗃 Data Model Notes
### Unknown Entity
_None_

### Unknown Entity
_None_

### Unknown Entity
_None_

### Unknown Entity
_None_

### Unknown Entity
_None_

## 🔐 Validation & Security
- **Rule:** _Not specified_
- **Rule:** _Not specified_
- **Rule:** _Not specified_
- **Rule:** _Not specified_
- **Rule:** _Not specified_
- **Rule:** _Not specified_

## 🧯 Error Handling Strategy
Build-time validation catches content errors via Zod schemas in Content Collections. Missing or malformed MDX files fail the build with descriptive error messages. Client-side islands gracefully degrade to static content if JavaScript fails to load. 404 page provided for unknown routes.

## 🔭 Observability
- **Logging:** Build logs captured by CI/CD platform. No runtime logging for static site.
- **Tracing:** Not applicable for static site. View Transitions API events logged to console in development mode only.
- **Metrics:**
- Lighthouse CI scores tracked in CI pipeline
- Core Web Vitals via hosting platform analytics (Netlify/Vercel)
- Page view analytics via privacy-respecting solution (Plausible/Fathom) - optional

## ⚡ Performance Notes
- **Metric:** _Not specified_
- **Metric:** _Not specified_
- **Metric:** _Not specified_
- **Metric:** _Not specified_
- **Metric:** _Not specified_
- **Metric:** _Not specified_
- **Metric:** _Not specified_
- **Metric:** _Not specified_

## 🧪 Testing Strategy
### Unit
- Zod schema validation tests for Content Collections
- TypingAnimation component renders correct characters at given progress
- ScrollSyncController calculates correct progress from scroll position
- SEOMeta generates valid Open Graph tags
### Integration
- SplitScreenLayout renders both panels correctly
- Scroll in left panel updates right panel visual state
- View Transitions navigate between projects without full reload
- Reduced motion preference disables typing animations
### E2E
- Lighthouse CI asserts Performance >= 95, Accessibility = 100
- Full scroll through project narrative triggers all visual reveals
- Keyboard navigation reaches all interactive elements
- Social share preview displays correct Open Graph image

## 🚀 Rollout Plan
### Phase
_Not specified_

### Phase
_Not specified_

### Phase
_Not specified_

### Phase
_Not specified_

### Phase
_Not specified_

### Phase
_Not specified_

### Phase
_Not specified_

### Phase
_Not specified_

### Phase
_Not specified_

### Phase
_Not specified_

## ❓ Open Questions
- Which island framework to use - React or Svelte? (Svelte smaller bundle, React more familiar)
- Should mobile layout be stacked panels or simplified single-panel narrative?
- Exact typing animation speed and whether to sync to scroll position or play on section enter?
- How many portfolio projects to include at launch?
- Privacy-respecting analytics solution preference (Plausible, Fathom, or none)?