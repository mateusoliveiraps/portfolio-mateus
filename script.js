/* ============================================================
   PORTFOLIO — MATEUS SEMIONI
   script.js
   ============================================================ */

'use strict';

/* ============================================================
   THEME TOGGLE — DARK / LIGHT MODE
   ============================================================ */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const html = document.documentElement;

  const STORAGE_KEY = 'ms-theme';

  // Aplica o tema salvo (ou preferência do sistema) sem animação
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved ?? (prefersDark ? 'dark' : 'light');
  if (initial === 'light') html.setAttribute('data-theme', 'light');

  if (!btn) return;

  btn.addEventListener('click', () => {
    const isLight = html.getAttribute('data-theme') === 'light';

    // Classe de transição para suavizar a troca
    html.classList.add('theme-transitioning');
    setTimeout(() => html.classList.remove('theme-transitioning'), 420);

    if (isLight) {
      html.removeAttribute('data-theme');
      localStorage.setItem(STORAGE_KEY, 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem(STORAGE_KEY, 'light');
    }
  });
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  const hoverTargets = 'a, button, [data-hover], .skill-card, .social-link, .stat-card';
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
})();

/* ============================================================
   HEADER — SCROLL BEHAVIOUR
   ============================================================ */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================================
   MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  let open = false;

  const openMenu = () => {
    open = true;
    toggle.classList.add('active');
    menu.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    open = false;
    toggle.classList.remove('active');
    menu.classList.remove('active');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => open ? closeMenu() : openMenu());

  menu.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (open && !menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });
})();

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
(function initTypewriter() {
  const target = document.getElementById('typewriterText');
  if (!target) return;

  const phrases = [
    'Desenvolvedor Web',
    'Automação com IA',
    'Aplicações Inteligentes',
    'Soluções Digitais',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let isPaused     = false;

  const TYPING_SPEED  = 80;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER   = 2000;
  const PAUSE_BEFORE  = 400;

  function tick() {
    const current = phrases[phraseIndex];

    if (isPaused) return;

    if (!isDeleting) {
      target.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(() => {
          isDeleting = true;
          isPaused = false;
          setTimeout(tick, DELETING_SPEED);
        }, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      target.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  }

  setTimeout(tick, 800);
})();

/* ============================================================
   INTERSECTION OBSERVER — REVEAL ANIMATIONS
   ============================================================ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ============================================================
   HERO CANVAS — PARTICLE / DOT GRID
   ============================================================ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const ACCENT_DARK  = '0, 212, 255';
  const ACCENT_LIGHT = '0, 153, 187';
  const DOT_SPACING = 36;
  const DOT_RADIUS  = 1.2;
  const INTERACTION_RADIUS = 120;

  let W, H, cols, rows, dots = [];
  let mouse = { x: -9999, y: -9999 };

  function getAccent() {
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? ACCENT_LIGHT
      : ACCENT_DARK;
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildGrid();
  }

  function buildGrid() {
    dots = [];
    cols = Math.ceil(W / DOT_SPACING) + 1;
    rows = Math.ceil(H / DOT_SPACING) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: c * DOT_SPACING,
          y: r * DOT_SPACING,
          baseOpacity: 0.15 + Math.random() * 0.1,
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const accent = getAccent();
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    dots.forEach((dot) => {
      const dx = dot.x - mouse.x;
      const dy = dot.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / INTERACTION_RADIUS);
      const baseOp = isLight ? dot.baseOpacity * 0.6 : dot.baseOpacity;
      const opacity = baseOp + influence * (isLight ? 0.45 : 0.7);
      const radius  = DOT_RADIUS + influence * 2;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accent}, ${opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('resize', resize);

  resize();
  draw();
})();

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.getElementById('header')?.offsetHeight ?? 70;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   CONTACT FORM — WEB3FORMS
   ============================================================ */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const success   = document.getElementById('formSuccess');
  const error     = document.getElementById('formError');
  const btn       = document.getElementById('submitBtn');
  const label     = document.getElementById('submitLabel');
  const icon      = document.getElementById('submitIcon');
  if (!form) return;

  function setInvalid(input) {
    input.style.borderColor = '#ff4d4d';
    input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
  }

  function validate() {
    let valid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach((el) => {
      if (!el.value.trim()) { setInvalid(el); valid = false; }
    });
    const emailEl = form.querySelector('#email');
    if (emailEl?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      setInvalid(emailEl); valid = false;
    }
    return valid;
  }

  function setLoading(loading) {
    btn.disabled = loading;
    label.textContent = loading ? 'Enviando...' : 'Enviar Mensagem';
    icon.style.opacity = loading ? '0' : '1';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    success.classList.remove('visible');
    error.classList.remove('visible');

    if (!validate()) return;

    setLoading(true);

    try {
      const data = new FormData(form);
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        form.reset();
        success.classList.add('visible');
        setTimeout(() => success.classList.remove('visible'), 6000);
      } else {
        error.classList.add('visible');
        setTimeout(() => error.classList.remove('visible'), 6000);
      }
    } catch {
      error.classList.add('visible');
      setTimeout(() => error.classList.remove('visible'), 6000);
    } finally {
      setLoading(false);
    }
  });
})();

/* ============================================================
   ACTIVE NAV LINK ON SCROLL
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');
  if (!sections.length || !links.length) return;

  const onScroll = () => {
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        links.forEach((link) => link.classList.remove('active'));
        const active = document.querySelector(`.nav__link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();
