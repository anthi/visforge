# VisForge — Architecture & Design

## Discipline Cluster Hierarchy (Level 1 — always visible)

```
├── Mind & Behavior
│   Psychology, Cognitive Science, Neuroscience
│   (know they study decisions; core JDM literature lives here)
│
├── Formal & Computational
│   CORE: Economics, Mathematics, Statistics, Decision Theory
│   CONTRIBUTING: Operations Research, AI, Computer Science
│   (formal foundations of rational choice; active citable literature)
│
├── Design & Interaction
│   Information Visualization, HCI
│   (operationalize decision support; rich latent DM content)
│
├── Collective & Societal Sciences
│   Management Science, Sociology, Anthropology, Political Science
│   (high latent DM content; rarely self-identified as DM research)
│
└── Philosophy
    (standalone; small in papers, foundational in normative grounding)

Bridging subfields (inter-cluster, Level 2 — visible on expand)
├── Behavioral Economics     Mind & Behavior ↔ Formal & Computational
├── Neuroeconomics           Mind & Behavior ↔ Formal & Computational
├── XAI                      Formal & Computational ↔ Design & Interaction
├── NDM                      Mind & Behavior ↔ Collective & Societal
├── MCDM                     Formal & Computational ↔ Collective & Societal
├── DSS                      Formal & Computational ↔ Design & Interaction
```

Visual implication: cluster visual weight should reflect DM knowledge density, not raw publication count. Peripheral clusters must not appear subordinate.

---

## Euler Layout Engine

**Decision: Custom D3 force simulation with dynamic convex hulls. No Euler library.**

### Rationale
Standard Euler libraries (venn.js, eulerr) are rejected:
- Designed for static, small-n, membership-only diagrams
- Cannot encode semantic meaning in spatial position
- Cannot support temporal evolution, author trajectories, field proximity
- Cannot be extended toward the novel visualization

### What we build
| Component | Approach |
|---|---|
| Layout engine | D3 force simulation (custom) |
| Set region boundaries | Dynamic convex hulls over clustered publication nodes |
| Spatial semantics | Field proximity encoded in force parameters; later UMAP/embedding |
| Membership | Encoded in data model, rendered as hull membership |
| Boundaries | Custom SVG paths, organic, smooth, translucent |

---

## Architecture Principles

1. **Entity-centric.** The central object is the Publication, not the diagram.
2. **Visualization-agnostic data layer.** Same dataset drives all views.
3. **Visualization adapter pattern.** Each viz type converts entities into visual structures.
4. **Coordinated multiple views.** Selection in one view propagates everywhere.
5. **Lens switching.** Same publications, different spatial organization per lens.

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

| Phase | Scope | Status |
|---|---|---|
| 1 | SvelteKit scaffold + data models + mock dataset | DONE |
| 2 | Entity store + filter store | DONE |
| 3 | Euler prototype — D3 force + convex hulls, static | DONE |
| 4 | Euler interactions — hover, tooltip, selection, details panel | DONE |
| 5 | Rebuild mock dataset: 3-axis ontology, 300 pubs, foundational papers | NEXT |
| 6 | Update Publication model to disciplines/subfields/domains | |
| 7 | Lens switching UI — disciplines / subfields / domains / authors | |
| 8 | Author view with within-field prominence scoring | |
| 9 | Sidebar upgrade — per-lens filters, venue filter, live counts | |
| 10 | Zotero integration — replace mock data with real library | |
| 11 | Network / citation view | |
| 12 | Temporal view | |
| 13 | Novel visualization design — cartography of DM universe | |

---

## Literature-Grounded Design Decisions

### From Alsallakh et al. (2016) — Set Visualization STAR (CGF)

Euler/region-based techniques break down beyond 6-8 sets due to clutter and drawability failure. This confirms the decision to use 5 Level 1 clusters rather than flat enumeration of 15+ disciplines.

Key techniques informing VisForge:
- **Bubble Sets** (Collins et al. 2009): isocontour-based regions via marching squares over an energy field. Handles overlapping membership naturally. Better than convex hulls for cross-cluster bridging subfields where publications belong to two clusters simultaneously.
- **KelpFusion** (Meulemans et al. 2013): hybrid lines + filled regions. Reduces artefact overlaps that convex hulls produce. Useful for bridging subfield rendering.
- Color recommendation: color alone is insufficient for >6 categories. Pair each cluster color with a secondary channel (opacity gradient, subtle texture, or stroke pattern) to maintain discriminability in dark mode and for colorblind users.

Task taxonomy mapping (Alsallakh Section 3) to VisForge:
- B10 (compare set cardinalities) → dot density encoding within cluster regions
- B11 (compare set similarities) → spatial proximity encoding between clusters
- C2/C3 (attribute distributions within sets) → lens switching views

### From Nobre et al. (2019) — Multivariate Networks STAR (EuroVis)

**Attribute-driven faceting** (Section 5.1.1.2): placing nodes in regions corresponding to a categorical attribute, with position within the region determined by force simulation. This is the correct framing for VisForge's Disciplines lens.

Their Table 2 scoring recommends **integrated views** over juxtaposed views for VisForge's task profile (cluster-level tasks, heterogeneous node types, several attributes). The details panel should be spatially coupled to the selected node, not a separate panel.

**Overloaded views** (Section 5.2.3): encoding set/cluster membership as hulls or isocontours overlaid on a force layout. This is the correct category for VisForge — not pure Euler diagram, not pure network, but a topology-driven layout with overloaded set membership encoding.

---

## Target Visual Design (the elegant solution)

This is the design VisForge is building toward. Every implementation decision should serve this design.

### Two-register spatial layout

**Register 1 — the landscape (always visible, reads first):**
- 5 cluster regions as large, soft, organic closed shapes
- Significant whitespace between Level 1 clusters — they do not overlap at this level
- Spatial position encodes intellectual proximity: Mind & Behavior adjacent to Formal & Computational; Philosophy spatially near but distinct; Design & Interaction on the periphery reflecting its role as applied rather than foundational
- Each cluster uses a distinct color family (not a single saturated hue) with low-opacity fill and a soft stroke
- Cluster labels: large, placed outside the region boundary, never inside dense dot areas

**Register 2 — the content (always visible, subordinate to landscape):**
- Publications as small dots inside their primary cluster region
- Dot opacity: 40% at default zoom — landscape reads first, content second
- Dot density conveys publication volume without individual visibility
- No labels at default zoom
- Zoom in: dots gain labels on hover, then tooltip, then full detail

**The bridging layer — the novel contribution:**
- Bridging subfields (Behavioral Economics, XAI, NDM, MCDM, DSS, Neuroeconomics) rendered as soft isocontour bands (Bubble Sets logic) stretching between their parent clusters
- Bands are always visible, semi-transparent, labeled
- A publication tagged as Behavioral Economics sits inside both Mind & Behavior and Formal & Computational regions; the isocontour wraps around the set of such publications
- This makes the intellectual argument visible: these subfields emerged precisely at cluster intersections
- Band color: blend of the two parent cluster colors, lower opacity than cluster fills

**What this design argues:**
Every visual element carries a specific intellectual claim. Cluster position = intellectual genealogy. Band presence = cross-disciplinary emergence. Dot density = where the literature actually lives. Nothing is decorative.

### Zoom semantics
- **Default:** landscape + dot density + bridge bands + cluster labels
- **Mid zoom:** dots gain size variation (publication year or citation count), hover labels appear
- **Deep zoom:** full publication details inline, author names visible, venue badges

### Left panel controls
- **View lens switcher:** Disciplines / Subfields / Domains / Authors — tabs not dropdown
- **Cluster filters:** opacity sliders (0–100%), not binary toggles
- **Year range:** draggable visual timeline with density sparkline, not two text input boxes
- **Author prominence threshold:** slider (show top N% within each field)
- **Search:** title, author, keyword, DOI

### What to avoid
- Binary show/hide toggles for clusters (use opacity)
- Labels placed inside dense dot regions
- More than 5 Level 1 regions visible simultaneously at default zoom
- Equal visual weight for all clusters regardless of DM knowledge density
- Bootstrap-style UI components anywhere

---

## Tech Stack

- **Framework:** SvelteKit (latest stable)
- **Visualization:** D3.js v7
- **Language:** TypeScript
- **Hosting:** Vercel
- **Version control:** GitHub
- **Deployment:** git push → auto-deploy on Vercel
- **Data source (future):** Zotero MCP connector

---

## Design Aesthetic

Elegant, exploratory, research-oriented, calm, information-rich.
Not dashboard-heavy, not corporate, not Bootstrap.
