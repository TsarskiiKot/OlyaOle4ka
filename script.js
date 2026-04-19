/* ── Data ───────────────────────────────────────────── */

/* Slideshow crops: 3 different zoomed-in regions per image */
const SLIDE_POSITIONS = [
  ['20% 20%', '75% 55%', '45% 80%'],
  ['60% 15%', '25% 65%', '80% 75%'],
  ['10% 50%', '70% 20%', '50% 85%'],
  ['40% 10%', '15% 70%', '80% 40%'],
  ['55% 30%', '30% 75%', '85% 15%'],
];

const WORKS = [
  {
    id: 1, section: 'works',
    title: 'Caption 1', year: '', technique: '', desc: '',
    src: 'Фото/photo_2026-04-19_23-48-03.jpg',
    positions: SLIDE_POSITIONS[0],
  },
  {
    id: 2, section: 'works',
    title: 'Caption 2', year: '', technique: '', desc: '',
    src: 'Фото/photo_2026-04-19_23-48-04.jpg',
    positions: SLIDE_POSITIONS[1],
  },
  {
    id: 3, section: 'works',
    title: 'Caption 3', year: '', technique: '', desc: '',
    src: 'Фото/photo_2026-04-19_23-48-14.jpg',
    positions: SLIDE_POSITIONS[2],
  },
  {
    id: 4, section: 'works',
    title: 'Caption 4', year: '', technique: '', desc: '',
    src: 'Фото/photo_2026-04-19_23-48-15.jpg',
    positions: SLIDE_POSITIONS[3],
  },
  {
    id: 5, section: 'works',
    title: 'Caption 5', year: '', technique: '', desc: '',
    src: 'Фото/photo_2026-04-19_23-48-24.jpg',
    positions: SLIDE_POSITIONS[4],
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
    const card = document.createElement('div');
    card.className = 'work-card';
    card.dataset.id = work.id;

    /* Square container */
    const sq = document.createElement('div');
    sq.className = 'work-card-square';

    /* Base layer – full photo, cover */
    const base = document.createElement('div');
    base.className = 'work-card-base';
    base.style.backgroundImage = `url('${work.src}')`;
    base.style.backgroundSize = 'cover';
    base.style.backgroundPosition = 'center';
    sq.appendChild(base);

    /* Three slide layers – zoomed-in crop fragments of the same photo */
    work.positions.forEach((pos, idx) => {
      const slide = document.createElement('div');
      slide.className = 'work-slide';
      slide.style.backgroundImage = `url('${work.src}')`;
      slide.style.backgroundSize = '220%';
      slide.style.backgroundPosition = pos;
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
  /* Hero image – natural dimensions, framed */
  const heroImg = document.getElementById('detail-hero-img');
  heroImg.src = work.src;
  heroImg.alt = work.title;
  heroImg.onclick = () => openLightbox(work.src);

  /* Meta */
  document.getElementById('det-title').textContent = work.title;
  document.getElementById('det-year').textContent = work.year;
  document.getElementById('det-technique').textContent = work.technique;
  document.getElementById('det-desc').textContent = work.desc;

  /* No extra images (single photo per work) */
  document.getElementById('detail-extra').innerHTML = '';

  state.activeWork = work;
  showPage('detail');
}


/* ── Lightbox ───────────────────────────────────────── */

function openLightbox(src) {
  lbContent.innerHTML = '';
  const img = document.createElement('img');
  img.src = src;
  img.style.maxWidth  = '90vw';
  img.style.maxHeight = '90vh';
  img.style.display   = 'block';
  img.style.objectFit = 'contain';
  lbContent.appendChild(img);
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
