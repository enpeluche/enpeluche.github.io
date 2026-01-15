const cvLink = document.getElementById("cv-link"); // On récupère le lien

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
  skill_title_languages: { fr: "Langages", en: "Languages" },
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
  skill_detail_graphs: {
    fr: "Théorie des graphes avancée (algorithmes en-ligne, distribués)",
    en: "Advanced graph theory (online and distributed algorithms)",
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
    fr: "Février 2026",
    en: "February 2026",
  },
  contact_availability_note: {
    fr: "(Ouvert aux échanges et entretiens dès aujourd'hui)",
    en: "(Open to discussions and interviews starting today)",
  },
};

const traductions = {
  ...homepage_traduction,
  ...homepage_skills,
  ...homepage_contact,
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
  document
    .getElementById("lang-toggle")
    .addEventListener("change", function () {
      if (this.checked) {
        cvLink.href =
          "https://raw.githubusercontent.com/enpeluche/resume/main/dist/en/CV_Lucas_Noirot-Petit.pdf";
        cvLink.setAttribute("download", "CV_Lucas_Noirot-Petit.pdf");
        changerLangue("en");
      } else {
        cvLink.href =
          "https://raw.githubusercontent.com/enpeluche/resume/main/dist/fr/CV_Lucas_Noirot-Petit.pdf";
        cvLink.setAttribute("download", "CV_Lucas_Noirot-Petit.pdf");
        changerLangue("fr");
      }
    });
});

function changerLangue(langue) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const cle = element.getAttribute("data-i18n");

    if (traductions[cle]) {
      element.innerHTML = traductions[cle][langue];
    }
  });
}
