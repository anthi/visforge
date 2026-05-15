# DecisionVerse — Dataset

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
  fields: string[];    // Layer 1: Psychology, InfoVis, HCI, Economics...
  subfields: string[];      // Layer 2: Behavioral Economics, MCDM, NDM, DSS...
  applications: string[];        // Layer 3: Medical, Organizational, Energy...

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
if both rank highly within their respective field's distribution.

```typescript
type Author = {
  id: string;
  name: string;
  affiliation?: string;
  primaryField: string;
  fields: string[];

  // All scores are within-field percentile ranks (0-1), never global counts
  withinFieldPercentile: number;     // primary visibility score
  topicalConsistency: number;        // % of their papers that are DM-relevant
  temporalSpread: number;            // career span within dataset (normalized)
  crossFieldPresence: number;        // n distinct fields they bridge
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

## Field Taxonomy

```typescript
const FIELDS = [
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

const APPLICATIONS = [
  "medical", "organizational", "energy", "legal",
  "financial", "ui_interactive", "education", "crisis_emergency"
];
```

---

## Mock Dataset Requirements

The mock dataset must illustrate the **big picture of decision making across fields**.
It must not be InfoVis-heavy. It must represent the full intellectual landscape.

### Target distribution (300 publications)

| Field | Target n | Example venues |
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
  "fields": ["psychology", "economics"],
  "subfields": ["behavioral_economics", "judgment_and_decision_making"],
  "applications": []
}

{
  "title": "A Decision Support System for ICU Triage",
  "year": 2019,
  "venue": "Journal of Medical Informatics",
  "fields": ["computer_science", "management_science"],
  "subfields": ["decision_support_systems"],
  "applications": ["medical"]
}

{
  "title": "Mitigating the Attraction Effect with Visualizations",
  "authors": [{"name": "Dimara"}, {"name": "Bezerianos"}, {"name": "Dragicevic"}],
  "year": 2017,
  "venue": "IEEE TVCG",
  "fields": ["information_visualization", "psychology"],
  "subfields": ["judgment_and_decision_making"],
  "applications": []
}
```

---

## Future: Zotero Integration (Phase 10)

The mock dataset will be replaced by live extraction from the owner's Zotero library via the Zotero MCP connector. The same 3-axis taxonomy (fields / subfields / applications) applies. Mock tagging examples above serve as ground truth for validating automated extraction and classification.
