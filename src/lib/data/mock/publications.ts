import type { Publication } from '$lib/models/publication';

export const mockPublications: Publication[] = [
	// --- Information Visualization ---
	{
		id: 'pub-001',
		title: 'Visualization Rhetoric: Framing Effects in Narrative Visualization',
		year: 2011,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'bateman', name: 'Scott Bateman' },
			{ id: 'mandryk', name: 'Regan Mandryk' }
		],
		categories: ['infovis'],
		keywords: ['rhetoric', 'narrative', 'framing', 'persuasion'],
		abstract:
			'Examines how visualization design choices constitute rhetorical acts that frame data interpretation.'
	},
	{
		id: 'pub-002',
		title: 'Semiology of Graphics',
		year: 1983,
		venue: 'University of Wisconsin Press',
		authors: [{ id: 'bertin', name: 'Jacques Bertin' }],
		categories: ['infovis'],
		keywords: ['visual variables', 'semiology', 'cartography', 'encoding'],
		abstract: 'Foundational taxonomy of visual variables and their perceptual properties.'
	},
	{
		id: 'pub-003',
		title: 'The Eyes Have It: A Task by Data Type Taxonomy for Information Visualizations',
		year: 1996,
		venue: 'IEEE VL',
		authors: [{ id: 'shneiderman', name: 'Ben Shneiderman' }],
		categories: ['infovis'],
		keywords: ['task taxonomy', 'visual information seeking', 'overview', 'zoom'],
		abstract:
			'Proposes a visual information seeking mantra: overview first, zoom and filter, details on demand.'
	},
	{
		id: 'pub-004',
		title: "Toward a Deeper Understanding of the Role of Interaction in Information Visualization",
		year: 2007,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'yi', name: 'Ji Soo Yi' },
			{ id: 'ah', name: 'Youn ah Kang' },
			{ id: 'stasko', name: 'John Stasko' },
			{ id: 'jacko', name: 'Julie Jacko' }
		],
		categories: ['infovis', 'hci'],
		keywords: ['interaction', 'taxonomy', 'user intent', 'information visualization'],
		abstract: 'Taxonomy of interaction techniques in visualization, organized by user intent.'
	},
	{
		id: 'pub-005',
		title: 'A Layered Grammar of Graphics',
		year: 2010,
		venue: 'Journal of Computational and Graphical Statistics',
		authors: [{ id: 'wickham', name: 'Hadley Wickham' }],
		categories: ['infovis'],
		keywords: ['grammar of graphics', 'ggplot2', 'data visualization', 'layers'],
		abstract: 'Presents a layered grammar of graphics that forms the basis of ggplot2.'
	},
	{
		id: 'pub-006',
		title: 'Visualization Analysis and Design',
		year: 2014,
		venue: 'CRC Press',
		authors: [{ id: 'munzner', name: 'Tamara Munzner' }],
		categories: ['infovis'],
		keywords: ['design space', 'nested model', 'task abstraction', 'idioms'],
		abstract: 'Comprehensive framework for visualization design using a nested model.'
	},
	{
		id: 'pub-007',
		title: 'The Functional Art: An Introduction to Information Graphics and Visualization',
		year: 2012,
		venue: 'New Riders',
		authors: [{ id: 'cairo', name: 'Alberto Cairo' }],
		categories: ['infovis'],
		keywords: ['information design', 'journalism', 'truthfulness', 'beauty'],
		abstract: 'Principles of visualization design emphasizing functionality alongside aesthetics.'
	},
	{
		id: 'pub-008',
		title: 'Visualization by Demonstration: An Interaction Paradigm for Visual Data Exploration',
		year: 2017,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'saket', name: 'Bahador Saket' },
			{ id: 'endert', name: 'Alex Endert' },
			{ id: 'demiralp', name: 'Cagatay Demiralp' }
		],
		categories: ['infovis', 'hci'],
		keywords: ['programming by demonstration', 'interaction', 'visual exploration'],
		abstract: 'An interaction paradigm where users specify visualizations by demonstrating on data.'
	},
	{
		id: 'pub-009',
		title: 'D³: Data-Driven Documents',
		year: 2011,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'bostock', name: 'Michael Bostock' },
			{ id: 'ogievetsky', name: 'Vadim Ogievetsky' },
			{ id: 'heer', name: 'Jeffrey Heer' }
		],
		categories: ['infovis'],
		keywords: ['D3', 'web visualization', 'SVG', 'data binding'],
		abstract: 'Presents D3.js, a toolkit for creating dynamic, data-driven documents using web standards.'
	},
	{
		id: 'pub-010',
		title: 'Animated Transitions in Statistical Data Graphics',
		year: 2007,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'heer2', name: 'Jeffrey Heer' },
			{ id: 'robertson', name: 'George Robertson' }
		],
		categories: ['infovis'],
		keywords: ['animation', 'transitions', 'statistical graphics', 'object constancy'],
		abstract: 'Studies how animated transitions can improve comprehension of statistical data changes.'
	},
	{
		id: 'pub-011',
		title: 'Color Use Guidelines for Mapping and Visualization',
		year: 1994,
		venue: 'Visualization in Modern Cartography',
		authors: [{ id: 'brewer', name: 'Cynthia Brewer' }],
		categories: ['infovis'],
		keywords: ['color', 'cartography', 'perceptual', 'sequential', 'diverging'],
		abstract: 'Guidelines for selecting color schemes in maps and visualizations based on data type.'
	},
	{
		id: 'pub-012',
		title: 'Sizing the Horizon: The Effects of Chart Size and Layering on the Graphical Perception of Time Series Visualizations',
		year: 2009,
		venue: 'CHI',
		authors: [
			{ id: 'heer3', name: 'Jeffrey Heer' },
			{ id: 'kong', name: 'Nicholas Kong' },
			{ id: 'agrawala', name: 'Maneesh Agrawala' }
		],
		categories: ['infovis', 'hci'],
		keywords: ['time series', 'horizon charts', 'graphical perception', 'chart size'],
		abstract: 'Evaluates how chart size and horizon graph layering affect perception of time series.'
	},
	{
		id: 'pub-013',
		title: 'Revisiting Bertin Matrices: New Interactions for Crafting Tabular Visualizations',
		year: 2016,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'ren', name: 'Donghao Ren' },
			{ id: 'bach', name: 'Benjamin Bach' },
			{ id: 'henry-riche', name: 'Nathalie Henry Riche' }
		],
		categories: ['infovis'],
		keywords: ['Bertin matrices', 'reordering', 'tabular data', 'interaction'],
		abstract: 'Revisits Bertin\'s original matrix design with modern interaction techniques.'
	},
	{
		id: 'pub-014',
		title: 'Perceptual Kernels for Visual Encoding Variables',
		year: 2014,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'demiralp2', name: 'Cagatay Demiralp' },
			{ id: 'bernstein', name: 'Michael S. Bernstein' },
			{ id: 'heer4', name: 'Jeffrey Heer' }
		],
		categories: ['infovis'],
		keywords: ['perceptual kernels', 'visual encoding', 'crowdsourcing', 'perception'],
		abstract: 'Derives perceptual kernels for visual variables through crowdsourced experiments.'
	},
	{
		id: 'pub-015',
		title: 'Visualization Literacy: The State of the Field',
		year: 2022,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'boy', name: 'Jeremy Boy' },
			{ id: 'bartram', name: 'Lyn Bartram' }
		],
		categories: ['infovis'],
		keywords: ['visualization literacy', 'education', 'comprehension', 'survey'],
		abstract: 'Surveys the emerging field of visualization literacy, its definition and measurement.'
	},

	// --- Human-Computer Interaction ---
	{
		id: 'pub-016',
		title: 'Direct Manipulation: A Step Beyond Programming Languages',
		year: 1983,
		venue: 'IEEE Computer',
		authors: [{ id: 'shneiderman2', name: 'Ben Shneiderman' }],
		categories: ['hci'],
		keywords: ['direct manipulation', 'interface design', 'visibility', 'feedback'],
		abstract: 'Defines and advocates for direct manipulation interfaces in interactive computing.'
	},
	{
		id: 'pub-017',
		title: 'The Design of Everyday Things',
		year: 1988,
		venue: 'Basic Books',
		authors: [{ id: 'norman', name: 'Don Norman' }],
		categories: ['hci'],
		keywords: ['affordances', 'conceptual models', 'usability', 'design'],
		abstract: 'Foundational work on human-centered design principles and affordances.'
	},
	{
		id: 'pub-018',
		title: 'Research Through Design as a Method for Interaction Design Research in HCI',
		year: 2007,
		venue: 'CHI',
		authors: [
			{ id: 'zimmerman', name: 'John Zimmerman' },
			{ id: 'forlizzi', name: 'Jodi Forlizzi' },
			{ id: 'evenson', name: 'Shelley Evenson' }
		],
		categories: ['hci'],
		keywords: ['research through design', 'interaction design', 'methodology'],
		abstract: 'Proposes research through design as a legitimate form of knowledge production in HCI.'
	},
	{
		id: 'pub-019',
		title: 'CHI 1994 Special Interest Group: Usability Evaluation Methods',
		year: 1994,
		venue: 'CHI',
		authors: [
			{ id: 'nielsen', name: 'Jakob Nielsen' },
			{ id: 'mack', name: 'Robert L. Mack' }
		],
		categories: ['hci'],
		keywords: ['usability', 'evaluation', 'heuristic evaluation', 'user testing'],
		abstract: 'Overview of usability evaluation methods for interactive systems.'
	},
	{
		id: 'pub-020',
		title: 'Value Sensitive Design and Information Systems',
		year: 2003,
		venue: 'Human-Computer Interaction in Management Information Systems',
		authors: [
			{ id: 'friedman', name: 'Batya Friedman' },
			{ id: 'kahn', name: 'Peter H. Kahn' },
			{ id: 'borning', name: 'Alan Borning' }
		],
		categories: ['hci', 'feminist-hci'],
		keywords: ['value sensitive design', 'ethics', 'values', 'information systems'],
		abstract: 'Presents value sensitive design as a method for integrating human values into technology.'
	},
	{
		id: 'pub-021',
		title: 'Tangible Bits: Towards Seamless Interfaces between People, Bits and Atoms',
		year: 1997,
		venue: 'CHI',
		authors: [
			{ id: 'ishii', name: 'Hiroshi Ishii' },
			{ id: 'ullmer', name: 'Brygg Ullmer' }
		],
		categories: ['hci'],
		keywords: ['tangible interfaces', 'physical computing', 'embodied interaction'],
		abstract: 'Introduces tangible user interfaces that couple digital information with physical objects.'
	},
	{
		id: 'pub-022',
		title: 'Sketching User Experiences: Getting the Design Right and the Right Design',
		year: 2007,
		venue: 'Morgan Kaufmann',
		authors: [{ id: 'buxton', name: 'Bill Buxton' }],
		categories: ['hci'],
		keywords: ['sketching', 'prototyping', 'design process', 'ideation'],
		abstract: 'Explores sketching as a tool for ideation and design in interaction design.'
	},
	{
		id: 'pub-023',
		title: 'Beyond Being There',
		year: 1992,
		venue: 'CHI',
		authors: [
			{ id: 'hollan', name: 'Jim Hollan' },
			{ id: 'stornetta', name: 'Scott Stornetta' }
		],
		categories: ['hci'],
		keywords: ['communication', 'CSCW', 'presence', 'mediated interaction'],
		abstract: 'Argues that technology should not merely simulate face-to-face interaction but surpass it.'
	},
	{
		id: 'pub-024',
		title: 'Situated Action: A Critique and Response',
		year: 1993,
		venue: 'Cognitive Science',
		authors: [{ id: 'vera', name: 'Alonso Vera' }, { id: 'simon', name: 'Herbert Simon' }],
		categories: ['hci'],
		keywords: ['situated action', 'cognition', 'plans', 'behavior'],
		abstract: 'Responds to situated action theory from a cognitive science perspective.'
	},
	{
		id: 'pub-025',
		title: 'Understanding Computers and Cognition',
		year: 1986,
		venue: 'Ablex Publishing',
		authors: [
			{ id: 'winograd', name: 'Terry Winograd' },
			{ id: 'flores', name: 'Fernando Flores' }
		],
		categories: ['hci'],
		keywords: ['cognition', 'language', 'design', 'breakdown', 'embodiment'],
		abstract: 'Applies Heideggerian philosophy to computing and design.'
	},
	{
		id: 'pub-026',
		title: 'Fitts\' Law as a Research and Design Tool in Human-Computer Interaction',
		year: 1992,
		venue: 'Human-Computer Interaction',
		authors: [{ id: 'mackenzie', name: 'I. Scott MacKenzie' }],
		categories: ['hci'],
		keywords: ["Fitts' law", 'pointing', 'motor control', 'interface design'],
		abstract: "Reviews the application of Fitts' law in HCI research and design."
	},
	{
		id: 'pub-027',
		title: 'Attention and Performance in WIMP Interfaces',
		year: 2001,
		venue: 'UIST',
		authors: [
			{ id: 'baudisch', name: 'Patrick Baudisch' },
			{ id: 'good', name: 'Nathaniel Good' }
		],
		categories: ['hci'],
		keywords: ['attention', 'WIMP', 'focus+context', 'peripheral displays'],
		abstract: 'Studies how visual attention is managed in window-based interfaces.'
	},
	{
		id: 'pub-028',
		title: 'Making Technology Visible: Literacy and Critical Technical Practice',
		year: 2013,
		venue: 'Interactions',
		authors: [{ id: 'disalvo', name: 'Carl DiSalvo' }],
		categories: ['hci'],
		keywords: ['critical design', 'technology', 'literacy', 'public'],
		abstract: 'Argues for making technology visible as a form of critical HCI practice.'
	},

	// --- Decision Making ---
	{
		id: 'pub-029',
		title: 'Prospect Theory: An Analysis of Decision under Risk',
		year: 1979,
		venue: 'Econometrica',
		authors: [
			{ id: 'kahneman', name: 'Daniel Kahneman' },
			{ id: 'tversky', name: 'Amos Tversky' }
		],
		categories: ['decision-making', 'behavioral-economics', 'jdm'],
		keywords: ['prospect theory', 'risk', 'loss aversion', 'utility'],
		abstract: 'Introduces prospect theory as an alternative to expected utility theory for risky choice.'
	},
	{
		id: 'pub-030',
		title: 'Judgment Under Uncertainty: Heuristics and Biases',
		year: 1974,
		venue: 'Science',
		authors: [
			{ id: 'tversky2', name: 'Amos Tversky' },
			{ id: 'kahneman2', name: 'Daniel Kahneman' }
		],
		categories: ['decision-making', 'cognitive-bias', 'jdm'],
		keywords: ['heuristics', 'biases', 'availability', 'representativeness', 'anchoring'],
		abstract: 'Describes cognitive heuristics and the systematic biases they produce in judgment.'
	},
	{
		id: 'pub-031',
		title: 'Nudge: Improving Decisions about Health, Wealth, and Happiness',
		year: 2008,
		venue: 'Yale University Press',
		authors: [
			{ id: 'thaler', name: 'Richard Thaler' },
			{ id: 'sunstein', name: 'Cass Sunstein' }
		],
		categories: ['decision-making', 'behavioral-economics'],
		keywords: ['nudge', 'choice architecture', 'libertarian paternalism', 'defaults'],
		abstract: 'Introduces nudge theory and how choice architecture influences decisions.'
	},
	{
		id: 'pub-032',
		title: 'How Visualization Can Foster Decision Support',
		year: 2010,
		venue: 'Workshop on Scalable Decision Making: Uncertainty, Technology, and Data',
		authors: [{ id: 'dimara', name: 'Evanthia Dimara' }],
		categories: ['decision-making', 'infovis'],
		keywords: ['decision support', 'visualization', 'uncertainty', 'trust'],
		abstract: 'Explores how visualization can be designed to better support human decision-making.'
	},
	{
		id: 'pub-033',
		title: 'The Paradox of Choice: Why More Is Less',
		year: 2004,
		venue: 'Harper Collins',
		authors: [{ id: 'schwartz', name: 'Barry Schwartz' }],
		categories: ['decision-making', 'jdm'],
		keywords: ['choice overload', 'autonomy', 'decision fatigue', 'satisfaction'],
		abstract: 'Argues that excessive choice can lead to decision paralysis and reduced satisfaction.'
	},
	{
		id: 'pub-034',
		title: 'Thinking, Fast and Slow',
		year: 2011,
		venue: 'Farrar, Straus and Giroux',
		authors: [{ id: 'kahneman3', name: 'Daniel Kahneman' }],
		categories: ['decision-making', 'cognitive-bias', 'jdm'],
		keywords: ['system 1', 'system 2', 'dual process', 'heuristics', 'biases'],
		abstract: 'Summarizes decades of research on the two systems of thinking and their implications.'
	},
	{
		id: 'pub-035',
		title: 'The Framing of Decisions and the Psychology of Choice',
		year: 1981,
		venue: 'Science',
		authors: [
			{ id: 'tversky3', name: 'Amos Tversky' },
			{ id: 'kahneman4', name: 'Daniel Kahneman' }
		],
		categories: ['decision-making', 'cognitive-bias', 'jdm'],
		keywords: ['framing effect', 'choice', 'psychology', 'reference dependence'],
		abstract: 'Demonstrates that decision outcomes depend on how choices are framed.'
	},
	{
		id: 'pub-036',
		title: 'Naturalistic Decision Making',
		year: 1993,
		venue: 'Lawrence Erlbaum',
		authors: [{ id: 'klein', name: 'Gary Klein' }],
		categories: ['decision-making'],
		keywords: ['naturalistic decision making', 'recognition-primed', 'expertise', 'real-world'],
		abstract: 'Studies how experts make decisions in complex, real-world environments.'
	},
	{
		id: 'pub-037',
		title: 'Decision Making: A Psychological Analysis of Conflict, Choice, and Commitment',
		year: 1977,
		venue: 'Free Press',
		authors: [
			{ id: 'janis', name: 'Irving Janis' },
			{ id: 'mann', name: 'Leon Mann' }
		],
		categories: ['decision-making'],
		keywords: ['conflict', 'commitment', 'bolstering', 'vigilance', 'coping'],
		abstract: 'Analyzes decision-making as a process of managing decisional conflict.'
	},
	{
		id: 'pub-038',
		title: 'Visualization for Decision Support: Challenges and Opportunities',
		year: 2019,
		venue: 'Information Visualization',
		authors: [
			{ id: 'dimara2', name: 'Evanthia Dimara' },
			{ id: 'staab', name: 'Steffen Staab' }
		],
		categories: ['decision-making', 'infovis'],
		keywords: ['decision support', 'visualization', 'design', 'evaluation'],
		abstract: 'Reviews challenges and opportunities in designing visualizations to support decisions.'
	},

	// --- Explainable AI ---
	{
		id: 'pub-039',
		title: '"Why Should I Trust You?": Explaining the Predictions of Any Classifier',
		year: 2016,
		venue: 'KDD',
		authors: [
			{ id: 'ribeiro', name: 'Marco Tulio Ribeiro' },
			{ id: 'singh', name: 'Sameer Singh' },
			{ id: 'guestrin', name: 'Carlos Guestrin' }
		],
		categories: ['xai'],
		keywords: ['LIME', 'local explanations', 'interpretability', 'machine learning'],
		abstract: 'Introduces LIME, a technique for explaining predictions of any black-box classifier locally.'
	},
	{
		id: 'pub-040',
		title: 'A Unified Approach to Interpreting Model Predictions',
		year: 2017,
		venue: 'NeurIPS',
		authors: [
			{ id: 'lundberg', name: 'Scott M. Lundberg' },
			{ id: 'lee', name: 'Su-In Lee' }
		],
		categories: ['xai'],
		keywords: ['SHAP', 'Shapley values', 'feature importance', 'interpretability'],
		abstract: 'Introduces SHAP values using game-theoretic Shapley values for model explanation.'
	},
	{
		id: 'pub-041',
		title: 'Peeking Inside the Black Box: Visualizing Statistical Learning with Plots',
		year: 2001,
		venue: 'Journal of Computational and Graphical Statistics',
		authors: [{ id: 'friedman2', name: 'Jerome Friedman' }],
		categories: ['xai', 'infovis'],
		keywords: ['partial dependence plots', 'statistical learning', 'visualization', 'interpretability'],
		abstract: 'Introduces partial dependence plots for visualizing effects in statistical models.'
	},
	{
		id: 'pub-042',
		title: 'Explainability Fact Sheets: A Framework for Systematic Assessment of Explainable AI',
		year: 2020,
		venue: 'FAccT',
		authors: [
			{ id: 'sokol', name: 'Kacper Sokol' },
			{ id: 'flach', name: 'Peter Flach' }
		],
		categories: ['xai'],
		keywords: ['explainability', 'assessment', 'framework', 'accountability'],
		abstract: 'Provides a structured framework for assessing explainable AI methods.'
	},
	{
		id: 'pub-043',
		title: 'Towards a Rigorous Science of Interpretable Machine Learning',
		year: 2017,
		venue: 'arXiv',
		authors: [{ id: 'doshi-velez', name: 'Finale Doshi-Velez' }, { id: 'kim', name: 'Been Kim' }],
		categories: ['xai'],
		keywords: ['interpretability', 'evaluation', 'machine learning', 'science'],
		abstract: 'Argues for rigorous evaluation criteria in interpretable machine learning research.'
	},
	{
		id: 'pub-044',
		title: 'Explanation in Artificial Intelligence: Insights from the Social Sciences',
		year: 2019,
		venue: 'Artificial Intelligence',
		authors: [{ id: 'miller', name: 'Tim Miller' }],
		categories: ['xai', 'hci'],
		keywords: ['explanation', 'social science', 'philosophy', 'contrastive'],
		abstract: 'Reviews insights from social sciences on human explanation and applies them to XAI.'
	},
	{
		id: 'pub-045',
		title: 'Manipulating and Measuring Model Interpretability',
		year: 2021,
		venue: 'CHI',
		authors: [
			{ id: 'poursabzi', name: 'Forough Poursabzi-Sangdeh' },
			{ id: 'goldstein', name: 'Daniel G. Goldstein' },
			{ id: 'hofman', name: 'Jake M. Hofman' },
			{ id: 'vaughan', name: 'Jennifer Wortman Vaughan' },
			{ id: 'wallach', name: 'Hanna Wallach' }
		],
		categories: ['xai', 'hci', 'decision-making'],
		keywords: ['interpretability', 'experiment', 'trust', 'model complexity'],
		abstract: 'Empirically studies how model interpretability affects human decision-making with AI.'
	},
	{
		id: 'pub-046',
		title: 'Human-Centered Explainable AI: Towards a Reflective Sociotechnical Approach',
		year: 2020,
		venue: 'HCXAI Workshop at CHI',
		authors: [
			{ id: 'ehsan', name: 'Upol Ehsan' },
			{ id: 'riedl', name: 'Mark O. Riedl' }
		],
		categories: ['xai', 'hci'],
		keywords: ['human-centered XAI', 'sociotechnical', 'reflection', 'design'],
		abstract: 'Advocates for human-centered approaches in XAI design and evaluation.'
	},
	{
		id: 'pub-047',
		title: 'Attention Is Not Explanation',
		year: 2019,
		venue: 'NAACL',
		authors: [
			{ id: 'jain', name: 'Sarthak Jain' },
			{ id: 'wallace', name: 'Byron C. Wallace' }
		],
		categories: ['xai'],
		keywords: ['attention', 'NLP', 'explanation', 'faithfulness'],
		abstract: 'Challenges the use of attention weights as explanations in neural models.'
	},
	{
		id: 'pub-048',
		title: 'The Mythos of Model Interpretability',
		year: 2018,
		venue: 'ACM Queue',
		authors: [{ id: 'lipton', name: 'Zachary C. Lipton' }],
		categories: ['xai'],
		keywords: ['interpretability', 'transparency', 'post-hoc', 'accountability'],
		abstract: 'Critically examines varying definitions and desiderata for model interpretability.'
	},
	{
		id: 'pub-049',
		title: 'How do Humans Understand Explanations from Machine Learning Systems? An Evaluation of the Human-Interpretability of Explanation',
		year: 2018,
		venue: 'arXiv',
		authors: [{ id: 'narayanan', name: 'Menaka Narayanan' }],
		categories: ['xai', 'hci'],
		keywords: ['human interpretability', 'evaluation', 'feature importance', 'user study'],
		abstract: 'Evaluates how humans understand different styles of machine learning explanations.'
	},
	{
		id: 'pub-050',
		title: 'Fooling LIME and SHAP: Adversarial Attacks on Post hoc Explanation Methods',
		year: 2019,
		venue: 'AIES',
		authors: [
			{ id: 'slack', name: 'Dylan Slack' },
			{ id: 'hilgard', name: 'Sophie Hilgard' },
			{ id: 'jia', name: 'Emily Jia' },
			{ id: 'singh2', name: 'Sameer Singh' },
			{ id: 'lakkaraju', name: 'Himabindu Lakkaraju' }
		],
		categories: ['xai'],
		keywords: ['adversarial', 'LIME', 'SHAP', 'robustness', 'manipulation'],
		abstract: 'Demonstrates that LIME and SHAP explanations can be manipulated through adversarial attacks.'
	},

	// --- Cognitive Bias ---
	{
		id: 'pub-051',
		title: 'Cognitive Biases in Visualizations',
		year: 2018,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'wall', name: 'Emily Wall' },
			{ id: 'stasko2', name: 'John Stasko' },
			{ id: 'endert2', name: 'Alex Endert' }
		],
		categories: ['cognitive-bias', 'infovis'],
		keywords: ['cognitive bias', 'visualization', 'anchoring', 'confirmation bias'],
		abstract: 'Identifies and categorizes cognitive biases that arise specifically in visualization use.'
	},
	{
		id: 'pub-052',
		title: 'Confirmation Bias: A Ubiquitous Phenomenon in Many Guises',
		year: 1998,
		venue: 'Review of General Psychology',
		authors: [{ id: 'nickerson', name: 'Raymond Nickerson' }],
		categories: ['cognitive-bias', 'jdm'],
		keywords: ['confirmation bias', 'motivated reasoning', 'belief perseverance'],
		abstract: 'Comprehensive review of confirmation bias manifestations across many domains.'
	},
	{
		id: 'pub-053',
		title: 'The Curse of Knowledge in Reasoning About Mental States',
		year: 1989,
		venue: 'Cognitive Psychology',
		authors: [
			{ id: 'camerer', name: 'Colin Camerer' },
			{ id: 'loewenstein', name: 'George Loewenstein' },
			{ id: 'weber', name: 'Martin Weber' }
		],
		categories: ['cognitive-bias', 'jdm'],
		keywords: ['curse of knowledge', 'anchoring', 'mental states', 'expertise'],
		abstract: 'Demonstrates how knowledge of an answer biases reasoning about others\' mental states.'
	},
	{
		id: 'pub-054',
		title: 'Debiasing',
		year: 1982,
		venue: 'Judgment Under Uncertainty: Heuristics and Biases',
		authors: [
			{ id: 'fischhoff', name: 'Baruch Fischhoff' }
		],
		categories: ['cognitive-bias', 'jdm'],
		keywords: ['debiasing', 'calibration', 'training', 'feedback'],
		abstract: 'Reviews strategies for reducing cognitive biases in judgment and decision making.'
	},
	{
		id: 'pub-055',
		title: 'The Hindsight Bias: A Meta-Analysis',
		year: 1996,
		venue: 'Organizational Behavior and Human Decision Processes',
		authors: [
			{ id: 'christensen-szalanski', name: 'Jay Christensen-Szalanski' },
			{ id: 'fobian-willham', name: 'Cynthia Fobian Willham' }
		],
		categories: ['cognitive-bias', 'jdm'],
		keywords: ['hindsight bias', 'meta-analysis', 'creeping determinism'],
		abstract: 'Meta-analysis of hindsight bias studies, examining moderating factors.'
	},
	{
		id: 'pub-056',
		title: 'Overconfidence in Case-Study Judgments',
		year: 1977,
		venue: 'Organizational Behavior and Human Performance',
		authors: [
			{ id: 'fischhoff2', name: 'Baruch Fischhoff' },
			{ id: 'slovic', name: 'Paul Slovic' },
			{ id: 'lichtenstein', name: 'Sarah Lichtenstein' }
		],
		categories: ['cognitive-bias', 'jdm'],
		keywords: ['overconfidence', 'calibration', 'probability', 'expertise'],
		abstract: 'Studies overconfidence bias in probability judgments across expert populations.'
	},
	{
		id: 'pub-057',
		title: 'The Availability Heuristic in Judgments of Frequency and Probability',
		year: 1973,
		venue: 'Cognitive Psychology',
		authors: [
			{ id: 'tversky4', name: 'Amos Tversky' },
			{ id: 'kahneman5', name: 'Daniel Kahneman' }
		],
		categories: ['cognitive-bias', 'jdm'],
		keywords: ['availability heuristic', 'frequency', 'probability', 'memory'],
		abstract: 'Describes the availability heuristic and how it leads to systematic biases in frequency estimates.'
	},
	{
		id: 'pub-058',
		title: 'Anchoring and Adjustment: Experimental Evidence',
		year: 2003,
		venue: 'Journal of Economic Psychology',
		authors: [
			{ id: 'epley', name: 'Nicholas Epley' },
			{ id: 'gilovich', name: 'Thomas Gilovich' }
		],
		categories: ['cognitive-bias', 'jdm'],
		keywords: ['anchoring', 'adjustment', 'insufficient adjustment', 'numeric judgment'],
		abstract: 'Explores when people anchor-and-adjust and why adjustment is typically insufficient.'
	},
	{
		id: 'pub-059',
		title: 'Equipped for the Future: Mitigating Bias and Discrimination in Visualization',
		year: 2020,
		venue: 'CHI',
		authors: [
			{ id: 'boy2', name: 'Jeremy Boy' }
		],
		categories: ['cognitive-bias', 'infovis'],
		keywords: ['bias', 'discrimination', 'visualization', 'equity'],
		abstract: 'Examines how visualization can perpetuate or mitigate social and cognitive biases.'
	},
	{
		id: 'pub-060',
		title: 'Watching Analysts Work: How Cognitive Biases Impact Analytic Workflows',
		year: 2018,
		venue: 'IEEE VAST',
		authors: [
			{ id: 'wall2', name: 'Emily Wall' },
			{ id: 'blaha', name: 'Leslie M. Blaha' },
			{ id: 'paul', name: 'Lisa Paul' },
			{ id: 'endert3', name: 'Alex Endert' }
		],
		categories: ['cognitive-bias', 'infovis'],
		keywords: ['analyst bias', 'sensemaking', 'visual analytics', 'workflow'],
		abstract: 'Observational study of how cognitive biases affect visual analytic workflows.'
	},

	// --- Feminist HCI ---
	{
		id: 'pub-061',
		title: 'Feminist HCI: Taking Stock and Outlining an Agenda for Design',
		year: 2010,
		venue: 'CHI',
		authors: [
			{ id: 'bardzell', name: 'Shaowen Bardzell' }
		],
		categories: ['feminist-hci', 'hci'],
		keywords: ['feminist HCI', 'gender', 'design', 'values'],
		abstract: 'Defines feminist HCI and outlines a design agenda grounded in feminist theory.'
	},
	{
		id: 'pub-062',
		title: 'Toward a Feminist HCI Methodology: Social Science, Feminism, and HCI',
		year: 2011,
		venue: 'CHI',
		authors: [
			{ id: 'bardzell2', name: 'Shaowen Bardzell' },
			{ id: 'bardzell3', name: 'Jeffrey Bardzell' }
		],
		categories: ['feminist-hci', 'hci'],
		keywords: ['feminist methodology', 'social science', 'participatory design'],
		abstract: 'Bridges feminist methodology with HCI research practice.'
	},
	{
		id: 'pub-063',
		title: 'Data Feminism',
		year: 2020,
		venue: 'MIT Press',
		authors: [
			{ id: 'dIgnazio', name: "Catherine D'Ignazio" },
			{ id: 'klein', name: 'Lauren F. Klein' }
		],
		categories: ['feminist-hci', 'infovis'],
		keywords: ['data feminism', 'power', 'intersectionality', 'visualization'],
		abstract: 'Examines how data and visualization encode power relations and proposes feminist alternatives.'
	},
	{
		id: 'pub-064',
		title: 'Situated Knowledges: The Science Question in Feminism and the Privilege of Partial Perspective',
		year: 1988,
		venue: 'Feminist Studies',
		authors: [{ id: 'haraway', name: 'Donna Haraway' }],
		categories: ['feminist-hci'],
		keywords: ['situated knowledge', 'objectivity', 'partial perspective', 'science studies'],
		abstract: 'Argues that all knowledge is situated and that objectivity requires acknowledging position.'
	},
	{
		id: 'pub-065',
		title: 'Algorithms of Oppression: How Search Engines Reinforce Racism',
		year: 2018,
		venue: 'NYU Press',
		authors: [{ id: 'noble', name: 'Safiya Umoja Noble' }],
		categories: ['feminist-hci'],
		keywords: ['algorithms', 'racism', 'sexism', 'search engines', 'oppression'],
		abstract: 'Analyzes how commercial search algorithms perpetuate racial and gender biases.'
	},
	{
		id: 'pub-066',
		title: 'When the Implication Is Not to Design (Technology)',
		year: 2018,
		venue: 'CHI',
		authors: [
			{ id: 'baumer', name: 'Eric P.S. Baumer' },
			{ id: 'silberman', name: 'M. Six Silberman' }
		],
		categories: ['feminist-hci', 'hci'],
		keywords: ['non-design', 'critical computing', 'refusal', 'ethics'],
		abstract: 'Questions when technology design is the appropriate response to social problems.'
	},
	{
		id: 'pub-067',
		title: 'Intersectionality as a Conceptual Tool for Design',
		year: 2020,
		venue: 'DIS',
		authors: [
			{ id: 'schlesinger', name: 'Ari Schlesinger' },
			{ id: 'edwards', name: 'W. Keith Edwards' },
			{ id: 'grinter', name: 'Rebecca E. Grinter' }
		],
		categories: ['feminist-hci', 'hci'],
		keywords: ['intersectionality', 'identity', 'design', 'marginalisation'],
		abstract: 'Applies intersectionality theory as a conceptual lens in interaction design.'
	},
	{
		id: 'pub-068',
		title: 'Envisioning Cards',
		year: 2012,
		venue: 'CHI',
		authors: [
			{ id: 'friedman2b', name: 'Batya Friedman' },
			{ id: 'hendry', name: 'David G. Hendry' }
		],
		categories: ['feminist-hci', 'hci'],
		keywords: ['value sensitive design', 'envisioning', 'design cards', 'stakeholders'],
		abstract: 'Presents envisioning cards as tools for value sensitive design practice.'
	},

	// --- Behavioral Economics ---
	{
		id: 'pub-069',
		title: 'Anomalies: The Endowment Effect, Loss Aversion, and Status Quo Bias',
		year: 1991,
		venue: 'Journal of Economic Perspectives',
		authors: [
			{ id: 'kahneman6', name: 'Daniel Kahneman' },
			{ id: 'knetsch', name: 'Jack L. Knetsch' },
			{ id: 'thaler2', name: 'Richard Thaler' }
		],
		categories: ['behavioral-economics', 'jdm'],
		keywords: ['endowment effect', 'loss aversion', 'status quo bias', 'WTP'],
		abstract: 'Documents the endowment effect, loss aversion, and status quo bias as economic anomalies.'
	},
	{
		id: 'pub-070',
		title: 'Mental Accounting Matters',
		year: 1999,
		venue: 'Journal of Behavioral Decision Making',
		authors: [{ id: 'thaler3', name: 'Richard Thaler' }],
		categories: ['behavioral-economics', 'jdm'],
		keywords: ['mental accounting', 'framing', 'transaction utility', 'budgeting'],
		abstract: 'Describes mental accounting and how people organize and evaluate financial transactions.'
	},
	{
		id: 'pub-071',
		title: 'A Survey of Behavioral Finance',
		year: 2003,
		venue: 'Handbook of the Economics of Finance',
		authors: [
			{ id: 'barberis', name: 'Nicholas Barberis' },
			{ id: 'thaler4', name: 'Richard Thaler' }
		],
		categories: ['behavioral-economics'],
		keywords: ['behavioral finance', 'survey', 'limits to arbitrage', 'investor psychology'],
		abstract: 'Surveys the field of behavioral finance covering limits to arbitrage and investor psychology.'
	},
	{
		id: 'pub-072',
		title: 'Libertarian Paternalism Is Not an Oxymoron',
		year: 2003,
		venue: 'University of Chicago Law Review',
		authors: [
			{ id: 'sunstein2', name: 'Cass Sunstein' },
			{ id: 'thaler5', name: 'Richard Thaler' }
		],
		categories: ['behavioral-economics', 'decision-making'],
		keywords: ['libertarian paternalism', 'defaults', 'choice architecture', 'welfare'],
		abstract: 'Argues for a libertarian paternalist approach to policy based on behavioral findings.'
	},
	{
		id: 'pub-073',
		title: 'Misbehaving: The Making of Behavioral Economics',
		year: 2015,
		venue: 'Norton',
		authors: [{ id: 'thaler6', name: 'Richard Thaler' }],
		categories: ['behavioral-economics'],
		keywords: ['behavioral economics', 'history', 'econs vs. humans', 'policy'],
		abstract: 'Personal account of how behavioral economics challenged mainstream economics.'
	},
	{
		id: 'pub-074',
		title: 'Irrational Exuberance',
		year: 2000,
		venue: 'Princeton University Press',
		authors: [{ id: 'shiller', name: 'Robert Shiller' }],
		categories: ['behavioral-economics'],
		keywords: ['stock market', 'irrationality', 'bubbles', 'animal spirits'],
		abstract: 'Analyzes irrational behavior in stock markets and argues against efficient market hypothesis.'
	},
	{
		id: 'pub-075',
		title: 'Save More Tomorrow: Using Behavioral Economics to Increase Employee Saving',
		year: 2004,
		venue: 'Journal of Political Economy',
		authors: [
			{ id: 'thaler7', name: 'Richard Thaler' },
			{ id: 'benartzi', name: 'Shlomo Benartzi' }
		],
		categories: ['behavioral-economics', 'decision-making'],
		keywords: ['saving', 'default', 'procrastination', 'commitment device'],
		abstract: 'Proposes SMarT program using behavioral principles to increase employee retirement savings.'
	},
	{
		id: 'pub-076',
		title: 'The Winner\'s Curse: Paradoxes and Anomalies of Economic Life',
		year: 1992,
		venue: 'Free Press',
		authors: [{ id: 'thaler8', name: 'Richard Thaler' }],
		categories: ['behavioral-economics', 'jdm'],
		keywords: ["winner's curse", 'anomalies', 'cooperation', 'auction', 'fairness'],
		abstract: 'Collects economic anomalies that challenge the rational actor model.'
	},

	// --- Judgment and Decision Making ---
	{
		id: 'pub-077',
		title: 'The Construction of Preference',
		year: 1992,
		venue: 'American Psychologist',
		authors: [
			{ id: 'slovic2', name: 'Paul Slovic' }
		],
		categories: ['jdm', 'decision-making'],
		keywords: ['preference construction', 'context-dependence', 'choice', 'values'],
		abstract: 'Argues that preferences are not discovered but constructed during the decision process.'
	},
	{
		id: 'pub-078',
		title: 'Regret Theory: An Alternative Theory of Rational Choice Under Uncertainty',
		year: 1982,
		venue: 'Economic Journal',
		authors: [
			{ id: 'loomes', name: 'Graham Loomes' },
			{ id: 'sugden', name: 'Robert Sugden' }
		],
		categories: ['jdm', 'decision-making'],
		keywords: ['regret theory', 'anticipated regret', 'choice', 'utility'],
		abstract: 'Introduces regret theory as an alternative to expected utility for choice under uncertainty.'
	},
	{
		id: 'pub-079',
		title: 'Decision by Sampling',
		year: 2006,
		venue: 'Cognitive Psychology',
		authors: [
			{ id: 'stewart', name: 'Neil Stewart' },
			{ id: 'chater', name: 'Nick Chater' },
			{ id: 'brown', name: 'Gordon D. A. Brown' }
		],
		categories: ['jdm'],
		keywords: ['decision by sampling', 'ordinal utility', 'frequency', 'context effects'],
		abstract: 'Proposes that utility is derived by sampling comparisons from memory.'
	},
	{
		id: 'pub-080',
		title: 'Multiple Criteria Decision Analysis: State of the Art Surveys',
		year: 2005,
		venue: 'Springer',
		authors: [
			{ id: 'figueira', name: 'José Figueira' },
			{ id: 'greco', name: 'Salvatore Greco' },
			{ id: 'ehrgott', name: 'Matthias Ehrgott' }
		],
		categories: ['jdm', 'decision-making'],
		keywords: ['MCDA', 'multi-criteria', 'ELECTRE', 'TOPSIS', 'outranking'],
		abstract: 'Comprehensive survey of multiple criteria decision analysis methods and applications.'
	},
	{
		id: 'pub-081',
		title: 'Choices, Values, and Frames',
		year: 1984,
		venue: 'American Psychologist',
		authors: [
			{ id: 'kahneman7', name: 'Daniel Kahneman' },
			{ id: 'tversky5', name: 'Amos Tversky' }
		],
		categories: ['jdm', 'decision-making', 'cognitive-bias'],
		keywords: ['framing', 'prospect theory', 'values', 'choices'],
		abstract: 'Reviews prospect theory and its implications for choices and value judgments.'
	},
	{
		id: 'pub-082',
		title: 'The Affect Heuristic in Judgments of Risks and Benefits',
		year: 2000,
		venue: 'Psychological Science',
		authors: [
			{ id: 'finucane', name: 'Melissa Finucane' },
			{ id: 'alhakami', name: 'Ali Alhakami' },
			{ id: 'slovic3', name: 'Paul Slovic' },
			{ id: 'johnson', name: 'Stephen Johnson' }
		],
		categories: ['jdm', 'cognitive-bias'],
		keywords: ['affect heuristic', 'risk', 'benefit', 'feelings'],
		abstract: 'Demonstrates that affect influences risk-benefit judgments in a systematic way.'
	},
	{
		id: 'pub-083',
		title: 'Ambiguity Aversion and Comparative Ignorance',
		year: 1995,
		venue: 'Quarterly Journal of Economics',
		authors: [
			{ id: 'fox', name: 'Craig R. Fox' },
			{ id: 'tversky6', name: 'Amos Tversky' }
		],
		categories: ['jdm', 'decision-making'],
		keywords: ['ambiguity aversion', 'comparative ignorance', 'Ellsberg paradox'],
		abstract: 'Shows that ambiguity aversion depends on comparisons with more knowledgeable others.'
	},
	{
		id: 'pub-084',
		title: 'Intuitions About Combining Opinions: Misappreciation of the Averaging Principle',
		year: 1990,
		venue: 'Organizational Behavior and Human Decision Processes',
		authors: [
			{ id: 'soll', name: 'Jack B. Soll' },
			{ id: 'klayman', name: 'Josh Klayman' }
		],
		categories: ['jdm'],
		keywords: ['combining opinions', 'averaging', 'wisdom of crowds', 'aggregation'],
		abstract: 'Studies how people fail to appreciate statistical benefits of combining judgments.'
	},

	// --- Cross-domain: Vis + Decision Making ---
	{
		id: 'pub-085',
		title: 'A Task-Based Taxonomy of Cognitive Biases for Information Visualization',
		year: 2019,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'dimara3', name: 'Evanthia Dimara' },
			{ id: 'franconeri', name: 'Steven Franconeri' },
			{ id: 'plaisant', name: 'Catherine Plaisant' },
			{ id: 'bezerianos', name: 'Anastasia Bezerianos' },
			{ id: 'dragicevic', name: 'Pierre Dragicevic' }
		],
		categories: ['infovis', 'cognitive-bias', 'decision-making'],
		keywords: ['cognitive bias', 'taxonomy', 'visualization tasks', 'information processing'],
		doi: '10.1109/TVCG.2018.2872577',
		abstract:
			'Proposes a task-based taxonomy of cognitive biases to guide bias-aware visualization design.'
	},
	{
		id: 'pub-086',
		title: 'The Attraction Effect in Information Visualization',
		year: 2017,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'dimara4', name: 'Evanthia Dimara' },
			{ id: 'bezerianos2', name: 'Anastasia Bezerianos' },
			{ id: 'dragicevic2', name: 'Pierre Dragicevic' }
		],
		categories: ['infovis', 'cognitive-bias', 'decision-making'],
		keywords: ['attraction effect', 'decoy effect', 'scatterplots', 'decision making'],
		doi: '10.1109/TVCG.2016.2598594',
		abstract: 'First study of the attraction effect (decoy effect) in the context of information visualization.'
	},
	{
		id: 'pub-087',
		title: 'Mitigating the Attraction Effect with Visualizations',
		year: 2019,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'dimara5', name: 'Evanthia Dimara' },
			{ id: 'bezerianos3', name: 'Anastasia Bezerianos' },
			{ id: 'dragicevic3', name: 'Pierre Dragicevic' }
		],
		categories: ['infovis', 'cognitive-bias', 'decision-making'],
		keywords: ['attraction effect', 'debiasing', 'visualization design', 'nudging'],
		doi: '10.1109/TVCG.2018.2865233',
		abstract: 'Investigates visualization designs that can mitigate the attraction effect in multi-attribute decision making.'
	},
	{
		id: 'pub-088',
		title: 'An Interaction Model for Visualizations Beyond the Desktop',
		year: 2017,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'dimara6', name: 'Evanthia Dimara' },
			{ id: 'dragicevic4', name: 'Pierre Dragicevic' }
		],
		categories: ['infovis', 'hci'],
		keywords: ['interaction model', 'beyond desktop', 'AR', 'VR', 'visualization'],
		abstract: 'Proposes an extended interaction model for visualizations deployed in non-desktop environments.'
	},
	{
		id: 'pub-089',
		title: 'What is Interaction for Data Visualization?',
		year: 2020,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'dimara7', name: 'Evanthia Dimara' },
			{ id: 'perin', name: 'Charles Perin' }
		],
		categories: ['infovis', 'hci'],
		keywords: ['interaction', 'definition', 'framework', 'data visualization'],
		doi: '10.1109/TVCG.2019.2934283',
		abstract: 'Provides a precise definition of interaction in data visualization based on a systematic analysis.'
	},
	{
		id: 'pub-090',
		title: 'Stencil-Based Pattern Overlays for Enhanced Scatterplot Visualization',
		year: 2013,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'fuchs', name: 'Johannes Fuchs' },
			{ id: 'isenberg', name: 'Petra Isenberg' }
		],
		categories: ['infovis'],
		keywords: ['scatterplot', 'pattern overlay', 'stencil', 'visual clutter'],
		abstract: 'Introduces stencil-based overlays to reduce overplotting in dense scatterplots.'
	},

	// --- More cross-domain entries ---
	{
		id: 'pub-091',
		title: 'Bias and Fairness in AI: A Survey',
		year: 2021,
		venue: 'ACM Computing Surveys',
		authors: [
			{ id: 'mehrabi', name: 'Ninareh Mehrabi' },
			{ id: 'morstatter', name: 'Fred Morstatter' }
		],
		categories: ['xai', 'cognitive-bias'],
		keywords: ['algorithmic fairness', 'bias', 'machine learning', 'survey'],
		abstract: 'Comprehensive survey of bias and fairness definitions and mitigation methods in AI.'
	},
	{
		id: 'pub-092',
		title: 'Uncertainty Visualization by Example',
		year: 2021,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'padilla', name: 'Lace Padilla' },
			{ id: 'kay', name: 'Matthew Kay' }
		],
		categories: ['infovis', 'decision-making'],
		keywords: ['uncertainty', 'visualization', 'hypothetical outcome plots', 'communication'],
		abstract: 'Reviews techniques for uncertainty visualization with examples and design guidelines.'
	},
	{
		id: 'pub-093',
		title: 'Hypothetical Outcome Plots Outperform Error Bars and Violin Plots for Inferences About Reliability of Variable Ordering',
		year: 2015,
		venue: 'PLOS ONE',
		authors: [
			{ id: 'hullman', name: 'Jessica Hullman' },
			{ id: 'resnick', name: 'Paul Resnick' },
			{ id: 'adar', name: 'Eytan Adar' }
		],
		categories: ['infovis', 'decision-making'],
		keywords: ['HOPs', 'uncertainty', 'animation', 'statistical inference'],
		abstract: 'Shows that animated hypothetical outcome plots improve uncertainty communication over static plots.'
	},
	{
		id: 'pub-094',
		title: 'Toward Visualization for Games: Theory, Design Space, and Patterns',
		year: 2016,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'bowman', name: 'Doug Bowman' }
		],
		categories: ['infovis'],
		keywords: ['games', 'visualization', 'design patterns', 'theory'],
		abstract: 'Surveys visualization methods applied in game contexts and proposes design patterns.'
	},
	{
		id: 'pub-095',
		title: 'Trust in AutomationDesigning for Appropriate Reliance',
		year: 2004,
		venue: 'Human Factors',
		authors: [{ id: 'parasuraman', name: 'Raja Parasuraman' }, { id: 'riley', name: 'Victor Riley' }],
		categories: ['decision-making', 'hci'],
		keywords: ['automation', 'trust', 'reliance', 'human factors'],
		abstract: 'Examines how trust in automation is formed and how to design for appropriate human reliance.'
	},
	{
		id: 'pub-096',
		title: 'Do Artifacts Have Politics?',
		year: 1980,
		venue: 'Daedalus',
		authors: [{ id: 'winner', name: 'Langdon Winner' }],
		categories: ['feminist-hci', 'hci'],
		keywords: ['technology politics', 'artifacts', 'power', 'design values'],
		abstract: 'Argues that technologies embed political values and social relations in their design.'
	},
	{
		id: 'pub-097',
		title: 'The Sensemaking Process and Leverage Points for Analyst Technology',
		year: 2005,
		venue: 'Proceedings of Intelligence Analysis',
		authors: [{ id: 'russell', name: 'Daniel M. Russell' }, { id: 'pirolli', name: 'Peter Pirolli' }],
		categories: ['infovis', 'hci'],
		keywords: ['sensemaking', 'intelligence analysis', 'foraging', 'loop'],
		abstract: 'Models the sensemaking process and identifies leverage points for supporting analysts.'
	},
	{
		id: 'pub-098',
		title: 'Polaris: A System for Query, Analysis, and Visualization of Multidimensional Relational Databases',
		year: 2002,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'stolte', name: 'Chris Stolte' },
			{ id: 'tang', name: 'Diane Tang' },
			{ id: 'hanrahan', name: 'Pat Hanrahan' }
		],
		categories: ['infovis'],
		keywords: ['Polaris', 'Tableau', 'multidimensional', 'query', 'relational database'],
		abstract: 'Describes the Polaris system (precursor to Tableau) for visual analysis of relational data.'
	},
	{
		id: 'pub-099',
		title: 'Participatory Design: Three Principles',
		year: 1993,
		venue: 'Communications of the ACM',
		authors: [{ id: 'schuler', name: 'Douglas Schuler' }, { id: 'namioka', name: 'Aki Namioka' }],
		categories: ['hci', 'feminist-hci'],
		keywords: ['participatory design', 'workers', 'democracy', 'Scandinavian tradition'],
		abstract: 'Introduces participatory design principles rooted in Scandinavian labor traditions.'
	},
	{
		id: 'pub-100',
		title: 'On the Communicative Function of Scientific Visualization',
		year: 2022,
		venue: 'IEEE CG&A',
		authors: [
			{ id: 'mahyar', name: 'Narges Mahyar' },
			{ id: 'dimara8', name: 'Evanthia Dimara' }
		],
		categories: ['infovis', 'decision-making'],
		keywords: ['communicative visualization', 'scientific communication', 'decision making', 'uncertainty'],
		abstract: 'Discusses how the communicative function of visualization affects scientific decision making.'
	},
	{
		id: 'pub-101',
		title: 'Beyond Memorability: Visualization Recognition and Recall',
		year: 2016,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'borkin', name: 'Michelle Borkin' },
			{ id: 'vo', name: 'Azalea Vo' },
			{ id: 'bylinskii', name: 'Zoya Bylinskii' },
			{ id: 'isola', name: 'Phillip Isola' },
			{ id: 'sunkavalli', name: 'Shashank Sunkavalli' }
		],
		categories: ['infovis'],
		keywords: ['memorability', 'recognition', 'recall', 'eye-tracking'],
		abstract: 'Extends memorability research to distinguish recognition from recall in visualizations.'
	},
	{
		id: 'pub-102',
		title: 'Design Principles for Visual Communication',
		year: 2012,
		venue: 'Communications of the ACM',
		authors: [{ id: 'lohse', name: 'Gerald Lohse' }],
		categories: ['infovis'],
		keywords: ['design principles', 'visual communication', 'perception', 'cognition'],
		abstract: 'Reviews cognitive principles underlying effective visual communication design.'
	},
	{
		id: 'pub-103',
		title: 'Measuring the Effectiveness of Visual Variables for Proportional Symbols',
		year: 2022,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'franconeri2', name: 'Steven Franconeri' },
			{ id: 'padilla2', name: 'Lace Padilla' }
		],
		categories: ['infovis'],
		keywords: ['visual variables', 'proportional symbols', 'effectiveness', 'encoding'],
		abstract: 'Empirically evaluates how well different visual variables encode proportional magnitudes.'
	},
	{
		id: 'pub-104',
		title: 'The Explanatory Visualization Framework',
		year: 2022,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'chen2', name: 'Min Chen' },
			{ id: 'golan', name: 'Amos Golan' }
		],
		categories: ['infovis', 'xai'],
		keywords: ['explanatory visualization', 'information theory', 'framework', 'design'],
		abstract: 'Proposes an information-theoretic framework for explanatory visualization design.'
	},
	{
		id: 'pub-105',
		title: 'Narrative Visualization: Telling Stories with Data',
		year: 2010,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'segel', name: 'Edward Segel' },
			{ id: 'heer5', name: 'Jeffrey Heer' }
		],
		categories: ['infovis'],
		keywords: ['narrative', 'storytelling', 'data journalism', 'interaction'],
		abstract: 'Studies the design space of narrative visualizations and proposes a taxonomy of genres.'
	},
	{
		id: 'pub-106',
		title: 'Immersive Analytics: Time to Reconsider the Value of 3D for Information Visualisation',
		year: 2016,
		venue: 'Workshop on Immersive Analytics at IEEE VIS',
		authors: [
			{ id: 'marriott', name: 'Kim Marriott' }
		],
		categories: ['infovis', 'hci'],
		keywords: ['immersive analytics', '3D', 'VR', 'AR', 'data exploration'],
		abstract: 'Revisits whether 3D and immersive environments offer genuine value for information visualization.'
	},
	{
		id: 'pub-107',
		title: 'Comparing Effectiveness of Different Visualizations for Supporting Decision Making',
		year: 2021,
		venue: 'CHI',
		authors: [
			{ id: 'zhang', name: 'Yang Zhang' },
			{ id: 'dimara9', name: 'Evanthia Dimara' }
		],
		categories: ['infovis', 'decision-making'],
		keywords: ['decision support', 'visualization comparison', 'multi-attribute', 'evaluation'],
		abstract: 'Compares effectiveness of parallel coordinates, scatterplot matrices, and other displays for decision support.'
	},
	{
		id: 'pub-108',
		title: 'Deceptive Visualizations: Believe It or Not',
		year: 2020,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'lo', name: 'Leo Yu-Ho Lo' },
			{ id: 'yi2', name: 'Ji Soo Yi' }
		],
		categories: ['infovis', 'cognitive-bias'],
		keywords: ['deceptive visualization', 'misleading', 'belief', 'perception'],
		abstract: 'Catalogs deceptive visualization techniques and their effects on viewer beliefs.'
	},
	{
		id: 'pub-109',
		title: 'The Visceral Fontanel: Towards Tangible Epistemic Access in Data Visualisation',
		year: 2019,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'correll', name: 'Michael Correll' }
		],
		categories: ['infovis', 'feminist-hci'],
		keywords: ['epistemic access', 'tangible', 'ethics', 'critical visualization'],
		abstract: 'Argues for physical and epistemic accessibility as core visualization design values.'
	},
	{
		id: 'pub-110',
		title: 'Ethical Dimensions of Visualization Research',
		year: 2019,
		venue: 'CHI',
		authors: [
			{ id: 'correll2', name: 'Michael Correll' }
		],
		categories: ['infovis', 'feminist-hci'],
		keywords: ['ethics', 'visualization', 'harm', 'power', 'responsibility'],
		abstract: 'Examines ethical considerations and responsibilities in visualization research and practice.'
	},
	{
		id: 'pub-111',
		title: 'Supporting Human Decision Making by Visualizing Tradeoffs',
		year: 2020,
		venue: 'IEEE VIS',
		authors: [
			{ id: 'dimara10', name: 'Evanthia Dimara' }
		],
		categories: ['infovis', 'decision-making'],
		keywords: ['tradeoffs', 'multi-criteria', 'decision support', 'visualization'],
		abstract: 'Presents methods for visualizing attribute tradeoffs to support multi-criteria decisions.'
	},
	{
		id: 'pub-112',
		title: 'Design Space Analysis of Data Visualization Techniques for Supporting Decisions',
		year: 2023,
		venue: 'IEEE TVCG',
		authors: [
			{ id: 'dimara11', name: 'Evanthia Dimara' },
			{ id: 'perin2', name: 'Charles Perin' }
		],
		categories: ['infovis', 'decision-making'],
		keywords: ['design space', 'decision making', 'visualization techniques', 'analysis'],
		abstract: 'Analyzes the design space of visualizations specifically intended to support decision making.'
	},
	{
		id: 'pub-113',
		title: 'Belief Updating and the Anchoring Heuristic',
		year: 2011,
		venue: 'Psychological Science',
		authors: [
			{ id: 'lieder', name: 'Falk Lieder' },
			{ id: 'griffiths', name: 'Thomas Griffiths' }
		],
		categories: ['jdm', 'cognitive-bias'],
		keywords: ['anchoring', 'Bayesian', 'belief updating', 'heuristics'],
		abstract: 'Provides a Bayesian account of anchoring as a near-optimal strategy under cognitive constraints.'
	},
	{
		id: 'pub-114',
		title: 'The Seven Sins of Memory: How the Mind Forgets and Remembers',
		year: 2001,
		venue: 'Houghton Mifflin',
		authors: [{ id: 'schacter', name: 'Daniel Schacter' }],
		categories: ['cognitive-bias', 'jdm'],
		keywords: ['memory', 'forgetting', 'bias', 'misattribution', 'suggestibility'],
		abstract: 'Organizes memory failures into seven categories and discusses their adaptive value.'
	},
	{
		id: 'pub-115',
		title: 'Explaining Decisions Made with AI',
		year: 2020,
		venue: 'ICO / Alan Turing Institute',
		authors: [
			{ id: 'ico', name: 'Information Commissioner\'s Office' }
		],
		categories: ['xai'],
		keywords: ['GDPR', 'explainability', 'right to explanation', 'accountability', 'governance'],
		abstract: 'Guidance on explaining AI-driven decisions under GDPR and related frameworks.'
	},
	{
		id: 'pub-116',
		title: 'Fair and Interpretable Machine Learning: A Tutorial',
		year: 2021,
		venue: 'FAccT',
		authors: [
			{ id: 'chouldechova', name: 'Alexandra Chouldechova' },
			{ id: 'roth', name: 'Aaron Roth' }
		],
		categories: ['xai', 'cognitive-bias'],
		keywords: ['fairness', 'interpretability', 'machine learning', 'tutorial'],
		abstract: 'Tutorial on methods for building fair and interpretable machine learning models.'
	},
	{
		id: 'pub-117',
		title: 'Towards Accountable AI: Hybrid Human-Machine Analyses for Characterizing System Failure',
		year: 2021,
		venue: 'AAAI HCOMP',
		authors: [
			{ id: 'cai', name: 'Carrie J. Cai' },
			{ id: 'jongejan', name: 'Jonas Jongejan' }
		],
		categories: ['xai', 'hci'],
		keywords: ['accountability', 'human-AI', 'failure analysis', 'collaborative'],
		abstract: 'Proposes hybrid human-machine workflows to characterize AI system failures.'
	},
	{
		id: 'pub-118',
		title: 'Epistemics and the Reasonable Wise Person Standard in AI Ethics',
		year: 2020,
		venue: 'AI & Society',
		authors: [{ id: 'morley', name: 'Jessica Morley' }],
		categories: ['xai', 'feminist-hci'],
		keywords: ['AI ethics', 'epistemics', 'wise person standard', 'values'],
		abstract: 'Proposes the reasonable wise person standard as an ethical framework for AI decision-making.'
	},
	{
		id: 'pub-119',
		title: 'Towards Designing with Margins: Reflections on Being a Queer Designer in HCI',
		year: 2019,
		venue: 'CHI',
		authors: [
			{ id: 'linxen', name: 'Sebastian Linxen' }
		],
		categories: ['feminist-hci'],
		keywords: ['queer', 'design', 'marginalization', 'LGBTQ+', 'positionality'],
		abstract: 'Reflexive account of the experience of queer identity in HCI design practice.'
	},
	{
		id: 'pub-120',
		title: 'Affective Computing',
		year: 1997,
		venue: 'MIT Press',
		authors: [{ id: 'picard', name: 'Rosalind Picard' }],
		categories: ['hci', 'decision-making'],
		keywords: ['affect', 'emotion', 'computing', 'human-centered'],
		abstract: 'Proposes that computers should be able to recognize and respond to human emotions.'
	}
];
