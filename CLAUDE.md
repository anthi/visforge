# VisForge — Project Context for Claude Code

## What This Project Is

VisForge is a research visualization framework built with SvelteKit and D3.js.

The primary dataset is academic publications. The primary visualization paradigm starts as an Euler-inspired set diagram but is designed to evolve into a novel visualization of the **entire decision-making intellectual landscape** — across fields, authors, time, and cross-disciplinary influence.

This is not a standard Euler diagram tool. It is a custom, research-grade visualization system where the Euler metaphor is the starting point, not the destination.

---

## Core Architectural Decision: Layout Engine

**Decision: Custom D3 force simulation with dynamic convex hulls. No Euler library.**

### Rationale

Standard Euler libraries (venn.js, eulerr, euler-diagrams) are rejected because:
- They are designed for static, small-n, membership-only diagrams
- They cannot encode semantic meaning in spatial position
- They cannot support temporal evolution, author trajectories, or field proximity
- They cannot be extended toward the novel visualization planned for later stages

### What We Build Instead

| Component | Approach |
|---|---|
| Layout engine | D3 force simulation (custom) |
| Set region boundaries | Dynamic convex hulls over clustered publication nodes |
| Spatial semantics | Field proximity encoded in force parameters; later via UMAP/embedding |
| Membership | Encoded in data model, rendered as hull membership |
| Boundaries | Custom SVG paths, organic, smooth, translucent |

This gives us a V1 that looks and behaves like an Euler diagram, but with an engine we fully own and can extend.

---

## Long-Term Visualization Vision

The final visualization represents the **decision-making universe** as an intellectual landscape:
- **Fields** as spatial regions (psychology, economics, HCI, AI, philosophy, neuroscience...)
- **Publications** as entities within and across regions
- **Authors** with trajectories over time
- **Cross-field influence** via citation and co-authorship edges
- **Temporal evolution** of the field's structure
- **Thematic overlap** as emergent spatial proximity, not just set membership

This is closer in spirit to Börner's Cartography of Science, PivotPaths, and VOSviewer than to classical Euler diagrams. Design ideation for the novel visualization happens in a later project stage.

---

## Architecture Principles

1. **Entity-centric, not visualization-centric.** The central object is the Publication, not the diagram.
2. **Visualization-agnostic data layer.** The same dataset drives all views.
3. **Visualization adapter pattern.** Each viz type converts entities into its own visual structures.
4. **Coordinated multiple views.** Selection in one view propagates everywhere via shared store.

---

## Core Data Models

```typescript
type Publication = {
  id: string;
  title: string;
  doi?: string;
  abstract?: string;
  year?: number;
  venue?: string;
  authors: Author[];
  categories: string[];
  keywords?: string[];
  citations?: string[];
  url?: string;
  metadata?: Record<string, unknown>;
};

type Author = {
  id: string;
  name: string;
  affiliation?: string;
};

type Category = {
  id: string;
  label: string;
  color: string;
  description?: string;
};
```

---

## File Structure

```
src/
  lib/
    data/
      publications/
      parsers/
      mock/
    models/
      publication.ts
      category.ts
      author.ts
    stores/
      entities.ts
      filters.ts
      interactions.ts
    viz/
      core/
        visualization.ts
        interactions.ts
        geometry.ts
        colors.ts
      euler/
        EulerDiagram.svelte
        eulerLayout.ts
        eulerGeometry.ts
        eulerInteractions.ts
      network/
        NetworkDiagram.svelte
      scatterplot/
        Scatterplot.svelte
      table/
        PublicationTable.svelte
    ui/
      Sidebar.svelte
      SearchPanel.svelte
      MetadataPanel.svelte
      FiltersPanel.svelte
      Tooltip.svelte
  routes/
    +layout.svelte
    +page.svelte
    euler/
    network/
    scatterplot/
    table/
```

---

## Build Phases

| Phase | Scope |
|---|---|
| 1 | Data models + mock dataset (vis/HCI/decision-making publications) |
| 2 | Entity store + filter store (Svelte reactive stores) |
| 3 | Euler prototype — D3 force layout + convex hulls, no interactions |
| 4 | Euler interactions — hover, selection, zoom semantics |
| 5+ | Additional viz types (network, scatterplot, table) |

**Always complete one phase and commit before starting the next.**

---

## Mock Dataset Domain

100-300 publications from:
- Information Visualization
- Human-Computer Interaction
- Decision Making
- Explainable AI
- Cognitive Bias
- Feminist HCI
- Behavioral Economics
- Judgment and Decision Making

Seed from the owner's actual Zotero library where possible (Zotero MCP connector available).

---

## Tech Stack

- **Framework:** SvelteKit (latest stable)
- **Visualization:** D3.js v7
- **Language:** TypeScript
- **Hosting:** Vercel
- **Version control:** GitHub
- **Deployment:** git push → auto-deploy on Vercel

---

## Design Aesthetic

Elegant, exploratory, research-oriented, calm, information-rich.
Not dashboard-heavy, not corporate, not Bootstrap.

---

## Owner

Evanthia Dimara — Tenured Assistant Professor, Information Visualization, Utrecht University.
Research focus: visualization, decision-making, HCI, XAI.
This framework is research infrastructure, intended to be reusable across papers, experiments, and design studies.
