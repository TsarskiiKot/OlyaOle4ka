/* ── Data ───────────────────────────────────────────── */

const PALETTE = [
  /* each work has 3 gradient "fragments" for the hover slideshow */
  { base: '#1a1a2e', slides: ['#16213e','#0f3460','#533483'] },
  { base: '#2d2d2d', slides: ['#3d2b1f','#6b3a2a','#8b4513'] },
  { base: '#1a2f1a', slides: ['#2d4a2d','#1f6b3a','#0d4d2d'] },
  { base: '#2a1a3d', slides: ['#3d1a5a','#5a1a7a','#7b2d8b'] },
  { base: '#3d2a1a', slides: ['#5a3d1a','#7a5a2a','#8b6b1a'] },
  { base: '#1a2a3d', slides: ['#1a3d5a','#1a5a7a','#2a6b8b'] },
  { base: '#3d1a1a', slides: ['#5a1a1a','#7a2a2a','#8b3a2a'] },
  { base: '#1a3d2a', slides: ['#2a5a3d','#3a7a5a','#4a8b6b'] },
  { base: '#2a2a1a', slides: ['#3d3d1a','#5a5a2a','#7a7a3a'] },
  { base: '#1a1a1a', slides: ['#2a2a2a','#3a3a3a','#4a4a4a'] },
  { base: '#3d1a2a', slides: ['#5a1a3d','#7a2a5a','#8b3a6b'] },
  { base: '#1a3a3d', slides: ['#1a5a5a','#1a7a7a','#2a8b8b'] },
];

const WORKS = [
  {
    id: 1, section: 'works',
    title: 'Composition I', year: '2024', technique: 'Oil on canvas',
    desc: 'A meditation on form and negative space, exploring the tension between presence and absence in a world increasingly defined by surface. The work invites the viewer to inhabit the intervals between things.',
    palette: 0, extraImages: 2,
  },
  {
    id: 2, section: 'works',
    title: 'Trace', year: '2023', technique: 'Ink on paper, 140 × 100 cm',
    desc: 'Gesture recorded over three sessions, each layer interrupting and completing the one before. The visible accumulation of time is the subject.',
    palette: 1, extraImages: 1,
  },
  {
    id: 3, section: 'works',
    title: 'Interior with Light', year: '2023', technique: 'Watercolour',
    desc: 'Light as architecture. This series investigates how illumination structures domestic space, rendering the familiar strange through incremental shift.',
    palette: 2, extraImages: 3,
  },
  {
    id: 4, section: 'works',
    title: 'Field Study II', year: '2022', technique: 'Acrylic, charcoal',
    desc: 'Observation of a landscape over four seasons, compressed into a single surface. Memory and immediacy coexist in the layered pigment.',
    palette: 3, extraImages: 0,
  },
  {
    id: 5, section: 'works',
    title: 'Unnamed Geometry', year: '2022', technique: 'Mixed media on linen',
    desc: 'Mathematical structure used not as subject but as scaffold — a way to organise sensation before sensation dissolves into mere feeling.',
    palette: 4, extraImages: 2,
  },
  {
    id: 6, section: 'works',
    title: 'Grey Scale', year: '2021', technique: 'Graphite on paper',
    desc: 'Monochrome is not the absence of colour but its suspension. Within this restraint, every value becomes charged with relational meaning.',
    palette: 5, extraImages: 1,
  },
  {
    id: 7, section: 'thoughts',
    title: 'On Silence', year: '2024', technique: 'Essay',
    desc: 'Notes on the productive role of silence in creative practice — the pause that holds pressure, the gap that generates meaning.',
    palette: 6, extraImages: 0,
  },
  {
    id: 8, section: 'thoughts',
    title: 'Material Memory', year: '2023', technique: 'Text',
    desc: 'How materials carry histories that exceed the intentions of the maker. Clay remembers hands; paper remembers water.',
    palette: 7, extraImages: 0,
  },
  {
    id: 9, section: 'experiments',
    title: 'Echo Chamber', year: '2024', technique: 'Installation prototype',
    desc: 'Sound and surface tested as a single phenomenon. Vibration made visible in pigmented liquid, recorded and translated back into form.',
    palette: 8, extraImages: 2,
  },
  {
    id: 10, section: 'experiments',
    title: 'Slow Burn', year: '2023', technique: 'Process work',
    desc: 'Three months of daily mark-making without revision. The work refuses the edited object in favour of unfiltered accumulation.',
    palette: 9, extraImages: 1,
  },
  {
    id: 11, section: 'going-on',
    title: 'Group Show — Berlin', year: '2025', technique: 'Exhibition',
    desc: 'Participating in a group exhibition exploring materiality and digital reproduction. Opening April 2025, Galerie Nord.',
    palette: 10, extraImages: 0,
  },
  {
    id: 12, section: 'going-on',
    title: 'Residency', year: '2025', technique: 'Artist residency',
    desc: 'Three-month residency at a rural arts centre, resulting in a new body of work responding to landscape and seasonal change.',
    palette: 11, extraImages: 0,
  },
];


/* ── State ──────────────────────────────────────────── */

const state = {
  menuOpen: false,
  activeSection: null,   /* slug string or null */
  activeWork: null,      /* work object or null */
  slideshowTimers: {},   /* workId → intervalId */
  slideIndices: {},      /* workId → current slide index */
};


/* ── DOM refs ───────────────────────────────────────── */

const intro        = document.getElementById('intro');
const header       = document.getElementById('header');
const mainNav      = document.getElementById('main-nav');
const menuBtn      = document.getElementById('menu-btn');
const activeLabel  = document.getElementById('active-label');
const logoBtn      = document.getElementById('logo-btn');
const worksGrid    = document.getElementById('works-grid');
const lightbox     = document.getElementById('lightbox');
const lbClose      = document.getElementById('lb-close');
const lbContent    = document.getElementById('lb-content');

const pages = {
  hero:     document.getElementById('page-hero'),
  section:  document.getElementById('page-section'),
  detail:   document.getElementById('page-detail'),
  contacts: document.getElementById('page-contacts'),
};


/* ── Helpers ────────────────────────────────────────── */

function showPage(name) {
  Object.entries(pages).forEach(([key, el]) => {
    el.classList.toggle('active', key === name);
    el.setAttribute('aria-hidden', key !== name);
  });
  window.scrollTo(0, 0);
}

function closeMenu() {
  state.menuOpen = false;
  mainNav.classList.remove('open');
}

function openMenu() {
  state.menuOpen = true;
  mainNav.classList.add('open');
}

function sectionLabel(slug) {
  return slug.replace(/-/g, ' ');
}


/* ── Intro animation ────────────────────────────────── */

function startIntro() {
  /* The CSS animation runs for ~2.8s then we remove the overlay */
  setTimeout(() => {
    intro.classList.add('fade-out');
    header.classList.add('visible');
    showPage('hero');

    setTimeout(() => {
      intro.style.display = 'none';
    }, 800);
  }, 2900);
}


/* ── Build grid ─────────────────────────────────────── */

function buildGrid(section) {
  const items = WORKS.filter(w => w.section === section);
  worksGrid.innerHTML = '';
  state.slideshowTimers = {};
  state.slideIndices = {};

  items.forEach(work => {
    const pal = PALETTE[work.palette];

    const card = document.createElement('div');
    card.className = 'work-card';
    card.dataset.id = work.id;

    /* Square container */
    const sq = document.createElement('div');
    sq.className = 'work-card-square';

    /* Base layer */
    const base = document.createElement('div');
    base.className = 'work-card-base';
    base.style.background = pal.base;
    sq.appendChild(base);

    /* Three slide layers */
    pal.slides.forEach((col, idx) => {
      const slide = document.createElement('div');
      slide.className = 'work-slide';
      /* Shift the "crop" position per slide to simulate fragment variation */
      const positions = ['20% 30%', '70% 50%', '40% 80%'];
      slide.style.background = col;
      slide.style.backgroundSize = '180%';
      slide.style.backgroundPosition = positions[idx];
      slide.dataset.idx = idx;
      sq.appendChild(slide);
    });

    /* Title */
    const title = document.createElement('div');
    title.className = 'work-card-title';
    title.textContent = work.title;

    card.appendChild(sq);
    card.appendChild(title);
    worksGrid.appendChild(card);

    /* Hover: start/stop slideshow */
    card.addEventListener('mouseenter', () => startSlideshow(work.id, sq));
    card.addEventListener('mouseleave', () => stopSlideshow(work.id, sq));

    /* Click: open detail */
    card.addEventListener('click', () => openDetail(work));
  });
}


/* ── Slideshow ──────────────────────────────────────── */

function startSlideshow(id, sq) {
  const slides = sq.querySelectorAll('.work-slide');
  if (!slides.length) return;
  state.slideIndices[id] = 0;

  function tick() {
    slides.forEach(s => s.classList.remove('on'));
    slides[state.slideIndices[id]].classList.add('on');
    state.slideIndices[id] = (state.slideIndices[id] + 1) % slides.length;
  }
  tick();
  state.slideshowTimers[id] = setInterval(tick, 220);
}

function stopSlideshow(id, sq) {
  clearInterval(state.slideshowTimers[id]);
  delete state.slideshowTimers[id];
  sq.querySelectorAll('.work-slide').forEach(s => s.classList.remove('on'));
}


/* ── Detail page ────────────────────────────────────── */

function openDetail(work) {
  const pal = PALETTE[work.palette];

  /* Hero image */
  const heroImg = document.getElementById('detail-hero-img');
  heroImg.style.background = pal.base;
  heroImg.onclick = () => openLightbox(pal.slides[0]);

  /* Meta */
  document.getElementById('det-title').textContent = work.title;
  document.getElementById('det-year').textContent = work.year;
  document.getElementById('det-technique').textContent = work.technique;
  document.getElementById('det-desc').textContent = work.desc;

  /* Extra images */
  const extra = document.getElementById('detail-extra');
  extra.innerHTML = '';
  for (let i = 0; i < work.extraImages; i++) {
    const div = document.createElement('div');
    div.className = 'extra-img';
    div.style.background = pal.slides[i % pal.slides.length];
    const capturedColor = pal.slides[i % pal.slides.length];
    div.onclick = () => openLightbox(capturedColor);
    extra.appendChild(div);
  }

  state.activeWork = work;
  showPage('detail');
}


/* ── Lightbox ───────────────────────────────────────── */

function openLightbox(color) {
  lbContent.innerHTML = '';
  const div = document.createElement('div');
  div.style.background = color;
  div.style.width  = '100%';
  div.style.height = '100%';
  lbContent.appendChild(div);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}


/* ── Section selection ──────────────────────────────── */

function selectSection(slug) {
  state.activeSection = slug;
  closeMenu();

  activeLabel.textContent = sectionLabel(slug);
  activeLabel.classList.add('visible');

  if (slug === 'contacts') {
    showPage('contacts');
  } else {
    buildGrid(slug);
    showPage('section');
  }
}


/* ── Back to hero ───────────────────────────────────── */

function goHome() {
  state.activeSection = null;
  state.activeWork = null;
  closeMenu();
  activeLabel.classList.remove('visible');
  activeLabel.textContent = '';
  showPage('hero');
}


/* ── Event listeners ────────────────────────────────── */

menuBtn.addEventListener('click', () => {
  if (state.menuOpen) {
    closeMenu();
  } else {
    /* If a section is already selected, treat click as "open menu" to allow re-selection */
    openMenu();
  }
});

mainNav.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => selectSection(btn.dataset.section));
});

/* Clicking the active badge re-opens menu */
activeLabel.addEventListener('click', () => {
  if (state.activeWork) {
    /* On detail page: go back to section grid */
    state.activeWork = null;
    showPage('section');
  } else {
    openMenu();
  }
});

logoBtn.addEventListener('click', (e) => {
  e.preventDefault();
  goHome();
});

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!lightbox.hidden) { closeLightbox(); return; }
    if (state.menuOpen)   { closeMenu();     return; }
  }
});

/* Close menu when clicking outside on mobile */
document.addEventListener('click', (e) => {
  if (state.menuOpen && !mainNav.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
    closeMenu();
  }
});


/* ── Boot ───────────────────────────────────────────── */

startIntro();
