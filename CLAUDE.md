# VisForge — Project Context for Claude Code

## What This Project Is

VisForge is a research visualization framework built with SvelteKit and D3.js.

The primary dataset is academic publications. The goal is to visualize the **intellectual landscape of decision making as a field** — across contributing disciplines, subfields, application domains, key authors, and time.

This is a research tool with two audiences:
1. **Scholars** who want to understand where decision making knowledge comes from
2. **The owner's own research** — seeded from a real Zotero library

The visualization starts as an Euler-inspired set diagram but is designed to evolve into a novel cartography of the decision making universe.

### Core Argument (the excavation thesis)
Decision making is a field that does not yet know it is a field. Its knowledge is distributed, fragmented, and often not self-aware across disciplines that rarely cite each other. A paper in Management Science may contain profound decision making insight without the authors framing it that way. A paper in HCI may operationalize a decision construct without citing JDM literature at all.

VisForge is an excavation map — it surfaces where decision making knowledge currently hides, not where researchers self-identify as decision making scholars.

This means:
- Peripheral clusters (Management Science, Political Science, HCI, Medicine) are as important as central ones
- Psychology and Behavioral Economics already know they study decisions; the hidden knowledge is elsewhere
- Visual design must not privilege high-publication-volume fields over fields with latent DM content
- The tool makes an argument: here is the scattered knowledge that a unified decision making field would synthesize

---

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

## Core Intellectual Architecture

Decision making knowledge has three distinct layers that must never be conflated:

### Layer 1 — Disciplines that study decisions
Fields with their own epistemology, methods, and publication culture.
Examples: Psychology, Economics, Philosophy, Cognitive Science, Neuroscience, Statistics, Computer Science, HCI, Information Visualization, Artificial Intelligence, Operations Research, Management Science, Anthropology, Sociology, Political Science

### Layer 2 — Subfields focused specifically on decision making
Subfields, paradigms, or applied fields that emerged from parent disciplines.
Examples: Behavioral Economics (← Psychology + Economics), Decision Theory (← Philosophy + Economics + Statistics), Game Theory (← Mathematics + Economics), MCDM (← Operations Research), Naturalistic Decision Making (← Cognitive Psychology), Decision Support Systems (← CS + Management Science), Recommender Systems (← AI), Judgment and Decision Making (← Psychology)

### Layer 3 — Application domains where decisions happen
Contexts where decision making is studied or supported — not disciplines.
Examples: Medical / Clinical, Organizational / Managerial, Energy / Sustainability, Legal / Policy, Financial, UI / Interactive Systems, Education, Crisis / Emergency Response

These three layers are **orthogonal axes** on every publication.
The visualization must support switching between these lenses over the same dataset.

---

## Publication Data Model

```typescript
type Publication = {
  id: string;
  title: string;
  doi?: string;
  abstract?: string;
  year?: number;
  venue?: string;
  authors: Author[];

  // Three orthogonal classification axes
  disciplines: string[];    // Layer 1: Psychology, InfoVis, HCI, Economics...
  subfields: string[];      // Layer 2: Behavioral Economics, MCDM, NDM, DSS...
  domains: string[];        // Layer 3: Medical, Organizational, Energy...

  keywords?: string[];
  citations?: string[];
  url?: string;
  metadata?: Record<string, unknown>;
};
```

---

## Author Model

Author prominence is **always computed within-field, never globally**.
A visualization researcher with 8 DM-relevant papers is as visible as a psychologist with 80,
if both rank highly within their respective discipline's distribution.

```typescript
type Author = {
  id: string;
  name: string;
  affiliation?: string;
  primaryDiscipline: string;
  disciplines: string[];

  // All scores are within-field percentile ranks (0-1), never global counts
  withinFieldPercentile: number;     // primary visibility score
  topicalConsistency: number;        // % of their papers that are DM-relevant
  temporalSpread: number;            // career span within dataset (normalized)
  crossFieldPresence: number;        // n distinct disciplines they bridge
  isFoundational: boolean;           // explicit override for canonical figures
};
```

### Foundational figures (explicit override, always visible in their field region)
Simon, Kahneman, Tversky, Klein, Savage, Thaler, Sunstein, von Neumann, Nash,
Munzner, Shneiderman, Norman, Russell, Pearl, Ackoff, Keeney, Raiffa

### Junior researcher protection
Within-field percentile naturally protects junior researchers in small subfields.
A researcher with 2 papers both DM-relevant scores 100% topical consistency.
Volume is never the primary axis.

---

## Visualization Lenses

The same publication dataset supports four switchable spatial organizations:

| Lens | Spatial logic | What emerges |
|---|---|---|
| **Disciplines** | Regions = contributing fields | Where does DM knowledge come from? |
| **Subfields** | Regions = DM-specific subfields | How is the DM field internally structured? |
| **Domains** | Regions = application contexts | Where is DM knowledge applied? |
| **Authors** | Nodes = key authors, sized by within-field prominence | Who built this knowledge? |

Switching lens = same publications, different spatial layout, different hulls.

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

## Long-Term Visualization Vision

The final visualization represents the **decision making universe** as an intellectual landscape:
- Fields as spatial regions with meaningful proximity
- Publications as entities within and across regions
- Authors with trajectories over time
- Cross-field influence via citation and co-authorship
- Temporal evolution of the field's structure
- Thematic overlap as emergent spatial proximity

Closest precedents in spirit: Borner's Cartography of Science, PivotPaths, VOSviewer.
Design ideation for the novel visualization is a later project stage.

---

## Mock Dataset Requirements

The mock dataset must illustrate the **big picture of decision making across fields**.
It must not be InfoVis-heavy. It must represent the full intellectual landscape.

### Target distribution (300 publications)

| Discipline | Target n | Example venues |
|---|---|---|
| Psychology / JDM | 50 | Psychological Review, JEP, Cognition |
| Behavioral Economics | 35 | QJE, AER, Journal of Finance |
| Cognitive Science | 25 | Cognitive Science, Psychological Science |
| Information Visualization | 30 | IEEE TVCG, IEEE VIS, EuroVis |
| HCI | 25 | CHI, CSCW, UIST |
| Artificial Intelligence / XAI | 25 | NeurIPS, AAAI, FAccT |
| Decision Theory / Philosophy | 20 | Ethics, Philosophy and Public Affairs |
| Neuroscience / Neuroeconomics | 20 | Nature Neuroscience, Neuron |
| Operations Research / MCDM | 20 | Management Science, EJOR |
| Naturalistic Decision Making | 15 | Journal of Cognitive Engineering |
| Management Science | 15 | Management Science, Org Science |
| Decision Support Systems | 15 | DSS Journal, Information Systems |

### Foundational papers that must appear
- Kahneman & Tversky (1979) Prospect Theory — Econometrica
- Tversky & Kahneman (1974) Judgment under Uncertainty — Science
- Simon (1955) A Behavioral Model of Rational Choice — QJE
- Klein (1998) Sources of Power — MIT Press
- Thaler & Sunstein (2008) Nudge — Yale UP
- von Neumann & Morgenstern (1944) Theory of Games
- Savage (1954) Foundations of Statistics
- Munzner (2014) Visualization Analysis and Design
- Norman (1988) The Design of Everyday Things
- Keeney & Raiffa (1976) Decisions with Multiple Objectives
- Dimara & Stasko (2021) A Critical Reflection on Visualization Research — IEEE TVCG
- Dimara et al. (2018) Mitigating the Attraction Effect — IEEE TVCG

### Multi-axis tagging examples
```json
{
  "title": "Prospect Theory: An Analysis of Decision under Risk",
  "authors": [{"name": "Kahneman"}, {"name": "Tversky"}],
  "year": 1979,
  "venue": "Econometrica",
  "disciplines": ["psychology", "economics"],
  "subfields": ["behavioral_economics", "judgment_and_decision_making"],
  "domains": []
}

{
  "title": "A Decision Support System for ICU Triage",
  "year": 2019,
  "venue": "Journal of Medical Informatics",
  "disciplines": ["computer_science", "management_science"],
  "subfields": ["decision_support_systems"],
  "domains": ["medical"]
}

{
  "title": "Mitigating the Attraction Effect with Visualizations",
  "authors": [{"name": "Dimara"}, {"name": "Bezerianos"}, {"name": "Dragicevic"}],
  "year": 2017,
  "venue": "IEEE TVCG",
  "disciplines": ["information_visualization", "psychology"],
  "subfields": ["judgment_and_decision_making"],
  "domains": []
}
```

---

## Discipline Taxonomy

```typescript
const DISCIPLINES = [
  // Core sciences
  "psychology", "economics", "philosophy", "cognitive_science",
  "neuroscience", "statistics", "mathematics", "computer_science",
  "anthropology", "sociology", "political_science",
  // Applied/interdisciplinary fields
  "information_visualization", "hci", "artificial_intelligence",
  "operations_research", "management_science"
];

const SUBFIELDS = [
  "behavioral_economics", "decision_theory", "game_theory",
  "judgment_and_decision_making", "naturalistic_decision_making",
  "multi_criteria_decision_making", "decision_support_systems",
  "recommender_systems", "data_driven_decision_making", "neuroeconomics"
];

const DOMAINS = [
  "medical", "organizational", "energy", "legal",
  "financial", "ui_interactive", "education", "crisis_emergency"
];
```

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

---

## Owner

Evanthia Dimara — Tenured Assistant Professor, Information Visualization, Utrecht University.
Research focus: visualization, decision making, HCI, XAI.
This framework is research infrastructure, reusable across papers, experiments, and design studies.
Her own papers appear in the dataset and serve as ground truth for multi-axis tagging.
