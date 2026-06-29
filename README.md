# Mari Group — GEO Portfolio Audit

A self-contained, static build of the Generative Engine Optimisation (GEO) technical audit of the Mari Group websites portfolio. Prepared by Rare Crew.

## Scope

- **34 sites** across **5 business units** (505 pages analysed)
- Mean portfolio score **62.0** (0–100 AI-readability and citability scale)
- Findings: 1,379 critical · 3,835 warning · 4,640 info

The audit measures the structural signals AI assistants and AI search engines — ChatGPT, Claude, Perplexity and Google's AI surfaces — rely on to read, understand and cite a website: crawler access, structured data, metadata, semantic markup, content clarity and performance.

## Viewing the report

Open [`index.html`](index.html) in any modern browser. The file is fully self-contained — fonts, the dataset and all assets are inlined, so it renders offline with no external dependencies or server.

The report contains:

- **Cover** — scope and methodology
- **Overall Audit Results** — portfolio stats strip
- **Business-unit roll-up** — mean score and critical load per unit
- **Fix first** — the highest-leverage remediation targets
- **Site scorecards** and a sortable **ranked comparison** table
- **AI readiness** — llms.txt and schema-markup status per site
- **Per-site detail** — every unique critical and warning finding, grouped by theme, with recommendations and scope (expand/collapse per site)

## Build notes

The report is a single `index.html`. Interactive behaviour (expand/collapse all, per-site expand/collapse, click-to-sort) is implemented in vanilla JavaScript with no runtime dependencies.
