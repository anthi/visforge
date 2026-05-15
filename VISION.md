# DecisionVerse — Vision & Goals

## What This Project Is

DecisionVerse is a research visualization framework built with SvelteKit and D3.js.

The primary dataset is academic publications. The goal is to visualize the **intellectual landscape of decision making as a field** — across contributing fields, subfields, application contexts, key authors, and time.

This is a research tool with two audiences:
1. **Scholars** who want to understand where decision making knowledge comes from
2. **The owner's own research** — seeded from a real Zotero library

The visualization starts as an Euler-inspired set diagram but is designed to evolve into a novel cartography of the decision making universe.

---

## Core Argument (the excavation thesis)

Decision making is a field that does not yet know it is a field. Its knowledge is distributed, fragmented, and often not self-aware across fields that rarely cite each other. A paper in Management Science may contain profound decision making insight without the authors framing it that way. A paper in HCI may operationalize a decision construct without citing JDM literature at all.

DecisionVerse is an excavation map — it surfaces where decision making knowledge currently hides, not where researchers self-identify as decision making scholars.

This means:
- Peripheral clusters (Management Science, Political Science, HCI, Medicine) are as important as central ones
- Psychology and Behavioral Economics already know they study decisions; the hidden knowledge is elsewhere
- Visual design must not privilege high-publication-volume fields over fields with latent DM content
- The tool makes an argument: here is the scattered knowledge that a unified decision making field would synthesize

---

## Core Intellectual Architecture

Decision making knowledge has three distinct layers that must never be conflated:

### Layer 1 — Fields that study decisions
Fields with their own epistemology, methods, and publication culture.
Examples: Psychology, Economics, Philosophy, Cognitive Science, Neuroscience, Statistics, Computer Science, HCI, Information Visualization, Artificial Intelligence, Operations Research, Management Science, Anthropology, Sociology, Political Science

### Layer 2 — Subfields focused specifically on decision making
Subfields, paradigms, or applied fields that emerged from parent fields.
Examples: Behavioral Economics (← Psychology + Economics), Decision Theory (← Philosophy + Economics + Statistics), Game Theory (← Mathematics + Economics), MCDM (← Operations Research), Naturalistic Decision Making (← Cognitive Psychology), Decision Support Systems (← CS + Management Science), Recommender Systems (← AI), Judgment and Decision Making (← Psychology)

### Layer 3 — Application applications where decisions happen
Contexts where decision making is studied or supported — not fields.
Examples: Medical / Clinical, Organizational / Managerial, Energy / Sustainability, Legal / Policy, Financial, UI / Interactive Systems, Education, Crisis / Emergency Response

These three layers are **orthogonal axes** on every publication.
The visualization must support switching between these lenses over the same dataset.

---

## Visualization Lenses

The same publication dataset supports four switchable spatial organizations:

| Lens | Spatial logic | What emerges |
|---|---|---|
| **Fields** | Regions = contributing fields | Where does DM knowledge come from? |
| **Subfields** | Regions = DM-specific subfields | How is the DM field internally structured? |
| **Applications** | Regions = application contexts | Where is DM knowledge applied? |
| **Authors** | Nodes = key authors, sized by within-field prominence | Who built this knowledge? |

Switching lens = same publications, different spatial layout, different hulls.

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

## Owner

Evanthia Dimara — Tenured Assistant Professor, Information Visualization, Utrecht University.
Research focus: visualization, decision making, HCI, XAI.
This framework is research infrastructure, reusable across papers, experiments, and design studies.
Her own papers appear in the dataset and serve as ground truth for multi-axis tagging.
