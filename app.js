// ──────────────────────────────────────────────
// Testing Lattice Model — Application Engine
// ──────────────────────────────────────────────

(() => {
  'use strict';

  const mainEl = document.getElementById('main');
  const navLinksEl = document.getElementById('nav-links');
  const mobileMenuEl = document.getElementById('mobile-menu');
  const mobileToggleEl = document.getElementById('mobile-toggle');
  const themeToggleEl = document.getElementById('theme-toggle');

  // ─── Theme ───────────────────────────────

  const getStoredTheme = () => localStorage.getItem('lattice-theme') || 'dark';

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggleEl.textContent = theme === 'dark' ? '☀' : '☾';
    themeToggleEl.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    localStorage.setItem('lattice-theme', theme);
  };

  applyTheme(getStoredTheme());

  themeToggleEl.addEventListener('click', () => {
    applyTheme(getStoredTheme() === 'dark' ? 'light' : 'dark');
  });

  // ─── Mobile Menu ─────────────────────────

  mobileToggleEl.addEventListener('click', () => {
    const open = mobileMenuEl.classList.toggle('open');
    mobileToggleEl.textContent = open ? '✕' : '☰';
  });

  const closeMobileMenu = () => {
    mobileMenuEl.classList.remove('open');
    mobileToggleEl.textContent = '☰';
  };

  mobileMenuEl.querySelectorAll('.mobile-menu-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ─── Router ──────────────────────────────

  const parseRoute = () => {
    const hash = window.location.hash.slice(1) || 'home';
    const parts = hash.split('/');
    return { view: parts[0], param: parts[1] || null };
  };

  const updateNavActive = (view) => {
    const baseView = view;
    navLinksEl.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('active', link.dataset.route === baseView);
    });
    mobileMenuEl.querySelectorAll('.mobile-menu-link').forEach((link) => {
      link.classList.toggle('active', link.dataset.route === baseView);
    });
  };

  const navigate = () => {
    const { view, param } = parseRoute();
    updateNavActive(view);

    mainEl.style.opacity = '0';
    mainEl.style.transform = 'translateY(8px)';

    setTimeout(() => {
      switch (view) {
        case 'home':
          renderHome();
          break;
        case 'lattice':
          renderLattice();
          break;
        case 'gates':
          param !== null ? renderGateDetail(parseInt(param, 10)) : renderGates();
          break;
        case 'attributes':
          param ? renderAttributeDetail(param) : renderAttributes();
          break;
        case 'tools':
          renderTools();
          break;
        case 'localisation':
          renderLocalisation();
          break;
        default:
          renderHome();
      }

      mainEl.style.transition = 'opacity 300ms ease, transform 300ms ease';
      mainEl.style.opacity = '1';
      mainEl.style.transform = 'translateY(0)';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  window.addEventListener('hashchange', navigate);

  // ─── Helpers ─────────────────────────────

  const staggerDelay = (index) => `animation-delay: ${index * 60}ms`;

  const gateAccentVar = (gateId) => `var(--gate-${gateId})`;
  const gateBgVar = (gateId) => `var(--gate-${gateId}-bg)`;
  const gateBorderVar = (gateId) => `var(--gate-${gateId}-border)`;

  const scopeColourVar = (scope) => `var(--scope-${scope})`;

  const flColourVar = (fl) => `var(--fl-${fl})`;

  const escapeHtml = (str) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ─── Render: Home ────────────────────────

  const renderHome = () => {
    mainEl.innerHTML = `
      <section class="hero">
        <h1 class="hero-title">The Testing Lattice Model</h1>
        <p class="hero-subtitle">${SITE_META.description}</p>

        <div class="hero-stats">
          <div class="hero-stat stagger-item" style="${staggerDelay(0)}">
            <div class="hero-stat-number" style="color: var(--gate-0)">${STATS.gates}</div>
            <div class="hero-stat-label">Quality Gates</div>
          </div>
          <div class="hero-stat stagger-item" style="${staggerDelay(1)}">
            <div class="hero-stat-number" style="color: var(--gate-1)">${STATS.attributes}</div>
            <div class="hero-stat-label">Quality Attributes</div>
          </div>
          <div class="hero-stat stagger-item" style="${staggerDelay(2)}">
            <div class="hero-stat-number" style="color: var(--gate-2)">${STATS.populatedCells}</div>
            <div class="hero-stat-label">Test Strategies</div>
          </div>
          <div class="hero-stat stagger-item" style="${staggerDelay(3)}">
            <div class="hero-stat-number" style="color: var(--gate-3)">${STATS.uniqueTools}</div>
            <div class="hero-stat-label">Unique Tools</div>
          </div>
        </div>

        <a href="#lattice" class="hero-cta">
          Explore the Lattice
          <span class="hero-cta-arrow">→</span>
        </a>
      </section>

      <div class="container">
        <div class="section-header">
          <div class="section-overline">The Problem</div>
          <h2 class="section-title">Why another testing model?</h2>
          <p class="section-desc">${PHILOSOPHY.intro}</p>
        </div>

        <div class="comparison-block">
          <p class="comparison-quote">${PHILOSOPHY.comparisonSummary}</p>
        </div>

        <div class="section-header mt-2xl">
          <div class="section-overline">What It Fixes</div>
          <h2 class="section-title">Four principles the lattice enforces</h2>
        </div>

        <div class="philosophy-grid">
          ${PHILOSOPHY.whatItFixes.map((item, i) => `
            <div class="philosophy-card stagger-item" style="${staggerDelay(i)}">
              <div class="philosophy-card-title">${item.title}</div>
              <div class="philosophy-card-body">${item.body}</div>
            </div>
          `).join('')}
        </div>

        <div class="gate-timeline mt-2xl">
          ${GATES.map((g, i) => `
            <div class="gate-timeline-item">
              <div class="gate-timeline-line" style="background: linear-gradient(90deg, ${gateAccentVar(i)}, ${gateAccentVar(Math.min(i + 1, 4))})"></div>
              <div class="gate-timeline-dot" style="color: ${gateAccentVar(i)}; background: ${gateAccentVar(i)}"></div>
              <div class="gate-timeline-name" style="color: ${gateAccentVar(i)}">${g.name}</div>
              <div class="gate-timeline-time">${g.time} · ${g.label}</div>
            </div>
          `).join('')}
        </div>

        <div class="adoption-block mt-2xl">
          <div class="adoption-title">How to adopt it</div>
          <div class="adoption-body">${PHILOSOPHY.adoption}</div>
        </div>
      </div>
    `;
  };

  // ─── Render: Lattice Grid ────────────────

  let latticeState = {
    selectedCell: null,
    scopeFilter: 'all',
    flFilter: 'all',
  };

  const renderLattice = () => {
    mainEl.innerHTML = `
      <div class="container">
        <div class="section-header">
          <div class="section-overline">Interactive Grid</div>
          <h1 class="section-title">The Testing Lattice</h1>
          <p class="section-desc">Click any cell to inspect its tools, scope, and fault localisation. Use the filters to focus on specific dimensions.</p>
        </div>

        <div class="lattice-filters" id="lattice-filters">
          <div class="filter-group">
            <span class="filter-label">Scope</span>
            <button class="filter-pill ${latticeState.scopeFilter === 'all' ? 'active' : ''}" data-scope="all">All</button>
            ${Object.entries(SCOPE_LEVELS).map(([key, val]) => `
              <button class="filter-pill ${latticeState.scopeFilter === key ? 'active' : ''}" data-scope="${key}">
                ${val.label}
              </button>
            `).join('')}
          </div>
          <div class="filter-group">
            <span class="filter-label">Localisation</span>
            <button class="filter-pill ${latticeState.flFilter === 'all' ? 'active' : ''}" data-fl="all">All</button>
            ${Object.entries(FL_LEVELS).map(([key, val]) => `
              <button class="filter-pill ${latticeState.flFilter === key ? 'active' : ''}" data-fl="${key}">
                ${val.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="lattice-scroll">
          <div class="lattice-grid" id="lattice-grid">
            <div></div>
            ${ATTRIBUTES.map((a) => `<div class="lattice-hdr">${a.name}</div>`).join('')}
            ${GATES.map((gate, gi) => `
              <a href="#gates/${gi}" class="lattice-gate" style="background: ${gateBgVar(gi)}; border: 1px solid ${gateBorderVar(gi)}; text-decoration: none; color: inherit;">
                <span class="lattice-gate-name" style="color: ${gateAccentVar(gi)}">${gate.name}</span>
                <span class="lattice-gate-time" style="color: ${gateAccentVar(gi)}">${gate.time}</span>
                <span class="lattice-gate-badge" style="background: ${gateBgVar(gi)}; color: ${gateAccentVar(gi)}; border: 1px solid ${gateBorderVar(gi)}">${gate.label}</span>
              </a>
              ${CELLS[gi].map((cell, ci) => {
                if (!cell) return `<div class="lattice-cell-empty"><div class="lattice-cell-empty-dot"></div></div>`;
                const matchScope = latticeState.scopeFilter === 'all' || cell.scope === latticeState.scopeFilter;
                const matchFl = latticeState.flFilter === 'all' || cell.fl === latticeState.flFilter;
                const dimmed = !matchScope || !matchFl;
                const selected = latticeState.selectedCell && latticeState.selectedCell.gateId === gi && latticeState.selectedCell.attributeId === ATTRIBUTES[ci].id;
                return `
                  <div class="lattice-cell ${dimmed ? 'dim' : ''} ${selected ? 'selected' : ''}"
                       style="background: color-mix(in srgb, ${scopeColourVar(cell.scope)} 10%, transparent); border-color: color-mix(in srgb, ${scopeColourVar(cell.scope)} 20%, transparent);"
                       data-gate="${gi}" data-attr="${ci}" role="button" tabindex="0" aria-label="${cell.tool} — ${gate.name}, ${ATTRIBUTES[ci].name}">
                    <div class="lattice-cell-fl" style="background: ${flColourVar(cell.fl)}"></div>
                    <div class="lattice-cell-tool" style="color: ${scopeColourVar(cell.scope)}">${cell.tool}</div>
                    <div class="lattice-cell-scope">${cell.scope}</div>
                  </div>
                `;
              }).join('')}
            `).join('')}
          </div>
        </div>

        <div id="lattice-detail"></div>
      </div>
    `;

    // Bind filter clicks
    document.getElementById('lattice-filters').addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      if (pill.dataset.scope) {
        latticeState.scopeFilter = pill.dataset.scope;
      }
      if (pill.dataset.fl) {
        latticeState.flFilter = pill.dataset.fl;
      }
      renderLattice();
    });

    // Bind cell clicks
    document.getElementById('lattice-grid').addEventListener('click', (e) => {
      const cellEl = e.target.closest('.lattice-cell');
      if (!cellEl) return;
      const gi = parseInt(cellEl.dataset.gate, 10);
      const ci = parseInt(cellEl.dataset.attr, 10);
      const cell = CELLS[gi][ci];
      if (!cell) return;

      latticeState.selectedCell = cell;
      renderLatticeDetail(cell, GATES[gi], ATTRIBUTES[ci]);

      // Update selected visual
      document.querySelectorAll('.lattice-cell.selected').forEach((el) => el.classList.remove('selected'));
      cellEl.classList.add('selected');
    });

    // Keyboard nav on cells
    document.getElementById('lattice-grid').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const cellEl = e.target.closest('.lattice-cell');
        if (cellEl) {
          e.preventDefault();
          cellEl.click();
        }
      }
    });

    // Re-render detail if one was selected
    if (latticeState.selectedCell) {
      const c = latticeState.selectedCell;
      const gate = GATES[c.gateId];
      const attr = ATTRIBUTES.find((a) => a.id === c.attributeId);
      if (gate && attr) renderLatticeDetail(c, gate, attr);
    }
  };

  const renderLatticeDetail = (cell, gate, attr) => {
    const detailEl = document.getElementById('lattice-detail');
    detailEl.innerHTML = `
      <div class="detail-panel">
        <div class="detail-panel-header">
          <div>
            <div class="detail-panel-title">${cell.tool}</div>
            <div class="detail-panel-subtitle">${gate.name} · ${attr.name}</div>
          </div>
          <button class="detail-panel-close" id="detail-close" aria-label="Close detail panel">✕</button>
        </div>
        <div class="detail-panel-body">${cell.detail}</div>
        <div class="detail-panel-chips">
          <span class="chip">
            <span class="chip-dot" style="background: ${scopeColourVar(cell.scope)}"></span>
            ${SCOPE_LEVELS[cell.scope].label} scope
          </span>
          <span class="chip">
            <span class="chip-dot" style="background: ${flColourVar(cell.fl)}"></span>
            ${FL_LEVELS[cell.fl].label} localisation — ${FL_LEVELS[cell.fl].description}
          </span>
          ${cell.tools.map((t) => `<span class="chip chip-tool">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    `;

    document.getElementById('detail-close').addEventListener('click', () => {
      latticeState.selectedCell = null;
      detailEl.innerHTML = '';
      document.querySelectorAll('.lattice-cell.selected').forEach((el) => el.classList.remove('selected'));
    });

    detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // ─── Render: Gates Overview ──────────────

  const renderGates = () => {
    mainEl.innerHTML = `
      <div class="container">
        <div class="section-header">
          <div class="section-overline">Pipeline Stages</div>
          <h1 class="section-title">Quality Gates</h1>
          <p class="section-desc">Five blocking thresholds in your pipeline, not abstract layers. Each gate has a timing budget and a set of required test types.</p>
        </div>

        <div class="gate-timeline">
          ${GATES.map((g, i) => `
            <div class="gate-timeline-item">
              <div class="gate-timeline-line" style="background: linear-gradient(90deg, ${gateAccentVar(i)}, ${gateAccentVar(Math.min(i + 1, 4))})"></div>
              <div class="gate-timeline-dot" style="color: ${gateAccentVar(i)}; background: ${gateAccentVar(i)}"></div>
              <div class="gate-timeline-name" style="color: ${gateAccentVar(i)}">${g.name}</div>
              <div class="gate-timeline-time">${g.time}</div>
            </div>
          `).join('')}
        </div>

        <div class="card-grid mt-xl">
          ${GATES.map((gate, i) => {
            const cellCount = CELLS[i].filter(Boolean).length;
            return `
              <a href="#gates/${i}" class="card stagger-item" style="${staggerDelay(i)}">
                <div style="position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0;background:${gateAccentVar(i)};"></div>
                <div class="card-icon" style="background: ${gateBgVar(i)}; color: ${gateAccentVar(i)}">${gate.label.charAt(0)}</div>
                <div class="card-title">${gate.name} — ${gate.label}</div>
                <div class="card-meta">
                  <span>${gate.time}</span>
                  <span>·</span>
                  <span>${cellCount} test strategies</span>
                </div>
                <div class="card-body">${gate.keyPrinciple}</div>
                <div class="card-footer">
                  <span>Explore gate →</span>
                  <span class="card-arrow">→</span>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;
  };

  // ─── Render: Gate Detail ─────────────────

  const renderGateDetail = (gateId) => {
    const gate = GATES[gateId];
    if (!gate) { renderGates(); return; }

    const gateCells = CELLS[gateId]
      .map((cell, ci) => cell ? { ...cell, attribute: ATTRIBUTES[ci] } : null)
      .filter(Boolean);

    mainEl.innerHTML = `
      <div class="container">
        <div class="gate-detail-header">
          <div class="gate-detail-nav">
            <a href="#gates" class="back-link">← All Gates</a>
          </div>
          <div class="gate-detail-badge" style="background: ${gateBgVar(gateId)}; color: ${gateAccentVar(gateId)}; border: 1px solid ${gateBorderVar(gateId)}">
            ${gate.label} · ${gate.time}
          </div>
          <h1 class="gate-detail-title" style="color: ${gateAccentVar(gateId)}">${gate.name}</h1>
          <div class="gate-detail-narrative">${gate.narrative}</div>
          <div class="gate-detail-principle" style="border-color: ${gateAccentVar(gateId)}; background: ${gateBgVar(gateId)}; color: ${gateAccentVar(gateId)}">
            ${gate.keyPrinciple}
          </div>
        </div>

        <div class="section-header">
          <div class="section-overline">${gate.name}</div>
          <h2 class="section-title">Test Strategies at this Gate</h2>
          <p class="section-desc">${gateCells.length} strategies across ${new Set(gateCells.map(c => c.attribute.id)).size} quality attributes.</p>
        </div>

        <div class="gate-tools-grid">
          ${gateCells.map((cell, i) => `
            <div class="gate-tool-card stagger-item" style="${staggerDelay(i)}">
              <div class="gate-tool-header">
                <div class="gate-tool-name" style="color: ${scopeColourVar(cell.scope)}">${cell.tool}</div>
                <a href="#attributes/${cell.attribute.id}" class="gate-tool-attr" style="text-decoration:none;">${cell.attribute.icon} ${cell.attribute.name}</a>
              </div>
              <div class="gate-tool-body">${cell.detail}</div>
              <div class="gate-tool-meta">
                <span class="chip">
                  <span class="chip-dot" style="background: ${scopeColourVar(cell.scope)}"></span>
                  ${SCOPE_LEVELS[cell.scope].label}
                </span>
                <span class="chip">
                  <span class="chip-dot" style="background: ${flColourVar(cell.fl)}"></span>
                  ${FL_LEVELS[cell.fl].label} localisation
                </span>
                ${cell.tools.map((t) => `<span class="chip chip-tool">${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        ${gateId < 4 ? `
          <div class="mt-2xl text-center">
            <a href="#gates/${gateId + 1}" class="hero-cta" style="font-size: 0.8125rem;">
              Next: ${GATES[gateId + 1].name} — ${GATES[gateId + 1].label}
              <span class="hero-cta-arrow">→</span>
            </a>
          </div>
        ` : ''}
      </div>
    `;
  };

  // ─── Render: Attributes Overview ─────────

  const renderAttributes = () => {
    mainEl.innerHTML = `
      <div class="container">
        <div class="section-header">
          <div class="section-overline">Quality Dimensions</div>
          <h1 class="section-title">Quality Attributes</h1>
          <p class="section-desc">Six orthogonal quality dimensions. Each attribute must be verified at a gate appropriate to its feedback cost.</p>
        </div>

        <div class="card-grid">
          ${ATTRIBUTES.map((attr, i) => {
            const attrCells = CELLS.flat().filter((c) => c && c.attributeId === attr.id);
            const gateColours = ['--gate-0', '--gate-1', '--gate-2', '--gate-3', '--gate-4'];
            return `
              <a href="#attributes/${attr.id}" class="card stagger-item" style="${staggerDelay(i)}">
                <div class="card-icon" style="background: var(--bg-tertiary); font-size: 20px;">${attr.icon}</div>
                <div class="card-title">${attr.name}</div>
                <div class="card-meta">
                  <span>${attrCells.length} strategies</span>
                  <span>·</span>
                  <span>Across ${new Set(attrCells.map(c => c.gateId)).size} gates</span>
                </div>
                <div class="card-body">${attr.description.substring(0, 150)}…</div>
                <div class="card-footer">
                  <span>Explore attribute →</span>
                  <span class="card-arrow">→</span>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;
  };

  // ─── Render: Attribute Detail ────────────

  const renderAttributeDetail = (attrId) => {
    const attr = ATTRIBUTES.find((a) => a.id === attrId);
    if (!attr) { renderAttributes(); return; }

    const attrCells = [];
    CELLS.forEach((gateRow, gi) => {
      gateRow.forEach((cell, ci) => {
        if (cell && ATTRIBUTES[ci].id === attrId) {
          attrCells.push({ ...cell, gate: GATES[gi] });
        }
      });
    });

    mainEl.innerHTML = `
      <div class="container">
        <div class="gate-detail-header">
          <div class="gate-detail-nav">
            <a href="#attributes" class="back-link">← All Attributes</a>
          </div>
          <div style="font-size: 2.5rem; margin-bottom: var(--space-md);">${attr.icon}</div>
          <h1 class="gate-detail-title">${attr.name}</h1>
          <div class="gate-detail-narrative">${attr.description}</div>
        </div>

        <div class="section-header">
          <div class="section-overline">Gate Progression</div>
          <h2 class="section-title">How ${attr.name} is verified across gates</h2>
          <p class="section-desc">${attr.gateProgression}</p>
        </div>

        <div class="gate-tools-grid">
          ${attrCells.map((cell, i) => `
            <div class="gate-tool-card stagger-item" style="${staggerDelay(i)}; border-top: 3px solid ${gateAccentVar(cell.gateId)};">
              <div class="gate-tool-header">
                <div>
                  <div class="gate-tool-name" style="color: ${scopeColourVar(cell.scope)}">${cell.tool}</div>
                  <a href="#gates/${cell.gateId}" style="font-size: 0.75rem; color: ${gateAccentVar(cell.gateId)}; text-decoration: none; margin-top: 4px; display: inline-block;">
                    ${cell.gate.name} — ${cell.gate.label}
                  </a>
                </div>
                <span class="gate-tool-attr">${cell.gate.time}</span>
              </div>
              <div class="gate-tool-body">${cell.detail}</div>
              <div class="gate-tool-meta">
                <span class="chip">
                  <span class="chip-dot" style="background: ${scopeColourVar(cell.scope)}"></span>
                  ${SCOPE_LEVELS[cell.scope].label}
                </span>
                <span class="chip">
                  <span class="chip-dot" style="background: ${flColourVar(cell.fl)}"></span>
                  ${FL_LEVELS[cell.fl].label} localisation
                </span>
                ${cell.tools.map((t) => `<span class="chip chip-tool">${escapeHtml(t)}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        ${(() => {
          const attrIndex = ATTRIBUTES.findIndex((a) => a.id === attrId);
          const next = ATTRIBUTES[attrIndex + 1];
          return next ? `
            <div class="mt-2xl text-center">
              <a href="#attributes/${next.id}" class="hero-cta" style="font-size: 0.8125rem;">
                Next: ${next.name}
                <span class="hero-cta-arrow">→</span>
              </a>
            </div>
          ` : '';
        })()}
      </div>
    `;
  };

  // ─── Render: Tool Catalogue ──────────────

  const renderTools = () => {
    mainEl.innerHTML = `
      <div class="container">
        <div class="section-header">
          <div class="section-overline">Reference</div>
          <h1 class="section-title">Tool Catalogue</h1>
          <p class="section-desc">${STATS.uniqueTools} unique tools referenced across the lattice. Search to find where each tool appears.</p>
        </div>

        <div class="tool-search-wrap">
          <span class="tool-search-icon">⌕</span>
          <input type="search" class="tool-search" id="tool-search" placeholder="Search tools…" autocomplete="off">
        </div>

        <div class="tool-list" id="tool-list">
          ${renderToolItems(TOOLS_INDEX)}
        </div>
      </div>
    `;

    document.getElementById('tool-search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = query
        ? TOOLS_INDEX.filter((t) => t.name.toLowerCase().includes(query))
        : TOOLS_INDEX;
      document.getElementById('tool-list').innerHTML = renderToolItems(filtered);
    });

    // Focus the search on load
    document.getElementById('tool-search').focus();
  };

  const renderToolItems = (tools) => {
    if (tools.length === 0) {
      return `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">⌕</div>
          <div class="empty-state-text">No tools found matching your search.</div>
        </div>
      `;
    }

    return tools.map((tool, i) => `
      <div class="tool-item stagger-item" style="${staggerDelay(i % 20)}">
        <div class="tool-item-name">${escapeHtml(tool.name)}</div>
        <div class="tool-item-appearances">
          ${tool.appearances.map((a) => `
            <div class="tool-appearance">
              <span class="tool-appearance-dot" style="background: ${gateAccentVar(a.gateId)}"></span>
              <a href="#gates/${a.gateId}" style="color: inherit; text-decoration: none;">
                ${a.gateName}
              </a>
              ·
              <a href="#attributes/${a.attributeId}" style="color: inherit; text-decoration: none;">
                ${a.attributeName}
              </a>
              ·
              <span style="color: ${scopeColourVar(a.scope)}">${a.scope}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  };

  // ─── Render: Fault Localisation ──────────

  const renderLocalisation = () => {
    // Gather cells by FL level
    const byFL = { high: [], mid: [], low: [] };
    CELLS.forEach((gateRow, gi) => {
      gateRow.forEach((cell, ci) => {
        if (cell) {
          byFL[cell.fl].push({
            ...cell,
            gateName: GATES[gi].name,
            gateLabel: GATES[gi].label,
            attrName: ATTRIBUTES[ci].name,
          });
        }
      });
    });

    mainEl.innerHTML = `
      <div class="container">
        <div class="section-header">
          <div class="section-overline">Diagnostic Power</div>
          <h1 class="section-title">Fault Localisation</h1>
          <p class="section-desc">How precisely a failing test identifies the location of a fault. The lattice requires that for every integration path, at least one test with high localisation power exists at Gate 1 or below.</p>
        </div>

        <div class="comparison-block">
          <p class="comparison-quote">An E2E test that detects a failure tells you <em>something</em> broke. A unit test that detects the same failure tells you <em>exactly</em> what broke and where. Both have roles. The lattice requires both.</p>
        </div>

        <div class="fl-diagram">
          ${Object.entries(FL_LEVELS).map(([key, level]) => `
            <div class="fl-level-row">
              <div class="fl-level-indicator" style="background: ${flColourVar(key)}"></div>
              <div class="fl-level-content">
                <div class="fl-level-header">
                  <div class="fl-level-name">${level.label} Localisation</div>
                  <span class="fl-level-tag" style="background: color-mix(in srgb, ${flColourVar(key)} 12%, transparent); color: ${flColourVar(key)}; border: 1px solid color-mix(in srgb, ${flColourVar(key)} 25%, transparent);">
                    ${level.description}
                  </span>
                </div>
                <div class="fl-level-desc">${level.explanation}</div>
                <div class="fl-level-gates">
                  <strong>${byFL[key].length} test strategies:</strong>
                  ${byFL[key].map((c) => `<span style="margin-left: 6px;">${c.gateName} · ${c.attrName} · ${c.tool}</span>`).join(' | ')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="section-header mt-2xl">
          <div class="section-overline">The Principle</div>
          <h2 class="section-title">Why localisation scoring matters</h2>
        </div>

        <div class="philosophy-grid">
          <div class="philosophy-card">
            <div class="philosophy-card-title">Prevents test suite gaming</div>
            <div class="philosophy-card-body">Teams gaming the honeycomb load up on E2E tests because they feel comprehensive. Every cell in the lattice carries a localisation score. Writing 300 E2E tests and calling it coverage is caught by the model: Gate 1 localisation cells are empty.</div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-card-title">Backs up expensive failures</div>
            <div class="philosophy-card-body">Low-localisation tests at Gates 3 and 4 are legitimate precisely because high-localisation tests at Gates 0 and 1 back them up. Without that backing, a Gate 3 E2E failure triggers an expensive full-system debugging cycle.</div>
          </div>
          <div class="philosophy-card">
            <div class="philosophy-card-title">Coverage contract, not volume ratio</div>
            <div class="philosophy-card-body">The lattice doesn't ask "do you have enough unit tests?" It asks "does every integration path have at least one high-localisation test at Gate 1 or below?" This is a coverage contract, not a shape.</div>
          </div>
        </div>
      </div>
    `;
  };

  // ─── Initial Route ───────────────────────

  navigate();

})();
