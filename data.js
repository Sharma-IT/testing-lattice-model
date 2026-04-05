// ──────────────────────────────────────────────
// Testing Lattice Model — Data Layer
// ──────────────────────────────────────────────

const SITE_META = {
  title: 'The Testing Lattice Model',
  subtitle: 'A systematic framework for mapping test types to quality gates',
  description:
    'The Testing Lattice is structured on three orthogonal axes: gate (feedback velocity), quality attribute (what property is being verified), and fault localisation power (how precisely a failure points to its cause). Rather than prescribing a shape, it prescribes a coverage contract.',
};

// ─── Philosophy / narrative blocks ───────────

const PHILOSOPHY = {
  intro: `The core failure of the test pyramid is treating test distribution as a volume problem. The core failure of the honeycomb is treating all test types as equal in urgency. Both models ignore two critical dimensions: <strong>when</strong> tests run in your pipeline, and <strong>how precisely</strong> a failing test identifies the location of a fault.`,

  whatItFixes: [
    {
      title: 'Gate assignment replaces volume ratios',
      body: `You don't need to debate whether you have "enough" unit tests — you need every gate to have its required cells populated. An unpopulated cell in Gate 2 (say, no consumer contract tests) is a visible gap in the model, not a hidden proportion problem.`,
    },
    {
      title: 'Fault localisation prevents test suite gaming',
      body: `Teams gaming the honeycomb load up on E2E tests because they feel comprehensive. Every cell in the lattice carries a localisation score. Low-localisation tests (E2E, synthetic monitoring) are legitimate at Gates 3 and 4 precisely because high-localisation tests exist at Gates 0 and 1 to back them up. Writing 300 E2E tests and calling it coverage is caught by the model: Gate 1 localisation cells are empty.`,
    },
    {
      title: 'Production scope is mandatory',
      body: `The lattice treats Gate 4 as a testing environment with real constraints: synthetic monitoring, real-user monitoring, and SLO alerting are required cells. A team with no Gate 4 coverage is running untested software in production by definition.`,
    },
    {
      title: 'Static analysis is Gate 0 infrastructure',
      body: `It does not compete with tests for budget or attention. It runs before any dynamic test. A Gate 0 with empty cells is a build configuration failure, not a testing strategy failure.`,
    },
  ],

  adoption: `Audit your current suite against the grid. Empty cells expose your actual risk surface. Fill cells in gate order, starting from 0. Gate 4 cells are valid even for teams without mature automation — a Datadog synthetic or a Checkly check takes an hour to configure and gives you immediate production coverage. Don't wait for a perfect Gate 3 before populating Gate 4.`,

  comparisonSummary: `The pyramid gives you a shape. The honeycomb gives you cells. Neither tells you when a test must pass, what attribute it verifies, or how precisely it localises a fault. The lattice gives you all three.`,
};

// ─── Gates ───────────────────────────────────

const GATES = [
  {
    id: 0,
    name: 'Gate 0',
    time: '<30s',
    label: 'Pre-commit',
    bg: '#EEEDFE',
    tc: '#3C3489',
    badge: '#534AB7',
    accent: '#7C6FE0',
    narrative: `Gate 0 is mandatory infrastructure, not optional tooling. Static analysis — type checking, linting, secret scanning, schema validation — runs before any dynamic test and completes in under 30 seconds. A Gate 0 with empty cells is a build configuration failure, not a testing strategy failure. Everything here has exact fault localisation: line and column. This is the fastest, cheapest feedback in the entire pipeline and the foundation every other gate depends on.`,
    keyPrinciple: 'Catch what can be caught without executing code.',
  },
  {
    id: 1,
    name: 'Gate 1',
    time: '<5 min',
    label: 'Pre-merge',
    bg: '#E1F5EE',
    tc: '#085041',
    badge: '#1D9E75',
    accent: '#34D399',
    narrative: `Gate 1 is where you prove your code works in isolation. Unit tests with mutation testing thresholds, component-scoped accessibility checks, and dependency audits run during CI before merge. The critical requirement: every integration path must have at least one test with high fault localisation power at Gate 1 or below. This ensures that failures surfaced higher in the pipeline are traceable without a full debugging cycle. If Gate 1 is weak, Gate 3 and 4 failures become expensive mysteries.`,
    keyPrinciple:
      'Every integration path must have high-localisation coverage here.',
  },
  {
    id: 2,
    name: 'Gate 2',
    time: '<15 min',
    label: 'Pre-deploy',
    bg: '#FAEEDA',
    tc: '#633806',
    badge: '#BA7517',
    accent: '#F59E0B',
    narrative: `Gate 2 crosses service boundaries. Integration tests, consumer contract tests, Lighthouse CI, DAST scans, and preview smoke tests all run against a deployed preview environment. Consumer contract tests are the centrepiece of this gate — they verify that your service's expectations of its dependencies are correct without requiring the provider to be running. This is where integration bugs are cheapest to find. Fault localisation drops to mid-level here: failures point to service or component boundaries rather than exact lines.`,
    keyPrinciple:
      'Cross service boundaries cheaply with contracts and preview deploys.',
  },
  {
    id: 3,
    name: 'Gate 3',
    time: '<30 min',
    label: 'Pre-production',
    bg: '#FAECE7',
    tc: '#4A1B0C',
    badge: '#D85A30',
    accent: '#FB923C',
    narrative: `Gate 3 is the last checkpoint before production. E2E critical paths, contract broker verification, staged accessibility audits, security regression suites, load tests, and trace verification all run against staging with production-representative data. Keep E2E tests small, stable, and focused on the highest-value user journeys. Every test here is expensive to maintain — cover only what integration tests cannot reach. Low-localisation tests are legitimate here precisely because high-localisation tests at Gates 0 and 1 back them up.`,
    keyPrinciple: 'Only test what lower gates cannot reach. Keep it stable.',
  },
  {
    id: 4,
    name: 'Gate 4',
    time: 'Continuous',
    label: 'Production',
    bg: '#FCEBEB',
    tc: '#501313',
    badge: '#A32D2D',
    accent: '#F87171',
    narrative: `Production is a first-class test environment. Synthetic monitoring, real-user monitoring, production contract monitoring, runtime security monitoring, and SLO alerting are required cells — not nice-to-haves. The pyramid excludes production. The honeycomb is indifferent to it. The lattice requires it. A team with no Gate 4 coverage is running untested software in production by definition. Gate 4 cells are valid even for teams without mature automation — a Datadog synthetic or a Checkly check takes an hour to configure and gives you immediate production coverage.`,
    keyPrinciple:
      'Production is a test environment. No Gate 4 coverage = untested software.',
  },
];

// ─── Quality Attributes ─────────────────────

const ATTRIBUTES = [
  {
    id: 'correctness',
    name: 'Correctness',
    icon: '✓',
    description:
      'Does the software do what it is supposed to do? Correctness verification spans from static type checking at Gate 0, through unit and mutation testing at Gate 1, integration tests at Gate 2, E2E critical paths at Gate 3, and synthetic monitoring in production at Gate 4.',
    gateProgression:
      'Gate 0 catches type errors and lint violations (exact localisation). Gate 1 proves component behaviour with mutation-backed unit tests. Gate 2 exercises service interactions. Gate 3 validates critical user journeys end-to-end. Gate 4 continuously asserts production health.',
  },
  {
    id: 'contracts',
    name: 'Contracts',
    icon: '⇄',
    description:
      'Are service interfaces stable and compatible? Contract testing ensures that the agreed-upon API shapes between services are maintained as each service evolves independently. Without contract tests, integration failures are discovered late and expensively.',
    gateProgression:
      'Gate 0 validates schemas statically (Spectral, openapi-lint). Gate 2 runs consumer contract tests against mocks. Gate 3 verifies all contracts through the broker before promotion. Gate 4 monitors for contract drift in production.',
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    icon: '♿',
    description:
      'Can all users, including those with disabilities, use the software effectively? Accessibility is not a feature to be bolted on — it is a quality attribute that must be verified at every stage, from static lint rules catching missing alt text to real-page audits in staging.',
    gateProgression:
      'Gate 0 enforces static rules (jsx-a11y). Gate 1 runs axe-core against rendered component trees. Gate 2 performs full-page audits on preview deploys. Gate 3 audits staging with production-representative content.',
  },
  {
    id: 'security',
    name: 'Security',
    icon: '🛡',
    description:
      'Is the software protected against threats? Security verification must be continuous and multi-layered — from secret scanning and SAST at commit time, through dependency audits, DAST against previews, security regression suites on staging, and runtime threat detection in production.',
    gateProgression:
      'Gate 0 catches secrets and SAST patterns. Gate 1 audits dependencies for known CVEs. Gate 2 runs DAST against preview environments. Gate 3 executes scripted penetration tests. Gate 4 provides runtime threat detection and WAF enforcement.',
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: '⚡',
    description:
      'Does the software meet its speed, throughput, and resource consumption targets? Performance regressions are notoriously hard to catch in unit tests — they require progressive verification from bundle size checks through Lighthouse CI to load tests and real-user monitoring.',
    gateProgression:
      'Gate 0 enforces bundle budgets statically. Gate 2 runs Lighthouse CI on preview deploys. Gate 3 executes load tests against staging with realistic traffic patterns. Gate 4 captures Core Web Vitals from real user sessions — the only source of truth for actual user experience.',
  },
  {
    id: 'observability',
    name: 'Observability',
    icon: '👁',
    description:
      'Can you understand what the software is doing when it runs? Observability is the meta-attribute — without it, failures in every other attribute become harder to diagnose. Trace propagation, structured logging, and SLO alerting must themselves be tested.',
    gateProgression:
      'Gate 2 runs preview smoke tests verifying basic availability. Gate 3 validates trace propagation and structured log completeness on staging. Gate 4 enforces SLO burn-rate alerts and on-call paging — observability is only complete when you know within minutes that something has changed.',
  },
];

// ─── Scope Levels ────────────────────────────

const SCOPE_LEVELS = {
  implementation: {
    label: 'Implementation',
    colour: '#534AB7',
    description:
      'Analysis of source code without executing it. Catches issues at the file or function level with exact localisation.',
  },
  component: {
    label: 'Component',
    colour: '#0F6E56',
    description:
      'Tests running against an isolated component or module. Dependencies are mocked or stubbed. Localisation is high — failures point to specific components.',
  },
  integration: {
    label: 'Integration',
    colour: '#BA7517',
    description:
      'Tests crossing at least one service or module boundary. Real or contract-verified dependencies are used. Localisation is mid-level.',
  },
  system: {
    label: 'System',
    colour: '#D85A30',
    description:
      'Tests running against a fully deployed environment (preview, staging, or production-like). Localisation is low — failures indicate system-level symptoms.',
  },
  production: {
    label: 'Production',
    colour: '#A32D2D',
    description:
      'Monitoring and assertions running against live production traffic. Not tests in the classical sense — they are production health assertions. Localisation is low but coverage is real.',
  },
};

// ─── Fault Localisation Levels ───────────────

const FL_LEVELS = {
  high: {
    label: 'High',
    colour: '#1D9E75',
    borderColour: '#1D9E75',
    textColour: '#0F6E56',
    description: 'Points to exact function, module, or line.',
    explanation:
      'A failure at this level tells you exactly what broke and where. No debugging cycle needed — the test output identifies the faulty code. This is the localisation power you need at Gates 0 and 1 to back up the low-localisation tests at Gates 3 and 4.',
  },
  mid: {
    label: 'Mid',
    colour: '#BA7517',
    borderColour: '#BA7517',
    textColour: '#854F0B',
    description: 'Points to service or component boundary.',
    explanation:
      'A failure at this level tells you which service interaction or component boundary failed. You know the area, but may need to investigate further. Consumer contract tests are the prototypical mid-localisation test — they identify which contract is broken.',
  },
  low: {
    label: 'Low',
    colour: '#888780',
    borderColour: '#888780',
    textColour: '#5F5E5A',
    description: 'Points to system-level symptom.',
    explanation:
      'A failure at this level tells you something broke, but not precisely what or where. E2E tests, synthetic monitoring, and RUM fall here. These are legitimate and necessary, but only when high-localisation tests at lower gates exist to back them up. Without that backing, a Gate 3 failure triggers an expensive full-system debugging cycle.',
  },
};

// ─── Lattice Cells ───────────────────────────

const CELLS = [
  // Gate 0 — Pre-commit
  [
    {
      tool: 'TypeScript + ESLint',
      scope: 'implementation',
      fl: 'high',
      detail:
        'Type checking and lint rules catch semantic errors before any test runs. Misconfigured imports, missing null guards, and rule violations surface in milliseconds. Fault localisation is exact: line and column. This is the fastest feedback in your entire pipeline — a type error caught here costs seconds, not hours.',
      tools: ['tsc', 'ESLint', 'Biome'],
      gateId: 0,
      attributeId: 'correctness',
    },
    {
      tool: 'Schema linting',
      scope: 'implementation',
      fl: 'high',
      detail:
        'OpenAPI or GraphQL schema validation at commit time. Catches malformed contracts before they reach the contract broker. Spectral or openapi-lint run in seconds. A schema violation caught here prevents an entire class of integration failures downstream — invalid field types, missing required properties, and incompatible enums are all surfaced before code review.',
      tools: ['Spectral', 'openapi-lint'],
      gateId: 0,
      attributeId: 'contracts',
    },
    {
      tool: 'jsx-a11y',
      scope: 'implementation',
      fl: 'high',
      detail:
        'Static accessibility rules enforced via ESLint. Catches missing alt attributes, invalid ARIA roles, and unlabelled form controls at the source level. These rules encode WCAG compliance requirements as linting rules — violations are caught before the code ever renders in a browser. This is the cheapest accessibility testing you can do.',
      tools: ['eslint-plugin-jsx-a11y'],
      gateId: 0,
      attributeId: 'accessibility',
    },
    {
      tool: 'Secret scanning + SAST',
      scope: 'implementation',
      fl: 'high',
      detail:
        'Credential leaks and common vulnerability patterns (injection, XSS sinks, hardcoded values) caught before commit. No runtime needed. A leaked API key caught at Gate 0 costs nothing. The same key reaching production costs an incident response, key rotation, audit log review, and potentially a customer notification.',
      tools: ['truffleHog', 'Semgrep', 'CodeQL'],
      gateId: 0,
      attributeId: 'security',
    },
    {
      tool: 'Bundle budget checks',
      scope: 'implementation',
      fl: 'high',
      detail:
        'Import-level size analysis. Prevents accidental large dependencies from entering the build. Fast and non-runtime. A single unguarded `import moment from "moment"` can add 300KB to your bundle. Bundle budget checks catch this at commit time, not after users start complaining about load times.',
      tools: ['bundlesize', 'size-limit'],
      gateId: 0,
      attributeId: 'performance',
    },
    null,
  ],
  // Gate 1 — Pre-merge
  [
    {
      tool: 'Unit + mutation tests',
      scope: 'component',
      fl: 'high',
      detail:
        'Component-scoped tests with a mutation score threshold (e.g. ≥80%). Stryker mutates source and measures how many mutations your tests kill. A high mutation score means your tests are actually discriminating, not just executing code paths. This is the critical gate for fault localisation — if your unit tests are strong here, every downstream failure is easier to trace.',
      tools: ['Vitest', 'Jest', 'Stryker'],
      gateId: 1,
      attributeId: 'correctness',
    },
    null,
    {
      tool: 'axe-core (component)',
      scope: 'component',
      fl: 'high',
      detail:
        'Rendered component trees tested with axe-core. Catches contrast failures, keyboard trap conditions, and focus order issues at the component level before integration. Unlike static jsx-a11y rules, axe-core operates on the rendered DOM — it catches issues that only manifest when CSS is applied and components are composed together.',
      tools: ['axe-core', '@axe-core/react'],
      gateId: 1,
      attributeId: 'accessibility',
    },
    {
      tool: 'Dependency audit',
      scope: 'implementation',
      fl: 'mid',
      detail:
        'Known CVE scanning of the dependency tree. Catches vulnerable transitive dependencies before they reach staging. The localisation is mid because a CVE in a transitive dependency requires investigation to determine whether the vulnerable code path is actually reachable in your application.',
      tools: ['npm audit', 'Snyk', 'OSV Scanner'],
      gateId: 1,
      attributeId: 'security',
    },
    null,
    null,
  ],
  // Gate 2 — Pre-deploy
  [
    {
      tool: 'Integration tests',
      scope: 'integration',
      fl: 'mid',
      detail:
        'Tests that exercise service interactions under controlled conditions, with real or contract-verified dependencies. Scope crosses one service boundary. These tests validate that your code works with its actual dependencies, not just mocks. The trade-off is speed and localisation — failures point to the interaction boundary, not the exact line.',
      tools: ['Vitest (integration mode)', 'Supertest', 'MSW'],
      gateId: 2,
      attributeId: 'correctness',
    },
    {
      tool: 'Consumer contract tests',
      scope: 'integration',
      fl: 'high',
      detail:
        'Pact consumer tests verify that your service\'s expectations of its dependencies are correct without requiring the provider to be running. Provider verification runs separately. This is where integration bugs are cheapest to find. A broken contract caught here prevents a staging or production outage. Contract tests have high localisation because they identify the exact expectation that was violated.',
      tools: ['Pact', 'PactFlow'],
      gateId: 2,
      attributeId: 'contracts',
    },
    {
      tool: 'pa11y / Lighthouse a11y',
      scope: 'system',
      fl: 'mid',
      detail:
        'Full page accessibility audit on deployed preview or staging. Catches issues that only emerge with real DOM and real stylesheets — colour contrast with actual theme colours, focus order with real page layouts, screen reader compatibility with the full component tree.',
      tools: ['pa11y', 'Lighthouse CI'],
      gateId: 2,
      attributeId: 'accessibility',
    },
    {
      tool: 'DAST scan',
      scope: 'system',
      fl: 'mid',
      detail:
        'Dynamic application security testing against a running preview environment. OWASP ZAP or Burp Suite run automated attack scripts against your endpoints. Unlike SAST (Gate 0), DAST finds vulnerabilities that only manifest at runtime — authentication bypasses, CORS misconfigurations, header injection, and session handling flaws.',
      tools: ['OWASP ZAP', 'Burp Suite'],
      gateId: 2,
      attributeId: 'security',
    },
    {
      tool: 'Lighthouse CI',
      scope: 'system',
      fl: 'mid',
      detail:
        'Performance budget enforcement on a deployed preview. Core Web Vitals (LCP, CLS, INP) must meet defined thresholds before merge proceeds. This is the first time performance is measured against a real deployed environment — bundle budgets (Gate 0) catch import-level issues, but Lighthouse CI catches rendering, layout, and network-level regressions.',
      tools: ['Lighthouse CI', 'web-vitals'],
      gateId: 2,
      attributeId: 'performance',
    },
    {
      tool: 'Preview smoke tests',
      scope: 'system',
      fl: 'low',
      detail:
        'Basic availability and response code checks on the deployed preview environment. Verifies the build is deployable before investing in deeper tests. These are intentionally shallow — their purpose is to catch deployment failures (missing env vars, broken builds, infrastructure misconfigurations) cheaply before running expensive Gate 3 suites.',
      tools: ['Playwright (smoke)', 'Datadog Synthetics'],
      gateId: 2,
      attributeId: 'observability',
    },
  ],
  // Gate 3 — Pre-production
  [
    {
      tool: 'E2E critical paths',
      scope: 'system',
      fl: 'low',
      detail:
        'End-to-end tests covering only the highest-value user journeys. Kept small and stable. Every test here is expensive to maintain — cover only what integration tests cannot reach. Low localisation is acceptable here because high-localisation tests at Gates 0 and 1 exist to back them up. An E2E failure triggers investigation; the unit tests narrow the search.',
      tools: ['Playwright', 'Cypress'],
      gateId: 3,
      attributeId: 'correctness',
    },
    {
      tool: 'Contract broker verification',
      scope: 'integration',
      fl: 'high',
      detail:
        'All provider verifications from the contract broker must pass before any service is promoted to production. Prevents provider-side breaking changes from reaching production silently. This is the final contract gate — if a provider has published a verification failure, no consumer depending on that contract can deploy.',
      tools: ['PactFlow', 'Pact Broker'],
      gateId: 3,
      attributeId: 'contracts',
    },
    {
      tool: 'Staged axe audit',
      scope: 'system',
      fl: 'mid',
      detail:
        'Full accessibility audit on staging against production-representative content. Catches CMS-introduced or data-driven accessibility regressions that preview environments with synthetic data might miss. Real product images, user-generated content, and dynamic layouts are all tested here.',
      tools: ['axe DevTools', 'Deque axe-core'],
      gateId: 3,
      attributeId: 'accessibility',
    },
    {
      tool: 'Security regression suite',
      scope: 'system',
      fl: 'mid',
      detail:
        'Scripted penetration tests covering known attack surfaces. Not a replacement for manual pen testing, but catches regressions between releases. If a vulnerability was found and fixed, a regression test ensures it stays fixed. These scripts encode your security team\'s institutional knowledge.',
      tools: ['OWASP ZAP', 'Nuclei'],
      gateId: 3,
      attributeId: 'security',
    },
    {
      tool: 'Load tests',
      scope: 'system',
      fl: 'mid',
      detail:
        'Realistic load simulations against staging. Throughput, error rate, and latency p95/p99 must meet defined SLOs before production deployment proceeds. Load tests catch capacity regressions — a new database query that works fine under unit test conditions but causes timeouts under concurrent load.',
      tools: ['k6', 'Gatling'],
      gateId: 3,
      attributeId: 'performance',
    },
    {
      tool: 'Trace + log verification',
      scope: 'system',
      fl: 'mid',
      detail:
        'Structured log completeness and trace propagation checks on staging. Ensures observability infrastructure itself is working before production. A missing trace header or a malformed log entry caught here prevents a blind spot in production monitoring.',
      tools: ['Datadog', 'Jaeger', 'OpenTelemetry'],
      gateId: 3,
      attributeId: 'observability',
    },
  ],
  // Gate 4 — Production
  [
    {
      tool: 'Synthetic monitoring',
      scope: 'production',
      fl: 'low',
      detail:
        'Continuously executed scripted user journeys against production. These are not tests in the classical sense — they are production health assertions running on a schedule. Alerts on failure within minutes. The pyramid excludes production. The honeycomb is indifferent to it. The lattice requires it.',
      tools: ['Datadog Synthetics', 'Checkly'],
      gateId: 4,
      attributeId: 'correctness',
    },
    {
      tool: 'Production contract monitoring',
      scope: 'production',
      fl: 'mid',
      detail:
        'Consumer-driven contract verification running continuously against live provider versions. Catches contract drift introduced by independent deployments. In a microservices architecture, providers deploy independently — production contract monitoring ensures that a provider deployment doesn\'t silently break its consumers.',
      tools: ['PactFlow', 'Pact'],
      gateId: 4,
      attributeId: 'contracts',
    },
    null,
    {
      tool: 'Runtime security monitoring',
      scope: 'production',
      fl: 'low',
      detail:
        'Continuous threat detection on live traffic. WAF rules, anomaly detection, and rate limiting enforced in production. Complements pre-production DAST by catching real-world attack patterns that scripted DAST scans may not cover — zero-day exploits, targeted attacks, and novel attack vectors.',
      tools: ['AWS WAF', 'Datadog Security', 'Fastly'],
      gateId: 4,
      attributeId: 'security',
    },
    {
      tool: 'Real user monitoring',
      scope: 'production',
      fl: 'low',
      detail:
        'Core Web Vitals measured from real user sessions. LCP, CLS, and INP captured by field data. The only source of truth for actual user experience — synthetic tests approximate it, but RUM captures the full diversity of real devices, networks, and usage patterns.',
      tools: ['Datadog RUM', 'web-vitals', 'SpeedCurve'],
      gateId: 4,
      attributeId: 'performance',
    },
    {
      tool: 'SLO / alerting',
      scope: 'production',
      fl: 'low',
      detail:
        'Error budget burn rate alerts, SLI dashboards, and on-call paging. Observability is only complete when you know within minutes that something in production has changed. SLOs transform monitoring from reactive ("something broke") to proactive ("we\'re burning error budget faster than expected").',
      tools: ['Datadog', 'Grafana', 'PagerDuty'],
      gateId: 4,
      attributeId: 'observability',
    },
  ],
];

// ─── Build tools index from cells ────────────

const TOOLS_INDEX = (() => {
  const index = new Map();

  CELLS.forEach((gateRow, gateIdx) => {
    gateRow.forEach((cell, attrIdx) => {
      if (!cell) return;
      cell.tools.forEach((toolName) => {
        if (!index.has(toolName)) {
          index.set(toolName, {
            name: toolName,
            appearances: [],
          });
        }
        index.get(toolName).appearances.push({
          gateId: gateIdx,
          gateName: GATES[gateIdx].name,
          attributeId: ATTRIBUTES[attrIdx].id,
          attributeName: ATTRIBUTES[attrIdx].name,
          cellTool: cell.tool,
          scope: cell.scope,
          fl: cell.fl,
        });
      });
    });
  });

  return Array.from(index.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
})();

// ─── Stats ───────────────────────────────────

const STATS = {
  gates: GATES.length,
  attributes: ATTRIBUTES.length,
  populatedCells: CELLS.flat().filter(Boolean).length,
  uniqueTools: TOOLS_INDEX.length,
};
