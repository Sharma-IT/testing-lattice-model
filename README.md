# The Testing Lattice Model

An interactive, explorable website for **The Testing Lattice** — a systematic framework for mapping test types to quality gates.

The Testing Lattice is structured on three orthogonal axes: **gate** (feedback velocity), **quality attribute** (what property is being verified), and **fault localisation power** (how precisely a failure points to its cause). Rather than prescribing a shape, it prescribes a coverage contract.

## Why another testing model?

The core failure of the pyramid is treating test distribution as a volume problem. The core failure of the honeycomb is treating all test types as equal in urgency. Both models ignore two critical dimensions: **when** tests run in your pipeline, and **how precisely** a failing test identifies the location of a fault.

> The pyramid gives you a shape. The honeycomb gives you cells. Neither tells you when a test must pass, what attribute it verifies, or how precisely it localises a fault. The lattice gives you all three.

## Exploring the website

The website is a single-page application with six interactive views:

| View | Route | Description |
|------|-------|-------------|
| **Home** | `#home` | Overview of the model, its philosophy, and four core principles |
| **Lattice Grid** | `#lattice` | Interactive 5×6 matrix with scope and localisation filters |
| **Gates** | `#gates` | The five pipeline gates, from pre-commit to production |
| **Attributes** | `#attributes` | Six quality dimensions: correctness, contracts, accessibility, security, performance, observability |
| **Tools** | `#tools` | Searchable catalogue of 50+ testing tools |
| **Localisation** | `#localisation` | Guide to fault localisation power (high / mid / low) |

### Key interactions

- **Click any cell** in the lattice grid to inspect its tools, scope, and fault localisation level
- **Filter** the grid by scope (implementation, component, integration, system, production) or localisation (high, mid, low)
- **Navigate** between gates and attributes via sequential "Next" links
- **Search** the tool catalogue by name
- **Toggle** between dark and light themes (persisted in localStorage)

## Running locally

No build step required — the site is vanilla HTML, CSS, and JavaScript.

```bash
python3 -m http.server 8765
# Open http://localhost:8765/index.html
```

## Running tests

E2E tests are written in [Playwright](https://playwright.dev/) and cover all views, interactions, navigation, filtering, accessibility, and theme toggling.

```bash
# Install dependencies (first time only)
npm install
npx playwright install chromium

# Run tests (headless)
npm test

# Run tests with interactive UI
npm run test:ui
```

### Test coverage

78 tests across 8 test files:

| File | Scope | Tests |
|------|-------|-------|
| `home.spec.js` | Hero, stats, CTA, philosophy, timeline, adoption | 8 |
| `navigation.spec.js` | Nav links, active states, history, deep linking, mobile menu | 8 |
| `lattice.spec.js` | Grid rendering, cell detail, keyboard nav, filtering | 14 |
| `gates.spec.js` | Overview, detail pages, strategy cards, invalid ID fallback | 12 |
| `attributes.spec.js` | Overview, detail pages, gate progression, invalid ID fallback | 11 |
| `tools.spec.js` | Catalogue rendering, search, case sensitivity, empty state | 9 |
| `localisation.spec.js` | FL levels, descriptions, strategy counts, principle cards | 6 |
| `theme-and-accessibility.spec.js` | Theme toggle, persistence, SEO, ARIA landmarks | 10 |

## Tech stack

- **HTML / CSS / JavaScript** — no frameworks, no build tools
- **Playwright** — E2E testing
- **Google Fonts** — Inter + JetBrains Mono

## Licence

MIT
