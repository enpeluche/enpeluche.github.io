/*
  Particules d'arrière-plan.
  - Jour : particules violettes (réglages d'origine).
  - Nuit : étoiles claires reliées par des traits discrets, comme des constellations.
  - Si le visiteur a activé "réduire les animations" dans son système, elles restent immobiles.
  Elles sont recréées quand le thème ou ce réglage change.
*/

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const PALETTES = {
  light: {
    particle: "#7451eb",
    opacity: 0.5,
    twinkle: false,
    link: "#271a38ff",
    linkOpacity: 0.85,
  },
  dark: {
    particle: "#f1edff",
    opacity: 0.8,
    twinkle: true, // les étoiles scintillent doucement
    link: "#a48bff",
    linkOpacity: 0.3,
  },
};

function buildOptions(theme, still) {
  const palette = PALETTES[theme] || PALETTES.light;

  return {
    fpsLimit: 30,
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 500,
        },
      },
      collisions: {
        enable: true,
        mode: "bounce",
      },
      color: {
        value: palette.particle,
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0.5,
          color: palette.particle,
        },
      },
      opacity: {
        value: palette.opacity,
        random: palette.twinkle,
        anim: {
          enable: palette.twinkle && !still,
          speed: 0.5,
          opacity_min: 0.2,
          sync: false,
        },
      },
      size: {
        value: 2,
        random: true,
        anim: {
          enable: !still,
          speed: 1,
          size_min: 1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 120,
        color: palette.link,
        opacity: palette.linkOpacity,
        width: 1,
      },
      move: {
        enable: !still,
        speed: 0.75,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "window",
      events: {
        onhover: {
          enable: !still,
          mode: "bubble",
        },
        onclick: {
          enable: !still,
          mode: ["repulse"],
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 300,
          size: 4,
          duration: 3,
          opacity: 8,
          speed: 5,
        },
        repulse: {
          distance: 250,
          duration: 4,
        },
        push: {
          particles_nb: 1,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  };
}

function loadParticles() {
  const theme = document.documentElement.dataset.theme;

  // Recharger le même identifiant remplace les particules existantes
  tsParticles.load("tsparticles", buildOptions(theme, reducedMotion.matches));
}

export function initParticles() {
  // Bibliothèque absente (CDN injoignable) : le site fonctionne sans particules
  if (typeof tsParticles === "undefined") return;

  loadParticles();

  document.addEventListener("themechange", loadParticles);
  reducedMotion.addEventListener("change", loadParticles);
}
