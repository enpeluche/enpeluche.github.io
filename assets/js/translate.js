const cvLink = document.getElementById("cv-link"); // On récupère le lien

const filters_traduction = {
  view_all: {
    fr: "Tout voir",
    en: "View all",
  },
};

const tags_traduction = {
  post_quantum_cryptography: {
    fr: "Cryptographie post-quantique",
    en: "Post-Quantum Cryptography",
  },
  cryptography: {
    fr: "Cryptographie",
    en: "Cryptography",
  },
  lattice_reduction: {
    fr: "Réduction de réseaux",
    en: "Lattice Reduction",
  },
  cryptanalysis: {
    fr: "Cryptanalyse",
    en: "Cryptanalysis",
  },
  complexity_analysis: {
    fr: "Analyse de complexité",
    en: "Complexity Analysis",
  },
  algebraic_surfaces: {
    fr: "Surfaces algébriques",
    en: "Algebraic Surfaces",
  },
  differential_geometry: {
    fr: "Géométrie différentielle",
    en: "Differential Geometry",
  },
  graph_theory: {
    fr: "Théorie des graphes",
    en: "Graph Theory",
  },
  hamiltonian_cycles: {
    fr: "Cycles hamiltoniens",
    en: "Hamiltonian Cycles",
  },
  heuristics: {
    fr: "Heuristique",
    en: "Heuristics",
  },
  accessibility: {
    fr: "Accessibilité",
    en: "Accessibility",
  },
  functional_harmonic_analysis: {
    fr: "Analyse fonctionnelle / harmonique",
    en: "Functional / Harmonic Analysis",
  },
  quantum_mechanics: {
    fr: "Mécanique quantique",
    en: "Quantum Mechanics",
  },
  analysis: {
    fr: "Analyse",
    en: "Analysis",
  },
  kepler_conjecture: {
    fr: "Conjecture de Kepler",
    en: "Kepler Conjecture",
  },
  euclidean_geometry: {
    fr: "Géométrie euclidienne",
    en: "Euclidean Geometry",
  },
  combinatorial_optimization: {
    fr: "Optimisation combinatoire",
    en: "Combinatorial Optimization",
  },
  greedy_heuristic: {
    fr: "Heuristique gloutonne",
    en: "Greedy Heuristic",
  },
  mip: {
    fr: "PLNE",
    en: "MIP",
  },
};

const footer_traduction = {
  explore_project: {
    fr: "Explorer le projet",
    en: "Explore the project",
  },
  read_research_report: {
    fr: "Lire le rapport de recherche",
    en: "Read the research report",
  },
  explore_engine_architecture: {
    fr: "Explorer l'architecture du moteur",
    en: "Explore the engine architecture",
  },
  read_research_thesis: {
    fr: "Lire le mémoire de recherche",
    en: "Read the research thesis",
  },
  explore_portfolio: {
    fr: "Explorer le portfolio",
    en: "Explore the portfolio",
  },
};

const sections_traduction = {
  research_engineering: {
    fr: "Recherche & Ingénierie",
    en: "Research & Engineering",
  },
  additional_projects: {
    fr: "Projets complémentaires",
    en: "Additional Projects",
  },
};

const latticechat_project = {
  latticechat_title: {
    fr: "Lattice-Chat",
    en: "Lattice-Chat",
  },
  latticechat_subtitle: {
    fr: "Messagerie chiffrée post-quantique et cryptanalyse par LLL",
    en: "Post-quantum encrypted messaging and LLL cryptanalysis",
  },
  latticechat_category: {
    fr: "Projet Personnel",
    en: "Personal Project",
  },
  latticechat_description: {
    fr: `
    <div>
        Système de messagerie chiffrée de bout en bout dont la sécurité repose
        sur la difficulté du problème <strong>SVP</strong> résistant aux attaques quantiques.
    </div>
    <div>
        <strong>Cryptographie</strong> : Échange de clés post-quantique via
        <strong>LWE</strong> (Learning With Errors), chiffrement symétrique
        des messages par <strong>ChaCha20</strong>.
    </div>
    <div>
        <strong>Réseau</strong> : Stack réseau asynchrone en Rust
        (Tokio, TCP/WebSockets).
    </div>
    <div>
        <strong>Cryptanalyse</strong> : Simulation d'attaques par réduction
        de base (<strong>LLL</strong>) et benchmarks selon la dimension,
        le bruit et le module.
    </div>
    <div>
        <strong>Roadmap</strong> : 🦀 Projet en cours d'implémentation. (mars 2026)
    </div>
    `,
    en: `
      <div>
          End-to-end encrypted messaging system whose security relies on
          the hardness of the quantum-resistant <strong>SVP</strong> (Shortest Vector Problem).
      </div>
      <div>
          <strong>Cryptography</strong>: Post-quantum key exchange via
          <strong>LWE</strong> (Learning With Errors), symmetric message
          encryption using <strong>ChaCha20</strong>.
      </div>
      <div>
          <strong>Networking</strong>: Asynchronous network stack in Rust
          (Tokio, TCP/WebSockets).
      </div>
      <div>
          <strong>Cryptanalysis</strong>: Simulation of attacks via lattice
          basis reduction (<strong>LLL</strong>) and benchmarks based on dimension,
          noise, and modulus.
      </div>
      <div>
          <strong>Roadmap</strong>: 🦀 Project currently being implemented. (March 2026)
      </div>
    `,
  },
};

const internship_project = {
  internship_title: {
    fr: "Réduction de réseaux euclidiens",
    en: "Euclidean lattice reduction",
  },
  internship_subtitle: {
    fr: "Adaptations d’idées provenant du cas polynomial au cas entier",
    en: "Adapting concepts from polynomial to euclidean lattices",
  },
  internship_category: {
    fr: "Stage de recherche (M2)",
    en: "Graduate Research Internship",
  },
  internship_date: {
    fr: "Février 2025 - Juin 2025",
    en: "February 2025 - June 2025",
  },

  internship_description: {
    fr: `
    <div>
        Exploration des similarités et différences entre réduction de réseaux
        <strong>polynomiaux</strong> et <strong>euclidiens</strong>, avec adaptation
        d'idées algorithmiques du cas polynomial vers le cas entier (algorithme LLL).
    </div>
    <div>
        <strong>Contexte</strong> : la réduction de réseaux est au cœur de la cryptographie
        post-quantique, dont la sécurité repose sur des problèmes réputés résistants aux
        attaques quantiques.
    </div>
    <div>
        <strong>Implémentation</strong> : Prototypes en SageMath pour analyser
        complexité algorithmique et stabilité numérique des variantes étudiées.
    </div>
    <div>
        <strong>Communication</strong> : Présentation technique d'1h30 en anglais
        au <em>Lattice Club</em> sur LLL.
    </div>
    <div>
        <strong>Travail de recherche</strong> : revue d’état de l’art et analyse critique
        d’articles scientifiques.
    </div>
    `,
    en: `
      <div>
          Exploration of the similarities and differences between
          <strong>polynomial</strong> and <strong>Euclidean</strong> lattice reduction,
          adapting algorithmic ideas from the polynomial case to the integer case (LLL algorithm).
      </div>
      <div>
          <strong>Context</strong>: Lattice reduction is at the core of post-quantum
          cryptography, whose security relies on problems deemed resistant to
          quantum attacks.
      </div>
      <div>
          <strong>Implementation</strong>: SageMath prototypes to analyze the
          algorithmic complexity and numerical stability of the studied variants.
      </div>
      <div>
          <strong>Communication</strong>: 1.5-hour technical presentation in English
          at the <em>Lattice Club</em> on LLL.
      </div>
      <div>
          <strong>Research work</strong>: State-of-the-art review and critical analysis
          of scientific papers.
      </div>
    `,
  },
};

const raytracer_project = {
  raytracer_title: {
    fr: "Ray Tracing Algébrique",
    en: "Algebraic Ray Tracing",
  },
  raytracer_subtitle: {
    fr: "Solveur exact pour surfaces implicites",
    en: "Exact solver for implicit surfaces",
  },
  raytracer_category: {
    fr: "Moteur de calcul symbolique",
    en: "Symbolic Computation Engine",
  },
  raytracer_description: {
    fr: `
    <div>
        Intersection rayon–surface via la résolution de l'équation $f(O + tD) = 0$.
        Isolement des racines en base de <strong>Bernstein</strong> via l'algorithme de
        <strong>De Casteljau</strong>.
        Gestion de géométrie constructive (<strong>CSG</strong>), multi-caméras, ombre portée.
    </div>
    <div>
        <strong>Qualité logicielle</strong>:
        Réalisation de tests unitaires et benchmarks (Criterion).
    </div>


    <div>
        <strong>Optimisations</strong>:
        AABB, heuristiques, Horner, SIMD
    </div>



    <div>
        <strong>Exemples de surfaces</strong> :
        <hover-preview src="assets/img/miniatures_hover/Taubin Heart_orthographiccamera.webp"
            alt="Rendu algébrique du Cœur de Taubin">
            Cœur de Taubin
        </hover-preview>,
        <hover-preview src="assets/img/miniatures_hover/roman_isometric_orthographic.webp"
            alt="Rendu algébrique de la surface de Roman">
            surface de Roman
        </hover-preview>,
        <hover-preview
            src="assets/img/miniatures_hover/hyperboloid_of_one_sheet_cylindricalcamera.webp"
            alt="Rendu algébrique d'une quadrique">
            quadriques
        </hover-preview>.
    </div>

    <div>
        <strong>Roadmap</strong>:
        🦀 Portage du solveur en Rust en cours d'implémentation. (mars 2026)
    </div>
    `,
    en: `
      <div>
          Ray-surface intersection by solving the equation $f(O + tD) = 0$.
          Root isolation in the <strong>Bernstein</strong> basis using the
          <strong>De Casteljau</strong> algorithm.
          Support for constructive solid geometry (<strong>CSG</strong>), multi-camera setups, and cast shadows.
      </div>
      <div>
          <strong>Software Quality</strong>:
          Implementation of unit tests and benchmarks (Criterion).
      </div>
      <div>
          <strong>Optimizations</strong>:
          AABB, heuristics, Horner's method, SIMD.
      </div>
      <div>
          <strong>Surface examples</strong>:
          <hover-preview src="assets/img/miniatures_hover/Taubin Heart_orthographiccamera.webp"
              alt="Algebraic rendering of Taubin's Heart">
              Taubin's Heart
          </hover-preview>,
          <hover-preview src="assets/img/miniatures_hover/roman_isometric_orthographic.webp"
              alt="Algebraic rendering of the Roman surface">
              Roman surface
          </hover-preview>,
          <hover-preview
              src="assets/img/miniatures_hover/hyperboloid_of_one_sheet_cylindricalcamera.webp"
              alt="Algebraic rendering of a quadric">
              quadrics
          </hover-preview>.
      </div>
      <div>
          <strong>Roadmap</strong>:
          🦀 Rust port of the solver currently being implemented. (March 2026)
      </div>
    `,
  },
};

const beckett_project = {
  beckett_title: {
    fr: "Codes de Beckett-Gray",
    en: "Beckett-Gray Codes",
  },
  beckett_subtitle: {
    fr: "Implémentation, heuristiques et analyses de graphes",
    en: "Implementation, heuristics, and graph analysis",
  },
  beckett_category: {
    fr: "Mémoire (M1)",
    en: "Thesis (M1)",
  },
  beckett_date: {
    fr: "Janvier 2024 - Mai 2024",
    en: "January 2024 - May 2024",
  },
  beckett_description: {
    fr: `
    <div>
        Recherche de codes de Gray sans retour arrière (<strong>Beckett-Gray</strong>)
        sur l'<strong>hypercube</strong>, via la recherche de cycles hamiltoniens
        spécifiques dans des graphes de grande dimension.
    </div>
    <div>
        <strong>Solvers</strong> : Implémentation en C++ de moteurs de recherche
        par backtracking et heuristiques pour explorer l'espace des solutions
        et identifier des contre-exemples.
    </div>
    <div>
        <strong>Analyse</strong> : Étude statistique des propriétés et motifs
        récurrents dans les codes générés.
    </div>
    `,
    en: `
      <div>
          Search for non-reversing Gray codes (<strong>Beckett-Gray</strong>)
          on the <strong>hypercube</strong>, via the search for specific Hamiltonian
          cycles in high-dimensional graphs.
      </div>
      <div>
          <strong>Solvers</strong>: C++ implementation of search engines using
          backtracking and heuristics to explore the solution space
          and identify counterexamples.
      </div>
      <div>
          <strong>Analysis</strong>: Statistical study of properties and recurring
          patterns in the generated codes.
      </div>
    `,
  },
};

const portfolio_project = {
  portfolio_title: {
    fr: "Portfolio Personnel",
    en: "Personal Portfolio",
  },
  portfolio_subtitle: {
    fr: "Interface web sur-mesure orientée performance et accessibilité.",
    en: "Custom web interface focused on performance and accessibility.",
  },
  portfolio_category: {
    fr: "Projet Personnel",
    en: "Personal Project",
  },
  portfolio_description: {
    fr: `
    <div>
        Conception et implémentation d'un portfolio numérique 100% from scratch ( sans framework
        JS, sans CSS framework, sans générateur de site).
    </div>

    <div>
        <strong>Systèmes dynamiques</strong> :
        Filtrage natif des projets, moteur de blog, système de traduction, web components
        custom.
    </div>
    <div>
        <strong>UI/UX</strong> :
        Expérience utilisateur "Mobile-First", animations fluides et design sur-mesure.
    </div>
    <div>
        <strong>Infrastructure</strong> :
        Déploiement automatisé via GitHub Pages, incluant un système de génération de tables des
        matières dynamiques.
    </div>

    <div>
        <strong>Roadmap</strong> : 🌓 Implémentation du mode sombre (Dark Mode) + amélioration
        de l’accessibilité.
    </div>
    `,
    en: `
      <div class="description">
          <div>
              Design and implementation of a digital portfolio 100% from scratch (no JS framework,
              no CSS framework, no static site generator).
          </div>
          <div>
              <strong>Dynamic systems</strong>:
              Native project filtering, blog engine, translation system, custom web components.
          </div>
          <div>
              <strong>UI/UX</strong>:
              "Mobile-First" user experience, smooth animations, and custom design.
          </div>
          <div>
              <strong>Infrastructure</strong>:
              Automated deployment via GitHub Pages, including a dynamic table of contents
              generation system.
          </div>
          <div>
              <strong>Roadmap</strong>: 🌓 Implementation of dark mode + accessibility
              improvements.
          </div>
      </div>
    `,
  },
};

const weyl_project = {
  weyl_title: {
    fr: "La transformation de Weyl",
    en: "The Weyl Transform",
  },
  weyl_subtitle: {
    fr: "Quantification de Weyl et analyse sur l’espace des phases",
    en: "Weyl quantization and phase space analysis",
  },
  weyl_category: {
    fr: "Mémoire de recherche (M1)",
    en: "Research Thesis (M1)",
  },
  weyl_description: {
    fr: `
      <div>
          Étude de la <strong>quantification de Weyl</strong> : correspondance entre
          fonctions sur l'espace des phases et opérateurs en mécanique quantique,
          en contournant la non-commutativité de P̂ et Q̂.
      </div>
      <div>
          <strong>Outils</strong> : Transformée de Fourier-Wigner, groupe de
          Heisenberg, opérateurs pseudo-différentiels, transformée de Wigner.
      </div>
      <div>
          <strong>Lien physique-mathématique</strong> : Formalisme rigoureux ancré
          dans les postulats de la mécanique quantique.
      </div>
    `,
    en: `
      <div>
          Study of <strong>Weyl quantization</strong>: correspondence between
          functions on phase space and operators in quantum mechanics,
          bypassing the non-commutativity of P̂ and Q̂.
      </div>
      <div>
          <strong>Tools</strong>: Fourier-Wigner transform, Heisenberg
          group, pseudo-differential operators, Wigner transform.
      </div>
      <div>
          <strong>Physical-mathematical connection</strong>: Rigorous formalism rooted
          in the postulates of quantum mechanics.
      </div>
    `,
  },
};

const packing_project = {
  packing_title: {
    fr: "Empilement compact",
    en: "Close Packing",
  },
  packing_subtitle: {
    fr: "Étude de l'inégalité isopérimétrique et simulations",
    en: "Study of the isoperimetric inequality and simulations",
  },
  packing_category: {
    fr: `Mémoire (L3)`,
    en: `Bachelor's Thesis (L3)`,
  },
  packing_description: {
    fr: `
      <div>
          Étude du problème de l'<strong>empilement compact</strong> (conjecture de Kepler)
          et de l'<strong>inégalité isopérimétrique</strong>, et exploration du lien
          entre ces deux problèmes fondamentaux de géométrie.
      </div>
      <div>
          <strong>Contexte</strong> : De Kepler (1611) à Hales, jusqu'aux travaux de
          <strong>Maryna Viazovska</strong> (dimensions 8 et 24, médaille Fields 2022).
      </div>
      <div>
          <strong>Simulations</strong> : Développement en Java pour visualiser
          les configurations d'empilement critiques.
      </div>
    `,
    en: `
      <div>
          Study of the <strong>close packing</strong> problem (Kepler conjecture)
          and the <strong>isoperimetric inequality</strong>, exploring the link
          between these two fundamental problems in geometry.
      </div>
      <div>
          <strong>Context</strong>: From Kepler (1611) to Hales, up to the works of
          <strong>Maryna Viazovska</strong> (dimensions 8 and 24, 2022 Fields Medal).
      </div>
      <div>
          <strong>Simulations</strong>: Java development to visualize
          critical packing configurations.
      </div>
    `,
  },
};

const wsrp_project = {
  wsrp_title: {
    fr: "Solveur WSRP",
    en: "WSRP Solver",
  },
  wsrp_subtitle: {
    fr: "Optimisation de tournées sous contraintes de compétences",
    en: "Routing optimization under skill constraints",
  },
  wsrp_description: {
    fr: `
    <div>
        Résolution du problème de planification et routage
        de techniciens (<strong>WSRP</strong>) sous contraintes
        de compétences et fenêtres temporelles.
    </div>
    <div>
        <strong>Modélisation</strong> : Formulation en
        Programmation Linéaire en Nombres Entiers (<strong>MIP</strong>)
        avec OR-Tools (SCIP).
    </div>
    <div>
        <strong>Heuristique</strong> : Solver glouton pour
        initialisation rapide, utilisé comme <strong>warm start</strong>
        pour accélérer la convergence du MIP.
    </div>
    <div>
        <strong>Critères</strong> : Maximisation du temps passé
        sur les tâches, minimisation du temps de trajet et des retards.
    </div>
    `,
    en: `
      <div>
          Resolution of the Workforce Scheduling and Routing Problem
          (<strong>WSRP</strong>) under skill constraints
          and time windows.
      </div>
      <div>
          <strong>Modeling</strong>: Mixed-Integer Programming
          (<strong>MIP</strong>) formulation
          using OR-Tools (SCIP).
      </div>
      <div>
          <strong>Heuristics</strong>: Greedy solver for
          fast initialization, used as a <strong>warm start</strong>
          to accelerate MIP convergence.
      </div>
      <div>
          <strong>Criteria</strong>: Maximization of time spent
          on tasks, minimization of travel time and delays.
      </div>
    `,
  },
};

const homepage_traduction = {
  welcome: {
    fr: "Bonjour, je suis",
    en: "Hello, I am",
  },
  education_master_degree: {
    fr: "Titulaire d'un Master 2 en Algorithmie & Mathématiques.",
    en: "Master's Degree in Algorithmics & Mathematics.",
  },
  section_about_title: {
    fr: "À propos de moi",
    en: "About Me",
  },
  section_about_description: {
    fr: "Je conçois des systèmes logiciels <strong>critiques</strong>, <strong>prouvés</strong> et <strong>optimisés</strong>. Combinant informatique théorique et mathématiques, je transforme l'abstraction complexe en code performant. Que ce soit en C++, OCaml ou Python, mon approche vise la robustesse absolue par l'usage de méthodes formelles.",
    en: "I design <strong>critical</strong>, <strong>proven</strong>, and <strong>optimized</strong> software systems. Combining theoretical computer science and mathematics, I transform complex abstraction into high-performance code. Whether in C++, OCaml or Python, my approach aims for absolute robustness through the use of formal methods.",
  },
  expertise_intro: {
    fr: "<strong>Mon expertise technique :</strong>",
    en: "<strong>My technical expertise:</strong>",
  },
  section_about_seeking: {
    fr: "<strong>Ce que je cherche :</strong> Un rôle technique en Recherche Opérationnelle, Preuve Formelle ou Cybersécurité.",
    en: "<strong>What I am looking for:</strong> A technical role in Operations Research, Formal Verification, or Cybersecurity.",
  },
  skill_optimization: {
    fr: "<strong>Optimisation & Modélisation :</strong> Modélisation mathématique, PLNE (MIP), Programmation par contraintes, Heuristiques & Métaheuristiques.",
    en: "<strong>Optimization & Modeling:</strong> Mathematical modeling, MILP, Constraint Programming, Heuristics & Metaheuristics.",
  },
  skill_safety_crypto: {
    fr: "<strong>Sûreté & Cryptographie :</strong> Méthodes formelles (Coq), Preuve de sécurité, Protocoles cryptographiques.",
    en: "<strong>Safety & Cryptography:</strong> Formal methods (Coq), Security proofs, Cryptographic protocols.",
  },
  skill_algorithms: {
    fr: "<strong>Algorithmique Avancée :</strong> Analyse de complexité, Théorie des graphes avancée (algorithmes en-ligne, distribués).",
    en: "<strong>Advanced Algorithmics:</strong> Complexity analysis, Advanced graph theory (online and distributed algorithms).",
  },
};

const homepage_skills = {
  section_soft_skills_title: {
    fr: "Qualités Humaines",
    en: "Soft Skills",
  },
  skill_scientific_rigor: {
    fr: "Rigueur scientifique",
    en: "Scientific Rigor",
  },
  skill_curiosity: {
    fr: "Curiosité",
    en: "Curiosity",
  },
  skill_creativity: {
    fr: "Créativité",
    en: "Creativity",
  },
  skill_teamwork: {
    fr: "Travail d'équipe",
    en: "Teamwork",
  },
  skill_pedagogy: {
    fr: "Pédagogie",
    en: "Pedagogy",
  },
  skill_problem_solving: {
    fr: "Résolution de problèmes",
    en: "Problem Solving",
  },
  btn_download_cv: {
    fr: "Télécharger mon CV (PDF)",
    en: "Download my CV (PDF)",
  },
  skills_main_title: { fr: "Compétences", en: "Skills" },
  skill_title_opti: {
    fr: "Optimisation & Modélisation",
    en: "Optimization & Modeling",
  },
  skill_title_safety: {
    fr: "Sûreté & Cryptographie",
    en: "Safety & Cryptography",
  },
  skill_title_algo: {
    fr: "Algorithmique Avancée",
    en: "Advanced Algorithmics",
  },
  skill_title_languages: {
    fr: "Développement",
    en: "Development",
  },
  skill_title_software: { fr: "Logiciels & OS", en: "Software & OS" },
  skill_title_spoken_langs: { fr: "Langues", en: "Spoken Languages" },

  skill_detail_math: {
    fr: "Modélisation mathématique",
    en: "Mathematical modeling",
  },
  skill_detail_plne: { fr: "PLNE (MIP)", en: "MILP (Integer Programming)" },
  skill_detail_constraints: {
    fr: "Programmation par contraintes",
    en: "Constraint Programming",
  },
  skill_detail_heuristics: {
    fr: "Heuristiques & Métaheuristiques",
    en: "Heuristics & Metaheuristics",
  },

  skill_detail_formal: {
    fr: "Méthodes formelles (Coq)",
    en: "Formal methods (Coq)",
  },
  skill_detail_proof: { fr: "Preuve de sécurité", en: "Security proofs" },
  skill_detail_crypto: {
    fr: "Protocoles cryptographiques",
    en: "Cryptographic protocols",
  },
  skill_detail_complexity: {
    fr: "Analyse de complexité",
    en: "Complexity Analysis",
  },
  skill_detail_graphs: {
    fr: "Structures et algorithmes de graphes",
    en: "Graph Structures and Algorithms",
  },
  skill_detail_flows: {
    fr: "Flots / graphes (algorithmes en-ligne)",
    en: "Flows / Graphs (Online Algorithms)",
  },

  lang_english: {
    fr: "<strong>Anglais :</strong> C1 (Technique courant)",
    en: "<strong>English:</strong> C1 (Fluent technical)",
  },
  lang_french: {
    fr: "<strong>Français :</strong> Langue maternelle",
    en: "<strong>French:</strong> Native speaker",
  },
};

const homepage_contact = {
  contact_title: {
    fr: "Me Contacter",
    en: "Contact Me",
  },
  contact_tagline: {
    fr: "Jeune diplômé en quête de défis techniques.",
    en: "Recent graduate looking for technical challenges.",
  },
  contact_description: {
    fr: "À la recherche de ma <strong>première opportunité en CDI</strong> en tant qu'Ingénieur R&D. Je souhaite rejoindre une équipe ambitieuse pour concevoir des solutions fiables en <strong>Optimisation</strong>, <strong>Méthodes Formelles</strong> ou <strong>Cybersécurité</strong>.",
    en: "Looking for my <strong>first permanent position</strong> as an R&D Engineer. I aim to join an ambitious team to design reliable solutions in <strong>Optimization</strong>, <strong>Formal Methods</strong>, or <strong>Cybersecurity</strong>.",
  },
  contact_availability_label: {
    fr: "Disponibilité",
    en: "Availability",
  },
  contact_availability_date: {
    fr: "Mars 2026",
    en: "March 2026",
  },
  contact_availability_note: {
    fr: "(Ouvert aux échanges et entretiens dès aujourd'hui)",
    en: "(Open to discussions and interviews starting today)",
  },
};

const traductions = {
  ...filters_traduction,
  ...tags_traduction,
  ...wsrp_project,
  ...latticechat_project,
  ...internship_project,
  ...raytracer_project,
  ...beckett_project,
  ...portfolio_project,
  ...weyl_project,
  ...packing_project,
  ...homepage_traduction,
  ...homepage_skills,
  ...homepage_contact,
  ...footer_traduction,
  ...sections_traduction,
};

const traducctions = {
  fr: {
    project_crypto_subtitle:
      "Implémentation d'un protocole de chiffrement post-quantique et attaque par réduction",
    project_portfolio_subtitle:
      "Développement d'une interface web responsive 'from scratch'",
    project_raytracer_subtitle:
      "Génération d'images 3D par simulation physique de la lumière",
    project_multiplayer_game_subtitle:
      "Architecture Client-Serveur et protocole de communication custom",
    project_diff_calc_subtitle:
      "Rédaction intégrale d'un manuel universitaire (100+ pages)",
    project_fractals_subtitle:
      "Visualisation d'ensembles mathématiques complexes via la récursivité",
    project_habit_tracker_subtitle:
      "Application web interactive de suivi d'habitudes et visualisation de données",
    project_lattice_reduction_subtitle:
      "Adaptations d’idées provenant du cas polynomial au cas entier",
    project_beckett_gray_subtitle:
      "Implémentation, heuristiques et analyses de graphes",
    project_weyl_transform_subtitle:
      "Une transformée de Fourier non commutative",
    project_close_packing_subtitle:
      "Étude de l'inégalité isopérimétrique et simulations",
    btn_download_cv: "Télécharger mon CV (PDF)",
    btn_contact_me: "Me Contacter",
    status_availability:
      "Disponible dès maintenant pour des projets de R&D ou d'Ingénierie complexe.",
    section_soft_skills_title: "Qualités Humaines",
    skill_scientific_rigor: "Rigueur scientifique",
    skill_curiosity: "Curiosité",
    skill_teamwork: "Travail d'équipe",
    skill_pedagogy: "Pédagogie",
    skill_problem_solving: "Résolution de problèmes",
    skill_creativity: "Créativité",
    btn_view_project: "Découvrir en détail le projet",
    label_context: "Contexte",
    label_language: "Langage",
    label_summary: "Résumé",
    label_field: "Domaine",
    label_period: "Période",
    label_core: "Cœur",
    label_tech_concepts: "Technologies & Concepts",
    label_type: "Type",
    project_crypto_title: "Cryptosystème & Cryptanalyse",
    project_portfolio_title: "Portfolio Personnel",
    project_raytracer_title: "Moteur de Ray Tracing",
    project_multiplayer_game_title: "Jeu Multijoueur en Réseau",
    project_diff_calc_title: "Cours de Calcul Différentiel",
    project_fractals_title: "Générateur de Fractales Interactif",
    project_habit_tracker_title: "Habit Tracker App",
    project_lattice_reduction_title: "Réduction de réseaux",
    project_beckett_gray_title: "Codes de Beckett-Gray",
    project_weyl_transform_title: "La transformation de Weyl",
    project_close_packing_title: "Empilement compact",
    section_skills_title: "Compétences",
    section_dev_projects_title: "Projets de développement",
    section_academic_projects_title: "Projets académiques",
    section_projects_title: "Projets",
    projects_category_dev: "Développement",
    projects_category_academic: "Académiques",
    welcome: "Bonjour, je suis",
    education_master_degree:
      "Titulaire d'un Master 2 en Algorithmie & Mathématiques.",
    section_about_title: "À propos de moi",
    about_description:
      "Combinant informatique théorique et mathématiques, je transforme l'abstraction complexe en solutions logicielles concrètes, performantes et rigoureusement optimisées.",
  },
  en: {
    project_crypto_subtitle:
      "Implementation of a post-quantum encryption protocol and reduction attack",
    project_portfolio_subtitle:
      "Development of a responsive web interface from scratch",
    project_raytracer_subtitle:
      "3D image generation via physical light simulation",
    project_multiplayer_game_subtitle:
      "Client-Server architecture and custom communication protocol",
    project_diff_calc_subtitle:
      "Full authorship of a university textbook (100+ pages)",
    project_fractals_subtitle:
      "Visualization of complex mathematical sets via recursion",
    project_habit_tracker_subtitle:
      "Interactive habit tracking web application and data visualization",
    project_lattice_reduction_subtitle:
      "Adaptation of ideas from the polynomial case to the integer case",
    project_beckett_gray_subtitle:
      "Implementation, heuristics, and graph analysis",
    project_weyl_transform_subtitle: "A non-commutative Fourier transform",
    project_close_packing_subtitle:
      "Study of the isoperimetric inequality and simulations",
    btn_download_cv: "Download my CV (PDF)",
    btn_contact_me: "Contact Me",
    status_availability:
      "Available immediately for R&D or complex engineering projects.",
    section_soft_skills_title: "Soft Skills",
    skill_scientific_rigor: "Scientific Rigor",
    skill_curiosity: "Curiosity",
    skill_teamwork: "Teamwork",
    skill_pedagogy: "Pedagogy",
    skill_problem_solving: "Problem Solving",
    skill_creativity: "Creativity",
    btn_view_project: "View Project Details",
    label_context: "Context",
    label_language: "Language",
    label_summary: "Summary",
    label_field: "Field",
    label_period: "Period",
    label_core: "Core",
    label_tech_concepts: "Technologies & Concepts",
    label_type: "Type",
    project_crypto_title: "Cryptosystem & Cryptanalysis",
    project_portfolio_title: "Personal Portfolio",
    project_raytracer_title: "Ray Tracing Engine",
    project_multiplayer_game_title: "Networked Multiplayer Game",
    project_diff_calc_title: "Differential Calculus Course",
    project_fractals_title: "Interactive Fractal Generator",
    project_habit_tracker_title: "Habit Tracker App",
    project_lattice_reduction_title: "Lattice Reduction",
    project_beckett_gray_title: "Beckett-Gray Codes",
    project_weyl_transform_title: "The Weyl Transform",
    project_close_packing_title: "Close-Packing",
    section_skills_title: "Skills",
    section_dev_projects_title: "Development Projects",
    section_academic_projects_title: "Academic Projects",
    section_projects_title: "Projects",
    projects_category_dev: "Development",
    projects_category_academic: "Academic",
    welcome: "Hello, I am",
    education_master_degree: "Master's Degree in Algorithmics & Mathematics.",
    section_about_title: "About Me",
    about_description:
      "Blending theoretical computer science with mathematics, I transform complex abstractions into concrete, high-performance, and rigorously optimized software solutions.",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.getElementById("lang-toggle");

  const urlParams = new URLSearchParams(window.location.search);
  const langDepuisURL = urlParams.get("lang");
  const langSauvegardee = localStorage.getItem("app_lang");

  const langueInitiale = langDepuisURL || langSauvegardee || "fr";

  if (langueInitiale === "en") {
    langToggle.checked = true;
  }

  changerLangue(langueInitiale);

  langToggle.addEventListener("change", function () {
    const nouvelleLangue = this.checked ? "en" : "fr";
    changerLangue(nouvelleLangue);
  });
});

function changerLangue(langue) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const cle = element.getAttribute("data-i18n");
    if (traductions[cle] && traductions[cle][langue]) {
      element.innerHTML = traductions[cle][langue];
    }
  });

  document.documentElement.lang = langue;

  localStorage.setItem("app_lang", langue);

  const currentUrl = new URL(window.location);
  currentUrl.searchParams.set("lang", langue);
  window.history.pushState({}, "", currentUrl);
}

document.addEventListener("DOMContentLoaded", () => {
  const cvLink = document.getElementById("cv-link");

  document
    .getElementById("lang-toggle")
    .addEventListener("change", function () {
      if (this.checked) {
        if (cvLink) {
          cvLink.href =
            "https://raw.githubusercontent.com/enpeluche/resume/main/dist/en/CV_Lucas_Noirot-Petit.pdf";
          cvLink.setAttribute("download", "CV_Lucas_Noirot-Petit_EN.pdf");
          cvLink.setAttribute("aria-label", "Download my Resume! (PDF)");
        }
        changerLangue("en");
      } else {
        if (cvLink) {
          cvLink.href =
            "https://raw.githubusercontent.com/enpeluche/resume/main/dist/fr/CV_Lucas_Noirot-Petit.pdf";
          cvLink.setAttribute("download", "CV_Lucas_Noirot-Petit_FR.pdf");
          cvLink.setAttribute("aria-label", "Télécharger mon CV ! (PDF)");
        }
        changerLangue("fr");
      }
    });
});
